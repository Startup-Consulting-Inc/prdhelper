/**
 * Project State Machine
 * 
 * Handles project phase transitions with validation.
 */

export type ProjectPhase =
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
  | 'TOOL_SELECTION'
  | 'TOOL_OUTPUT_GENERATING'
  | 'TOOL_OUTPUT_READY'
  | 'COMPLETED';

/**
 * Get next phase based on current phase and action
 */
export function getNextPhase(
  currentPhase: ProjectPhase,
  action: 'answer' | 'generate' | 'approve' | 'select_tool',
  mode?: 'PLAIN' | 'TECHNICAL' | 'UNIFIED'
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
      generate: mode === 'PLAIN' ? 'PROMPT_BUILD_GENERATING' : mode === 'TECHNICAL' ? 'TASKS_GENERATING' : 'TOOL_OUTPUT_GENERATING',
      select_tool: 'TOOL_SELECTION', // Unified flow: go to tool selection
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
    TOOL_SELECTION: {
      generate: 'TOOL_OUTPUT_GENERATING', // User selected a tool, start generating
    },
    TOOL_OUTPUT_GENERATING: {
      generate: 'TOOL_OUTPUT_READY',
    },
    TOOL_OUTPUT_READY: {
      approve: 'COMPLETED',
      select_tool: 'TOOL_SELECTION', // Go back to select another tool
      generate: 'TOOL_OUTPUT_GENERATING', // Regenerate
    },
    COMPLETED: {
      select_tool: 'TOOL_SELECTION', // Allow generating more tool outputs from completed state
    },
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
    PRD_APPROVED: ['PROMPT_BUILD_GENERATING', 'TASKS_GENERATING', 'TOOL_SELECTION', 'TOOL_OUTPUT_GENERATING', 'COMPLETED'],
    PROMPT_BUILD_GENERATING: ['PROMPT_BUILD_READY'],
    PROMPT_BUILD_READY: ['COMPLETED', 'PROMPT_BUILD_GENERATING'],
    TASKS_GENERATING: ['TASKS_READY'],
    TASKS_READY: ['COMPLETED', 'TASKS_GENERATING'],
    TOOL_SELECTION: ['TOOL_OUTPUT_GENERATING'],
    TOOL_OUTPUT_GENERATING: ['TOOL_OUTPUT_READY'],
    TOOL_OUTPUT_READY: ['COMPLETED', 'TOOL_SELECTION', 'TOOL_OUTPUT_GENERATING'],
    COMPLETED: ['TOOL_SELECTION'],
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
    TOOL_SELECTION: 'Select Output Tool',
    TOOL_OUTPUT_GENERATING: 'Generating Tool Output',
    TOOL_OUTPUT_READY: 'Tool Output Ready',
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
    TOOL_SELECTION: 75,
    TOOL_OUTPUT_GENERATING: 85,
    TOOL_OUTPUT_READY: 95,
    COMPLETED: 100,
  };

  return progress[phase];
}

