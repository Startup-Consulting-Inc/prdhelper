import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const RadioGroup = ({
  options,
  value,
  onValueChange,
  label,
  disabled,
  className,
}: RadioGroupProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className="space-y-2"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              'flex items-start gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-800',
              'transition-colors cursor-pointer',
              'hover:bg-gray-50 dark:hover:bg-gray-900/50',
              value === option.value &&
                'bg-primary-50 dark:bg-primary-950/20 border-primary-500',
              (disabled || option.disabled) &&
                'opacity-50 cursor-not-allowed hover:bg-transparent'
            )}
          >
            <RadioGroupPrimitive.Item
              value={option.value}
              disabled={option.disabled}
              id={`radio-${option.value}`}
              className={cn(
                'h-5 w-5 flex-shrink-0 rounded-full border-2 mt-0.5',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                'transition-colors',
                value === option.value
                  ? 'border-primary-600 dark:border-primary-500'
                  : 'border-gray-300 dark:border-gray-700'
              )}
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full relative">
                <div className="h-2.5 w-2.5 rounded-full bg-primary-600 dark:bg-primary-500" />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            <label
              htmlFor={`radio-${option.value}`}
              className="flex-1 cursor-pointer"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </div>
              )}
            </label>
          </div>
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };

