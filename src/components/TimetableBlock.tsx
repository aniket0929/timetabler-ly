
import React, { useState, useRef } from 'react';
import { Pencil, X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TimetableBlock as TimetableBlockType } from '@/context/TimetableContext';

interface TimetableBlockProps {
  block: TimetableBlockType;
  subject: { name: string; faculty: string; room?: string };
  updateBlock: (block: TimetableBlockType) => void;
}

const TimetableBlock: React.FC<TimetableBlockProps> = ({ block, subject, updateBlock }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlock, setEditedBlock] = useState(block);
  const blockRef = useRef<HTMLDivElement>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'move';
    
    if (blockRef.current) {
      // Add visual feedback for dragging
      setTimeout(() => {
        if (blockRef.current) {
          blockRef.current.style.opacity = '0.4';
        }
      }, 0);
    }
  };
  
  const handleDragEnd = () => {
    if (blockRef.current) {
      blockRef.current.style.opacity = '1';
    }
  };
  
  const handleEdit = () => {
    setEditedBlock(block);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    updateBlock(editedBlock);
    setIsEditing(false);
  };
  
  const handleFieldChange = (field: keyof TimetableBlockType, value: string) => {
    setEditedBlock(prev => ({ ...prev, [field]: value }));
  };
  
  // Get a light color based on the subject name
  const getSubjectColor = () => {
    // Simple hash function for strings
    const hash = subject.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // List of pastel colors
    const colors = [
      { bg: 'bg-[#F2FCE2]', border: 'border-[#DCF0C3]', text: 'text-[#77A357]' }, // green
      { bg: 'bg-[#E5DEFF]', border: 'border-[#CBC2FF]', text: 'text-[#7366BD]' }, // purple
      { bg: 'bg-[#D3E4FD]', border: 'border-[#B0CEFF]', text: 'text-[#3B82F6]' }, // blue
      { bg: 'bg-[#FDE1D3]', border: 'border-[#FEC6A1]', text: 'text-[#F97316]' }, // orange
      { bg: 'bg-[#FEF7CD]', border: 'border-[#F3E9A6]', text: 'text-[#EAB308]' }, // yellow
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  const { bg, border, text } = getSubjectColor();
  
  return (
    <>
      <div
        ref={blockRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`h-full w-full p-2 ${bg} ${border} border-2 rounded-md cursor-grab hover:shadow-md transition-all duration-200`}
      >
        <div className="flex justify-between items-start">
          <div className={`font-bold text-sm ${text}`}>{subject.name}</div>
          <button
            onClick={handleEdit}
            className={`${text} hover:text-opacity-70`}
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
        
        <div className="mt-1 text-xs text-gray-600">
          <div>{subject.faculty}</div>
          {block.room && <div>{block.room}</div>}
          <div className={`mt-1 ${text}`}>
            {block.startTime} - {block.endTime}
          </div>
        </div>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-[#FFBAC3]">
          <DialogHeader>
            <DialogTitle className="text-[#FF6B8B]">Edit Class</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-faculty" className="text-[#FF6B8B]">Faculty</Label>
              <Input
                id="edit-faculty"
                value={editedBlock.faculty}
                onChange={(e) => handleFieldChange('faculty', e.target.value)}
                className="border-[#FFBAC3] focus-visible:ring-[#FF6B8B]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-room" className="text-[#FF6B8B]">Room</Label>
              <Input
                id="edit-room"
                value={editedBlock.room || ''}
                onChange={(e) => handleFieldChange('room', e.target.value)}
                placeholder="e.g., Room 101"
                className="border-[#FFBAC3] focus-visible:ring-[#FF6B8B]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-time" className="text-[#FF6B8B]">Start Time</Label>
                <Input
                  id="edit-start-time"
                  type="time"
                  value={editedBlock.startTime}
                  onChange={(e) => handleFieldChange('startTime', e.target.value)}
                  className="border-[#FFBAC3] focus-visible:ring-[#FF6B8B]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-end-time" className="text-[#FF6B8B]">End Time</Label>
                <Input
                  id="edit-end-time"
                  type="time"
                  value={editedBlock.endTime}
                  onChange={(e) => handleFieldChange('endTime', e.target.value)}
                  className="border-[#FFBAC3] focus-visible:ring-[#FF6B8B]"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-[#FFBAC3] text-[#FF6B8B] hover:bg-[#FFF5F7] hover:text-[#FF6B8B]">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} className="bg-[#FF6B8B] hover:bg-[#FF8FAA] text-white">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimetableBlock;
