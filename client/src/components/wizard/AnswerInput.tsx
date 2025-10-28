import { useState, forwardRef, KeyboardEvent } from 'react';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Send, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  className?: string;
}

const AnswerInput = forwardRef<HTMLTextAreaElement, AnswerInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder = 'Type your answer here...',
      isLoading = false,
      disabled = false,
      minLength = 10,
      maxLength = 2000,
      className,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (canSubmit) {
          onSubmit();
        }
      }
    };

    const canSubmit = value.trim().length >= minLength && !isLoading && !disabled;
    const characterCount = value.length;
    const isNearLimit = characterCount > maxLength * 0.8;
    const isOverLimit = characterCount > maxLength;

    return (
      <div className={cn('flex gap-4', className)}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        {/* Input area */}
        <div className="flex-1">
          <div
            className={cn(
              'rounded-lg border transition-all',
              isFocused
                ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400'
                : 'border-gray-300 dark:border-gray-700',
              'bg-white dark:bg-gray-950'
            )}
          >
            <Textarea
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={4}
              maxLength={maxLength}
              className="border-0 focus:ring-0 resize-none"
              autoResize
            />

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {characterCount} / {maxLength}
                  {isOverLimit && (
                    <span className="ml-1 text-error-600 dark:text-error-400 font-medium">
                      (over limit)
                    </span>
                  )}
                  {isNearLimit && !isOverLimit && (
                    <span className="ml-1 text-warning-600 dark:text-warning-400 font-medium">
                      (near limit)
                    </span>
                  )}
                </span>
                <span className="hidden sm:inline">
                  Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">⌘</kbd> +{' '}
                  <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd> to
                  submit
                </span>
              </div>

              <Button
                onClick={onSubmit}
                disabled={!canSubmit}
                isLoading={isLoading}
                variant="primary"
                size="sm"
                iconLeft={<Send className="h-4 w-4" />}
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Helper text */}
          {!isOverLimit && value.trim().length > 0 && value.trim().length < minLength && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Minimum {minLength} characters required ({minLength - value.trim().length} more to go)
            </p>
          )}
        </div>
      </div>
    );
  }
);

AnswerInput.displayName = 'AnswerInput';

export { AnswerInput };

