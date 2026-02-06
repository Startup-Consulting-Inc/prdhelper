/**
 * Tool Selection Page
 *
 * Displayed after PRD approval for UNIFIED mode projects.
 * Users pick a target AI/vibe coding tool to generate optimized output.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Footer } from '../components/layout/Footer';
import { trpc } from '../lib/trpc';
import { VIBE_CODING_TOOLS, AI_CODING_TOOLS, OUTPUT_TOOLS, type OutputToolType } from '@shared/types';

const GENERATION_STEPS = [
  'Analyzing your PRD and BRD...',
  'Generating optimized output...',
  'Building reference documentation...',
  'Finalizing output...',
];

export function ToolSelectionPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<OutputToolType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const utils = trpc.useUtils();

  const generateMutation = trpc.ai.generateToolOutput.useMutation({
    onSuccess: (data) => {
      utils.projects.getById.invalidate({ id: projectId! });
      utils.documents.getByProjectId.invalidate({ projectId: projectId! });
      navigate(`/projects/${projectId}/tool-output/${data.id}`);
    },
    onError: (err) => {
      setError(err.message || 'Failed to generate tool output');
    },
  });

  const handleGenerate = () => {
    if (!selectedTool || !projectId) return;
    setError(null);
    setGenerationStep(0);
    generateMutation.mutate({ projectId, toolType: selectedTool });
  };

  const isGenerating = generateMutation.isPending;

  // Advance generation step indicator during generation
  useEffect(() => {
    if (!isGenerating) {
      setGenerationStep(0);
      return;
    }
    const interval = setInterval(() => {
      setGenerationStep((prev) => Math.min(prev + 1, GENERATION_STEPS.length - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const selectedToolInfo = selectedTool ? OUTPUT_TOOLS.find((t) => t.id === selectedTool) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Choose Your Output Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a development tool to generate optimized output from your approved PRD and BRD.
            You can generate output for multiple tools.
          </p>
        </div>

        {error && (
          <Alert variant="error" title="Generation failed" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-6 p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Generating {selectedToolInfo?.label} output...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {GENERATION_STEPS[generationStep]}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-1.5">
              {GENERATION_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                    i <= generationStep
                      ? 'bg-primary-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Vibe Coding Tools */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Vibe Coding Tools
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            AI-powered visual builders. Get a copy-paste ready prompt optimized for the tool.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VIBE_CODING_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                disabled={isGenerating}
                onClick={() => setSelectedTool(tool.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTool === tool.id
                    ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {tool.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {tool.description}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  {tool.outputDescription}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* AI Coding Tools */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            AI Coding Tools
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Code-first development tools. Get configuration files and a reference document.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_CODING_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                disabled={isGenerating}
                onClick={() => setSelectedTool(tool.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTool === tool.id
                    ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {tool.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {tool.description}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  {tool.outputDescription}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        {!isGenerating && (
          <div className="flex justify-end">
            <Button
              variant="primary"
              disabled={!selectedTool || isGenerating}
              onClick={handleGenerate}
            >
              Generate Output
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ToolSelectionPage;
