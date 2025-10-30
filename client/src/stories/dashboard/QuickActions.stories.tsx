import type { Meta, StoryObj } from '@storybook/react';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Plus, FileText, Users, Download } from 'lucide-react';

const meta = {
  title: 'Dashboard/QuickActions',
  component: QuickActions,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuickActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllActions: Story = {
  args: {
    onCreateProject: () => console.log('Create project'),
    onViewDocuments: () => console.log('View documents'),
    onSettings: () => console.log('Settings'),
    onHelp: () => console.log('Help'),
  },
};

export const LimitedActions: Story = {
  args: {
    onCreateProject: () => console.log('Create project'),
    onHelp: () => console.log('Help'),
  },
};

export const CustomActions: Story = {
  args: {
    customActions: [
      {
        id: 'create',
        label: 'New Project',
        description: 'Create a new project from scratch',
        icon: Plus,
        onClick: () => console.log('New project'),
        variant: 'primary',
      },
      {
        id: 'import',
        label: 'Import Project',
        description: 'Import existing requirements',
        icon: Download,
        onClick: () => console.log('Import'),
        variant: 'outline',
      },
      {
        id: 'team',
        label: 'Invite Team',
        description: 'Collaborate with your team',
        icon: Users,
        onClick: () => console.log('Invite team'),
        variant: 'outline',
      },
    ],
  },
};

export const Interactive = {
  render: () => {
    const handleCreateProject = () => alert('Opening project creation wizard...');
    const handleViewDocuments = () => alert('Navigating to documents page...');
    const handleSettings = () => alert('Opening settings...');
    const handleHelp = () => alert('Opening help documentation...');

    return (
      <div className="max-w-md">
        <QuickActions
          onCreateProject={handleCreateProject}
          onViewDocuments={handleViewDocuments}
          onSettings={handleSettings}
          onHelp={handleHelp}
        />
      </div>
    );
  },
};

export const InDashboard = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
              <p className="text-gray-600 dark:text-gray-400">Project list would be here...</p>
            </div>
          </div>
          
          <div>
            <QuickActions
              onCreateProject={() => alert('Create')}
              onViewDocuments={() => alert('Documents')}
              onSettings={() => alert('Settings')}
              onHelp={() => alert('Help')}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const NewUserOnboarding = {
  render: () => (
    <div className="max-w-md">
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Welcome! 👋</strong>
          <br />
          Get started by creating your first project or exploring the help documentation.
        </p>
      </div>
      <QuickActions
        onCreateProject={() => alert('Start your first project!')}
        onHelp={() => alert('Learn how to use Clearly')}
      />
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  args: {
    onCreateProject: () => console.log('Create project'),
    onViewDocuments: () => console.log('View documents'),
    onSettings: () => console.log('Settings'),
    onHelp: () => console.log('Help'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick actions include keyboard navigation, clear labels, and accessible focus states.',
      },
    },
  },
};

