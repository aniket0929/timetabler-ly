
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import TimetableView from '@/components/TimetableView';
import ExportOptions from '@/components/ExportOptions';
import { useTimetable } from '@/context/TimetableContext';

const TimetableContainer: React.FC = () => {
  const navigate = useNavigate();
  const { saveTimetable } = useTimetable();
  const { toast } = useToast();
  
  const handleSaveTimetable = async () => {
    try {
      await saveTimetable();
      toast({
        title: "Timetable saved",
        description: "Your timetable has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving timetable:", error);
      toast({
        title: "Error saving timetable",
        description: "An error occurred while saving your timetable",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/generator')} 
            className="mb-2 -ml-2 text-[#FF6B8B] hover:text-[#FF6B8B] hover:bg-[#FFF5F7]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Constraints
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#FF6B8B]">Your Timetable</h1>
          <p className="text-[#FF8FAA] mt-1">
            Drag and drop to rearrange classes or edit them by clicking the pencil icon.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={handleSaveTimetable}
            className="flex items-center border-[#FFBAC3] text-[#FF6B8B] hover:bg-[#FFF5F7] hover:text-[#FF6B8B]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Timetable
          </Button>
          <ExportOptions />
        </div>
      </div>
      
      <TimetableView />
    </div>
  );
};

export default TimetableContainer;
