
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TimetableContainer from '@/components/timetable/TimetableContainer';
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF5F7] to-[#FFDEE2]">
      <Header />
      
      <main className="flex-1 pt-24 pb-20 px-6">
        <TimetableContainer />
      </main>
      
      <Footer />
    </div>
  );
};

export default Timetable;
