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
  
  const days = constraints.operatingDays === 'monday-to-friday'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const startHour = parseInt(constraints.startTime.split(':')[0]);
  const endHour = parseInt(constraints.endTime.split(':')[0]);
  const timeSlots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  const timetableMatrix: (TimetableBlockType | null)[][] = [];
  
  for (let i = 0; i < timeSlots.length; i++) {
    timetableMatrix[i] = [];
    for (let j = 0; j < days.length; j++) {
      timetableMatrix[i][j] = null;
    }
  }
  
  selectedTimetable.blocks.forEach(block => {
    const day = days.indexOf(block.day);
    const startTime = block.startTime.split(':');
    const hour = parseInt(startTime[0]);
    const rowIndex = hour - startHour;
    
    if (day >= 0 && rowIndex >= 0 && rowIndex < timeSlots.length) {
      timetableMatrix[rowIndex][day] = block;
    }
  });
  
  const getBreakForTimeSlot = (time: string) => {
    return constraints.breakPeriods.find(breakPeriod => {
      const breakStartHour = parseInt(breakPeriod.startTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      
      return breakStartHour === slotHour;
    });
  };
  
  const handleBlockDrop = (e: React.DragEvent<HTMLDivElement>, timeIndex: number, dayIndex: number) => {
    e.preventDefault();
    setDropTargetId(null);
    
    try {
      const blockData = JSON.parse(e.dataTransfer.getData('application/json')) as TimetableBlockType;
      if (blockData && blockData.id) {
        const day = days[dayIndex];
        const time = timeSlots[timeIndex];
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
    'Monday': 'bg-[#FFF5F7] border-[#FFBAC3]',
    'Tuesday': 'bg-[#FFF5F7] border-[#FFBAC3]',
    'Wednesday': 'bg-[#FFF5F7] border-[#FFBAC3]',
    'Thursday': 'bg-[#FFF5F7] border-[#FFBAC3]',
    'Friday': 'bg-[#FFF5F7] border-[#FFBAC3]',
    'Saturday': 'bg-[#FFF5F7] border-[#FFBAC3]'
  };
  
  return (
    <div className="space-y-6 animate-scale-in">
      {timetableOptions.length > 1 && (
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
      )}
      
      <Card className="overflow-hidden border-[#FFBAC3] bg-white p-0 relative">
        <div className="absolute top-0 left-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40 transform scale-x-[-1]"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40 transform scale-y-[-1]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[url('/lovable-uploads/84a222e7-3f1c-44e3-a17b-451371481dca.png')] bg-no-repeat bg-contain opacity-40 transform scale-x-[-1] scale-y-[-1]"></div>
        
        <h2 className="text-center py-3 text-2xl font-bold bg-[#FFDEE2] text-[#FF6B8B] border-b-2 border-[#FFBAC3]">
          School Timetable
        </h2>
        
        <div className="overflow-x-auto p-4">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse">
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
              <tbody>
                {timeSlots.map((time, timeIndex) => {
                  const breakPeriod = getBreakForTimeSlot(time);
                  
                  return (
                    <tr key={time}>
                      <td className={`p-2 text-center text-sm font-medium bg-[#FFDEE2] text-[#FF6B8B] border-2 border-[#FFBAC3] ${timeIndex === timeSlots.length - 1 ? 'rounded-bl-lg' : ''}`}>
                        {time}
                      </td>
                      
                      {days.map((day, dayIndex) => {
                        const block = timetableMatrix[timeIndex][dayIndex];
                        const cellId = `${timeIndex}-${dayIndex}`;
                        const isLastRow = timeIndex === timeSlots.length - 1;
                        const isLastCol = dayIndex === days.length - 1;
                        
                        return (
                          <td
                            key={`${day}-${time}`}
                            className={`border-2 relative h-24 ${dayColors[day]} ${isLastRow && isLastCol ? 'rounded-br-lg' : ''} ${dropTargetId === cellId ? 'ring-2 ring-[#FF6B8B]' : ''}`}
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
                              <div className="h-full w-full flex items-center justify-center p-2 bg-[#FFF0F3] text-[#FF6B8B] text-sm font-medium border border-[#FFCDD6] rounded-md">
                                {breakPeriod.name}
                              </div>
                            )}
                            
                            {!block && !breakPeriod && (
                              <div className="h-full w-full p-2">
                                <div className="h-full w-full rounded-md border-2 border-dashed border-[#FFBAC3]/30 flex items-center justify-center">
                                  <span className="text-xs text-[#FF6B8B]/30">Empty Slot</span>
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
