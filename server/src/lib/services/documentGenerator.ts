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
// Inline types matching shared/types.ts (server can't import from shared due to rootDir constraints)
type OutputToolType =
  | 'VIBE_V0'
  | 'VIBE_LOVEABLE'
  | 'VIBE_BOLT'
  | 'VIBE_REPLIT'
  | 'VIBE_FIREBASE_STUDIO'
  | 'CLAUDE_CODE'
  | 'CURSOR'
  | 'OPENAI_CODEX'
  | 'GOOGLE_ANTIGRAVITY';

interface ToolOutputFile {
  path: string;
  content: string;
  description?: string;
}

interface ToolOutputBundle {
  toolType: OutputToolType;
  files: ToolOutputFile[];
  referenceDoc?: string;
  prdContent?: string;
}

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
// The model supports up to 65,536 output tokens
const MAX_OUTPUT_TOKENS = 65536;

/**
 * Generate Problem Definition Document from conversation
 *
 * @param systemPrompt - The system prompt for problem definition generation
 * @param conversation - The conversation history
 * @param language - Optional language override; if not provided, detects from conversation
 */
export async function generateProblemDefinition(
  systemPrompt: string,
  conversation: Message[],
  language?: SupportedLanguage
): Promise<GenerationResult> {
  const conversationText = conversation.map((m) => m.content).join(' ');
  const detectedLanguage = language || detectLanguage(conversationText);
  const languageInstruction = getLanguageInstruction(detectedLanguage);

  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { conversation }) + `\n\n${languageInstruction}`,
    },
    {
      role: 'user' as const,
      content: `Based on our conversation, please generate a comprehensive Problem Definition Document. Today's date is ${new Date().toISOString().split('T')[0]}. Use this date for the document header.

The document MUST include these sections:
1. **Initial Pain Point** - Observation, context, and current workarounds
2. **Root Cause Analysis** - 5 Whys table (from symptom to root cause) + Job-to-be-Done analysis
3. **Problem Statement** - Using the formula: [Who] is struggling to [Task/Goal] because [Obstacle], which results in [Negative Impact]
4. **Impact Analysis** - Affected stakeholders table, current cost of problem, expected impact if solved
5. **Validation Checklist** - Root cause verified, no solution bias, impact quantified, scope appropriate, technical fit, aligned with goals
6. **Go/No-Go Decision** - Recommendation with rationale
7. **Handoff to BRD** - Mapping table showing which PDD sections feed into which BRD sections

CRITICAL: The problem statement must NOT mention any specific technology or solution. Focus purely on the problem, not how to solve it.

Remember to wrap the entire document in <<PROBLEM_DEFINITION_START>> and <<PROBLEM_DEFINITION_END>> markers. ${languageInstruction}`,
    },
  ];

  const response = await generateCompletion(messages, {
    temperature: 0.7,
    maxTokens: MAX_OUTPUT_TOKENS,
  });

  const rawContent = response.content;
  let warning: string | undefined;

  if (response.truncated) {
    warning = 'The Problem Definition document may be incomplete due to length constraints.';
    console.warn(`Problem Definition generation truncated. Output tokens: ${response.usage?.completionTokens}`);
  }

  let content = extractMarkedContent(rawContent, '<<PROBLEM_DEFINITION_START>>', '<<PROBLEM_DEFINITION_END>>', response.truncated);

  if (!content) {
    console.warn('Problem Definition markers not found in AI response. Using full content as fallback.');
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
      content: `Based on our conversation, please generate a comprehensive Business Requirements Document. Today's date is ${new Date().toISOString().split('T')[0]}. Use this date for the document header. Remember to wrap it in <<BRD_START>> and <<BRD_END>> markers. ${languageInstruction}`,
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
  let content = extractMarkedContent(rawContent, '<<BRD_START>>', '<<BRD_END>>', response.truncated);

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
      content: `Based on the approved BRD and our conversation, please generate a comprehensive Product Requirements Document. Today's date is ${new Date().toISOString().split('T')[0]}. Use this date for the document header. Remember to wrap it in <<PRD_START>> and <<PRD_END>> markers. ${languageInstruction}`,
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
  let content = extractMarkedContent(rawContent, '<<PRD_START>>', '<<PRD_END>>', response.truncated);

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
  let content = extractMarkedContent(rawContent, '<<TASKS_START>>', '<<TASKS_END>>', response.truncated);

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
  let content = extractMarkedContent(rawContent, '<<PROMPT_BUILD_START>>', '<<PROMPT_BUILD_END>>', response.truncated);

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
    truncated: response.truncated,
    warning,
  };
}

/**
 * Generate tool-specific output from PRD and BRD
 *
 * For vibe coding tools: generates tool-specific prompts
 * For AI coding tools: generates config files + reference document
 */
