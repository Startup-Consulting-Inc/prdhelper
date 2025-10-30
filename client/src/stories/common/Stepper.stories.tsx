import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from '@/components/common/Stepper';

const meta = {
  title: 'Common/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStep: Story = {
  args: {
    steps: [
      { label: 'Step 1', status: 'current' },
      { label: 'Step 2', status: 'upcoming' },
      { label: 'Step 3', status: 'upcoming' },
    ],
  },
};

export const MiddleStep: Story = {
  args: {
    steps: [
      { label: 'Step 1', status: 'complete' },
      { label: 'Step 2', status: 'current' },
      { label: 'Step 3', status: 'upcoming' },
    ],
  },
};

export const LastStep: Story = {
  args: {
    steps: [
      { label: 'Step 1', status: 'complete' },
      { label: 'Step 2', status: 'complete' },
      { label: 'Step 3', status: 'current' },
    ],
  },
};

export const AllComplete: Story = {
  args: {
    steps: [
      { label: 'Step 1', status: 'complete' },
      { label: 'Step 2', status: 'complete' },
      { label: 'Step 3', status: 'complete' },
    ],
  },
};

// Use case: Document Generation Progress
export const DocumentProgress = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">BRD Started</h3>
        <Stepper
          steps={[
            { label: 'BRD', status: 'current' },
            { label: 'PRD', status: 'upcoming' },
            { label: 'Tasks', status: 'upcoming' },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">PRD In Progress</h3>
        <Stepper
          steps={[
            { label: 'BRD', status: 'complete' },
            { label: 'PRD', status: 'current' },
            { label: 'Tasks', status: 'upcoming' },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">All Complete</h3>
        <Stepper
          steps={[
            { label: 'BRD', status: 'complete' },
            { label: 'PRD', status: 'complete' },
            { label: 'Tasks', status: 'complete' },
          ]}
        />
      </div>
    </div>
  ),
};

// Use case: Wizard Progress
export const WizardProgress = {
  render: () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">BRD Question Wizard</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Answer all questions to generate your Business Requirements Document
        </p>
      </div>
      
      <Stepper
        steps={[
          { label: 'Project Goals', status: 'complete' },
          { label: 'Target Audience', status: 'complete' },
          { label: 'Requirements', status: 'current' },
          { label: 'Success Criteria', status: 'upcoming' },
        ]}
      />
      
      <div className="mt-8 p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Question 3 of 4</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          What are the key functional requirements of your project?
        </p>
      </div>
    </div>
  ),
};

// Use case: Onboarding Flow
export const OnboardingFlow = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Clearly</h2>
      
      <Stepper
        steps={[
          { label: 'Create Account', status: 'complete' },
          { label: 'Choose Mode', status: 'complete' },
          { label: 'Create Project', status: 'current' },
          { label: 'Start Wizard', status: 'upcoming' },
        ]}
      />
      
      <div className="mt-8 p-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Create Your First Project</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Give your project a name and describe what you want to build.
        </p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
          <textarea
            placeholder="Project description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
      </div>
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    steps: [
      { label: 'Step 1', status: 'complete' },
      { label: 'Step 2', status: 'current' },
      { label: 'Step 3', status: 'upcoming' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Stepper includes proper ARIA labels and aria-current for the current step.',
      },
    },
  },
};

