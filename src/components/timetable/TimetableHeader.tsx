
import React from 'react';

interface TimetableHeaderProps {
  days: string[];
}

const TimetableHeader: React.FC<TimetableHeaderProps> = ({ days }) => {
  return (
    <thead>
      <tr>
        <th className="p-2 bg-primary/10 text-primary font-bold border-2 border-primary/30 rounded-tl-lg w-[100px]">Time</th>
        {days.map((day, index) => (
          <th 
            key={day}
            className={`p-2 font-bold border-2 bg-primary/10 text-primary border-primary/30 ${index === days.length - 1 ? 'rounded-tr-lg' : ''}`}
          >
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TimetableHeader;
