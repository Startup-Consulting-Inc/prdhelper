import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface QuestionCardProps {
  question: string;
  questionNumber?: number;
  totalQuestions?: number;
  isTyping?: boolean;
  className?: string;
}

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  isTyping = false,
  className,
}: QuestionCardProps) => {
  return (
    <div className={cn('flex gap-4', className)}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Question metadata */}
        {questionNumber && totalQuestions && (
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
        )}

        {/* Question text */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
          {isTyping ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
              {question}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

QuestionCard.displayName = 'QuestionCard';

export { QuestionCard };

