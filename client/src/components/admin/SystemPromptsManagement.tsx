/**
 * System Prompts Management
 *
 * Component for viewing and editing system prompts with version history.
 * Two-column layout: left panel with tabs (Current Prompts / Version History),
 * right panel with prompt editor.
 */

import { useState } from 'react';
import { FileText, History } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { PromptsList } from './PromptsList';
import { PromptVersionHistory } from './PromptVersionHistory';
import { PromptEditor } from './PromptEditor';
import {
  useSystemPrompts,
  useUpdateSystemPrompt,
  useDeleteSystemPrompt,
  usePromptVersionHistory,
  useRestorePromptVersion,
} from '../../hooks/useAdmin';

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

export function SystemPromptsManagement() {
  const { prompts, isLoading } = useSystemPrompts();
  const { updatePrompt, isUpdating } = useUpdateSystemPrompt();
  const { deletePrompt, isDeleting } = useDeleteSystemPrompt();
  const { restoreVersion, isRestoring } = useRestorePromptVersion();

  const [activeTab, setActiveTab] = useState<'prompts' | 'history'>('prompts');
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPrompt | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);

  const { versions, isLoading: isLoadingVersions } = usePromptVersionHistory(
    selectedPrompt?.id
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading system prompts...</div>;
  }

  const handlePromptSelect = (prompt: SystemPrompt) => {
    setSelectedPrompt(prompt);
    setSelectedVersion(null);
  };

  const handleVersionSelect = (version: PromptVersion) => {
    setSelectedVersion(version);
  };

  const handleSave = async (id: string, newPrompt: string) => {
    try {
      await updatePrompt({ id, prompt: newPrompt });
      // Refresh selected prompt
      const updatedPrompt = prompts.find((p) => p.id === id);
      if (updatedPrompt) {
        setSelectedPrompt(updatedPrompt);
      }
    } catch (error) {
      alert('Failed to update prompt');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePrompt({ id });
      setSelectedPrompt(null);
      setSelectedVersion(null);
    } catch (error) {
      alert('Failed to delete prompt');
    }
  };

  const handleRestore = async (versionId: string) => {
    try {
      await restoreVersion({ versionId });
      // Refresh selected prompt
      const updatedPrompt = prompts.find((p) => p.id === selectedPrompt?.id);
      if (updatedPrompt) {
        setSelectedPrompt(updatedPrompt);
      }
      setSelectedVersion(null);
      setActiveTab('prompts');
    } catch (error) {
      alert('Failed to restore version');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'prompts' | 'history');
    if (value === 'history') {
      setSelectedVersion(null);
    } else {
      setSelectedVersion(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        System Prompts Management
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Edit the AI system prompts used for document generation. Changes will affect all future generations.
      </p>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="prompts" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Current Prompts
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                <History className="h-4 w-4 mr-2" />
                Version History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompts">
              <PromptsList
                prompts={prompts}
                selectedPromptId={selectedPrompt?.id}
                onSelect={handlePromptSelect}
              />
            </TabsContent>

            <TabsContent value="history">
              {!selectedPrompt ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a prompt to view its version history</p>
                </div>
              ) : isLoadingVersions ? (
                <div className="text-center py-8">Loading version history...</div>
              ) : (
                <PromptVersionHistory
                  versions={versions}
                  selectedVersionId={selectedVersion?.id}
                  onSelect={handleVersionSelect}
                  onRestore={handleRestore}
                  isRestoring={isRestoring}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2">
          <PromptEditor
            prompt={selectedVersion || selectedPrompt || undefined}
            isVersion={!!selectedVersion}
            onSave={handleSave}
            onDelete={handleDelete}
            isSaving={isUpdating}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}
