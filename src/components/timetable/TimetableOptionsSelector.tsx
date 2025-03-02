
import React from 'react';
import { TimetableOption } from '@/context/TimetableContext';

interface TimetableOptionsSelectorProps {
  timetableOptions: TimetableOption[];
  selectedTimetable: TimetableOption;
  setSelectedTimetable: (timetable: TimetableOption) => void;
}

const TimetableOptionsSelector: React.FC<TimetableOptionsSelectorProps> = ({
  timetableOptions,
  selectedTimetable,
  setSelectedTimetable
}) => {
  if (timetableOptions.length <= 1) {
    return null;
  }
  
  return (
    <div className="flex justify-center space-x-2 mb-6">
      {timetableOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => setSelectedTimetable(option)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedTimetable.id === option.id
              ? 'bg-[#FFDEE2] text-[#FF6B8B]'
              : 'bg-white text-[#FF6B8B] border border-[#FFDEE2] hover:bg-[#FFF5F7]'
          }`}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default TimetableOptionsSelector;
