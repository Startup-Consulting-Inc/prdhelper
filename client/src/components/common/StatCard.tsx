import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatCard = ({
  label,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className,
}: StatCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <div
      className={cn(
        'p-6 rounded-lg border border-gray-200 dark:border-gray-800',
        'bg-white dark:bg-gray-950',
        'transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2', getTrendColor())}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                vs last period
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.displayName = 'StatCard';

export { StatCard };

