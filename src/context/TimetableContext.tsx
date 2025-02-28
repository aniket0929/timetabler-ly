
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Generate timetable options based on constraints
  const generateTimetableOptions = () => {
    setIsGenerating(true);
    
    // Simulate AI-based timetable generation
    setTimeout(() => {
      const options: TimetableOption[] = generateSampleTimetables(constraints);
      setTimetableOptions(options);
      if (options.length > 0) {
        setSelectedTimetable(options[0]);
      }
      setIsGenerating(false);
    }, 2000);
  };

  // Update a timetable block
  const updateTimetableBlock = (updatedBlock: TimetableBlock) => {
    if (!selectedTimetable) return;
    
    const updatedBlocks = selectedTimetable.blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    );
    
    setSelectedTimetable({
      ...selectedTimetable,
      blocks: updatedBlocks
    });
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

  // Mock function to generate sample timetables based on constraints
  const generateSampleTimetables = (constraints: TimetableConstraints): TimetableOption[] => {
    // This would be replaced with actual AI-based generation
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
              id: `${blockIdPrefix}${subjectIndex}_${lecturesPlaced}`,
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
        id: `option${optionIndex + 1}`,
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
    moveTimetableBlock
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
