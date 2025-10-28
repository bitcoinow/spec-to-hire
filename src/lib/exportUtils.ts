import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

// Convert CV/Cover Letter text to formatted PDF
export const exportToPDF = (text: string, filename: string) => {
  const doc = new jsPDF();
  
  // Set font to Arial for ATS compatibility
  doc.setFont("helvetica");
  doc.setFontSize(11);
  
  // Split text into lines and add to PDF
  const lines = text.split('\n');
  let y = 20;
  const lineHeight = 6;
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;
  
  lines.forEach((line) => {
    // Check if we need a new page
    if (y + lineHeight > pageHeight - marginBottom) {
      doc.addPage();
      y = 20;
    }
    
    // Handle different formatting
    if (line.trim() === '') {
      y += lineHeight / 2;
    } else if (line.toUpperCase() === line && line.length < 50) {
      // Heading
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(line, 20, y);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      y += lineHeight * 1.2;
    } else {
      // Regular text - wrap long lines
      const splitText = doc.splitTextToSize(line, 170);
      doc.text(splitText, 20, y);
      y += lineHeight * splitText.length;
    }
  });
  
  doc.save(filename);
};

// Convert CV/Cover Letter text to DOCX
export const exportToDOCX = async (text: string, filename: string) => {
  const lines = text.split('\n');
  const paragraphs: Paragraph[] = [];
  
  lines.forEach((line) => {
    if (line.trim() === '') {
      paragraphs.push(new Paragraph({ text: "" }));
    } else if (line.toUpperCase() === line && line.length < 50) {
      // Heading
      paragraphs.push(
        new Paragraph({
          text: line,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
    } else {
      // Regular text
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: "Arial",
              size: 22, // 11pt
            }),
          ],
          spacing: { line: 276 }, // 1.15 line height
        })
      );
    }
  });
  
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
