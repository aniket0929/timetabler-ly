
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

export type TimetableContextType = {
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
