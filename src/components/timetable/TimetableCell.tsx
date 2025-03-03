
import React from 'react';
import { TimetableBlock as TimetableBlockType } from '@/context/TimetableContext';
import TimetableBlock from '../TimetableBlock';

interface TimetableCellProps {
  day: string;
  time: string;
  block: TimetableBlockType | null;
  breakPeriod: { name: string } | undefined;
  isLastRow: boolean;
  isLastCol: boolean;
  timeIndex: number;
  dayIndex: number;
  cellId: string;
  dropTargetId: string | null;
  getSubjectForBlock: (block: TimetableBlockType) => { name: string; faculty: string; room?: string };
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, cellId: string) => void;
  handleDragLeave: () => void;
  handleBlockDrop: (e: React.DragEvent<HTMLDivElement>, timeIndex: number, dayIndex: number) => void;
  updateTimetableBlock: (block: TimetableBlockType) => void;
  dayColor: string;
}

const TimetableCell: React.FC<TimetableCellProps> = ({
  day,
  block,
  breakPeriod,
  isLastRow,
  isLastCol,
  timeIndex,
  dayIndex,
  cellId,
  dropTargetId,
  getSubjectForBlock,
  handleDragOver,
  handleDragLeave,
  handleBlockDrop,
  updateTimetableBlock,
  dayColor
}) => {
  return (
    <td
      className={`border-2 relative h-24 ${dayColor} ${isLastRow && isLastCol ? 'rounded-br-lg' : ''} ${dropTargetId === cellId ? 'ring-2 ring-primary' : ''}`}
      onDrop={(e) => handleBlockDrop(e, timeIndex, dayIndex)}
      onDragOver={(e) => handleDragOver(e, cellId)}
      onDragLeave={handleDragLeave}
    >
      {block && (
        <TimetableBlock 
          block={block} 
          subject={getSubjectForBlock(block)}
          updateBlock={updateTimetableBlock}
        />
      )}
      
      {breakPeriod && !block && (
        <div className="h-full w-full flex items-center justify-center p-2 bg-primary/5 text-primary text-sm font-medium border border-primary/20 rounded-md">
          {breakPeriod.name}
        </div>
      )}
      
      {!block && !breakPeriod && (
        <div className="h-full w-full p-2">
          <div className="h-full w-full rounded-md border-2 border-dashed border-primary/20 flex items-center justify-center">
            <span className="text-xs text-primary/30">Empty Slot</span>
          </div>
        </div>
      )}
    </td>
  );
};

export default TimetableCell;
