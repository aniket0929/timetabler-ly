
import { useState } from 'react';
import { TimetableConstraints, TimetableOption } from './types';
import { defaultConstraints } from './types';

export function useTimetableState() {
  const [constraints, setConstraints] = useState<TimetableConstraints>(defaultConstraints);
  const [timetableOptions, setTimetableOptions] = useState<TimetableOption[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableOption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return {
    constraints,
    setConstraints,
    timetableOptions,
    setTimetableOptions,
    selectedTimetable,
    setSelectedTimetable,
    isGenerating,
    setIsGenerating,
  };
}
