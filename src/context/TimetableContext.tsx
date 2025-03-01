
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';

// Types for our timetable system
export type InstitutionType = 'school' | 'college';

export type OperatingDays = 'monday-to-friday' | 'monday-to-saturday';

export type BreakPeriod = {
  id: string;
  startTime: string;
  endTime: string;
  name: string;
};

export type Subject = {
  id: string;
  name: string;
  faculty: string;
  lecturesPerWeek: number;
  duration: number; // in minutes
  preferredTimeSlots?: Array<{day: string, time: string}>;
  maxLecturesPerDay?: number;
  room?: string;
};

export type TimetableBlock = {
  id: string;
  subjectId: string;
  day: string;
  startTime: string;
  endTime: string;
  faculty: string;
  room?: string;
};

export type TimetableOption = {
  id: string;
  name: string;
  blocks: TimetableBlock[];
};

export type TimetableConstraints = {
  institutionType: InstitutionType;
  operatingDays: OperatingDays;
  startTime: string;
  endTime: string;
  breakPeriods: BreakPeriod[];
  subjects: Subject[];
};

type TimetableContextType = {
  constraints: TimetableConstraints;
  setConstraints: React.Dispatch<React.SetStateAction<TimetableConstraints>>;
  timetableOptions: TimetableOption[];
  setTimetableOptions: React.Dispatch<React.SetStateAction<TimetableOption[]>>;
  selectedTimetable: TimetableOption | null;
  setSelectedTimetable: React.Dispatch<React.SetStateAction<TimetableOption | null>>;
  generateTimetableOptions: () => void;
  isGenerating: boolean;
  updateTimetableBlock: (block: TimetableBlock) => void;
  moveTimetableBlock: (blockId: string, newDay: string, newStartTime: string) => void;
  saveTimetable: () => Promise<void>;
  loadSavedTimetables: () => Promise<void>;
};

// Default constraints
const defaultConstraints: TimetableConstraints = {
  institutionType: 'school',
  operatingDays: 'monday-to-friday',
  startTime: '08:00',
  endTime: '16:00',
  breakPeriods: [],
  subjects: [],
};

// Create the context
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

