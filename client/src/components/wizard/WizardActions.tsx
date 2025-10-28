import { Button } from '../ui/Button';
import { Save, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface WizardActionsProps {
  onSave?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  isSaving?: boolean;
  canSave?: boolean;
  canCancel?: boolean;
  canReset?: boolean;
  layout?: 'default' | 'spaced';
  className?: string;
}

const WizardActions = ({
  onSave,
  onCancel,
  onReset,
  saveLabel = 'Save Progress',
  cancelLabel = 'Cancel',
  resetLabel = 'Reset',
  isSaving = false,
  canSave = true,
  canCancel = true,
  canReset = true,
  layout = 'default',
  className,
}: WizardActionsProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        layout === 'spaced' ? 'justify-between' : 'justify-end',
        className
      )}
    >
      {/* Left side actions (reset) */}
      {layout === 'spaced' && onReset && (
        <Button
          variant="ghost"
          onClick={onReset}
          disabled={!canReset || isSaving}
          iconLeft={<RotateCcw className="h-4 w-4" />}
          className="text-gray-600 dark:text-gray-400"
        >
          {resetLabel}
        </Button>
      )}

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {layout === 'default' && onReset && (
          <Button
            variant="ghost"
            onClick={onReset}
            disabled={!canReset || isSaving}
            iconLeft={<RotateCcw className="h-4 w-4" />}
            className="text-gray-600 dark:text-gray-400"
          >
            {resetLabel}
          </Button>
        )}

        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={!canCancel || isSaving}
            iconLeft={<X className="h-4 w-4" />}
          >
            {cancelLabel}
          </Button>
        )}

        {onSave && (
          <Button
            variant="primary"
            onClick={onSave}
            disabled={!canSave || isSaving}
            isLoading={isSaving}
            iconLeft={<Save className="h-4 w-4" />}
          >
            {saveLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

WizardActions.displayName = 'WizardActions';

export { WizardActions };

