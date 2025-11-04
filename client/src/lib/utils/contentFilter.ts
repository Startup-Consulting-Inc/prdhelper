/**
 * Content Filter Utilities
 *
 * Utilities for filtering technical markers from document content before display.
 */

/**
 * Remove document parsing markers from content
 *
 * Strips technical markers used for document generation and parsing
 * that should not be displayed to end users.
 *
 * @param content - Raw document content with potential markers
 * @returns Cleaned content without markers
 */
export function stripDocumentMarkers(content: string): string {
  return content
    .replace(/<<TASKS_START>>\n?/g, '')
    .replace(/<<TASKS_END>>\n?/g, '')
    .replace(/<<BRD_START>>\n?/g, '')
    .replace(/<<BRD_END>>\n?/g, '')
    .replace(/<<PRD_START>>\n?/g, '')
    .replace(/<<PRD_END>>\n?/g, '')
    .replace(/<<PROMPT_BUILD_START>>\n?/g, '')
    .replace(/<<PROMPT_BUILD_END>>\n?/g, '');
}