// Provider component
export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [constraints, setConstraints] = useState<TimetableConstraints>(defaultConstraints);
  const [timetableOptions, setTimetableOptions] = useState<TimetableOption[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableOption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Generate timetable options based on constraints
  const generateTimetableOptions = async () => {
    setIsGenerating(true);
    
    try {
      // Save constraints to Supabase first
      const constraintId = await saveConstraints();
      
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

  // Save constraints to Supabase
  const saveConstraints = async (): Promise<string> => {
    try {
      // Insert constraints
      const { data: constraintData, error: constraintError } = await supabase
        .from('timetable_constraints')
        .insert({
          institution_type: constraints.institutionType,
          operating_days: constraints.operatingDays,
          start_time: constraints.startTime,
          end_time: constraints.endTime,
        })
        .select('id')
        .single();
      
      if (constraintError) throw constraintError;
      
      const constraintId = constraintData.id;
      
      // Insert break periods
      if (constraints.breakPeriods.length > 0) {
        const breakPeriodsData = constraints.breakPeriods.map(breakPeriod => ({
          constraint_id: constraintId,
          name: breakPeriod.name,
          start_time: breakPeriod.startTime,
          end_time: breakPeriod.endTime,
        }));
        
        const { error: breakPeriodsError } = await supabase
          .from('break_periods')
          .insert(breakPeriodsData);
        
        if (breakPeriodsError) throw breakPeriodsError;
      }
      
      // Insert subjects
      for (const subject of constraints.subjects) {
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .insert({
            constraint_id: constraintId,
            name: subject.name,
            faculty: subject.faculty,
            lectures_per_week: subject.lecturesPerWeek,
            duration: subject.duration,
            max_lectures_per_day: subject.maxLecturesPerDay,
            room: subject.room,
          })
          .select('id')
          .single();
        
        if (subjectError) throw subjectError;
        
        // Insert preferred time slots if any
        if (subject.preferredTimeSlots && subject.preferredTimeSlots.length > 0) {
          const preferredTimeSlotsData = subject.preferredTimeSlots.map(slot => ({
            subject_id: subjectData.id,
            day: slot.day,
            time: slot.time,
          }));
          
          const { error: slotsError } = await supabase
            .from('preferred_time_slots')
            .insert(preferredTimeSlotsData);
          
          if (slotsError) throw slotsError;
        }
      }
      
      return constraintId;
    } catch (error) {
      console.error("Error saving constraints:", error);
      throw error;
    }
  };

  // Save generated timetables to Supabase
  const saveGeneratedTimetables = async (options: TimetableOption[], constraintId: string) => {
    try {
      for (const option of options) {
        // Save timetable option
        const { data: timetableData, error: timetableError } = await supabase
          .from('timetable_options')
          .insert({
            constraint_id: constraintId,
            name: option.name,
          })
          .select('id')
          .single();
        
        if (timetableError) throw timetableError;
        
        const timetableId = timetableData.id;
        
        // Save timetable blocks
        const blocksData = option.blocks.map(block => ({
          timetable_id: timetableId,
          subject_id: block.subjectId,
          day: block.day,
          start_time: block.startTime,
          end_time: block.endTime,
          faculty: block.faculty,
          room: block.room,
        }));
        
        const { error: blocksError } = await supabase
          .from('timetable_blocks')
          .insert(blocksData);
        
        if (blocksError) throw blocksError;
      }
    } catch (error) {
      console.error("Error saving timetables:", error);
      throw error;
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
      
      // If the block has a UUID format (from Supabase), update it in the database
      if (updatedBlock.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        const { error } = await supabase
          .from('timetable_blocks')
          .update({
            day: updatedBlock.day,
            start_time: updatedBlock.startTime,
            end_time: updatedBlock.endTime,
            faculty: updatedBlock.faculty,
            room: updatedBlock.room,
            updated_at: new Date(),
          })
          .eq('id', updatedBlock.id);
        
        if (error) {
          console.error("Error updating timetable block:", error);
          toast({
            title: "Error updating class",
            description: "An error occurred while updating the class details",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error updating timetable block:", error);
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

  // Helper function to calculate duration between two times in milliseconds
  const getDurationInMs = (startTime: string, endTime: string) => {
    const start = new Date(`2023-01-01T${startTime}`);
    const end = new Date(`2023-01-01T${endTime}`);
    return end.getTime() - start.getTime();
  };

  // Save current timetable
  const saveTimetable = async () => {
    if (!selectedTimetable) return;
    
    try {
      toast({
        title: "Saving timetable...",
        description: "Your timetable is being saved",
      });
      
      // Logic to save the timetable would go here
      // This is a placeholder for future implementation
      
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
      // This is a placeholder for future implementation
      // Logic to load saved timetables would go here
      
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

  // Function to generate AI-based timetable options
  const generateSampleTimetables = async (
    constraints: TimetableConstraints,
    constraintId: string
  ): Promise<TimetableOption[]> => {
    // This function would ideally call an AI-based generator on the backend
    // For now, we'll use a similar logic to our mock function
    
    const days = constraints.operatingDays === 'monday-to-friday'
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const options: TimetableOption[] = [];
    
    // Generate 3 different timetable options
    for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
      const blocks: TimetableBlock[] = [];
      const blockIdPrefix = `option${optionIndex + 1}_`;
      
      constraints.subjects.forEach((subject, subjectIndex) => {
        // Distribute the subject's lectures across the week
        let lecturesPlaced = 0;
        
        while (lecturesPlaced < subject.lecturesPerWeek) {
          // Randomly select a day for this lecture
          const dayIndex = Math.floor(Math.random() * days.length);
          const day = days[dayIndex];
          
          // Generate a random start time between institution start and end times
          const startHour = parseInt(constraints.startTime.split(':')[0]);
          const endHour = parseInt(constraints.endTime.split(':')[0]) - Math.ceil(subject.duration / 60);
          
          if (endHour <= startHour) continue; // Skip if there's not enough time in the day
          
          const randomHour = startHour + Math.floor(Math.random() * (endHour - startHour));
          const startTime = `${randomHour.toString().padStart(2, '0')}:00`;
          
          // Calculate end time based on subject duration
          const startDate = new Date(`2023-01-01T${startTime}`);
          startDate.setMinutes(startDate.getMinutes() + subject.duration);
          const endTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
          
          // Check for overlap with breaks
          const overlapsWithBreak = constraints.breakPeriods.some(breakPeriod => {
            return (startTime < breakPeriod.endTime && endTime > breakPeriod.startTime);
          });
          
          // Check for overlap with existing blocks for this day
          const overlapsWithBlock = blocks.some(block => {
            return block.day === day && 
                  ((startTime >= block.startTime && startTime < block.endTime) ||
                   (endTime > block.startTime && endTime <= block.endTime) ||
                   (startTime <= block.startTime && endTime >= block.endTime));
          });
          
          if (!overlapsWithBreak && !overlapsWithBlock) {
            blocks.push({
              id: nanoid(), // Use nanoid for temporary IDs
              subjectId: subject.id,
              day,
              startTime,
              endTime,
              faculty: subject.faculty,
              room: subject.room
            });
            
            lecturesPlaced++;
          }
        }
      });
      
      options.push({
        id: nanoid(), // Use nanoid for temporary IDs
        name: `Timetable Option ${optionIndex + 1}`,
        blocks
      });
    }
    
    return options;
  };
  
  const value = {
    constraints,
    setConstraints,
    timetableOptions,
    setTimetableOptions,
    selectedTimetable,
    setSelectedTimetable,
    generateTimetableOptions,
    isGenerating,
    updateTimetableBlock,
    moveTimetableBlock,
    saveTimetable,
    loadSavedTimetables
  };

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
};

// Hook for using the timetable context
export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
