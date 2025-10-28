/**
 * Prompt Version History Component
 *
 * Displays version history list with timestamps and authors.
 */

import { Clock, User, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

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

interface PromptVersionHistoryProps {
  versions: PromptVersion[];
  selectedVersionId?: string;
  onSelect: (version: PromptVersion) => void;
  onRestore: (versionId: string) => void;
  isRestoring?: boolean;
}

export function PromptVersionHistory({
  versions,
  selectedVersionId,
  onSelect,
  onRestore,
  isRestoring,
}: PromptVersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
        <p className="text-gray-600 dark:text-gray-400">No version history available</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Make changes to create version history
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {versions.map((version) => (
        <div
          key={version.id}
          className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
            selectedVersionId === version.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950'
          }`}
        >
          <div className="flex items-start justify-between">
            <button
              onClick={() => onSelect(version)}
              className="flex-1 text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Version {version.version}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{version.creator.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(version.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(version.id)}
              disabled={isRestoring}
              className="ml-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
