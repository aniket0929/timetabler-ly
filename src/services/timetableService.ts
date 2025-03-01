
import { supabase } from '@/integrations/supabase/client';
import { 
  TimetableConstraints, 
  TimetableOption, 
  TimetableBlock,
  Subject,
  BreakPeriod
} from '../types/timetable';

// Save constraints to Supabase
export const saveConstraints = async (constraints: TimetableConstraints): Promise<string> => {
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
export const saveGeneratedTimetables = async (options: TimetableOption[], constraintId: string) => {
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

// Update a timetable block in the database
export const updateTimetableBlockInDB = async (updatedBlock: TimetableBlock) => {
  // Only update if the block has a UUID format (from Supabase)
  if (updatedBlock.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    const { error } = await supabase
      .from('timetable_blocks')
      .update({
        day: updatedBlock.day,
        start_time: updatedBlock.startTime,
        end_time: updatedBlock.endTime,
        faculty: updatedBlock.faculty,
        room: updatedBlock.room,
        updated_at: new Date().toISOString(), // Fix: Convert Date to string
      })
      .eq('id', updatedBlock.id);
    
    if (error) {
      console.error("Error updating timetable block:", error);
      throw error;
    }
  }
};

// Load saved timetables (placeholder for future implementation)
export const loadSavedTimetables = async () => {
  // This is a placeholder for future implementation
  // Logic to load saved timetables would go here
  return [];
};
