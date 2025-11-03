/**
 * PDF Export Utility
 *
 * Converts markdown content into a styled PDF using jsPDF.
 * Supports headings, lists, tables, inline emphasis (bold/italic/code),
 * and basic horizontal rules.
 */

import jsPDF from 'jspdf';

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

type FontVariant = 'normal' | 'bold' | 'italic' | 'boldItalic' | 'code';

interface Segment {
  text: string;
  style: FontVariant;
}

interface SegmentWord extends Segment {
  width: number;
}

interface ParagraphOptions {
  fontSize?: number;
  baseStyle?: FontVariant;
  lineSpacingMultiplier?: number;
  spacingAfter?: number;
  indent?: number;
  prefix?: {
    text: string;
    fontStyle?: FontVariant;
    xOffset?: number;
  };
}

/**
 * Export document content to PDF
 */
export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const { filename, title, content, metadata } = options;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  pdf.setProperties({
    title,
    author: metadata?.author || 'Clearly',
    subject: metadata?.subject || title,
    keywords: metadata?.keywords || '',
    creator: 'Clearly - The Intelligent Requirements Platform',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeight = 7;
  let currentY = margin;

  const getFontConfig = (style: FontVariant) => {
    switch (style) {
      case 'bold':
        return { font: 'helvetica', fontStyle: 'bold' as const };
      case 'italic':
        return { font: 'helvetica', fontStyle: 'italic' as const };
      case 'boldItalic':
        return { font: 'helvetica', fontStyle: 'bolditalic' as const };
      case 'code':
        return { font: 'courier', fontStyle: 'normal' as const };
      default:
        return { font: 'helvetica', fontStyle: 'normal' as const };
    }
  };

  const mergeStyles = (base: FontVariant, next: FontVariant): FontVariant => {
    if (base === 'code' || next === 'code') {
      return 'code';
    }

    const hasBold =
      base === 'bold' || base === 'boldItalic' || next === 'bold' || next === 'boldItalic';
    const hasItalic =
      base === 'italic' || base === 'boldItalic' || next === 'italic' || next === 'boldItalic';

    if (hasBold && hasItalic) return 'boldItalic';
    if (hasBold) return 'bold';
    if (hasItalic) return 'italic';
    return 'normal';
  };

  const parseInlineSegments = (text: string, baseStyle: FontVariant = 'normal'): Segment[] => {
    const pattern = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
    const segments: Segment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: text.slice(lastIndex, match.index),
          style: baseStyle,
        });
      }

      const token = match[0];

      if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
        const inner = token.slice(2, -2);
        segments.push(...parseInlineSegments(inner, mergeStyles(baseStyle, 'bold')));
      } else if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
        const inner = token.slice(1, -1);
        segments.push(...parseInlineSegments(inner, mergeStyles(baseStyle, 'italic')));
      } else if (token.startsWith('`') && token.endsWith('`')) {
        const inner = token.slice(1, -1);
        segments.push({ text: inner, style: 'code' });
      }

      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      segments.push({
        text: text.slice(lastIndex),
        style: baseStyle,
      });
    }

    return segments.filter((segment) => segment.text.length > 0);
  };

  const measureWord = (word: string, style: FontVariant, fontSize: number): number => {
    const { font, fontStyle } = getFontConfig(style);
    pdf.setFont(font, fontStyle);
    pdf.setFontSize(fontSize);
    return pdf.getTextWidth(word);
  };

  const wrapSegments = (segments: Segment[], fontSize: number, maxWidth: number): SegmentWord[][] => {
    const lines: SegmentWord[][] = [];
    let currentLine: SegmentWord[] = [];
    let currentWidth = 0;

    const pushLine = () => {
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [];
        currentWidth = 0;
      }
    };

    segments.forEach((segment) => {
      const words = segment.text.split(/(\s+)/).filter((token) => token.length > 0);

      words.forEach((word) => {
        const width = measureWord(word, segment.style, fontSize);
        const isWhitespace = word.trim() === '';

        if (width === 0) {
          return;
        }

        if (isWhitespace) {
          if (currentLine.length > 0) {
            currentLine.push({ text: word, style: segment.style, width });
            currentWidth += width;
          }
          return;
        }

        if (width > maxWidth) {
          for (const char of word) {
            const charWidth = measureWord(char, segment.style, fontSize);

            if (currentWidth + charWidth > maxWidth && currentLine.length > 0) {
              pushLine();
            }

            currentLine.push({ text: char, style: segment.style, width: charWidth });
            currentWidth += charWidth;
          }
          return;
        }

        if (currentWidth + width > maxWidth && currentLine.length > 0) {
          pushLine();
        }

        currentLine.push({ text: word, style: segment.style, width });
        currentWidth += width;
      });
    });

    if (currentLine.length > 0) {
      pushLine();
    }

    return lines;
  };

  const addNewPage = () => {
    pdf.addPage();
    currentY = margin;
  };

  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      addNewPage();
      return true;
    }
    return false;
  };

  const renderParagraph = (
    text: string,
    {
      fontSize = 11,
      baseStyle = 'normal',
      lineSpacingMultiplier = 1,
      spacingAfter = 0,
      indent = 0,
      prefix,
    }: ParagraphOptions = {}
  ) => {
    const segments = parseInlineSegments(text, baseStyle);

    if (segments.length === 0) {
      currentY += spacingAfter;
      return;
    }

    const startX = margin + indent;
    const availableWidth = Math.max(contentWidth - indent, 10);
    const lines = wrapSegments(segments, fontSize, availableWidth);
    const effectiveLineHeight = lineHeight * lineSpacingMultiplier;

    lines.forEach((lineSegments, index) => {
      checkPageBreak(effectiveLineHeight);

      if (prefix && index === 0) {
        const { font, fontStyle } = getFontConfig(prefix.fontStyle ?? 'normal');
        pdf.setFont(font, fontStyle);
        pdf.setFontSize(fontSize);
        pdf.text(prefix.text, margin + (prefix.xOffset ?? 0), currentY);
      }

      let currentX = startX;

      lineSegments.forEach(({ text: segmentText, style, width }) => {
        const { font, fontStyle } = getFontConfig(style);
        pdf.setFont(font, fontStyle);
        pdf.setFontSize(fontSize);
        pdf.text(segmentText, currentX, currentY);
        currentX += width;
      });

      currentY += effectiveLineHeight;
    });

    currentY += spacingAfter;
  };

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) {
      currentY += lineHeight * 0.5;
      continue;
    }

    checkPageBreak(lineHeight * 2);

    if (line.startsWith('# ')) {
      const text = line.substring(2);
      renderParagraph(text, {
        fontSize: 20,
        baseStyle: 'bold',
        lineSpacingMultiplier: 1.2,
        spacingAfter: 5,
      });
    } else if (line.startsWith('## ')) {
      const text = line.substring(3);
      renderParagraph(text, {
        fontSize: 16,
        baseStyle: 'bold',
        lineSpacingMultiplier: 1.1,
        spacingAfter: 4,
      });
    } else if (line.startsWith('### ')) {
      const text = line.substring(4);
      renderParagraph(text, {
        fontSize: 14,
        baseStyle: 'bold',
        lineSpacingMultiplier: 1.05,
        spacingAfter: 3,
      });
    } else if (line.startsWith('#### ')) {
      const text = line.substring(5);
      renderParagraph(text, {
        fontSize: 12,
        baseStyle: 'bold',
        spacingAfter: 2,
      });
    } else if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, currentY, margin + contentWidth, currentY);
      currentY += lineHeight * 0.5;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.substring(2);
      renderParagraph(text, {
        fontSize: 11,
        indent: 8,
        prefix: {
          text: '•',
          xOffset: 2,
        },
      });
    } else if (line.match(/^\d+\.\s/)) {
      const match = line.match(/^(\d+)\.\s(.+)/);
      if (match) {
        const [, num, text] = match;
        renderParagraph(text, {
          fontSize: 11,
          indent: 12,
          prefix: {
            text: `${num}.`,
            xOffset: 2,
          },
        });
      }
    } else if (line.startsWith('|')) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const cells = line.split('|').filter((cell) => cell.trim());
      const cellWidth = contentWidth / cells.length;

      cells.forEach((cell, index) => {
        const text = cell.trim();
        const x = margin + index * cellWidth;
        pdf.text(text, x + 2, currentY, { maxWidth: cellWidth - 4 });
      });

      pdf.line(margin, currentY + 2, margin + contentWidth, currentY + 2);
      currentY += lineHeight;
    } else {
      renderParagraph(line, {
        fontSize: 11,
      });
    }
  }

  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

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
