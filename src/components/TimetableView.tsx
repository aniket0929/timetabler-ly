
import React, { useState } from 'react';
import { useTimetable, TimetableBlock as TimetableBlockType } from '@/context/TimetableContext';
import TimetableBlock from './TimetableBlock';

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
  
  // Determine days to display based on operating days
  const days = constraints.operatingDays === 'monday-to-friday'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Generate time slots
  const startHour = parseInt(constraints.startTime.split(':')[0]);
  const endHour = parseInt(constraints.endTime.split(':')[0]);
  const timeSlots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  // Get blocks for a specific day and time
  const getBlockForTimeSlot = (day: string, time: string) => {
    return selectedTimetable.blocks.find(block => {
      const blockStartHour = parseInt(block.startTime.split(':')[0]);
      const blockStartMinute = parseInt(block.startTime.split(':')[1]);
      const slotHour = parseInt(time.split(':')[0]);
      
      return block.day === day && blockStartHour === slotHour;
    });
  };
  
  // Get break periods for a specific time
  const getBreakForTimeSlot = (time: string) => {
    return constraints.breakPeriods.find(breakPeriod => {
      const breakStartHour = parseInt(breakPeriod.startTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      
      return breakStartHour === slotHour;
    });
  };
  
  const handleBlockDrop = (e: React.DragEvent<HTMLDivElement>, day: string, time: string) => {
    e.preventDefault();
    setDropTargetId(null);
    
    try {
      const blockData = JSON.parse(e.dataTransfer.getData('application/json')) as TimetableBlockType;
      if (blockData && blockData.id) {
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
      faculty: block.faculty, // Use faculty from block as it might have been edited
      room: block.room // Use room from block as it might have been edited
    };
  };
  
  // Switch between timetable options
  const handleTimetableChange = (timetableId: string) => {
    const selected = timetableOptions.find(option => option.id === timetableId);
    if (selected) {
      setSelectedTimetable(selected);
    }
  };
  
  return (
    <div className="space-y-6 animate-scale-in">
      {timetableOptions.length > 1 && (
        <div className="flex justify-center space-x-2 mb-6">
          {timetableOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleTimetableChange(option.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimetable.id === option.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
      
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[100px_repeat(auto-fill,1fr)]">
            {/* Header row with days */}
            <div className="p-2"></div>
            {days.map((day) => (
              <div 
                key={day} 
                className="p-2 text-center font-semibold border-b border-border"
              >
                {day}
              </div>
            ))}
            
            {/* Time slots rows */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="p-2 text-center text-sm font-medium text-muted-foreground border-r border-border/50">
                  {time}
                </div>
                
                {days.map((day) => {
                  const block = getBlockForTimeSlot(day, time);
                  const breakPeriod = getBreakForTimeSlot(time);
                  const cellId = `${day}-${time}`;
                  
                  return (
                    <div
                      key={`${day}-${time}`}
                      className={`timetable-cell ${dropTargetId === cellId ? 'timetable-cell-drop-active' : ''}`}
                      onDrop={(e) => handleBlockDrop(e, day, time)}
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
                        <div className="h-full w-full flex items-center justify-center p-2 bg-muted/30 text-muted-foreground text-sm">
                          {breakPeriod.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Drag and drop classes to rearrange them. Click the edit icon to modify details.</p>
      </div>
    </div>
  );
};

export default TimetableView;
