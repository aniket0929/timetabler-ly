
import React, { createContext, useContext, ReactNode } from 'react';
import { TimetableContextType } from './types';
import { useTimetableState } from './useTimetableState';
import { useTimetableActions } from './useTimetableActions';

// Create the context
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

// Provider component
export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const state = useTimetableState();
  
  const actions = useTimetableActions({
    constraints: state.constraints,
    setTimetableOptions: state.setTimetableOptions,
    setSelectedTimetable: state.setSelectedTimetable,
    selectedTimetable: state.selectedTimetable,
    setIsGenerating: state.setIsGenerating
  });
  
  const value = {
    ...state,
    ...actions
  };

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
};

// Hook for using the timetable context
export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};

// Re-export types for convenience
export * from './types';
