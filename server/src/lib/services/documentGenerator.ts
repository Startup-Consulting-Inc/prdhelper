/**
 * Document Generation Service
 * 
 * Handles generation of BRD, PRD, and Task documents using AI.
 */

import { generateCompletion, extractMarkedContent, buildSystemPrompt, parseTaskList, type Task } from './ai.js';
import { trackTokenUsage } from './tokenTracker.js';
import {
  detectLanguage,
  getLanguageInstruction,
  type SupportedLanguage,
} from '../utils/languageDetector.js';

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
  truncated?: boolean;
  warning?: string;
}

// Maximum output tokens for Gemini 2.5 Flash model
// Note: The model supports up to 65,536 output tokens
// Using 32K to allow for comprehensive documents while leaving headroom
const MAX_OUTPUT_TOKENS = 32000;

/**
 * Generate BRD from conversation
 *
 * @param systemPrompt - The system prompt for BRD generation
 * @param conversation - The conversation history
 * @param language - Optional language override; if not provided, detects from conversation
 */
export async function generateBRD(
  systemPrompt: string,
  conversation: Message[],
  language?: SupportedLanguage
): Promise<GenerationResult> {
  // Detect language from conversation if not provided
  const conversationText = conversation.map((m) => m.content).join(' ');
  const detectedLanguage = language || detectLanguage(conversationText);
  const languageInstruction = getLanguageInstruction(detectedLanguage);

  // Build messages for AI with language instruction
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { conversation }) + `\n\n${languageInstruction}`,
    },
    {
      role: 'user' as const,
      content: `Based on our conversation, please generate a comprehensive Business Requirements Document. Remember to wrap it in <<BRD_START>> and <<BRD_END>> markers. ${languageInstruction}`,
    },
  ];

  // Call AI with model-appropriate token limit
  const response = await generateCompletion(messages, {
    temperature: 0.7,
    maxTokens: MAX_OUTPUT_TOKENS,
  });

  const rawContent = response.content;
  let warning: string | undefined;

  // Check if response was truncated
  if (response.truncated) {
    warning = 'The BRD document may be incomplete due to length constraints. Consider breaking down complex requirements into multiple documents.';
    console.warn(`BRD generation truncated. Output tokens: ${response.usage?.completionTokens}`);
  }

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<BRD_START>>', '<<BRD_END>>');

  // If markers not found and response was truncated, this likely means the document was cut off
  if (!content) {
    if (response.truncated) {
      console.warn('BRD markers not found due to truncation. Using available content.');
      warning = 'The BRD document was cut off due to length limits. Some sections may be missing.';
    } else {
      console.warn('BRD markers not found in AI response. Using full content as fallback.');
    }
    content = rawContent.trim();
  }

  return {
    content,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
    truncated: response.truncated,
    warning,
  };
}

/**
 * Generate PRD from conversation and BRD
 *
 * @param systemPrompt - The system prompt for PRD generation
 * @param conversation - The conversation history
 * @param brdContent - The approved BRD content
 * @param language - Optional language override; if not provided, detects from conversation
 */
export async function generatePRD(
  systemPrompt: string,
  conversation: Message[],
  brdContent: string,
  language?: SupportedLanguage
): Promise<GenerationResult> {
  // Detect language from conversation if not provided
  const conversationText = conversation.map((m) => m.content).join(' ');
  const detectedLanguage = language || detectLanguage(conversationText);
  const languageInstruction = getLanguageInstruction(detectedLanguage);

  // Build messages for AI with language instruction
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { brd: brdContent, conversation }) + `\n\n${languageInstruction}`,
    },
    {
      role: 'user' as const,
      content: `Based on the approved BRD and our conversation, please generate a comprehensive Product Requirements Document. Remember to wrap it in <<PRD_START>> and <<PRD_END>> markers. ${languageInstruction}`,
    },
  ];

  // Call AI with model-appropriate token limit
  const response = await generateCompletion(messages, {
    temperature: 0.7,
    maxTokens: MAX_OUTPUT_TOKENS,
  });

  const rawContent = response.content;
  let warning: string | undefined;

  // Check if response was truncated
  if (response.truncated) {
    warning = 'The PRD document may be incomplete due to length constraints. Consider breaking down complex requirements into multiple documents.';
    console.warn(`PRD generation truncated. Output tokens: ${response.usage?.completionTokens}`);
  }

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<PRD_START>>', '<<PRD_END>>');

  // If markers not found and response was truncated, this likely means the document was cut off
  if (!content) {
    if (response.truncated) {
      console.warn('PRD markers not found due to truncation. Using available content.');
      warning = 'The PRD document was cut off due to length limits. Some sections may be missing.';
    } else {
      console.warn('PRD markers not found in AI response. Using full content as fallback.');
    }
    content = rawContent.trim();
  }

  return {
    content,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
    truncated: response.truncated,
    warning,
  };
}

