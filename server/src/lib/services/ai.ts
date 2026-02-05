/**
 * AI Service
 * 
 * OpenRouter API integration for AI-powered document generation.
 * Handles:
 * - API calls with retry logic
 * - Error handling
 * - Marker extraction from AI responses
 * - Prompt building with context
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  finishReason?: string;
  truncated?: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Generate completion from OpenRouter API
 */
export async function generateCompletion(
  messages: ChatMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
    retries?: number;
    modelOverride?: string;
  } = {}
): Promise<AIResponse> {
  const {
    temperature = 0.7,
    maxTokens = 2000,
    retries = 3,
    modelOverride,
  } = options;

  let lastError: Error | null = null;

  // Get API key and model dynamically to ensure .env is loaded
  const apiKey = process.env.OPENROUTER_API_KEY || '';
  const model = modelOverride || process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'PRD Helper',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const data = (await response.json()) as any;

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No choices returned from OpenRouter API');
      }

      const content = data.choices[0].message.content as string;
      const finishReason = data.choices[0].finish_reason as string | undefined;
      const truncated = finishReason === 'length';

      if (truncated) {
        console.warn(
          `AI response was truncated due to token limit. Model: ${data.model || model}, ` +
          `Completion tokens: ${data.usage?.completion_tokens || 'unknown'}, ` +
          `Requested max_tokens: ${maxTokens}`
        );
      }

      return {
        content,
        model: data.model || model,
        finishReason,
        truncated,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      lastError = error as Error;
      console.error(`AI API attempt ${attempt + 1} failed:`, error);

      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  throw new Error(
    `AI API failed after ${retries} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Extract content between markers
 */
export function extractMarkedContent(
  rawContent: string,
  startMarker: string,
  endMarker: string
): string | null {
  const startIndex = rawContent.indexOf(startMarker);
  const endIndex = rawContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.warn(
      `Markers not found: ${startMarker} or ${endMarker} in content`
    );
    return null;
  }

  if (startIndex >= endIndex) {
    console.warn('Start marker appears after end marker');
    return null;
  }

  // Extract content between markers (excluding the markers themselves)
  const content = rawContent
    .substring(startIndex + startMarker.length, endIndex)
    .trim();

  return content;
}

/**
 * Build system prompt with context
 */
export function buildSystemPrompt(
  basePrompt: string,
  context?: {
    brd?: string;
    prd?: string;
    conversation?: Array<{ role: string; content: string }>;
  }
): string {
  let prompt = basePrompt;

  // Add BRD context if provided
  if (context?.brd) {
    prompt += `\n\n### Approved BRD\n\n${context.brd}`;
  }

  // Add PRD context if provided
  if (context?.prd) {
    prompt += `\n\n### Approved PRD\n\n${context.prd}`;
  }

  // Add conversation history if provided
  if (context?.conversation && context.conversation.length > 0) {
    prompt += '\n\n### Previous Q&A\n\n';
    context.conversation.forEach((msg, index) => {
      if (msg.role === 'user') {
        prompt += `**Question ${Math.floor(index / 2) + 1}:** ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        prompt += `**Your Question:** ${msg.content}\n\n`;
      }
    });
  }

  return prompt;
}

/**
 * Parse task list from markdown
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: string;
  dependencies: string[];
  tags: string[];
}

export function parseTaskList(rawContent: string): Task[] {
  const tasks: Task[] = [];
  
  // Simple regex-based parsing
  // This is a basic implementation; production would need more robust parsing
  const taskRegex = /## TASK-(\d+): (.+?)\n\n(.+?)\n\n\*\*Acceptance Criteria:\*\*\n((?:- .+?\n)+)\n\*\*Priority:\*\* (HIGH|MEDIUM|LOW)\n\*\*Effort:\*\* (.+?)\n\*\*Dependencies:\*\* (.+?)\n\*\*Tags:\*\* (.+?)(?=\n\n##|$)/gs;

  let match;
  while ((match = taskRegex.exec(rawContent)) !== null) {
    const [, id, title, description, criteriaText, priority, effort, dependencies, tags] = match;

    const acceptanceCriteria = criteriaText
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.trim().substring(2));

    tasks.push({
      id: `TASK-${id}`,
      title: title.trim(),
      description: description.trim(),
      acceptanceCriteria,
      priority: priority as Task['priority'],
      effort: effort.trim(),
      dependencies: dependencies
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d && d !== 'None'),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
    });
  }

  return tasks;
}

