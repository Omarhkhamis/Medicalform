import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FormData } from "../types/form";

// استورد الخط بصيغة base64 (مثال للخط Amiri)
import amiriFont from "../fonts/Amiri-Regular-normal.js"; // هذا ملف يحتوي على الخط بصيغة base64

export const generatePDF = async (formData: FormData): Promise<void> => {
  const doc = new jsPDF("p", "mm", "a4");

  // إضافة الخط العربي
  doc.addFileToVFS("Amiri-Regular.ttf", amiriFont);
  doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
  doc.setFont("Amiri");
  doc.setFontSize(12);

  const pageWidth = doc.internal.pageSize.getWidth();

  // -------- العنوان الرئيسي --------
  doc.setFontSize(16);
  doc.text("قسم الإستشارات الطبية", pageWidth / 2, 15, { align: "center" });

  // -------- معلومات الطبيب والمريض --------
  const infoStartY = 25;
  const infoLines = [
    `اسم المستشار الطبي: ${formData.consultantName}`,
    `اسم المريض: ${formData.patientName}`,
    `العمر: ${formData.age}     التاريخ: ${formData.entryDate}`,
    `الرقم التعريفي: ${formData.patientId}`,
    `الحالة الصحية: ${formData.healthCondition}`,
  ];

  infoLines.forEach((line, i) => {
    doc.text(line, 190, infoStartY + i * 8, { align: "right" });
  });

  // -------- جدول الزيارة الأولى --------
  let currentY = infoStartY + infoLines.length * 8 + 10;
  doc.setFontSize(14);
  doc.text("الزيارة الأولى:", 190, currentY, { align: "right" });

  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [["الصنف", "المنشأ", "السعر", "العدد", "المجموع"]],
    body: [
      [
        formData.firstVisit.serviceType,
        formData.firstVisit.serviceName,
        formData.firstVisit.price,
        formData.firstVisit.quantity,
        formData.firstVisit.price * formData.firstVisit.quantity,
      ],
    ],
    styles: {
      font: "Amiri",
      halign: "right",
    },
    headStyles: { fillColor: [240, 240, 240] },
  });

  // -------- ملاحظة بين الزيارات --------
  currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text(
    "ستكون الزيارة بعد ٤ إلى ٦ أشهر لاستكمال العلاج ووضع التيجان على الزرعات.",
    190,
    currentY,
    { align: "right" }
  );

  // -------- جدول الزيارة الثانية --------
  currentY += 10;
  doc.setFontSize(14);
  doc.text("الزيارة الثانية:", 190, currentY, { align: "right" });

  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [["الصنف", "المنشأ", "السعر", "العدد", "المجموع"]],
    body: [
      [
        formData.secondVisit.serviceType,
        formData.secondVisit.serviceName,
        formData.secondVisit.price,
        formData.secondVisit.quantity,
        formData.secondVisit.price * formData.secondVisit.quantity,
      ],
    ],
    styles: {
      font: "Amiri",
      halign: "right",
    },
    headStyles: { fillColor: [240, 240, 240] },
  });

  // -------- التكلفة النهائية --------
  const totalCost =
    formData.firstVisit.price * formData.firstVisit.quantity +
    formData.secondVisit.price * formData.secondVisit.quantity;

  currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.setFont("Amiri", "bold");
  doc.text(`التكلفة النهائية: $${totalCost}`, 190, currentY, {
    align: "right",
  });

  // -------- التذييل --------
  doc.setFontSize(8);
  doc.setFont("Amiri", "italic");
  const footer = `تم التوليد بتاريخ ${new Date().toLocaleDateString()} الساعة ${new Date().toLocaleTimeString()}`;
  doc.text(footer, pageWidth / 2, 290, { align: "center" });

  // -------- الحفظ --------
  const fileName = `تقرير_${formData.patientName.replace(/\s+/g, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
};
