import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Progress = ({
  value,
  label,
  showValue = false,
  size = 'md',
  className,
  ...props
}: ProgressProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300 ease-in-out',
            sizeStyles[size]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

Progress.displayName = 'Progress';

export { Progress };

