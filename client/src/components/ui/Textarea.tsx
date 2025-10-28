import { TextareaHTMLAttributes, forwardRef, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorText,
      id,
      className,
      maxLength,
      showCharacterCount = false,
      autoResize = false,
      value,
      onChange,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(errorText);
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
      const textarea = internalRef.current;
      if (autoResize && textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };

    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={setRefs}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            'w-full px-3 py-2 text-base',
            'bg-white dark:bg-gray-900',
            'border rounded-md',
            'transition-colors',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none',
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            errorText
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          value={value}
          onChange={handleChange}
          {...props}
        />
        <div className="flex justify-between items-start mt-1.5">
          <div className="flex-1">
            {helperText && !errorText && (
              <p
                id={`${textareaId}-helper`}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
            {errorText && (
              <p
                id={`${textareaId}-error`}
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {errorText}
              </p>
            )}
          </div>
          {showCharacterCount && maxLength && (
            <p
              className={cn(
                'text-sm ml-2 flex-shrink-0',
                charCount > maxLength
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };

