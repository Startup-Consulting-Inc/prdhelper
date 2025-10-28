import type { Meta, StoryObj } from '@storybook/react';
import { ProgressOverview } from '@/components/project/ProgressOverview';

const meta = {
  title: 'Project/ProgressOverview',
  component: ProgressOverview,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

// Plain Mode Stories
export const PlainModeJustStarted: Story = {
  args: {
    mode: 'plain',
    brdStatus: 'in-progress',
    prdStatus: 'pending',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
  },
};

export const PlainModeBRDComplete: Story = {
  args: {
    mode: 'plain',
    brdStatus: 'complete',
    prdStatus: 'in-progress',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
  },
};

export const PlainModeAllComplete: Story = {
  args: {
    mode: 'plain',
    brdStatus: 'complete',
    prdStatus: 'complete',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
  },
};

// Technical Mode Stories
export const TechnicalModeJustStarted: Story = {
  args: {
    mode: 'technical',
    brdStatus: 'in-progress',
    prdStatus: 'pending',
    tasksStatus: 'locked',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
    onNavigateToTasks: () => console.log('Navigate to Tasks'),
  },
};

export const TechnicalModeBRDComplete: Story = {
  args: {
    mode: 'technical',
    brdStatus: 'complete',
    prdStatus: 'in-progress',
    tasksStatus: 'locked',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
    onNavigateToTasks: () => console.log('Navigate to Tasks'),
  },
};

export const TechnicalModePRDComplete: Story = {
  args: {
    mode: 'technical',
    brdStatus: 'complete',
    prdStatus: 'complete',
    tasksStatus: 'in-progress',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
    onNavigateToTasks: () => console.log('Navigate to Tasks'),
  },
};

export const TechnicalModeAllComplete: Story = {
  args: {
    mode: 'technical',
    brdStatus: 'complete',
    prdStatus: 'complete',
    tasksStatus: 'complete',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
    onNavigateToTasks: () => console.log('Navigate to Tasks'),
  },
};

// Interactive plain mode workflow
export const PlainModeWorkflow = {
  render: () => {
    return (
      <div>
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Plain Mode Workflow
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            1. Complete Business Requirements Document (BRD)
            <br />
            2. Then generate Product Requirements Document (PRD)
            <br />
            Click on in-progress or completed documents to view them.
          </p>
        </div>
        <ProgressOverview
          mode="plain"
          brdStatus="complete"
          prdStatus="in-progress"
          onNavigateToBRD={() => alert('Opening BRD...')}
          onNavigateToPRD={() => alert('Opening PRD...')}
        />
      </div>
    );
  },
};

// Interactive technical mode workflow
export const TechnicalModeWorkflow = {
  render: () => {
    return (
      <div>
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
            Technical Mode Workflow
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            1. Complete Business Requirements Document (BRD)
            <br />
            2. Generate Product Requirements Document (PRD)
            <br />
            3. Finally, get Technical Task Lists
            <br />
            Documents unlock sequentially.
          </p>
        </div>
        <ProgressOverview
          mode="technical"
          brdStatus="complete"
          prdStatus="complete"
          tasksStatus="in-progress"
          onNavigateToBRD={() => alert('Opening BRD...')}
          onNavigateToPRD={() => alert('Opening PRD...')}
          onNavigateToTasks={() => alert('Opening Task List...')}
        />
      </div>
    );
  },
};

// Locked state explanation
export const LockedStateDemo = {
  render: () => {
    return (
      <div>
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Locked Documents
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Documents are locked until previous steps are completed. This ensures a logical
            workflow and maintains document quality.
          </p>
        </div>
        <ProgressOverview
          mode="technical"
          brdStatus="in-progress"
          prdStatus="pending"
          tasksStatus="locked"
          onNavigateToBRD={() => alert('BRD is in progress')}
        />
      </div>
    );
  },
};

// Comparison: Plain vs Technical
export const PlainVsTechnical = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Plain Mode</h3>
        <ProgressOverview
          mode="plain"
          brdStatus="complete"
          prdStatus="complete"
          onNavigateToBRD={() => console.log('BRD')}
          onNavigateToPRD={() => console.log('PRD')}
        />
      </div>
      <div className="border-t pt-8 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Technical Mode</h3>
        <ProgressOverview
          mode="technical"
          brdStatus="complete"
          prdStatus="complete"
          tasksStatus="complete"
          onNavigateToBRD={() => console.log('BRD')}
          onNavigateToPRD={() => console.log('PRD')}
          onNavigateToTasks={() => console.log('Tasks')}
        />
      </div>
    </div>
  ),
};

// In page context
export const InProjectPage = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            E-Commerce Platform Redesign
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Technical Mode • Active
          </p>
        </div>
        <ProgressOverview
          mode="technical"
          brdStatus="complete"
          prdStatus="in-progress"
          tasksStatus="locked"
          onNavigateToBRD={() => alert('View BRD')}
          onNavigateToPRD={() => alert('View PRD')}
          onNavigateToTasks={() => alert('Tasks locked')}
        />
      </div>
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    mode: 'technical',
    brdStatus: 'complete',
    prdStatus: 'in-progress',
    tasksStatus: 'locked',
    onNavigateToBRD: () => console.log('Navigate to BRD'),
    onNavigateToPRD: () => console.log('Navigate to PRD'),
    onNavigateToTasks: () => console.log('Navigate to Tasks'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The progress overview includes keyboard navigation, ARIA labels, and clear status indicators for accessibility.',
      },
    },
  },
};

