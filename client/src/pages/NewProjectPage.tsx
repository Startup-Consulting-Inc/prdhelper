/**
 * New Project Page
 *
 * Single-step form for creating a new project:
 * Enter project title, description, and language
 * Optionally skip Problem Definition if user already knows what to build.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { SUPPORTED_LANGUAGES } from '@shared/types';

const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(15000, 'Description must be 15,000 characters or less'),
  language: z.enum(['en', 'ko', 'ja', 'zh', 'auto']),
  skipProblemDefinition: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const languageOptions = [
  { value: 'auto', label: `${SUPPORTED_LANGUAGES.auto} (Recommended)` },
  { value: 'en', label: SUPPORTED_LANGUAGES.en },
  { value: 'ko', label: SUPPORTED_LANGUAGES.ko },
  { value: 'ja', label: SUPPORTED_LANGUAGES.ja },
  { value: 'zh', label: SUPPORTED_LANGUAGES.zh },
];

export function NewProjectPage() {
  const navigate = useNavigate();
  const { createProjectAsync, isCreating } = useProjects();
  const [createError, setCreateError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      language: 'auto',
      skipProblemDefinition: true,
    },
  });

  const description = watch('description', '');
  const title = watch('title', '');
  const skipProblemDefinition = watch('skipProblemDefinition', false);

  const onSubmit = async (data: ProjectFormData) => {
    setCreateError(null);
    try {
      const newProject = await createProjectAsync({
        title: data.title,
        description: data.description,
        mode: 'UNIFIED',
        language: data.language,
        skipProblemDefinition: data.skipProblemDefinition,
      });

      if (newProject?.id) {
        if (data.skipProblemDefinition) {
          navigate(`/projects/${newProject.id}/wizard/brd?autoStart=true`);
        } else {
          navigate(`/projects/${newProject.id}/wizard/problem-definition?autoStart=true`);
        }
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
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {createError && (
              <Alert variant="error" title="Unable to create project" className="mb-6">
                {createError}
              </Alert>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Create New Project
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Start by describing your project idea. Our AI will guide you through creating
                  comprehensive requirements documents, then help you generate tool-specific output.
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
                maxLength={15000}
                errorText={errors.description?.message}
                disabled={isCreating}
                helperText="Provide as much context as possible — up to ~2,000 words supported (min. 20 characters)"
                autoResize
              />

              <Select
                {...register('language')}
                label="Output Language"
                options={languageOptions}
                errorText={errors.language?.message}
                disabled={isCreating}
                helperText="Select the language for AI questions and generated documents"
              />

              {/* Skip Problem Definition option */}
              <div className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${skipProblemDefinition ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30' : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30'}`}>
                <input
                  {...register('skipProblemDefinition')}
                  type="checkbox"
                  id="skipProblemDefinition"
                  disabled={isCreating}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="skipProblemDefinition" className="cursor-pointer">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    I already know what to build — skip Problem Definition
                  </span>
                  <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Jump straight to the BRD wizard if you have a clear product vision and well-defined requirements.
                  </span>
                  <span className="block text-sm text-amber-700 dark:text-amber-400 mt-2 font-medium">
                    💡 Not sure about the problem you're solving? Uncheck this. Problem Definition uses the 5 Whys and Jobs-to-be-Done frameworks to help you uncover root causes, avoid building the wrong thing, and write a sharper BRD — it only takes 5–8 questions.
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isCreating}
                  disabled={isCreating || !title || !description || !!errors.title || !!errors.description}
                >
                  {isCreating ? 'Creating Project...' : 'Create Project'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Helpful Tip */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {skipProblemDefinition ? (
              <>
                <strong>What happens next:</strong> You'll go straight to the BRD wizard where our AI
                will ask questions to build your BRD and PRD. Then you'll choose your target development
                tool (v0, Loveable, Claude Code, Cursor, etc.) to generate optimized output.
              </>
            ) : (
              <>
                <strong>What happens next:</strong> Our AI will first help you validate and define the
                right problem to solve, then guide you through BRD and PRD creation. Finally, you'll
                choose your target development tool to generate optimized output.
              </>
            )}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NewProjectPage;
