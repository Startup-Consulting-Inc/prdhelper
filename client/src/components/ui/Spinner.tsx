import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const Spinner = ({ size = 'md', label, className }: SpinnerProps) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="inline-flex items-center gap-2" role="status">
      <Loader2
        className={cn(
          'animate-spin text-primary-600 dark:text-primary-400',
          sizeStyles[size],
          className
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';

export { Spinner };

