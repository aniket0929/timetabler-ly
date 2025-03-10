
import React, { useState } from 'react';
import { useTimetable, TimetableBlock as TimetableBlockType } from '@/context/TimetableContext';
import { Card } from '@/components/ui/card';
import TimetableOptionsSelector from './timetable/TimetableOptionsSelector';
import TimetableHeader from './timetable/TimetableHeader';
import TimetableBody from './timetable/TimetableBody';

const TimetableView: React.FC = () => {
  const { 
    constraints, 
    selectedTimetable, 
    timetableOptions, 
    setSelectedTimetable,
    updateTimetableBlock,
    moveTimetableBlock
  } = useTimetable();
  
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  
  if (!selectedTimetable) {
    return (
      <div className="text-center py-10">
        No timetable selected. Please generate a timetable first.
      </div>
    );
  }
  
  const days = constraints.operatingDays === 'monday-to-friday'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const startHour = parseInt(constraints.startTime.split(':')[0]);
  const endHour = parseInt(constraints.endTime.split(':')[0]);
  const timeSlots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  // Initialize the timetable matrix with null values
  const timetableMatrix: (TimetableBlockType | null)[][] = [];
  for (let i = 0; i < timeSlots.length; i++) {
    timetableMatrix[i] = [];
    for (let j = 0; j < days.length; j++) {
      timetableMatrix[i][j] = null;
    }
  }
  
  // Track which timeSlots are occupied by 2-hour blocks
  const occupiedSlots: Record<string, boolean> = {};
  
  // Place blocks in the matrix
  selectedTimetable.blocks.forEach(block => {
    const day = days.indexOf(block.day);
    const startTime = block.startTime.split(':');
    const hour = parseInt(startTime[0]);
    const rowIndex = hour - startHour;
    
    if (day >= 0 && rowIndex >= 0 && rowIndex < timeSlots.length) {
      timetableMatrix[rowIndex][day] = block;
      
      // For 2-hour blocks, mark the next slot as occupied
      const subject = constraints.subjects.find(s => s.id === block.subjectId);
      if (subject && subject.duration === 120 && rowIndex + 1 < timeSlots.length) {
        // Mark this slot as occupied by a 2-hour block
        occupiedSlots[`${rowIndex + 1}-${day}`] = true;
      }
    }
  });
  
  const getBreakForTimeSlot = (time: string) => {
    return constraints.breakPeriods.find(breakPeriod => {
      const breakStartHour = parseInt(breakPeriod.startTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      
      return breakStartHour === slotHour;
    });
  };
  
  const isSlotOccupiedByTwoHourBlock = (timeIndex: number, dayIndex: number) => {
    return occupiedSlots[`${timeIndex}-${dayIndex}`] === true;
  };
  
  const getDurationForBlock = (block: TimetableBlockType) => {
    const subject = constraints.subjects.find(s => s.id === block.subjectId);
    return subject ? subject.duration : 60;
  };
  
  const handleBlockDrop = (e: React.DragEvent<HTMLDivElement>, timeIndex: number, dayIndex: number) => {
    e.preventDefault();
    setDropTargetId(null);
    
    try {
      const blockData = JSON.parse(e.dataTransfer.getData('application/json')) as TimetableBlockType;
      if (blockData && blockData.id) {
        const day = days[dayIndex];
        const time = timeSlots[timeIndex];
        
        // Check if there's already a subject from this block on this day
        const hasDuplicateSubjectOnDay = selectedTimetable.blocks.some(existingBlock => 
          existingBlock.subjectId === blockData.subjectId && 
          existingBlock.day === day && 
          existingBlock.id !== blockData.id
        );
        
        if (hasDuplicateSubjectOnDay) {
          console.log('Cannot place more than one lecture for the same subject on the same day');
          return;
        }
        
        // Check if there's enough space for a 2-hour block
        const subject = constraints.subjects.find(s => s.id === blockData.subjectId);
        if (subject && subject.duration === 120) {
          // Check if the next slot is available
          if (timeIndex + 1 >= timeSlots.length) {
            console.log('Not enough time slots available for a 2-hour lecture');
            return;
          }
          
          const nextSlotHasBlock = timetableMatrix[timeIndex + 1][dayIndex] !== null;
          if (nextSlotHasBlock) {
            console.log('Next time slot is already occupied');
            return;
          }
        }
        
        moveTimetableBlock(blockData.id, day, time);
      }
    } catch (error) {
      console.error('Error parsing dragged block data:', error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, cellId: string) => {
    e.preventDefault();
    setDropTargetId(cellId);
  };
  
  const handleDragLeave = () => {
    setDropTargetId(null);
  };
  
  const getSubjectForBlock = (block: TimetableBlockType) => {
    const subject = constraints.subjects.find(s => s.id === block.subjectId);
    if (!subject) {
      return { name: 'Unknown Subject', faculty: block.faculty, room: block.room };
    }
    return {
      name: subject.name,
      faculty: block.faculty, 
      room: block.room
    };
  };
  
  const dayColors = {
    'Monday': 'bg-[#F6F6F7] border-primary/20',
    'Tuesday': 'bg-[#F6F6F7] border-primary/20',
    'Wednesday': 'bg-[#F6F6F7] border-primary/20',
    'Thursday': 'bg-[#F6F6F7] border-primary/20',
    'Friday': 'bg-[#F6F6F7] border-primary/20',
    'Saturday': 'bg-[#F6F6F7] border-primary/20'
  };
  
  return (
    <div className="space-y-6 animate-scale-in">
      <TimetableOptionsSelector
        timetableOptions={timetableOptions}
        selectedTimetable={selectedTimetable}
        setSelectedTimetable={setSelectedTimetable}
      />
      
      <Card className="overflow-hidden border-primary/30 bg-white p-0 relative">
        <div className="absolute top-0 left-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-30"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-30 transform scale-x-[-1]"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-30 transform scale-y-[-1]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-30 transform scale-x-[-1] scale-y-[-1]"></div>
        
        <h2 className="text-center py-3 text-2xl font-bold bg-primary/10 text-primary border-b-2 border-primary/30">
          School Timetable
        </h2>
        
        <div className="overflow-x-auto p-4">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse">
              <TimetableHeader days={days} />
              <TimetableBody
                timeSlots={timeSlots}
                days={days}
                timetableMatrix={timetableMatrix}
                dropTargetId={dropTargetId}
                dayColors={dayColors}
                getBreakForTimeSlot={getBreakForTimeSlot}
                getSubjectForBlock={getSubjectForBlock}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleBlockDrop={handleBlockDrop}
                updateTimetableBlock={updateTimetableBlock}
                isSlotOccupiedByTwoHourBlock={isSlotOccupiedByTwoHourBlock}
                getDurationForBlock={getDurationForBlock}
              />
            </table>
          </div>
        </div>
      </Card>
      
      <div className="text-center text-sm text-primary/80">
        <p>Drag and drop classes to rearrange them. Click the edit icon to modify details.</p>
      </div>
    </div>
  );
};

export default TimetableView;
