/**
 * Project Progress Calculation Utility
 *
 * Provides a single source of truth for calculating project completion progress
 * based on approved documents rather than workflow phase.
 */

export interface ProjectForProgress {
  mode: string;
}

export interface DocumentForProgress {
  type: string;
  status: string;
}

/**
 * Calculate project progress based on approved documents
 *
 * This is the authoritative method for displaying project completion percentage.
 * Progress is based on actual deliverables (approved documents) rather than workflow state.
 *
 * @param project - Project with mode field
 * @param documents - Array of project documents with type and status
 * @returns Progress percentage (0-100)
 */
export function calculateProjectProgress(
  project: ProjectForProgress,
  documents: DocumentForProgress[]
): number {
  const brdDoc = documents.find((d) => d.type === 'BRD');
  const prdDoc = documents.find((d) => d.type === 'PRD');

  if (project.mode === 'UNIFIED') {
    // Unified mode: BRD + PRD + at least one TOOL_OUTPUT
    const toolOutputDoc = documents.find((d) => d.type === 'TOOL_OUTPUT');
    const totalSteps = 3;
    let completedSteps = 0;

    if (brdDoc?.status === 'APPROVED') completedSteps++;
    if (prdDoc?.status === 'APPROVED') completedSteps++;
    if (toolOutputDoc) completedSteps++;

    return Math.round((completedSteps / totalSteps) * 100);
  }

  // Legacy PLAIN/TECHNICAL modes
  const finalDoc = documents.find((d) =>
    d.type === (project.mode === 'PLAIN' ? 'PROMPT_BUILD' : 'TASKS')
  );

  const totalSteps = 3; // BRD, PRD, and final document
  let completedSteps = 0;

  if (brdDoc?.status === 'APPROVED') completedSteps++;
  if (prdDoc?.status === 'APPROVED') completedSteps++;
  if (finalDoc?.status === 'APPROVED') completedSteps++;

  return Math.round((completedSteps / totalSteps) * 100);
}
