
import React, { useState } from 'react';
import { useTimetable, TimetableBlock as TimetableBlockType } from '@/context/TimetableContext';
import TimetableBlock from './TimetableBlock';
import { Card } from '@/components/ui/card';

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
  
  // Define pastel colors for days
  const dayColors = {
    'Monday': 'bg-[#FFDEE2] border-[#FFBAC3]',
    'Tuesday': 'bg-[#FEF7CD] border-[#F3E9A6]',
    'Wednesday': 'bg-[#F2FCE2] border-[#DCF0C3]',
    'Thursday': 'bg-[#D3E4FD] border-[#B0CEFF]',
    'Friday': 'bg-[#FFDEE2] border-[#FFBAC3]',
    'Saturday': 'bg-[#E5DEFF] border-[#CBC2FF]'
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
                  ? 'bg-[#FFDEE2] text-[#FF6B8B]'
                  : 'bg-white text-[#FF6B8B] border border-[#FFDEE2] hover:bg-[#FFF5F7]'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
      
      <Card className="overflow-hidden border-[#FFBAC3] bg-white p-0 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40 transform scale-x-[-1]"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40 transform scale-y-[-1]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40 transform scale-x-[-1] scale-y-[-1]"></div>
        
        <h2 className="text-center py-3 text-2xl font-bold bg-[#FFDEE2] text-[#FF6B8B] border-b-2 border-[#FFBAC3]">
          School Timetable
        </h2>
        
        <div className="overflow-x-auto p-4">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_repeat(auto-fill,1fr)]">
              {/* Header row with days */}
              <div className="p-2 bg-[#FFDEE2] text-[#FF6B8B] font-bold border border-[#FFBAC3] rounded-tl-lg flex items-center justify-center">Time</div>
              {days.map((day, index) => (
                <div 
                  key={day} 
                  className={`p-2 text-center font-bold border-2 ${dayColors[day]} ${index === days.length - 1 ? 'rounded-tr-lg' : ''}`}
                >
                  {day}
                </div>
              ))}
              
              {/* Time slots rows */}
              {timeSlots.map((time, timeIndex) => (
                <React.Fragment key={time}>
                  <div className={`p-2 text-center text-sm font-medium bg-[#FFDEE2] text-[#FF6B8B] border-2 border-[#FFBAC3] ${timeIndex === timeSlots.length - 1 ? 'rounded-bl-lg' : ''}`}>
                    {time}
                  </div>
                  
                  {days.map((day, dayIndex) => {
                    const block = getBlockForTimeSlot(day, time);
                    const breakPeriod = getBreakForTimeSlot(time);
                    const cellId = `${day}-${time}`;
                    const isLastRow = timeIndex === timeSlots.length - 1;
                    const isLastCol = dayIndex === days.length - 1;
                    
                    return (
                      <div
                        key={`${day}-${time}`}
                        className={`border-2 ${dayColors[day]} ${isLastRow && isLastCol ? 'rounded-br-lg' : ''} ${dropTargetId === cellId ? 'ring-2 ring-[#FF6B8B]' : ''}`}
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
                          <div className="h-full w-full flex items-center justify-center p-2 bg-[#FDE1D3] text-[#FF6B8B] text-sm font-medium border border-[#FEC6A1]">
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
      </Card>
      
      <div className="text-center text-sm text-[#FF6B8B]">
        <p>Drag and drop classes to rearrange them. Click the edit icon to modify details.</p>
      </div>
    </div>
  );
};

export default TimetableView;
