import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
  className?: string;
}

const WizardNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onFinish,
  canGoBack = true,
  canGoNext = true,
  isLoading = false,
  nextLabel = 'Next',
  backLabel = 'Back',
  finishLabel = 'Finish',
  className,
}: WizardNavigationProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress bar with step indicator */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <Progress value={progressPercentage} />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {onBack && currentStep > 1 && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={!canGoBack || isLoading}
              iconLeft={<ChevronLeft className="h-4 w-4" />}
            >
              {backLabel}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {!isLastStep && onNext && (
            <Button
              variant="primary"
              onClick={onNext}
              disabled={!canGoNext || isLoading}
              isLoading={isLoading}
              iconRight={<ChevronRight className="h-4 w-4" />}
            >
              {nextLabel}
            </Button>
          )}

          {isLastStep && onFinish && (
            <Button
              variant="primary"
              onClick={onFinish}
              disabled={!canGoNext || isLoading}
              isLoading={isLoading}
              iconLeft={<Check className="h-4 w-4" />}
            >
              {finishLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

WizardNavigation.displayName = 'WizardNavigation';

export { WizardNavigation };

