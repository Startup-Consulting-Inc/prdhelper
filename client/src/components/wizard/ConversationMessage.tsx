import { useState } from 'react';
import { Bot, User, HelpCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useQuestionExplanation, type ExplanationResponse } from '@/hooks/useAI';

type MessageRole = 'ai' | 'assistant' | 'user';

export interface ConversationMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: Date | string;
  className?: string;
  projectMode?: 'PLAIN' | 'TECHNICAL';
  documentType?: 'BRD' | 'PRD';
}

const ConversationMessage = ({
  role,
  content,
  timestamp,
  className,
  projectMode = 'TECHNICAL',
  documentType = 'BRD',
}: ConversationMessageProps) => {
  const isAI = role === 'ai' || role === 'assistant';
  const [showExplanation, setShowExplanation] = useState(false);
  const { explainAsync, isExplaining, error: explainError } = useQuestionExplanation();
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleExplainClick = async () => {
    setShowExplanation(true);

    // If explanation already loaded, don't fetch again
    if (explanation) return;

    try {
      const result = await explainAsync({
        question: content,
        projectMode,
        documentType,
      });
      setExplanation(result);
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      // Set fallback explanation on error
      setExplanation({
        purpose: 'Understanding your project requirements',
        importance: 'This helps create accurate specifications',
        tips: [
          'Be specific in your answer',
          'Consider both current and future needs',
          'Think about your users',
          'Ask yourself: what problem does this solve?',
        ],
      });
    }
  };

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            isAI
              ? 'bg-primary-100 dark:bg-primary-900/30'
              : 'bg-gray-100 dark:bg-gray-800'
          )}
        >
          {isAI ? (
            <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          ) : (
            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {isAI ? 'AI Assistant' : 'You'}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(timestamp)}
            </span>
          )}
          {isAI && (
            <button
              onClick={handleExplainClick}
              disabled={isExplaining}
              className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-50"
              title="Explain this question"
              aria-label="Explain this question"
            >
              {isExplaining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <HelpCircle className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        <div
          className={cn(
            'rounded-lg border p-4',
            isAI
              ? 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
              : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
          )}
        >
          <p
            className={cn(
              'text-sm leading-relaxed whitespace-pre-wrap',
              isAI
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-blue-900 dark:text-blue-100'
            )}
          >
            {content}
          </p>
        </div>
      </div>

      {/* Explanation Dialog */}
      {isAI && (
        <Dialog
          open={showExplanation}
          onOpenChange={setShowExplanation}
          title="Understanding This Question"
          description={
            isExplaining
              ? 'Generating explanation...'
              : 'Here\'s some guidance to help you answer this question effectively'
          }
          footer={
            <Button onClick={() => setShowExplanation(false)} variant="primary">
              Got it
            </Button>
          }
        >
          {isExplaining ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : explainError ? (
            <div className="text-red-600 dark:text-red-400">
              Failed to load explanation. Please try again.
            </div>
          ) : explanation ? (
            <div className="space-y-4">
              {/* Purpose */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What this question is about:
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {explanation.purpose}
                </p>
              </div>

              {/* Importance */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Why it matters:
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {explanation.importance}
                </p>
              </div>

              {/* Recommendation */}
              {explanation.recommendation && (
                <div className="bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Recommended Best-Fit Architecture:
                  </h4>
                  <p className="text-sm text-primary-800 dark:text-primary-200">
                    {explanation.recommendation}
                  </p>
                </div>
              )}

              {/* Tips */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Tips for answering:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {explanation.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Examples (if available) */}
              {explanation.examples && explanation.examples.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Common options:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {explanation.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pros and Cons (if available) */}
              {explanation.prosAndCons && explanation.prosAndCons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Comparing your options:
                  </h4>
                  <div className="space-y-4">
                    {explanation.prosAndCons.map((option, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-800 rounded-lg p-3"
                      >
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {option.option}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Pros */}
                          <div>
                            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                              ✓ Pros:
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                              {option.pros.map((pro, proIndex) => (
                                <li key={proIndex}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          {/* Cons */}
                          <div>
                            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                              ✗ Cons:
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                              {option.cons.map((con, conIndex) => (
                                <li key={conIndex}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </Dialog>
      )}
    </div>
  );
};

ConversationMessage.displayName = 'ConversationMessage';

export { ConversationMessage };
