/**
 * AI Service
 *
 * Moonshot Kimi API integration for AI-powered document generation.
 * (OpenAI-compatible API; falls back to OpenRouter env vars during rollout.)
 *
 * Handles:
 * - Chat completions with retry + timeout
 * - Truncation detection
 * - Marker extraction from AI responses
 * - System prompt assembly with project / BRD / PRD / conversation context
 */

// Moonshot Kimi is the primary provider. OpenRouter env vars are accepted as a
// fallback so existing deployments keep working until secrets are rotated.
const MOONSHOT_BASE_URL = 'https://api.moonshot.ai/v1';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

const DEFAULT_MOONSHOT_MODEL = 'kimi-k2.6';
const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.5-flash';

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

// Timeout for AI API calls (3 minutes - document generation can be slow)
const AI_REQUEST_TIMEOUT_MS = 3 * 60 * 1000;

interface ProviderConfig {
  provider: 'moonshot' | 'openrouter';
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
}

/**
 * Resolve the active provider from env. Moonshot is preferred; OpenRouter is
 * accepted as a fallback so we don't hard-break deployments mid-rotation.
 */
function resolveProvider(): ProviderConfig {
  const moonshotKey = process.env.MOONSHOT_API_KEY?.trim();
  if (moonshotKey) {
    return {
      provider: 'moonshot',
      apiKey: moonshotKey,
      baseUrl: process.env.MOONSHOT_BASE_URL?.trim() || MOONSHOT_BASE_URL,
      defaultModel: process.env.MOONSHOT_MODEL?.trim() || DEFAULT_MOONSHOT_MODEL,
    };
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    return {
      provider: 'openrouter',
      apiKey: openRouterKey,
      baseUrl: OPENROUTER_BASE_URL,
      defaultModel: process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL,
    };
  }

  throw new Error(
    'No AI provider configured. Set MOONSHOT_API_KEY (preferred) or OPENROUTER_API_KEY.'
  );
}

/**
 * Generate a chat completion. The temperature/maxTokens contract is unchanged
 * for callers; we translate to the provider's expected fields internally.
 *
 * Note: Kimi accepts a temperature range of 0-1. Callers should pass values in
 * that range (existing call sites already do).
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

  const providerConfig = resolveProvider();
  const model = modelOverride || providerConfig.defaultModel;
  const endpoint = `${providerConfig.baseUrl}/chat/completions`;

  // Some Kimi endpoints/models (notably Kimi Code's `kimi-for-coding`) reject
  // non-default temperature values and require `temperature: 1`.
  const resolvedTemperature =
    model === 'kimi-for-coding' ? 1 : temperature;

  // Kimi documents max_tokens as deprecated in favor of max_completion_tokens.
  // OpenRouter uses max_tokens. Send both to be safe across providers.
  const requestBody: Record<string, unknown> = {
    model,
    messages,
    temperature: resolvedTemperature,
    max_tokens: maxTokens,
    max_completion_tokens: maxTokens,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${providerConfig.apiKey}`,
  };

  // OpenRouter expects these for routing/attribution; Moonshot ignores them.
  if (providerConfig.provider === 'openrouter') {
    headers['HTTP-Referer'] = process.env.CLIENT_URL || 'http://localhost:5173';
    headers['X-Title'] = 'Clearly';
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = `${providerConfig.provider} API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`;
        // Don't retry client errors (4xx) - they won't succeed on retry
        if (response.status >= 400 && response.status < 500) {
          throw Object.assign(new Error(errMsg), { nonRetryable: true });
        }
        throw new Error(errMsg);
      }

      const data = (await response.json()) as any;

      if (!data.choices || data.choices.length === 0) {
        throw new Error(`No choices returned from ${providerConfig.provider} API`);
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
    } catch (error: any) {
      lastError = error as Error;
      if (lastError.name === 'AbortError') {
        lastError = new Error(`AI API request timed out after ${AI_REQUEST_TIMEOUT_MS / 1000}s`);
      }
      console.error(`AI API attempt ${attempt + 1}/${retries} failed:`, lastError.message);

      if (error?.nonRetryable) {
        break;
      }

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
  endMarker: string,
  allowTruncated = false
): string | null {
  const startIndex = rawContent.indexOf(startMarker);
  const endIndex = rawContent.indexOf(endMarker);

  if (startIndex === -1) {
    console.warn(`Start marker not found: ${startMarker}`);
    return null;
  }

  if (endIndex === -1) {
    if (allowTruncated) {
      // Response was truncated before the end marker — use content from start marker to end of string
      console.warn(`End marker not found: ${endMarker} — using content up to end of truncated response`);
      return rawContent.substring(startIndex + startMarker.length).trim();
    }
    console.warn(`End marker not found: ${endMarker}`);
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

  if (context?.brd) {
    prompt += `\n\n### Approved BRD\n\n${context.brd}`;
  }

  if (context?.prd) {
    prompt += `\n\n### Approved PRD\n\n${context.prd}`;
  }

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
