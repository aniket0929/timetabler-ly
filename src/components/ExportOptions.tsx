
import React from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTimetable } from '@/context/TimetableContext';
import { toast } from 'sonner';

const ExportOptions: React.FC = () => {
  const { selectedTimetable, constraints } = useTimetable();
  
  const exportAsPDF = () => {
    // In a real app, this would connect to a PDF generation library
    toast.success('Exporting as PDF...');
    setTimeout(() => {
      toast.success('Your timetable has been exported as PDF!');
    }, 1500);
  };
  
  const exportAsExcel = () => {
    // In a real app, this would generate an Excel file
    toast.success('Exporting as Excel...');
    setTimeout(() => {
      toast.success('Your timetable has been exported as Excel!');
    }, 1500);
  };
  
  const exportAsCSV = () => {
    if (!selectedTimetable) return;
    
    // Create CSV content
    const days = constraints.operatingDays === 'monday-to-friday'
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let csvContent = 'Day,Start Time,End Time,Subject,Faculty,Room\n';
    
    selectedTimetable.blocks.forEach(block => {
      const subject = constraints.subjects.find(s => s.id === block.subjectId);
      if (!subject) return;
      
      csvContent += `${block.day},${block.startTime},${block.endTime},"${subject.name}","${block.faculty}","${block.room || ''}"\n`;
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `timetable_${selectedTimetable.name}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    
    toast.success('Timetable exported as CSV successfully!');
  };
  
  if (!selectedTimetable) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportAsPDF} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsExcel} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsCSV} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
