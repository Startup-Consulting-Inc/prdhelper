import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { User, Code } from 'lucide-react';
import { Alert } from '../ui/Alert';

const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be 2000 characters or less'),
  mode: z.enum(['plain', 'technical']),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProjectFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const CreateProjectDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  error,
}: CreateProjectDialogProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  const description = watch('description', '');
  const mode = watch('mode');

  const handleModeSelect = (selectedMode: 'plain' | 'technical') => {
    setValue('mode', selectedMode);
  };

  const onSubmitHandler = async (data: CreateProjectFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      title="Create New Project"
      description="Start by describing your project idea. Our AI will guide you through creating comprehensive requirements documents."
    >
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
          {error && (
            <Alert variant="error" title="Unable to create project">
              {error}
            </Alert>
          )}
          {/* Title Input */}
          <div>
            <Input
              {...register('title')}
              label="Project Title"
              placeholder="e.g., E-Commerce Platform Redesign"
              errorText={errors.title?.message}
              disabled={isLoading}
              helperText="A brief, descriptive name for your project"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <Textarea
              {...register('description')}
              label="Initial Idea"
              placeholder="Describe your project idea, goals, and what you want to achieve..."
              rows={6}
              maxLength={2000}
              errorText={errors.description?.message}
              disabled={isLoading}
              helperText="Provide as much context as possible (min. 20 characters)"
              autoResize
            />
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Your Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => !isLoading && handleModeSelect('plain')}
                className={`cursor-pointer p-4 rounded-lg border transition-all ${
                  mode === 'plain'
                    ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400'
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Plain Mode
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For business stakeholders and non-technical users. Generates BRD and PRD only.
                    </p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => !isLoading && handleModeSelect('technical')}
                className={`cursor-pointer p-4 rounded-lg border transition-all ${
                  mode === 'technical'
                    ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400'
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Technical Mode
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For developers and technical teams. Includes detailed technical task lists.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {errors.mode && (
              <p className="mt-2 text-sm text-error-600 dark:text-error-400">
                {errors.mode.message}
              </p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Dialog>
  );
};

CreateProjectDialog.displayName = 'CreateProjectDialog';

export { CreateProjectDialog };
