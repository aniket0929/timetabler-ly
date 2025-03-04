import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useTimetable,
  BreakPeriod,
  Subject,
  InstitutionType,
  OperatingDays
} from '@/context/TimetableContext';

const ConstraintForm: React.FC = () => {
  const navigate = useNavigate();
  const { constraints, setConstraints, generateTimetableOptions, isGenerating } = useTimetable();
  
  // Form validation state
  const [formErrors, setFormErrors] = useState<{
    institutionType?: string;
    operatingDays?: string;
    startTime?: string;
    endTime?: string;
    subjects?: string;
  }>({});
  
  // Handle form field changes
  const handleInstitutionTypeChange = (value: InstitutionType) => {
    setConstraints(prev => ({ ...prev, institutionType: value }));
  };
  
  const handleOperatingDaysChange = (value: OperatingDays) => {
    setConstraints(prev => ({ ...prev, operatingDays: value }));
  };
  
  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setConstraints(prev => ({ ...prev, [field]: value }));
  };
  
  // Break period management
  const addBreakPeriod = () => {
    const newBreak: BreakPeriod = {
      id: `break_${Date.now()}`,
      name: `Break ${constraints.breakPeriods.length + 1}`,
      startTime: '10:00',
      endTime: '10:15'
    };
    
    setConstraints(prev => ({
      ...prev,
      breakPeriods: [...prev.breakPeriods, newBreak]
    }));
  };
  
  const updateBreakPeriod = (id: string, field: string, value: string) => {
    setConstraints(prev => ({
      ...prev,
      breakPeriods: prev.breakPeriods.map(breakPeriod => 
        breakPeriod.id === id ? { ...breakPeriod, [field]: value } : breakPeriod
      )
    }));
  };
  
  const removeBreakPeriod = (id: string) => {
    setConstraints(prev => ({
      ...prev,
      breakPeriods: prev.breakPeriods.filter(breakPeriod => breakPeriod.id !== id)
    }));
  };
  
  // Subject management
  const addSubject = () => {
    const newSubject: Subject = {
      id: `subject_${Date.now()}`,
      name: '',
      faculty: '',
      lecturesPerWeek: 3,
      duration: 60, // 1 hour
      room: ''
    };
    
    setConstraints(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
  };
  
  const updateSubject = (id: string, field: string, value: any) => {
    setConstraints(prev => ({
      ...prev,
      subjects: prev.subjects.map(subject => 
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    }));
  };
  
  const removeSubject = (id: string) => {
    setConstraints(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject.id !== id)
    }));
  };
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const errors: any = {};
    
    if (!constraints.institutionType) {
      errors.institutionType = 'Please select an institution type';
    }
    
    if (!constraints.operatingDays) {
      errors.operatingDays = 'Please select operating days';
    }
    
    if (!constraints.startTime) {
      errors.startTime = 'Please enter a start time';
    }
    
    if (!constraints.endTime) {
      errors.endTime = 'Please enter an end time';
    }
    
    if (constraints.subjects.length === 0) {
      errors.subjects = 'Please add at least one subject';
    } else {
      const hasEmptyFields = constraints.subjects.some(
        subject => !subject.name || !subject.faculty
      );
      
      if (hasEmptyFields) {
        errors.subjects = 'Please fill in all subject details';
      }
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Generate timetable and navigate to timetable view
      generateTimetableOptions();
      navigate('/timetable');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Institution Type</Label>
              <RadioGroup 
                value={constraints.institutionType} 
                onValueChange={handleInstitutionTypeChange}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="school" id="institution-school" />
                  <Label htmlFor="institution-school" className="cursor-pointer">School</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="college" id="institution-college" />
                  <Label htmlFor="institution-college" className="cursor-pointer">College</Label>
                </div>
              </RadioGroup>
              {formErrors.institutionType && (
                <p className="text-sm text-destructive mt-1">{formErrors.institutionType}</p>
              )}
            </div>
            
            <div>
              <Label>Operating Days</Label>
              <RadioGroup 
                value={constraints.operatingDays} 
                onValueChange={handleOperatingDaysChange}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monday-to-friday" id="days-weekday" />
                  <Label htmlFor="days-weekday" className="cursor-pointer">Monday to Friday</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monday-to-saturday" id="days-saturday" />
                  <Label htmlFor="days-saturday" className="cursor-pointer">Monday to Saturday</Label>
                </div>
              </RadioGroup>
              {formErrors.operatingDays && (
                <p className="text-sm text-destructive mt-1">{formErrors.operatingDays}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Daily Start Time</Label>
                <Input 
                  id="start-time" 
                  type="time" 
                  value={constraints.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="mt-2"
                />
                {formErrors.startTime && (
                  <p className="text-sm text-destructive mt-1">{formErrors.startTime}</p>
                )}
              </div>
              <div>
                <Label htmlFor="end-time">Daily End Time</Label>
                <Input 
                  id="end-time" 
                  type="time" 
                  value={constraints.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="mt-2"
                />
                {formErrors.endTime && (
                  <p className="text-sm text-destructive mt-1">{formErrors.endTime}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Break Periods</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addBreakPeriod}
              className="flex items-center"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Add Break
            </Button>
          </div>
          
          {constraints.breakPeriods.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No break periods added yet.</p>
          ) : (
            <div className="space-y-4">
              {constraints.breakPeriods.map((breakPeriod) => (
                <div key={breakPeriod.id} className="flex items-center space-x-4 p-3 rounded-md bg-muted/50">
                  <div className="flex-1">
                    <Input 
                      value={breakPeriod.name}
                      onChange={(e) => updateBreakPeriod(breakPeriod.id, 'name', e.target.value)}
                      placeholder="Break Name"
                      className="mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        type="time" 
                        value={breakPeriod.startTime}
                        onChange={(e) => updateBreakPeriod(breakPeriod.id, 'startTime', e.target.value)}
                      />
                      <Input 
                        type="time" 
                        value={breakPeriod.endTime}
                        onChange={(e) => updateBreakPeriod(breakPeriod.id, 'endTime', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeBreakPeriod(breakPeriod.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Subjects & Lectures</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addSubject}
              className="flex items-center"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Add Subject
            </Button>
          </div>
          
          {formErrors.subjects && (
            <p className="text-sm text-destructive mb-4">{formErrors.subjects}</p>
          )}
          
          {constraints.subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No subjects added yet.</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addSubject}
                className="mt-4"
              >
                Add Your First Subject
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {constraints.subjects.map((subject, index) => (
                <AccordionItem key={subject.id} value={subject.id} className="border rounded-lg p-2">
                  <AccordionTrigger className="py-2 px-4 hover:no-underline">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {subject.name || `Subject ${index + 1}`}
                      </span>
                      {subject.name && subject.faculty && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({subject.faculty})
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-3">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`subject-name-${subject.id}`}>Subject Name</Label>
                          <Input 
                            id={`subject-name-${subject.id}`}
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                            placeholder="e.g., Mathematics"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`faculty-name-${subject.id}`}>Faculty Name</Label>
                          <Input 
                            id={`faculty-name-${subject.id}`}
                            value={subject.faculty}
                            onChange={(e) => updateSubject(subject.id, 'faculty', e.target.value)}
                            placeholder="e.g., Prof. Johnson"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`lectures-per-week-${subject.id}`}>Lectures per Week</Label>
                          <Select 
                            value={subject.lecturesPerWeek.toString()}
                            onValueChange={(value) => updateSubject(subject.id, 'lecturesPerWeek', parseInt(value))}
                          >
                            <SelectTrigger id={`lectures-per-week-${subject.id}`} className="mt-1">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'lecture' : 'lectures'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`duration-${subject.id}`}>Lecture Duration</Label>
                          <Select 
                            value={subject.duration.toString()}
                            onValueChange={(value) => updateSubject(subject.id, 'duration', parseInt(value))}
                          >
                            <SelectTrigger id={`duration-${subject.id}`} className="mt-1">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`room-${subject.id}`}>Room (Optional)</Label>
                          <Input 
                            id={`room-${subject.id}`}
                            value={subject.room || ''}
                            onChange={(e) => updateSubject(subject.id, 'room', e.target.value)}
                            placeholder="e.g., Room 101"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSubject(subject.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove Subject
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Timetable'}
        </Button>
      </div>
    </form>
  );
};

export default ConstraintForm;
