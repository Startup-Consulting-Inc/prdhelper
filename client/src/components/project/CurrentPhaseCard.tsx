/**
 * Current Phase Card
 *
 * Displays the current project phase with icon, subtitle, and primary action button.
 */

import { LucideIcon, PlayCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils/cn';

export interface CurrentPhaseCardProps {
  /** Phase title (e.g., "Review BRD") */
  title: string;
  /** Subtitle text (e.g., "BRD QUESTIONS") */
  subtitle: string;
  /** Action button text (e.g., "Review & Approve BRD") */
  actionText: string;
  /** Icon component to display */
  icon: LucideIcon;
  /** Click handler for action button */
  onAction: () => void;
  /** Whether the action is loading */
  isLoading?: boolean;
  /** Custom className */
  className?: string;
}

export function CurrentPhaseCard({
  title,
  subtitle,
  actionText,
  icon: Icon,
  onAction,
  isLoading = false,
  className,
}: CurrentPhaseCardProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Phase Header */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Current Phase: {title}
          </h2>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onAction}
        isLoading={isLoading}
        className="w-full sm:w-auto min-w-[280px]"
      >
        <PlayCircle className="w-5 h-5 mr-2" />
        {actionText}
      </Button>
    </div>
  );
}
