
import React from 'react';
import { TimetableBlock as TimetableBlockType } from '@/context/TimetableContext';
import TimetableCell from './TimetableCell';

interface TimetableRowProps {
  time: string;
  timeIndex: number;
  days: string[];
  timetableMatrix: (TimetableBlockType | null)[][];
  timeSlots: string[];
  dropTargetId: string | null;
  dayColors: Record<string, string>;
  getBreakForTimeSlot: (time: string) => { name: string } | undefined;
  getSubjectForBlock: (block: TimetableBlockType) => { name: string; faculty: string; room?: string };
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, cellId: string) => void;
  handleDragLeave: () => void;
  handleBlockDrop: (e: React.DragEvent<HTMLDivElement>, timeIndex: number, dayIndex: number) => void;
  updateTimetableBlock: (block: TimetableBlockType) => void;
}

const TimetableRow: React.FC<TimetableRowProps> = ({
  time,
  timeIndex,
  days,
  timetableMatrix,
  timeSlots,
  dropTargetId,
  dayColors,
  getBreakForTimeSlot,
  getSubjectForBlock,
  handleDragOver,
  handleDragLeave,
  handleBlockDrop,
  updateTimetableBlock
}) => {
  const breakPeriod = getBreakForTimeSlot(time);
  const isLastRow = timeIndex === timeSlots.length - 1;
  
  return (
    <tr key={time}>
      <td className={`p-2 text-center text-sm font-medium bg-[#FFDEE2] text-[#FF6B8B] border-2 border-[#FFBAC3] ${isLastRow ? 'rounded-bl-lg' : ''}`}>
        {time}
      </td>
      
      {days.map((day, dayIndex) => {
        const block = timetableMatrix[timeIndex][dayIndex];
        const cellId = `${timeIndex}-${dayIndex}`;
        const isLastCol = dayIndex === days.length - 1;
        
        return (
          <TimetableCell
            key={`${day}-${time}`}
            day={day}
            time={time}
            block={block}
            breakPeriod={breakPeriod}
            isLastRow={isLastRow}
            isLastCol={isLastCol}
            timeIndex={timeIndex}
            dayIndex={dayIndex}
            cellId={cellId}
            dropTargetId={dropTargetId}
            getSubjectForBlock={getSubjectForBlock}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleBlockDrop={handleBlockDrop}
            updateTimetableBlock={updateTimetableBlock}
            dayColor={dayColors[day]}
          />
        );
      })}
    </tr>
  );
};

export default TimetableRow;