/**
 * Generate Tasks from PRD
 *
 * @param systemPrompt - The system prompt for task generation
 * @param prdContent - The approved PRD content
 * @param brdContent - Optional approved BRD content
 * @param language - Optional language override; if not provided, detects from PRD content
 */
export async function generateTasks(
  systemPrompt: string,
  prdContent: string,
  brdContent?: string,
  language?: SupportedLanguage
): Promise<GenerationResult & { tasks: Task[] }> {
  // Detect language from PRD content if not provided
  const detectedLanguage = language || detectLanguage(prdContent);
  const languageInstruction = getLanguageInstruction(detectedLanguage);

  // Build messages for AI with language instruction
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { prd: prdContent, brd: brdContent }) + `\n\n${languageInstruction}`,
    },
    {
      role: 'user' as const,
      content: `Based on the approved PRD and BRD, please generate a detailed technical task list. IMPORTANT: Generate ONLY the task list with NO additional content. Everything must be wrapped between <<TASKS_START>> and <<TASKS_END>> markers. Do not include summaries, overviews, or kickoff prompts. Format each task with ID, title, description, acceptance criteria, priority, effort, dependencies, and tags. ${languageInstruction}`,
    },
  ];

  // Call AI with model-appropriate token limit
  const response = await generateCompletion(messages, {
    temperature: 0.6,
    maxTokens: MAX_OUTPUT_TOKENS,
  });

  const rawContent = response.content;
  let warning: string | undefined;

  // Check if response was truncated
  if (response.truncated) {
    warning = 'The task list may be incomplete due to length constraints. Some tasks may be missing.';
    console.warn(`Tasks generation truncated. Output tokens: ${response.usage?.completionTokens}`);
  }

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<TASKS_START>>', '<<TASKS_END>>');

  // If markers not found and response was truncated, this likely means the document was cut off
  if (!content) {
    if (response.truncated) {
      console.warn('Tasks markers not found due to truncation. Using available content.');
      warning = 'The task list was cut off due to length limits. Some tasks may be missing.';
    } else {
      console.warn('Tasks markers not found in AI response. Using full content as fallback.');
    }
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
    truncated: response.truncated,
    warning,
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
 *
 * @param systemPrompt - The system prompt for prompt build generation
 * @param prdContent - The approved PRD content
 * @param brdContent - Optional approved BRD content
 * @param language - Optional language override; if not provided, detects from PRD content
 */
export async function generatePromptBuild(
  systemPrompt: string,
  prdContent: string,
  brdContent?: string,
  language?: SupportedLanguage
): Promise<GenerationResult> {
  // Detect language from PRD content if not provided
  const detectedLanguage = language || detectLanguage(prdContent);
  const languageInstruction = getLanguageInstruction(detectedLanguage);

  // Build messages for AI with language instruction
  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { prd: prdContent, brd: brdContent }) + `\n\n${languageInstruction}`,
    },
    {
      role: 'user' as const,
      content: `Based on the approved PRD (and BRD if provided), please generate a comprehensive, copy-paste ready prompt for vibe coding tools like Loveable, V0, or Bolt. This prompt should enable these AI tools to create a complete, production-ready web service. Remember to wrap it in <<PROMPT_BUILD_START>> and <<PROMPT_BUILD_END>> markers. ${languageInstruction}`,
    },
  ];

  // Call AI with model-appropriate token limit
  const response = await generateCompletion(messages, {
    temperature: 0.7,
    maxTokens: MAX_OUTPUT_TOKENS,
  });

  const rawContent = response.content;
  let warning: string | undefined;

  // Check if response was truncated
  if (response.truncated) {
    warning = 'The prompt build may be incomplete due to length constraints.';
    console.warn(`Prompt Build generation truncated. Output tokens: ${response.usage?.completionTokens}`);
  }

  // Extract content between markers
  let content = extractMarkedContent(rawContent, '<<PROMPT_BUILD_START>>', '<<PROMPT_BUILD_END>>');

  // If markers not found and response was truncated, this likely means the document was cut off
  if (!content) {
    if (response.truncated) {
      console.warn('Prompt Build markers not found due to truncation. Using available content.');
      warning = 'The prompt build was cut off due to length limits. Some content may be missing.';
    } else {
      console.warn('Prompt Build markers not found in AI response. Using full content as fallback.');
    }
    content = rawContent.trim();
  }

  return {
    content,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
    truncated: response.truncated,
    warning,
  };
}

