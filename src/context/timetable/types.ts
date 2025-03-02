
// Re-export types from the main timetable types file
export type {
  InstitutionType,
  OperatingDays,
  BreakPeriod,
  Subject,
  TimetableBlock,
  TimetableOption,
  TimetableConstraints,
  TimetableContextType
} from '@/types/timetable';

// Default constraints for new timetables
export const defaultConstraints = {
  institutionType: 'school' as const,
  operatingDays: 'monday-to-friday' as const,
  startTime: '08:00',
  endTime: '16:00',
  breakPeriods: [],
  subjects: [],
};
