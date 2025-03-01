
import { nanoid } from 'nanoid';
import { TimetableConstraints, TimetableOption, TimetableBlock } from '../types/timetable';
import { supabase } from '@/integrations/supabase/client';

// Helper function to calculate duration between two times in milliseconds
export const getDurationInMs = (startTime: string, endTime: string) => {
  const start = new Date(`2023-01-01T${startTime}`);
  const end = new Date(`2023-01-01T${endTime}`);
  return end.getTime() - start.getTime();
};

// Function to generate AI-based timetable options
export const generateSampleTimetables = async (
  constraints: TimetableConstraints,
  constraintId: string
): Promise<TimetableOption[]> => {
  try {
    console.log("Calling OpenAI to generate timetable options with constraints:", JSON.stringify(constraints, null, 2));
    
    // Call the Supabase Edge Function that uses OpenAI
    const { data, error } = await supabase.functions.invoke('generate-timetable', {
      body: { constraints, constraintId },
    });
    
    if (error) {
      console.error("Error calling timetable generation function:", error);
      throw new Error(`Failed to generate timetable: ${error.message}`);
    }
    
    console.log("AI generated timetable options:", data.options);
    return data.options;
  } catch (error) {
    console.error("Error in AI timetable generation:", error);
    
    // Fall back to the sample generation if AI fails
    console.log("Falling back to sample timetable generation");
    return generateFallbackTimetables(constraints);
  }
};

// Fallback function to generate sample timetables (the original mock function)
const generateFallbackTimetables = (constraints: TimetableConstraints): TimetableOption[] => {
  const days = constraints.operatingDays === 'monday-to-friday'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const options: TimetableOption[] = [];
  
  // Generate 3 different timetable options
  for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
    const blocks: TimetableBlock[] = [];
    
    constraints.subjects.forEach((subject) => {
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
