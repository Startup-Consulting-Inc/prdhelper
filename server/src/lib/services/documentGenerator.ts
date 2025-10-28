/**
 * Document Generation Service
 * 
 * Handles generation of BRD, PRD, and Task documents using AI.
 */

import { generateCompletion, extractMarkedContent, buildSystemPrompt, parseTaskList, type Task } from './ai.js';
import { trackTokenUsage } from './tokenTracker.js';

interface Message {
  role: string;
  content: string;
}

interface GenerationResult {
  content: string;
  rawContent: string;
  model: string;
  tokensUsed?: number;
  inputTokens?: number;
  outputTokens?: number;
}

/**
 * Generate BRD from conversation
 */
export async function generateBRD(
  systemPrompt: string,
  conversation: Message[]
): Promise<GenerationResult> {
  // Build messages for AI
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { conversation }),
    },
    {
      role: 'user' as const,
      content: 'Based on our conversation, please generate a comprehensive Business Requirements Document. Remember to wrap it in <<BRD_START>> and <<BRD_END>> markers.',
    },
  ];

  // Call AI
  const response = await generateCompletion(messages, {
    temperature: 0.7,
    maxTokens: 3000,
  });

  const rawContent = response.content;

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<BRD_START>>', '<<BRD_END>>');

  // Fallback: If markers not found, use the entire response
  if (!content) {
    console.warn('BRD markers not found in AI response. Using full content as fallback.');
    content = rawContent.trim();
  }

  return {
    content,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
  };
}

/**
 * Generate PRD from conversation and BRD
 */
export async function generatePRD(
  systemPrompt: string,
  conversation: Message[],
  brdContent: string
): Promise<GenerationResult> {
  // Build messages for AI
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { brd: brdContent, conversation }),
    },
    {
      role: 'user' as const,
      content: 'Based on the approved BRD and our conversation, please generate a comprehensive Product Requirements Document. Remember to wrap it in <<PRD_START>> and <<PRD_END>> markers.',
    },
  ];

  // Call AI
  const response = await generateCompletion(messages, {
    temperature: 0.7,
    maxTokens: 4000,
  });

  const rawContent = response.content;

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<PRD_START>>', '<<PRD_END>>');

  // Fallback: If markers not found, use the entire response
  if (!content) {
    console.warn('PRD markers not found in AI response. Using full content as fallback.');
    content = rawContent.trim();
  }

  return {
    content,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
  };
}

/**
 * Generate Tasks from PRD
 */
export async function generateTasks(
  systemPrompt: string,
  prdContent: string,
  brdContent?: string
): Promise<GenerationResult & { tasks: Task[] }> {
  // Build messages for AI
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { prd: prdContent, brd: brdContent }),
    },
    {
      role: 'user' as const,
      content: 'Based on the approved PRD and BRD, please generate a detailed technical task list. Remember to wrap it in <<TASKS_START>> and <<TASKS_END>> markers. Format each task with ID, title, description, acceptance criteria, priority, effort, dependencies, and tags.',
    },
  ];

  // Call AI
  const response = await generateCompletion(messages, {
    temperature: 0.6,
    maxTokens: 5000,
  });

  const rawContent = response.content;

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<TASKS_START>>', '<<TASKS_END>>');

  // Fallback: If markers not found, use the entire response
  if (!content) {
    console.warn('Tasks markers not found in AI response. Using full content as fallback.');
    content = rawContent.trim();
  }

  // Parse tasks
  const tasks = parseTaskList(content);

  return {
    content,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
    tasks,
  };
}

/**
 * Generate kickoff prompt from tasks and PRD
 */
export function generateKickoffPrompt(tasks: Task[], prdSummary: string): string {
  const highPriorityTasks = tasks.filter((t) => t.priority === 'HIGH');

  let prompt = `# Project Kickoff Summary\n\n`;
  prompt += `## Overview\n\n${prdSummary}\n\n`;
  prompt += `## High-Priority Tasks (${highPriorityTasks.length})\n\n`;

  highPriorityTasks.slice(0, 5).forEach((task) => {
    prompt += `### ${task.id}: ${task.title}\n`;
    prompt += `${task.description}\n\n`;
  });

  prompt += `## Next Steps\n\n`;
  prompt += `1. Review and prioritize the full task list\n`;
  prompt += `2. Assign tasks to team members\n`;
  prompt += `3. Set up development environment\n`;
  prompt += `4. Begin implementation with high-priority tasks\n`;

  return prompt;
}

/**
 * Generate Prompt Build from PRD for vibe coding tools (Loveable, V0, Bolt)
 */
export async function generatePromptBuild(
  systemPrompt: string,
  prdContent: string,
  brdContent?: string
): Promise<GenerationResult> {
  // Build messages for AI
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { prd: prdContent, brd: brdContent }),
    },
    {
      role: 'user' as const,
      content: 'Based on the approved PRD (and BRD if provided), please generate a comprehensive, copy-paste ready prompt for vibe coding tools like Loveable, V0, or Bolt. This prompt should enable these AI tools to create a complete, production-ready web service. Remember to wrap it in <<PROMPT_BUILD_START>> and <<PROMPT_BUILD_END>> markers.',
    },
  ];

  // Call AI
  const response = await generateCompletion(messages, {
    temperature: 0.7,
    maxTokens: 5000,
  });

  const rawContent = response.content;

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<PROMPT_BUILD_START>>', '<<PROMPT_BUILD_END>>');

  // Fallback: If markers not found, use the entire response
  if (!content) {
    console.warn('Prompt Build markers not found in AI response. Using full content as fallback.');
    content = rawContent.trim();
  }

  return {
    content,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
  };
}

