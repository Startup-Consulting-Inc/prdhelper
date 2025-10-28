import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  status: 'complete' | 'current' | 'upcoming';
}

export interface WizardProgressProps {
  steps: WizardStep[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const WizardProgress = ({
  steps,
  orientation = 'horizontal',
  className,
}: WizardProgressProps) => {
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal'
          ? 'flex-row items-center justify-between'
          : 'flex-col space-y-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const isComplete = step.status === 'complete';
        const isCurrent = step.status === 'current';
        const isUpcoming = step.status === 'upcoming';
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className={cn(
              'flex',
              orientation === 'horizontal' ? 'flex-col items-center' : 'flex-row items-start gap-4'
            )}
          >
            {/* Step indicator */}
            <div
              className={cn(
                'flex items-center',
                orientation === 'horizontal' ? 'flex-col' : 'flex-row'
              )}
            >
              {/* Circle/Check icon */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                  isComplete &&
                    'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500',
                  isCurrent &&
                    'bg-primary-100 border-primary-600 dark:bg-primary-900/30 dark:border-primary-400',
                  isUpcoming && 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <Circle
                    className={cn(
                      'h-5 w-5',
                      isCurrent && 'text-primary-600 dark:text-primary-400 fill-current',
                      isUpcoming && 'text-gray-400 dark:text-gray-600'
                    )}
                  />
                )}
              </div>

              {/* Connector line (except for last step) */}
              {!isLast && (
                <div
                  className={cn(
                    orientation === 'horizontal'
                      ? 'w-full h-0.5 min-w-[60px]'
                      : 'h-full w-0.5 min-h-[40px] ml-5',
                    isComplete
                      ? 'bg-primary-600 dark:bg-primary-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  )}
                />
              )}
            </div>

            {/* Step label */}
            <div
              className={cn(
                orientation === 'horizontal'
                  ? 'text-center mt-2 max-w-[120px]'
                  : 'flex-1 ml-0 mt-0'
              )}
            >
              <p
                className={cn(
                  'text-sm font-medium',
                  isComplete && 'text-primary-600 dark:text-primary-400',
                  isCurrent && 'text-gray-900 dark:text-gray-100',
                  isUpcoming && 'text-gray-500 dark:text-gray-400'
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p
                  className={cn(
                    'text-xs mt-1',
                    isUpcoming
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

WizardProgress.displayName = 'WizardProgress';

export { WizardProgress };

