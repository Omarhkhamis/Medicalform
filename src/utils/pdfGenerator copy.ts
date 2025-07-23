import jsPDF from 'jspdf';
import { FormData } from '../types/form';

export const generatePDF = async (formData: FormData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Set up fonts
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  
  // Title
  const title = 'Medical Form Report';
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, 25);
  
  // Add horizontal line
  pdf.setLineWidth(0.5);
  pdf.line(20, 30, pageWidth - 20, 30);
  
  let yPosition = 45;
  
  // Helper function to add section
  const addSection = (sectionTitle: string, fields: Array<{label: string, value: string | number}>) => {
    // Section title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text(sectionTitle, 20, yPosition);
    yPosition += 10;
    
    // Section content
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(68, 68, 68);
    
    fields.forEach(field => {
      if (field.value) {
        const text = `${field.label}: ${field.value}`;
        const lines = pdf.splitTextToSize(text, pageWidth - 40);
        pdf.text(lines, 25, yPosition);
        yPosition += lines.length * 5;
      }
    });
    
    yPosition += 8;
    
    // Check if we need a new page
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };
  
  // Step 1: Personal Information
  addSection('Personal Information', [
    { label: 'Consultant Name', value: formData.consultantName },
    { label: 'Patient Name', value: formData.patientName },
    { label: 'Phone Number', value: formData.phoneNumber },
    { label: 'Patient ID', value: formData.patientId },
    { label: 'Entry Date', value: formData.entryDate },
    { label: 'Age', value: formData.age.toString() },
    { label: 'Currency', value: formData.currency },
    { label: 'Language', value: formData.language },
    { label: 'Health Condition', value: formData.healthCondition },
    { label: 'Services', value: formData.services }
  ]);
  
  // Step 2: Medical Visit
  addSection('Medical Visit Information', [
    { label: 'First Visit Date', value: formData.firstVisitDate },
    { label: 'Second Visit Days', value: formData.secondVisitDays.toString() },
    { label: 'Service Name', value: formData.serviceName },
    { label: 'Service Type', value: formData.serviceType },
    { label: 'Price', value: `${formData.price} ${formData.currency}` },
    { label: 'Quantity', value: formData.quantity.toString() }
  ]);
  
  // Step 3: Notes
  if (formData.notes) {
    addSection('Additional Notes', [
      { label: 'Notes', value: formData.notes }
    ]);
  }
  
  // Add footer
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  const footer = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
  const footerWidth = pdf.getTextWidth(footer);
  pdf.text(footer, (pageWidth - footerWidth) / 2, pageHeight - 10);
  
  // Save the PDF
  const fileName = `medical_form_${formData.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};