/**
 * PDF Export Utility
 *
 * Handles exporting markdown documents to PDF format with proper styling.
 */

import jsPDF from 'jspdf';
import { marked } from 'marked';

export interface PDFExportOptions {
  filename: string;
  title: string;
  content: string;
  metadata?: {
    author?: string;
    subject?: string;
    keywords?: string;
  };
}

/**
 * Export document content to PDF
 */
export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const { filename, title, content, metadata } = options;

  // Create new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set document properties
  pdf.setProperties({
    title: title,
    author: metadata?.author || 'Clearly',
    subject: metadata?.subject || title,
    keywords: metadata?.keywords || '',
    creator: 'Clearly - The Intelligent Requirements Platform',
  });

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeight = 7;
  let currentY = margin;

  // Helper function to add new page
  const addNewPage = () => {
    pdf.addPage();
    currentY = margin;
  };

  // Helper function to check if new page is needed
  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      addNewPage();
      return true;
    }
    return false;
  };

  // Parse markdown to plain text with styling
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      currentY += lineHeight * 0.5;
      continue;
    }

    // Check for page break
    checkPageBreak(lineHeight * 2);

    // Handle headings
    if (line.startsWith('# ')) {
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      const text = line.substring(2);
      const textLines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(textLines, margin, currentY);
      currentY += textLines.length * lineHeight * 1.2 + 5;
    } else if (line.startsWith('## ')) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const text = line.substring(3);
      const textLines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(textLines, margin, currentY);
      currentY += textLines.length * lineHeight * 1.1 + 4;
    } else if (line.startsWith('### ')) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const text = line.substring(4);
      const textLines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(textLines, margin, currentY);
      currentY += textLines.length * lineHeight * 1.05 + 3;
    } else if (line.startsWith('#### ')) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const text = line.substring(5);
      const textLines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(textLines, margin, currentY);
      currentY += textLines.length * lineHeight + 2;
    } else if (line.startsWith('**') && line.endsWith('**')) {
      // Bold text
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const text = line.substring(2, line.length - 2);
      const textLines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(textLines, margin, currentY);
      currentY += textLines.length * lineHeight;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Bullet points
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const text = line.substring(2);
      const textLines = pdf.splitTextToSize(text, contentWidth - 10);
      pdf.text('•', margin + 2, currentY);
      pdf.text(textLines, margin + 10, currentY);
      currentY += textLines.length * lineHeight;
    } else if (line.match(/^\d+\.\s/)) {
      // Numbered lists
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const match = line.match(/^(\d+)\.\s(.+)/);
      if (match) {
        const [, num, text] = match;
        const textLines = pdf.splitTextToSize(text, contentWidth - 10);
        pdf.text(`${num}.`, margin + 2, currentY);
        pdf.text(textLines, margin + 10, currentY);
        currentY += textLines.length * lineHeight;
      }
    } else if (line.startsWith('|')) {
      // Table row - simplified handling
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const cells = line.split('|').filter(cell => cell.trim());
      const cellWidth = contentWidth / cells.length;

      cells.forEach((cell, index) => {
        const text = cell.trim();
        const x = margin + (index * cellWidth);
        pdf.text(text, x + 2, currentY, { maxWidth: cellWidth - 4 });
      });

      // Draw horizontal line for table
      pdf.line(margin, currentY + 2, margin + contentWidth, currentY + 2);
      currentY += lineHeight;
    } else {
      // Normal text
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const textLines = pdf.splitTextToSize(line, contentWidth);

      // Check if we need multiple pages for this text
      textLines.forEach((textLine: string) => {
        checkPageBreak(lineHeight);
        pdf.text(textLine, margin, currentY);
        currentY += lineHeight;
      });
    }
  }

  // Add page numbers
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  pdf.save(filename);
}

/**
 * Generate filename for PDF export
 */
export function generatePDFFilename(documentType: string, projectTitle: string): string {
  const cleanTitle = projectTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const timestamp = new Date().toISOString().split('T')[0];

  return `${documentType.toLowerCase()}-${cleanTitle}-${timestamp}.pdf`;
}
