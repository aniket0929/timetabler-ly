
// This file is now a re-export file to maintain backward compatibility
export { 
  TimetableProvider, 
  useTimetable,
  defaultConstraints 
} from './timetable';

// Re-exporting types for convenience
export type {
  InstitutionType,
  OperatingDays,
  BreakPeriod,
  Subject,
  TimetableBlock,
  TimetableOption,
  TimetableConstraints
} from './timetable';
