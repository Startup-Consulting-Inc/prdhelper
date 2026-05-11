import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import {
  useExampleAnswers,
  type ExampleAnswer,
  type ExampleAnswersResponse,
} from '@/hooks/useAI';

export interface ExampleAnswersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  projectMode: 'PLAIN' | 'TECHNICAL' | 'UNIFIED';
  documentType: 'PROBLEM_DEFINITION' | 'BRD' | 'PRD';
  projectTitle: string;
  projectDescription: string;
  /**
   * Called when the user clicks "Use this" on a particular example. The wizard
   * page decides whether to overwrite the textarea immediately or confirm
   * first; this component never mutates the answer itself.
   */
  onUseExample: (answer: string) => void;
}

interface ConfirmReplaceState {
  answer: string;
}

const ExampleAnswersPanel = ({
  open,
  onOpenChange,
  question,
  projectMode,
  documentType,
  projectTitle,
  projectDescription,
  onUseExample,
}: ExampleAnswersPanelProps) => {
  const { suggestAsync, isSuggesting, error } = useExampleAnswers();
  const [data, setData] = useState<ExampleAnswersResponse | null>(null);
  const [loadKey, setLoadKey] = useState<string | null>(null);

  const cacheKey = `${documentType}::${projectMode}::${question}`;

  const load = useCallback(async () => {
    try {
      const result = await suggestAsync({
        question,
        projectMode,
        documentType,
        projectTitle,
        projectDescription,
      });
      setData(result);
      setLoadKey(cacheKey);
    } catch {
      // The hook surfaces the error; we just avoid blowing up the UI.
    }
  }, [
    suggestAsync,
    question,
    projectMode,
    documentType,
    projectTitle,
    projectDescription,
    cacheKey,
  ]);

  // Fetch the first time the panel opens for a given question; reuse the
  // cached client-side response on re-open as long as the question hasn't
  // changed. Server-side cache catches the cross-tab case.
  useEffect(() => {
    if (!open) return;
    if (loadKey === cacheKey && data) return;
    void load();
  }, [open, loadKey, cacheKey, data, load]);

  const handleRegenerate = async () => {
    setData(null);
    setLoadKey(null);
    await load();
  };

  const handleUse = (example: ExampleAnswer) => {
    onUseExample(example.answer);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Example answers"
      description={`Generated for: ${projectTitle || 'this project'}`}
      className="max-w-2xl"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            disabled={isSuggesting}
            iconLeft={
              isSuggesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )
            }
          >
            Regenerate
          </Button>
          <Button onClick={() => onOpenChange(false)} variant="primary">
            Close
          </Button>
        </div>
      }
    >
      {isSuggesting && !data ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
          <p className="mt-3 text-sm">
            Drafting a few example answers tailored to your project…
          </p>
        </div>
      ) : error && !data ? (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
          <p className="font-medium mb-1">Couldn't generate examples</p>
          <p className="mb-3">{error.message || 'Please try again.'}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRegenerate}
            disabled={isSuggesting}
            iconLeft={<RefreshCw className="h-4 w-4" />}
          >
            Try again
          </Button>
        </div>
      ) : data && data.examples.length > 0 ? (
        <div className="space-y-3">
          <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary-500" />
            <span>
              These are suggestions, not the only valid answers. Click "Use this" to copy
              one into your draft — you can edit it before submitting.
            </span>
          </p>
          {data.examples.map((example, index) => (
            <ExampleCard
              key={example.id || index}
              example={example}
              onUse={() => handleUse(example)}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No suggestions available. Try regenerating.
        </div>
      )}
    </Dialog>
  );
};

interface ExampleCardProps {
  example: ExampleAnswer;
  onUse: () => void;
}

const ExampleCard = ({ example, onUse }: ExampleCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {example.label}
      </h4>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
        {example.answer}
      </p>
      {example.rationale && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Why this works:
          </span>{' '}
          {example.rationale}
        </p>
      )}
      <div className="flex justify-end">
        <Button size="sm" variant="primary" onClick={onUse}>
          Use this
        </Button>
      </div>
    </div>
  );
};

ExampleAnswersPanel.displayName = 'ExampleAnswersPanel';

export { ExampleAnswersPanel };
