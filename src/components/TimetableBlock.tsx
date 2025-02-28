
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
  
  return (
    <>
      <div
        ref={blockRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="timetable-block"
      >
        <div className="flex justify-between items-start">
          <div className="font-medium text-sm">{subject.name}</div>
          <button
            onClick={handleEdit}
            className="text-primary/70 hover:text-primary"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
        
        <div className="mt-1 text-xs text-muted-foreground">
          <div>{subject.faculty}</div>
          {block.room && <div>{block.room}</div>}
          <div className="mt-1 text-primary/70">
            {block.startTime} - {block.endTime}
          </div>
        </div>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-faculty">Faculty</Label>
              <Input
                id="edit-faculty"
                value={editedBlock.faculty}
                onChange={(e) => handleFieldChange('faculty', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-room">Room</Label>
              <Input
                id="edit-room"
                value={editedBlock.room || ''}
                onChange={(e) => handleFieldChange('room', e.target.value)}
                placeholder="e.g., Room 101"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-time">Start Time</Label>
                <Input
                  id="edit-start-time"
                  type="time"
                  value={editedBlock.startTime}
                  onChange={(e) => handleFieldChange('startTime', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-end-time">End Time</Label>
                <Input
                  id="edit-end-time"
                  type="time"
                  value={editedBlock.endTime}
                  onChange={(e) => handleFieldChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimetableBlock;
