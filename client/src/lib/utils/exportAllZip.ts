/**
 * Export All Documents as ZIP
 *
 * Bundles project documents (BRD, PRD, Tasks, Vibe Coding Prompt) into a single ZIP file.
 * Each document is included as Markdown and PDF.
 */

import JSZip from 'jszip';
import { generatePDFBlob } from './pdfExport';

export interface DocumentToExport {
  id: string;
  type: string;
  projectId: string;
}

export interface ExportAllOptions {
  projectId: string;
  projectTitle: string;
  documents: DocumentToExport[];
  fetchDocumentContent: (documentId: string, projectId: string) => Promise<{ content: string }>;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  BRD: 'BRD',
  PRD: 'PRD',
  TASKS: 'Tasks',
  PROMPT_BUILD: 'Vibe-Coding-Prompt',
};

function getDocumentTitle(docType: string, projectTitle: string): string {
  return docType === 'PROMPT_BUILD'
    ? `Vibe Coding Prompt: ${projectTitle}`
    : `${docType} Document: ${projectTitle}`;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Export all project documents as a ZIP file containing Markdown and PDF for each document.
 */
export async function exportAllAsZip(options: ExportAllOptions): Promise<void> {
  const { projectId, projectTitle, documents, fetchDocumentContent } = options;

  if (documents.length === 0) {
    throw new Error('No documents to export');
  }

  const zip = new JSZip();
  const baseName = sanitizeFilename(projectTitle) || 'project';

  for (const doc of documents) {
    const { content } = await fetchDocumentContent(doc.id, projectId);
    const label = DOC_TYPE_LABELS[doc.type] ?? doc.type;
    const safeLabel = sanitizeFilename(label) || doc.type.toLowerCase();
    const docTitle = getDocumentTitle(doc.type, projectTitle);

    zip.file(`${safeLabel}.md`, content);

    const pdfBlob = await generatePDFBlob({
      title: docTitle,
      content,
      metadata: {
        author: 'Clearly',
        subject: `${doc.type} - ${projectTitle}`,
      },
    });

    zip.file(`${safeLabel}.pdf`, pdfBlob);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseName}_documents.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
