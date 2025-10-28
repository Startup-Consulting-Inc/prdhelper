import type { Meta, StoryObj } from '@storybook/react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';

const meta = {
  title: 'Dashboard/DashboardStats',
  component: DashboardStats,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalProjects: 24,
    activeProjects: 8,
    completedDocuments: 156,
    completionRate: 87,
    projectsChange: 12,
    documentsChange: 23,
  },
};

export const NewUser: Story = {
  args: {
    totalProjects: 1,
    activeProjects: 1,
    completedDocuments: 3,
    completionRate: 100,
  },
};

export const LargeNumbers: Story = {
  args: {
    totalProjects: 1247,
    activeProjects: 342,
    completedDocuments: 8956,
    completionRate: 94,
    projectsChange: 156,
    documentsChange: 489,
  },
};

export const Declining: Story = {
  args: {
    totalProjects: 18,
    activeProjects: 5,
    completedDocuments: 92,
    completionRate: 72,
    projectsChange: -5,
    documentsChange: -12,
  },
};

export const InDashboard = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's an overview of your projects.
          </p>
        </div>
        
        <DashboardStats
          totalProjects={24}
          activeProjects={8}
          completedDocuments={156}
          completionRate={87}
          projectsChange={12}
          documentsChange={23}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
            <p className="text-gray-600 dark:text-gray-400">Project list would appear here...</p>
          </div>
          <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-600 dark:text-gray-400">Activity feed would appear here...</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  args: {
    totalProjects: 24,
    activeProjects: 8,
    completedDocuments: 156,
    completionRate: 87,
    projectsChange: 12,
    documentsChange: 23,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard stats include clear labels, visual indicators, and accessible color contrasts.',
      },
    },
  },
};

