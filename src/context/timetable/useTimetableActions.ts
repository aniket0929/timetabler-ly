
import { useToast } from '@/hooks/use-toast';
import { TimetableBlock, TimetableOption, TimetableConstraints } from './types';
import { 
  saveConstraints, 
  saveGeneratedTimetables, 
  updateTimetableBlockInDB, 
  loadSavedTimetables as loadTimetables 
} from '@/services/timetableService';
import { getDurationInMs, generateSampleTimetables } from '@/utils/timetableUtils';

export function useTimetableActions({
  constraints,
  setTimetableOptions,
  setSelectedTimetable,
  selectedTimetable,
  setIsGenerating
}: {
  constraints: TimetableConstraints;
  setTimetableOptions: React.Dispatch<React.SetStateAction<TimetableOption[]>>;
  setSelectedTimetable: React.Dispatch<React.SetStateAction<TimetableOption | null>>;
  selectedTimetable: TimetableOption | null;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  // Generate timetable options based on constraints
  const generateTimetableOptions = async () => {
    setIsGenerating(true);
    
    try {
      // Save constraints to Supabase first
      const constraintId = await saveConstraints(constraints);
      
      // Simulate AI-based timetable generation
      setTimeout(async () => {
        try {
          const options: TimetableOption[] = await generateSampleTimetables(constraints, constraintId);
          setTimetableOptions(options);
          if (options.length > 0) {
            setSelectedTimetable(options[0]);
          }
          
          // Save generated timetable options
          await saveGeneratedTimetables(options, constraintId);
          
          toast({
            title: "Timetable generated",
            description: `Generated ${options.length} timetable options`,
          });
        } catch (error) {
          console.error("Error generating timetable:", error);
          toast({
            title: "Error generating timetable",
            description: "An error occurred while generating the timetable",
            variant: "destructive",
          });
        } finally {
          setIsGenerating(false);
        }
      }, 2000);
    } catch (error) {
      console.error("Error saving constraints:", error);
      toast({
        title: "Error saving constraints",
        description: "An error occurred while saving your constraints",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  // Update a timetable block
  const updateTimetableBlock = async (updatedBlock: TimetableBlock) => {
    if (!selectedTimetable) return;
    
    try {
      const updatedBlocks = selectedTimetable.blocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      );
      
      setSelectedTimetable({
        ...selectedTimetable,
        blocks: updatedBlocks
      });
      
      // Update the block in the database
      await updateTimetableBlockInDB(updatedBlock);
    } catch (error) {
      console.error("Error updating timetable block:", error);
      toast({
        title: "Error updating class",
        description: "An error occurred while updating the class details",
        variant: "destructive",
      });
    }
  };

  // Move a timetable block to a new day and time
  const moveTimetableBlock = (blockId: string, newDay: string, newStartTime: string) => {
    if (!selectedTimetable) return;
    
    const blockToMove = selectedTimetable.blocks.find(block => block.id === blockId);
    if (!blockToMove) return;
    
    // Calculate new end time based on duration
    const startDate = new Date(`2023-01-01T${newStartTime}`);
    const durationMs = getDurationInMs(blockToMove.startTime, blockToMove.endTime);
    const endDate = new Date(startDate.getTime() + durationMs);
    const newEndTime = endDate.toTimeString().slice(0, 5);
    
    const updatedBlock = {
      ...blockToMove,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime
    };
    
    updateTimetableBlock(updatedBlock);
  };

  // Save current timetable
  const saveTimetable = async () => {
    if (!selectedTimetable) return;
    
    try {
      toast({
        title: "Saving timetable...",
        description: "Your timetable is being saved",
      });
      
      // Update all blocks in the database
      for (const block of selectedTimetable.blocks) {
        await updateTimetableBlockInDB(block);
      }
      
      toast({
        title: "Timetable saved",
        description: "Your timetable has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving timetable:", error);
      toast({
        title: "Error saving timetable",
        description: "An error occurred while saving your timetable",
        variant: "destructive",
      });
    }
  };

  // Load saved timetables
  const loadSavedTimetables = async () => {
    try {
      await loadTimetables();
      
      toast({
        title: "Timetables loaded",
        description: "Your saved timetables have been loaded",
      });
    } catch (error) {
      console.error("Error loading timetables:", error);
      toast({
        title: "Error loading timetables",
        description: "An error occurred while loading your timetables",
        variant: "destructive",
      });
    }
  };

  return {
    generateTimetableOptions,
    updateTimetableBlock,
    moveTimetableBlock,
    saveTimetable,
    loadSavedTimetables
  };
}
