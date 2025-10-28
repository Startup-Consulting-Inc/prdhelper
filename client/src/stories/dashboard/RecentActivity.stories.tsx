import type { Meta, StoryObj } from '@storybook/react';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

const meta = {
  title: 'Dashboard/RecentActivity',
  component: RecentActivity,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecentActivity>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockActivities = [
  {
    id: '1',
    type: 'created' as const,
    title: 'Created new project',
    description: 'E-Commerce Platform Redesign',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    projectName: 'E-Commerce Platform',
  },
  {
    id: '2',
    type: 'completed' as const,
    title: 'Document generated',
    description: 'Business Requirements Document completed',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    projectName: 'Mobile App MVP',
  },
  {
    id: '3',
    type: 'updated' as const,
    title: 'Project updated',
    description: 'Modified stakeholder information',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    projectName: 'API Documentation',
  },
  {
    id: '4',
    type: 'completed' as const,
    title: 'Document approved',
    description: 'Product Requirements Document approved',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    projectName: 'Customer Portal',
  },
  {
    id: '5',
    type: 'created' as const,
    title: 'Started wizard',
    description: 'Began requirements gathering for new project',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    projectName: 'Analytics Dashboard',
  },
];

export const WithActivities: Story = {
  args: {
    activities: mockActivities,
    onViewAll: () => console.log('View all clicked'),
  },
};

export const Empty: Story = {
  args: {
    activities: [],
  },
};

export const Limited: Story = {
  args: {
    activities: mockActivities,
    maxItems: 3,
    onViewAll: () => console.log('View all clicked'),
  },
};

export const NoViewAll: Story = {
  args: {
    activities: mockActivities.slice(0, 3),
  },
};

export const Interactive = {
  render: () => (
    <div className="max-w-2xl">
      <RecentActivity
        activities={mockActivities}
        maxItems={5}
        onViewAll={() => alert('Navigate to full activity page')}
      />
    </div>
  ),
};

export const InDashboard = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity
              activities={mockActivities}
              onViewAll={() => alert('View all')}
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quick action buttons would be here...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AllActivityTypes = {
  render: () => (
    <div className="max-w-2xl">
      <RecentActivity
        activities={[
          {
            id: '1',
            type: 'created',
            title: 'Created Activity',
            description: 'New project created',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
          },
          {
            id: '2',
            type: 'updated',
            title: 'Updated Activity',
            description: 'Project details modified',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
          },
          {
            id: '3',
            type: 'completed',
            title: 'Completed Activity',
            description: 'Document generation finished',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            id: '4',
            type: 'deleted',
            title: 'Deleted Activity',
            description: 'Old project archived',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
          },
        ]}
      />
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  args: {
    activities: mockActivities,
    onViewAll: () => console.log('View all'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Activity feed includes semantic HTML, clear time indicators, and accessible color contrasts.',
      },
    },
  },
};

