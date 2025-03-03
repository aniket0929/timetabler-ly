
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimetableView from '@/components/TimetableView';
import ExportOptions from '@/components/ExportOptions';

const TimetableContainer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/generator')} 
            className="mb-2 -ml-2 text-primary hover:text-primary hover:bg-secondary/50"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Constraints
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Your Timetable</h1>
          <p className="text-primary/80 mt-1">
            Drag and drop to rearrange classes or edit them by clicking the pencil icon.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <ExportOptions />
        </div>
      </div>
      
      <TimetableView />
    </div>
  );
};

export default TimetableContainer;
