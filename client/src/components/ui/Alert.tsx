import { HTMLAttributes, ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  ...props
}: AlertProps) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const variantStyles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-900',
    success:
      'bg-green-50 text-green-900 border-green-200 dark:bg-green-950/30 dark:text-green-200 dark:border-green-900',
    warning:
      'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-200 dark:border-yellow-900',
    error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/30 dark:text-red-200 dark:border-red-900',
  };

  const iconColorStyles = {
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  };

  const Icon = icons[variant];

  return (
    <div
      role="alert"
      className={cn(
        'relative flex gap-3 p-4 border rounded-lg',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <Icon
        className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColorStyles[variant])}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className="font-semibold mb-1 text-sm">{title}</h5>
        )}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
            iconColorStyles[variant]
          )}
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';

export { Alert };

