import jsPDF from 'jspdf';
import { FormData } from '../types/form';

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
  addSection('First Visit Information', [
    { label: 'Visit Date', value: formData.firstVisit.visitDate },
    { label: 'Visit Days', value: formData.firstVisit.visitDays.toString() }
  ]);
  
  // First Visit Service Entries
  if (formData.firstVisit.serviceEntries.length > 0) {
    addServiceEntriesTable('First Visit Service Entries', formData.firstVisit.serviceEntries);
  }
  
  addSection('Second Visit Information', [
    { label: 'Visit Date', value: formData.secondVisit.visitDate },
    { label: 'Visit Days', value: formData.secondVisit.visitDays.toString() }
  ]);
  
  // Second Visit Service Entries
  if (formData.secondVisit.serviceEntries.length > 0) {
    addServiceEntriesTable('Second Visit Service Entries', formData.secondVisit.serviceEntries);
  }
  
  // Helper function to add service entries table
  function addServiceEntriesTable(title: string, serviceEntries: any[]) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text(title, 20, yPosition);
    yPosition += 10;
    
    // Table header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(68, 68, 68);
    
    const tableStartY = yPosition;
    const colWidths = [40, 40, 30, 30, 30];
    const colPositions = [20, 60, 100, 130, 160];
    
    // Draw header
    pdf.text('Service Name', colPositions[0], yPosition);
    pdf.text('Service Type', colPositions[1], yPosition);
    pdf.text('Price', colPositions[2], yPosition);
    pdf.text('Quantity', colPositions[3], yPosition);
    pdf.text('Total', colPositions[4], yPosition);
    
    yPosition += 8;
    
    // Draw header line
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
    
    // Table rows
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    
    serviceEntries.forEach((entry, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const serviceName = entry.serviceName || '-';
      const serviceType = entry.serviceType || '-';
      const price = entry.price ? `${entry.price} ${formData.currency}` : '-';
      const quantity = entry.quantity || '-';
      const total = (entry.price && entry.quantity) ? 
        `${(Number(entry.price) * Number(entry.quantity))} ${formData.currency}` : '-';
      
      pdf.text(serviceName, colPositions[0], yPosition);
      pdf.text(serviceType, colPositions[1], yPosition);
      pdf.text(price, colPositions[2], yPosition);
      pdf.text(quantity.toString(), colPositions[3], yPosition);
      pdf.text(total, colPositions[4], yPosition);
      
      yPosition += 6;
    });
    
    yPosition += 8;
  }
  
  // Add uploaded image if exists
  if (formData.uploadedImage) {
    try {
      const imageBase64 = await convertImageToBase64(formData.uploadedImage);
      const imageFormat = formData.uploadedImage.type.includes('png') ? 'PNG' : 'JPEG';
      
      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Uploaded Image', 20, yPosition);
      yPosition += 15;
      
      // Add image (max width: 150mm, max height: 100mm)
      const imgWidth = 150;
      const imgHeight = 100;
      pdf.addImage(imageBase64, imageFormat, 20, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
    } catch (error) {
      console.error('Error adding image to PDF:', error);
    }
  }
  
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
  const patientName = formData.patientName ? formData.patientName.replace(/\s+/g, '_') : 'patient';
  const fileName = `medical_form_${patientName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
  
  // Add a small delay to ensure the download completes
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};