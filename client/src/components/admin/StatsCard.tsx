/**
 * Stats Card Component
 *
 * Displays a single statistic with icon and label.
 */

import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '@/lib/utils/cn';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {trend && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span
                className={cn(
                  'font-medium',
                  trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {trend.direction === 'up' ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>{' '}
              {trend.label}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>
    </Card>
  );
}
