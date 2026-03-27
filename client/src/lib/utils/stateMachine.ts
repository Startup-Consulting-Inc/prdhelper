/**
 * Project State Machine Utilities (Frontend)
 *
 * Utilities for handling project phases and progress.
 */

export type ProjectPhase =
  | 'PROBLEM_DEFINITION_QUESTIONS'
  | 'PROBLEM_DEFINITION_GENERATING'
  | 'PROBLEM_DEFINITION_READY'
  | 'PROBLEM_DEFINITION_APPROVED'
  | 'BRD_QUESTIONS'
  | 'BRD_GENERATING'
  | 'BRD_READY'
  | 'BRD_APPROVED'
  | 'PRD_QUESTIONS'
  | 'PRD_GENERATING'
  | 'PRD_READY'
  | 'PRD_APPROVED'
  | 'PROMPT_BUILD_GENERATING'
  | 'PROMPT_BUILD_READY'
  | 'TASKS_GENERATING'
  | 'TASKS_READY'
  | 'COMPLETED';

/**
 * Get progress percentage for phase
 */
export function getPhaseProgress(phase: ProjectPhase): number {
  const progress: Record<ProjectPhase, number> = {
    PROBLEM_DEFINITION_QUESTIONS: 5,
    PROBLEM_DEFINITION_GENERATING: 10,
    PROBLEM_DEFINITION_READY: 15,
    PROBLEM_DEFINITION_APPROVED: 20,
    BRD_QUESTIONS: 25,
    BRD_GENERATING: 35,
    BRD_READY: 40,
    BRD_APPROVED: 45,
    PRD_QUESTIONS: 50,
    PRD_GENERATING: 60,
    PRD_READY: 65,
    PRD_APPROVED: 70,
    PROMPT_BUILD_GENERATING: 85,
    PROMPT_BUILD_READY: 90,
    TASKS_GENERATING: 85,
    TASKS_READY: 90,
    COMPLETED: 100,
  };

  return progress[phase];
}

/**
 * Get human-readable label for phase
 */
export function getPhaseLabel(phase: ProjectPhase): string {
  const labels: Record<ProjectPhase, string> = {
    PROBLEM_DEFINITION_QUESTIONS: 'Defining the Problem',
    PROBLEM_DEFINITION_GENERATING: 'Generating Problem Definition',
    PROBLEM_DEFINITION_READY: 'Problem Definition Ready for Review',
    PROBLEM_DEFINITION_APPROVED: 'Problem Definition Approved',
    BRD_QUESTIONS: 'Answering BRD Questions',
    BRD_GENERATING: 'Generating BRD',
    BRD_READY: 'BRD Ready for Review',
    BRD_APPROVED: 'BRD Approved',
    PRD_QUESTIONS: 'Answering PRD Questions',
    PRD_GENERATING: 'Generating PRD',
    PRD_READY: 'PRD Ready for Review',
    PRD_APPROVED: 'PRD Approved',
    PROMPT_BUILD_GENERATING: 'Generating Vibe Coding Prompt',
    PROMPT_BUILD_READY: 'Prompt Build Ready',
    TASKS_GENERATING: 'Generating Task List',
    TASKS_READY: 'Tasks Ready for Review',
    COMPLETED: 'Project Completed',
  };

  return labels[phase];
}
