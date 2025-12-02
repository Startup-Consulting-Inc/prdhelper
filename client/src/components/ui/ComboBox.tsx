import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Tooltip } from './Tooltip';

export interface ComboBoxProps {
  label?: string;
  helperText?: string;
  tooltipContent?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
}

export function ComboBox({
  label,
  helperText,
  tooltipContent,
  value,
  onChange,
  options,
  placeholder = 'Select or type...',
  disabled = false,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const inputId = `combobox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {tooltipContent ? (
            <Tooltip content={tooltipContent}>
              <div className="flex items-center gap-1.5 cursor-help w-fit">
                <span>{label}</span>
                <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              </div>
            </Tooltip>
          ) : (
            label
          )}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 pr-20 text-base',
            'bg-white dark:bg-gray-900',
            'border rounded-md',
            'transition-colors',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500'
          )}
          aria-autocomplete="list"
          aria-controls={`${inputId}-listbox`}
          aria-expanded={isOpen}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label="Clear"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-label="Toggle options"
          >
            <ChevronDown
              className={cn(
                'w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          </button>
        </div>
        {isOpen && filteredOptions.length > 0 && (
          <ul
            id={`${inputId}-listbox`}
            role="listbox"
            className={cn(
              'absolute z-10 w-full mt-1',
              'bg-white dark:bg-gray-900',
              'border border-gray-300 dark:border-gray-700',
              'rounded-md shadow-lg',
              'max-h-60 overflow-auto'
            )}
          >
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                role="option"
                aria-selected={option === value}
                onClick={() => handleOptionClick(option)}
                className={cn(
                  'px-3 py-2 cursor-pointer',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'text-gray-900 dark:text-gray-100',
                  option === value &&
                    'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                )}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
        {isOpen && filteredOptions.length === 0 && inputValue && (
          <div
            className={cn(
              'absolute z-10 w-full mt-1',
              'bg-white dark:bg-gray-900',
              'border border-gray-300 dark:border-gray-700',
              'rounded-md shadow-lg',
              'px-3 py-2 text-sm text-gray-500 dark:text-gray-400'
            )}
          >
            No matching options. Press Enter to use "{inputValue}"
          </div>
        )}
      </div>
      {helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
