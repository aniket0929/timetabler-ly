
import React from 'react';

interface TimetableHeaderProps {
  days: string[];
}

const TimetableHeader: React.FC<TimetableHeaderProps> = ({ days }) => {
  return (
    <thead>
      <tr>
        <th className="p-2 bg-[#FFDEE2] text-[#FF6B8B] font-bold border-2 border-[#FFBAC3] rounded-tl-lg w-[100px]">Time</th>
        {days.map((day, index) => (
          <th 
            key={day}
            className={`p-2 font-bold border-2 bg-[#FFDEE2] text-[#FF6B8B] border-[#FFBAC3] ${index === days.length - 1 ? 'rounded-tr-lg' : ''}`}
          >
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TimetableHeader;
