/**
 * Vibe Tool Parser
 *
 * Parses vibe coding tool output into structured sections
 * so each can be displayed and copied independently.
 */

import type { OutputToolType } from '@shared/types';

export interface VibeToolSection {
  title: string;
  content: string;
  copyLabel: string;
}

/**
 * Parse vibe tool output content into sections based on markdown headings.
 * Falls back to a single section if no clear structure is found.
 */
export function parseVibeToolSections(
  content: string,
  toolType: OutputToolType
): VibeToolSection[] {
  if (!content || !content.trim()) {
    return [{ title: 'Prompt', content: '', copyLabel: 'Prompt' }];
  }

  // Split by top-level headings (# or ##)
  const sections = splitByHeadings(content);

  if (sections.length <= 1) {
    // No headings found or only one section — return as single section
    const label = getDefaultLabel(toolType);
    return [{ title: label, content: content.trim(), copyLabel: label }];
  }

  return sections.map((section) => ({
    title: section.title,
    content: section.content.trim(),
    copyLabel: section.title,
  }));
}

interface RawSection {
  title: string;
  content: string;
}

function splitByHeadings(content: string): RawSection[] {
  const lines = content.split('\n');
  const sections: RawSection[] = [];
  let currentTitle = '';
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,2}\s+(.+)$/);
    if (headingMatch) {
      // Save previous section if it has content
      if (currentLines.length > 0 || currentTitle) {
        sections.push({
          title: currentTitle || 'Introduction',
          content: currentLines.join('\n'),
        });
      }
      currentTitle = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Save last section
  if (currentLines.length > 0 || currentTitle) {
    sections.push({
      title: currentTitle || 'Content',
      content: currentLines.join('\n'),
    });
  }

  // Filter out empty sections
  return sections.filter((s) => s.content.trim().length > 0);
}

function getDefaultLabel(toolType: OutputToolType): string {
  const labels: Partial<Record<OutputToolType, string>> = {
    VIBE_V0: 'v0 Prompt',
    VIBE_LOVEABLE: 'Loveable Prompt',
    VIBE_BOLT: 'Bolt.new Prompt',
    VIBE_REPLIT: 'Replit Prompt',
    VIBE_FIREBASE_STUDIO: 'Firebase Studio Prompt',
  };
  return labels[toolType] || 'Prompt';
}
