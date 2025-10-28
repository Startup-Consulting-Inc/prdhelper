/**
 * Project State Machine
 * 
 * Handles project phase transitions with validation.
 */

import { ProjectPhase } from '@prisma/client';

/**
 * Get next phase based on current phase and action
 */
export function getNextPhase(
  currentPhase: ProjectPhase,
  action: 'answer' | 'generate' | 'approve',
  mode?: 'PLAIN' | 'TECHNICAL'
): ProjectPhase {
  const transitions: Record<ProjectPhase, Partial<Record<typeof action, ProjectPhase>>> = {
    BRD_QUESTIONS: {
      generate: 'BRD_GENERATING',
    },
    BRD_GENERATING: {
      generate: 'BRD_READY',
    },
    BRD_READY: {
      approve: 'BRD_APPROVED',
      generate: 'BRD_GENERATING', // Regenerate
    },
    BRD_APPROVED: {
      answer: 'PRD_QUESTIONS',
    },
    PRD_QUESTIONS: {
      generate: 'PRD_GENERATING',
    },
    PRD_GENERATING: {
      generate: 'PRD_READY',
    },
    PRD_READY: {
      approve: 'PRD_APPROVED',
      generate: 'PRD_GENERATING', // Regenerate
    },
    PRD_APPROVED: {
      // Branch based on mode
      generate: mode === 'PLAIN' ? 'PROMPT_BUILD_GENERATING' : 'TASKS_GENERATING',
    },
    PROMPT_BUILD_GENERATING: {
      generate: 'PROMPT_BUILD_READY',
    },
    PROMPT_BUILD_READY: {
      approve: 'COMPLETED',
      generate: 'PROMPT_BUILD_GENERATING', // Regenerate
    },
    TASKS_GENERATING: {
      generate: 'TASKS_READY',
    },
    TASKS_READY: {
      approve: 'COMPLETED',
      generate: 'TASKS_GENERATING', // Regenerate
    },
    COMPLETED: {},
  };

  const nextPhase = transitions[currentPhase]?.[action];

  if (!nextPhase) {
    throw new Error(`Invalid transition: ${currentPhase} -> ${action}`);
  }

  return nextPhase;
}

/**
 * Check if transition from current to target phase is allowed
 */
export function canTransition(
  currentPhase: ProjectPhase,
  targetPhase: ProjectPhase
): boolean {
  // Define allowed transitions
  const allowedTransitions: Record<ProjectPhase, ProjectPhase[]> = {
    BRD_QUESTIONS: ['BRD_GENERATING'],
    BRD_GENERATING: ['BRD_READY'],
    BRD_READY: ['BRD_APPROVED', 'BRD_GENERATING'],
    BRD_APPROVED: ['PRD_QUESTIONS'],
    PRD_QUESTIONS: ['PRD_GENERATING'],
    PRD_GENERATING: ['PRD_READY'],
    PRD_READY: ['PRD_APPROVED', 'PRD_GENERATING'],
    PRD_APPROVED: ['PROMPT_BUILD_GENERATING', 'TASKS_GENERATING', 'COMPLETED'],
    PROMPT_BUILD_GENERATING: ['PROMPT_BUILD_READY'],
    PROMPT_BUILD_READY: ['COMPLETED', 'PROMPT_BUILD_GENERATING'],
    TASKS_GENERATING: ['TASKS_READY'],
    TASKS_READY: ['COMPLETED', 'TASKS_GENERATING'],
    COMPLETED: [],
  };

  return allowedTransitions[currentPhase]?.includes(targetPhase) ?? false;
}

/**
 * Get human-readable label for phase
 */
export function getPhaseLabel(phase: ProjectPhase): string {
  const labels: Record<ProjectPhase, string> = {
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

/**
 * Get progress percentage for phase
 */
export function getPhaseProgress(phase: ProjectPhase): number {
  const progress: Record<ProjectPhase, number> = {
    BRD_QUESTIONS: 10,
    BRD_GENERATING: 20,
    BRD_READY: 25,
    BRD_APPROVED: 35,
    PRD_QUESTIONS: 45,
    PRD_GENERATING: 55,
    PRD_READY: 60,
    PRD_APPROVED: 70,
    PROMPT_BUILD_GENERATING: 85,
    PROMPT_BUILD_READY: 90,
    TASKS_GENERATING: 85,
    TASKS_READY: 90,
    COMPLETED: 100,
  };

  return progress[phase];
}

