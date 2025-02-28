
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TimetableView from '@/components/TimetableView';
import ExportOptions from '@/components/ExportOptions';
import { useTimetable } from '@/context/TimetableContext';

const Timetable: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTimetable, constraints } = useTimetable();
  
  // Redirect to generator if no timetable is selected
  useEffect(() => {
    if (!selectedTimetable && constraints.subjects.length === 0) {
      navigate('/generator');
    }
  }, [selectedTimetable, constraints.subjects, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/generator')} 
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Constraints
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold">Your Timetable</h1>
              <p className="text-muted-foreground mt-2">
                Drag and drop to rearrange classes or edit them by clicking the pencil icon.
              </p>
            </div>
            
            <ExportOptions />
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-glass">
            <TimetableView />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Timetable;
