import { HTMLAttributes, ReactNode } from 'react';
import { Check, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface OptionCardProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const OptionCard = ({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
  disabled,
  className,
  ...props
}: OptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative w-full text-left p-4 rounded-lg border-2 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50',
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className={cn(
              'flex-shrink-0 p-2 rounded-md',
              selected
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-semibold text-sm',
              selected
                ? 'text-primary-900 dark:text-primary-100'
                : 'text-gray-900 dark:text-gray-100'
            )}
          >
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {selected && (
          <div className="flex-shrink-0">
            <div className="h-6 w-6 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

OptionCard.displayName = 'OptionCard';

export { OptionCard };

