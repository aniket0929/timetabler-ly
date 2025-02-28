
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConstraintForm from '@/components/ConstraintForm';

const Generator: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Create Your Timetable</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Enter your constraints below and we'll generate optimized timetable options for you.
          </p>
          
          <ConstraintForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Generator;