export async function generateToolOutput(
  systemPrompt: string,
  toolType: OutputToolType,
  prdContent: string,
  brdContent: string,
  projectTitle: string,
  language?: SupportedLanguage
): Promise<GenerationResult & { bundle: ToolOutputBundle }> {
  const detectedLanguage = language || detectLanguage(prdContent);
  const languageInstruction = getLanguageInstruction(detectedLanguage);

  const isVibeCoding = toolType.startsWith('VIBE_');

  const userPrompt = isVibeCoding
    ? `Based on the approved PRD and BRD, generate a comprehensive, optimized prompt specifically for ${getToolLabel(toolType)}. The prompt should be copy-paste ready and enable the tool to build a complete, production-ready application. Wrap the output in <<TOOL_OUTPUT_START>> and <<TOOL_OUTPUT_END>> markers. ${languageInstruction}`
    : `Based on the approved PRD and BRD, generate the specific configuration files for ${getToolLabel(toolType)}. ${getToolFileExpectations(toolType)} Mark each file with <<FILE:path/to/file>> before the content and <<END_FILE>> after. Wrap the entire output in <<TOOL_OUTPUT_START>> and <<TOOL_OUTPUT_END>> markers. ${languageInstruction}`;

  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(systemPrompt, { prd: prdContent, brd: brdContent }) + `\n\n${languageInstruction}`,
    },
    {
      role: 'user' as const,
      content: userPrompt,
    },
  ];

  const response = await generateCompletion(messages, {
    temperature: 0.6,
    maxTokens: MAX_OUTPUT_TOKENS,
  });

  const rawContent = response.content;
  let warning: string | undefined;

  if (response.truncated) {
    warning = `The ${getToolLabel(toolType)} output may be incomplete due to length constraints.`;
    console.warn(`Tool output generation truncated for ${toolType}. Output tokens: ${response.usage?.completionTokens}`);
  }

  let toolContent = extractMarkedContent(rawContent, '<<TOOL_OUTPUT_START>>', '<<TOOL_OUTPUT_END>>', response.truncated);

  if (!toolContent) {
    console.warn('Tool output markers not found in AI response. Using full content as fallback.');
    toolContent = rawContent.trim();
  }

  // Parse files from the content for AI coding tools
  const files: ToolOutputFile[] = [];
  let referenceDoc: string | undefined;

  if (!isVibeCoding) {
    const fileRegex = /<<FILE:(.*?)>>([\s\S]*?)<<END_FILE>>/g;
    let match;
    while ((match = fileRegex.exec(toolContent)) !== null) {
      const filePath = match[1].trim();
      const fileContent = match[2].trim();
      if (filePath.toLowerCase().includes('reference') || filePath.toLowerCase().includes('readme')) {
        referenceDoc = fileContent;
      } else {
        files.push({ path: filePath, content: fileContent });
      }
    }

    if (files.length === 0) {
      referenceDoc = toolContent;
    }
  }

  const bundle: ToolOutputBundle = {
    toolType,
    files,
    referenceDoc: isVibeCoding ? undefined : (referenceDoc || toolContent),
  };

  return {
    content: toolContent,
    rawContent,
    model: response.model,
    tokensUsed: response.usage?.totalTokens,
    inputTokens: response.usage?.promptTokens,
    outputTokens: response.usage?.completionTokens,
    truncated: response.truncated,
    warning,
    bundle,
  };
}

function getToolFileExpectations(toolType: OutputToolType): string {
  const expectations: Partial<Record<OutputToolType, string>> = {
    CLAUDE_CODE: `Generate exactly these files:
1. <<FILE:CLAUDE.md>> - A comprehensive MARKDOWN project guide for Claude Code. Include: project overview, architecture description, tech stack, development commands, coding conventions, key patterns, directory structure, and implementation notes. This MUST be a markdown file, NOT JSON.
2. <<FILE:.claude/settings.json>> - A JSON settings file for the .claude directory with project-specific configuration including allowed tools, permissions, and project preferences.
3. <<FILE:REFERENCE_DOCUMENT.md>> - A comprehensive reference document with the full project specification, requirements, and technical details.`,
    CURSOR: `Generate exactly these files:
1. <<FILE:.cursor/rules/project.mdc>> - Main project rules file in MDC format with project context, coding standards, directory structure, and development patterns.
2. <<FILE:.cursor/rules/architecture.mdc>> - Architecture rules file with system design patterns, component relationships, and data flow.
3. <<FILE:AGENTS.md>> - Agent configuration and workflow documentation for Cursor AI agents.
4. <<FILE:REFERENCE_DOCUMENT.md>> - A comprehensive reference document with full project specifications.`,
    OPENAI_CODEX: `Generate exactly these files:
1. <<FILE:AGENTS.md>> - Agent configuration with project context, coding guidelines, workflow definitions, and implementation patterns.
2. <<FILE:.codex/config.toml>> - TOML configuration file for Codex CLI with project settings, tool permissions, and workspace configuration.
3. <<FILE:REFERENCE_DOCUMENT.md>> - A comprehensive reference document with full project specifications.`,
    GOOGLE_ANTIGRAVITY: `Generate exactly these files:
1. <<FILE:.agent/rules.md>> - Agent rules with project context, coding standards, and decision frameworks.
2. <<FILE:.agent/skills.md>> - Skill definitions for the agent with project-specific capabilities and domain expertise.
3. <<FILE:.agent/workflows.md>> - Workflow definitions for common development tasks and processes.
4. <<FILE:AGENTS.md>> - Top-level agent documentation with overview and usage instructions.
5. <<FILE:REFERENCE_DOCUMENT.md>> - A comprehensive reference document with full project specifications.`,
  };
  return expectations[toolType] || 'Output each file with clear markers: <<FILE:path/to/file>> before each file\'s content and <<END_FILE>> after. Also generate a comprehensive reference document.';
}

function getToolLabel(toolType: OutputToolType): string {
  const labels: Record<OutputToolType, string> = {
    VIBE_V0: 'v0 (Vercel)',
    VIBE_LOVEABLE: 'Loveable',
    VIBE_BOLT: 'Bolt.new',
    VIBE_REPLIT: 'Replit',
    VIBE_FIREBASE_STUDIO: 'Firebase Studio',
    CLAUDE_CODE: 'Claude Code',
    CURSOR: 'Cursor',
    OPENAI_CODEX: 'OpenAI Codex',
    GOOGLE_ANTIGRAVITY: 'Google Antigravity',
  };
  return labels[toolType] || toolType;
}

