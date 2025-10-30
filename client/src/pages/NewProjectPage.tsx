/**
 * New Project Page
 *
 * Multi-step form for creating a new project:
 * Step 1: Enter project title and description
 * Step 2: Select mode (Plain/Technical)
 * Automatically navigates to BRD wizard on completion
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Alert } from '../components/ui/Alert';
import { User, Code, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';

const projectSchema = z.object({
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

type ProjectFormData = z.infer<typeof projectSchema>;

type Step = 1 | 2;

export function NewProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProjectAsync, isCreating } = useProjects();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [createError, setCreateError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      mode: user?.modePreference === 'TECHNICAL' ? 'technical' : 'plain',
    },
  });

  const description = watch('description', '');
  const mode = watch('mode');
  const title = watch('title', '');

  const handleModeSelect = (selectedMode: 'plain' | 'technical') => {
    setValue('mode', selectedMode, { shouldValidate: true });
  };

  const handleNext = async () => {
    // Validate current step fields
    const fieldsToValidate = currentStep === 1 ? ['title', 'description'] : ['mode'];
    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setCreateError(null);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setCreateError(null);
    try {
      const newProject = await createProjectAsync({
        title: data.title,
        description: data.description,
        mode: data.mode === 'technical' ? 'TECHNICAL' : 'PLAIN',
      });

      if (newProject?.id) {
        // Immediately navigate to BRD wizard with autoStart param
        navigate(`/projects/${newProject.id}/wizard/brd?autoStart=true`);
      }
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span className={currentStep === 1 ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}>
              Step 1
            </span>
            <span>→</span>
            <span className={currentStep === 2 ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}>
              Step 2
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 dark:bg-primary-400 transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {createError && (
              <Alert variant="error" title="Unable to create project" className="mb-6">
                {createError}
              </Alert>
            )}

            {/* Step 1: Project Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Create New Project
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start by describing your project idea. Our AI will guide you through creating
                    comprehensive requirements documents.
                  </p>
                </div>

                <Input
                  {...register('title')}
                  label="Project Title"
                  placeholder="e.g., E-Commerce Platform Redesign"
                  errorText={errors.title?.message}
                  disabled={isCreating}
                  helperText="A brief, descriptive name for your project"
                  autoFocus
                />

                <Textarea
                  {...register('description')}
                  label="Initial Idea"
                  placeholder="Describe your project idea, goals, and what you want to achieve..."
                  rows={8}
                  maxLength={2000}
                  errorText={errors.description?.message}
                  disabled={isCreating}
                  helperText="Provide as much context as possible (min. 20 characters)"
                  autoResize
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    disabled={isCreating || !title || !description || !!errors.title || !!errors.description}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Mode Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Choose Your Mode
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select the mode that best fits your workflow and tools.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plain Mode */}
                  <div
                    onClick={() => !isCreating && handleModeSelect('plain')}
                    className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                      mode === 'plain'
                        ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/10'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <User className="h-6 w-6 text-gray-600 dark:text-gray-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Plain Mode
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          For business stakeholders and non-technical users using AI-powered visual
                          builders.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          <strong>Best for:</strong> V0, Lovable, Bubble, Replit, Bolt
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          <strong>Generates:</strong> BRD and PRD with vibe coding prompts
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Mode */}
                  <div
                    onClick={() => !isCreating && handleModeSelect('technical')}
                    className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                      mode === 'technical'
                        ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/10'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <Code className="h-6 w-6 text-gray-600 dark:text-gray-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Technical Mode
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          For developers and technical teams using code-first development tools.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          <strong>Best for:</strong> CLI, Cursor, Claude Code, VS Code, IDEs
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          <strong>Generates:</strong> BRD, PRD, and detailed technical task lists
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {errors.mode && (
                  <p className="text-sm text-error-600 dark:text-error-400">
                    {errors.mode.message}
                  </p>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isCreating}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isCreating}
                    disabled={isCreating || !mode}
                  >
                    {isCreating ? 'Creating Project...' : 'Create & Start BRD'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Helpful Tip */}
        {currentStep === 2 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 What happens next:</strong>
              <br />
              After you click "Create & Start BRD", we'll immediately begin the BRD wizard where our
              AI will ask you questions to understand your business requirements.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
