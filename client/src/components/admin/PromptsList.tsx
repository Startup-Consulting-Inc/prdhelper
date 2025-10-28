/**
 * Prompts List Component
 *
 * Displays list of system prompts with selection state.
 */

import { Check, Circle } from 'lucide-react';

interface SystemPrompt {
  id: string;
  type: string;
  prompt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptsListProps {
  prompts: SystemPrompt[];
  selectedPromptId?: string;
  onSelect: (prompt: SystemPrompt) => void;
}

export function PromptsList({ prompts, selectedPromptId, onSelect }: PromptsListProps) {
  const getPromptLabel = (type: string) => {
    switch (type) {
      case 'BRD':
      case 'BRD_PLAIN':
        return 'BRD Generation (Plain Mode)';
      case 'BRD_TECHNICAL':
        return 'BRD Generation (Technical Mode)';
      case 'PRD':
      case 'PRD_PLAIN':
        return 'PRD Generation (Plain Mode)';
      case 'PRD_TECHNICAL':
        return 'PRD Generation (Technical Mode)';
      case 'TASK':
      case 'TASKS':
        return 'Task Generation';
      case 'PROMPT_BUILD':
        return 'Prompt Build';
      default:
        return type;
    }
  };

  const getPromptDescription = (type: string) => {
    switch (type) {
      case 'BRD':
      case 'BRD_PLAIN':
      case 'BRD_TECHNICAL':
        return 'Business Requirements Document';
      case 'PRD':
      case 'PRD_PLAIN':
      case 'PRD_TECHNICAL':
        return 'Product Requirements Document';
      case 'TASK':
      case 'TASKS':
        return 'Task breakdown';
      case 'PROMPT_BUILD':
        return 'Vibe coding tool prompts (Loveable, V0, Bolt)';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelect(prompt)}
          className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
            selectedPromptId === prompt.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-950'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {getPromptLabel(prompt.type)}
                </span>
                {prompt.isActive ? (
                  <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                ) : (
                  <Circle className="h-3 w-3 fill-gray-400 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {getPromptDescription(prompt.type)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Updated {new Date(prompt.updatedAt).toLocaleDateString()}
              </p>
            </div>
            {selectedPromptId === prompt.id && (
              <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
