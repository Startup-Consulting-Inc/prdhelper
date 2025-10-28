import type { Meta, StoryObj } from '@storybook/react';
import { WizardProgress } from '@/components/wizard/WizardProgress';

const meta = {
  title: 'Wizard/WizardProgress',
  component: WizardProgress,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WizardProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

const simpleSteps = [
  { id: '1', label: 'Project Info', status: 'complete' as const },
  { id: '2', label: 'Requirements', status: 'complete' as const },
  { id: '3', label: 'Stakeholders', status: 'current' as const },
  { id: '4', label: 'Timeline', status: 'upcoming' as const },
  { id: '5', label: 'Review', status: 'upcoming' as const },
];

const detailedSteps = [
  {
    id: '1',
    label: 'Project Details',
    description: 'Basic project information',
    status: 'complete' as const,
  },
  {
    id: '2',
    label: 'Requirements',
    description: 'Define project requirements',
    status: 'complete' as const,
  },
  {
    id: '3',
    label: 'Stakeholders',
    description: 'Identify key stakeholders',
    status: 'current' as const,
  },
  {
    id: '4',
    label: 'Timeline',
    description: 'Set project timeline',
    status: 'upcoming' as const,
  },
  {
    id: '5',
    label: 'Review',
    description: 'Review and confirm',
    status: 'upcoming' as const,
  },
];

export const HorizontalSimple: Story = {
  args: {
    steps: simpleSteps,
    orientation: 'horizontal',
  },
};

export const VerticalSimple: Story = {
  args: {
    steps: simpleSteps,
    orientation: 'vertical',
  },
};

export const HorizontalDetailed: Story = {
  args: {
    steps: detailedSteps,
    orientation: 'horizontal',
  },
};

export const VerticalDetailed: Story = {
  args: {
    steps: detailedSteps,
    orientation: 'vertical',
  },
};

export const AllComplete: Story = {
  args: {
    steps: simpleSteps.map((step) => ({ ...step, status: 'complete' as const })),
    orientation: 'horizontal',
  },
};

export const JustStarted: Story = {
  args: {
    steps: [
      { id: '1', label: 'Project Info', status: 'current' as const },
      { id: '2', label: 'Requirements', status: 'upcoming' as const },
      { id: '3', label: 'Stakeholders', status: 'upcoming' as const },
      { id: '4', label: 'Timeline', status: 'upcoming' as const },
      { id: '5', label: 'Review', status: 'upcoming' as const },
    ],
    orientation: 'horizontal',
  },
};

export const LastStep: Story = {
  args: {
    steps: [
      { id: '1', label: 'Project Info', status: 'complete' as const },
      { id: '2', label: 'Requirements', status: 'complete' as const },
      { id: '3', label: 'Stakeholders', status: 'complete' as const },
      { id: '4', label: 'Timeline', status: 'complete' as const },
      { id: '5', label: 'Review', status: 'current' as const },
    ],
    orientation: 'horizontal',
  },
};

// Different step counts
export const ThreeSteps: Story = {
  args: {
    steps: [
      { id: '1', label: 'Start', status: 'complete' as const },
      { id: '2', label: 'Middle', status: 'current' as const },
      { id: '3', label: 'End', status: 'upcoming' as const },
    ],
    orientation: 'horizontal',
  },
};

export const EightSteps: Story = {
  args: {
    steps: [
      { id: '1', label: 'Step 1', status: 'complete' as const },
      { id: '2', label: 'Step 2', status: 'complete' as const },
      { id: '3', label: 'Step 3', status: 'complete' as const },
      { id: '4', label: 'Step 4', status: 'current' as const },
      { id: '5', label: 'Step 5', status: 'upcoming' as const },
      { id: '6', label: 'Step 6', status: 'upcoming' as const },
      { id: '7', label: 'Step 7', status: 'upcoming' as const },
      { id: '8', label: 'Step 8', status: 'upcoming' as const },
    ],
    orientation: 'horizontal',
  },
};

// In page context
export const InWizardPage = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Create Project Requirements
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Follow the steps below to generate comprehensive requirements documents
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <WizardProgress steps={detailedSteps} orientation="horizontal" />

          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Step 3: Identify Stakeholders</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Who are the key people involved in this project? This could include project sponsors,
              team members, and end users.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Vertical in sidebar
export const VerticalInSidebar = {
  render: () => (
    <div className="flex gap-6 min-h-[600px]">
      <div className="w-64 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Progress
        </h3>
        <WizardProgress steps={detailedSteps} orientation="vertical" />
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Main Content Area</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The vertical progress indicator works great in sidebars!
        </p>
      </div>
    </div>
  ),
};

// Comparison: Horizontal vs Vertical
export const OrientationComparison = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-lg font-semibold mb-4">Horizontal Orientation</h3>
        <div className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
          <WizardProgress steps={simpleSteps} orientation="horizontal" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Vertical Orientation</h3>
        <div className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
          <WizardProgress steps={simpleSteps} orientation="vertical" />
        </div>
      </div>
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    steps: detailedSteps,
    orientation: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The wizard progress includes proper contrast, semantic HTML, and clear visual indicators for each step state.',
      },
    },
  },
};

