/**
 * Prompt Editor Component
 *
 * Right panel component for viewing and editing prompts.
 */

import { useState } from 'react';
import { Save, RotateCcw, Trash2, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SystemPrompt {
  id: string;
  type: string;
  prompt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptVersion {
  id: string;
  promptId: string;
  prompt: string;
  version: number;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface PromptEditorProps {
  prompt?: SystemPrompt | PromptVersion;
  isVersion?: boolean;
  onSave?: (id: string, newPrompt: string) => void;
  onDelete?: (id: string) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function PromptEditor({
  prompt,
  isVersion,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: PromptEditorProps) {
  const [editedPrompt, setEditedPrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  if (!prompt) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Prompt Selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Select a prompt from the left panel to view or edit
          </p>
        </div>
      </Card>
    );
  }

  const currentValue = isEditing ? editedPrompt : prompt.prompt;
  const hasChanges = isEditing && editedPrompt !== prompt.prompt;

  const handleEdit = () => {
    setEditedPrompt(prompt.prompt);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (onSave && hasChanges) {
      await onSave(prompt.id, editedPrompt);
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    setEditedPrompt(prompt.prompt);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPrompt('');
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      onDelete(prompt.id);
    }
  };

  const getPromptLabel = (type?: string) => {
    if (!type) return 'System Prompt';
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

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isVersion
                ? `Version ${(prompt as PromptVersion).version}`
                : getPromptLabel((prompt as SystemPrompt).type)}
            </h3>
            {isVersion && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Created by {(prompt as PromptVersion).creator.name} on{' '}
                {new Date(prompt.createdAt).toLocaleString()}
              </p>
            )}
          </div>
          {!isVersion && !isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isVersion ? 'Version Content' : 'System Prompt'}
          </label>
          <textarea
            value={currentValue}
            onChange={(e) => setEditedPrompt(e.target.value)}
            readOnly={!isEditing || isVersion}
            rows={20}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              !isEditing || isVersion ? 'cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''
            }`}
            placeholder="Enter system prompt..."
          />
        </div>

        {isEditing && !isVersion && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            {hasChanges && (
              <Button variant="outline" onClick={handleReset} disabled={isSaving}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        )}

        {hasChanges && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            You have unsaved changes
          </p>
        )}
      </div>
    </Card>
  );
}
