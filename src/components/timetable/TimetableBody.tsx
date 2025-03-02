
import React from 'react';
import { TimetableBlock as TimetableBlockType } from '@/context/TimetableContext';
import TimetableRow from './TimetableRow';

interface TimetableBodyProps {
  timeSlots: string[];
  days: string[];
  timetableMatrix: (TimetableBlockType | null)[][];
  dropTargetId: string | null;
  dayColors: Record<string, string>;
  getBreakForTimeSlot: (time: string) => { name: string } | undefined;
  getSubjectForBlock: (block: TimetableBlockType) => { name: string; faculty: string; room?: string };
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, cellId: string) => void;
  handleDragLeave: () => void;
  handleBlockDrop: (e: React.DragEvent<HTMLDivElement>, timeIndex: number, dayIndex: number) => void;
  updateTimetableBlock: (block: TimetableBlockType) => void;
}

const TimetableBody: React.FC<TimetableBodyProps> = ({
  timeSlots,
  days,
  timetableMatrix,
  dropTargetId,
  dayColors,
  getBreakForTimeSlot,
  getSubjectForBlock,
  handleDragOver,
  handleDragLeave,
  handleBlockDrop,
  updateTimetableBlock
}) => {
  return (
    <tbody>
      {timeSlots.map((time, timeIndex) => (
        <TimetableRow
          key={time}
          time={time}
          timeIndex={timeIndex}
          days={days}
          timetableMatrix={timetableMatrix}
          timeSlots={timeSlots}
          dropTargetId={dropTargetId}
          dayColors={dayColors}
          getBreakForTimeSlot={getBreakForTimeSlot}
          getSubjectForBlock={getSubjectForBlock}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleBlockDrop={handleBlockDrop}
          updateTimetableBlock={updateTimetableBlock}
        />
      ))}
    </tbody>
  );
};

export default TimetableBody;
