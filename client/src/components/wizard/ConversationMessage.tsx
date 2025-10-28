import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type MessageRole = 'ai' | 'assistant' | 'user';

export interface ConversationMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: Date | string;
  className?: string;
}

const ConversationMessage = ({
  role,
  content,
  timestamp,
  className,
}: ConversationMessageProps) => {
  const isAI = role === 'ai' || role === 'assistant';

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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
    </div>
  );
};

ConversationMessage.displayName = 'ConversationMessage';

export { ConversationMessage };

