import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface Step {
  label: string;
  status: 'complete' | 'current' | 'upcoming';
}

export interface StepperProps {
  steps: Step[];
  className?: string;
}

const Stepper = ({ steps, className }: StepperProps) => {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <li
              key={index}
              className={cn(
                'relative flex items-center',
                !isLast && 'flex-1'
              )}
            >
              {/* Step content */}
              <div className="flex flex-col items-center">
                {/* Step indicator */}
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                    step.status === 'complete' &&
                      'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500',
                    step.status === 'current' &&
                      'border-primary-600 bg-white dark:border-primary-500 dark:bg-gray-950',
                    step.status === 'upcoming' &&
                      'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950'
                  )}
                >
                  {step.status === 'complete' ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        step.status === 'current' &&
                          'text-primary-600 dark:text-primary-500',
                        step.status === 'upcoming' &&
                          'text-gray-400 dark:text-gray-600'
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center max-w-[100px] truncate',
                    step.status === 'complete' &&
                      'text-primary-600 dark:text-primary-500',
                    step.status === 'current' &&
                      'text-gray-900 dark:text-gray-100',
                    step.status === 'upcoming' &&
                      'text-gray-500 dark:text-gray-400'
                  )}
                  aria-current={step.status === 'current' ? 'step' : undefined}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors',
                    step.status === 'complete'
                      ? 'bg-primary-600 dark:bg-primary-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Stepper.displayName = 'Stepper';

export { Stepper };

