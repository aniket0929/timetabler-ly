
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
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const ExportOptions: React.FC = () => {
  const { selectedTimetable, constraints } = useTimetable();
  
  const exportAsPDF = () => {
    if (!selectedTimetable) return;
    
    const pdf = new jsPDF('landscape');
    
    // Add title
    pdf.setFontSize(18);
    pdf.text(`Timetable: ${selectedTimetable.name}`, 14, 22);
    
    // Set up table content
    const days = constraints.operatingDays === 'monday-to-friday'
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Prepare table data
    const tableData = [];
    const header = ['Day', 'Start Time', 'End Time', 'Subject', 'Faculty', 'Room'];
    tableData.push(header);
    
    selectedTimetable.blocks.forEach(block => {
      const subject = constraints.subjects.find(s => s.id === block.subjectId);
      if (!subject) return;
      
      tableData.push([
        block.day,
        block.startTime,
        block.endTime,
        subject.name,
        block.faculty,
        block.room || ''
      ]);
    });
    
    // Add table to PDF
    pdf.setFontSize(10);
    (pdf as any).autoTable({
      startY: 30,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 107, 139], textColor: [255, 255, 255] }
    });
    
    // Save PDF
    pdf.save(`${selectedTimetable.name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Timetable exported as PDF successfully!');
  };
  
  const exportAsExcel = () => {
    if (!selectedTimetable) return;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare table data
    const tableData = [];
    const header = ['Day', 'Start Time', 'End Time', 'Subject', 'Faculty', 'Room'];
    tableData.push(header);
    
    selectedTimetable.blocks.forEach(block => {
      const subject = constraints.subjects.find(s => s.id === block.subjectId);
      if (!subject) return;
      
      tableData.push([
        block.day,
        block.startTime,
        block.endTime,
        subject.name,
        block.faculty,
        block.room || ''
      ]);
    });
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(tableData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
    
    // Write to file and trigger download
    XLSX.writeFile(wb, `${selectedTimetable.name.replace(/\s+/g, '_')}.xlsx`);
    toast.success('Timetable exported as Excel successfully!');
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
    link.setAttribute('download', `${selectedTimetable.name.replace(/\s+/g, '_')}.csv`);
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
