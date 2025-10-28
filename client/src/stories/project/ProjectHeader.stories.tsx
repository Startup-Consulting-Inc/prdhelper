import type { Meta, StoryObj } from '@storybook/react';
import { ProjectHeader } from '@/components/project/ProjectHeader';

const meta = {
  title: 'Project/ProjectHeader',
  component: ProjectHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlainModeActive: Story = {
  args: {
    projectTitle: 'E-Commerce Platform Redesign',
    mode: 'plain',
    status: 'active',
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
};

export const TechnicalModeActive: Story = {
  args: {
    projectTitle: 'Mobile App MVP',
    mode: 'technical',
    status: 'active',
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
};

export const Completed: Story = {
  args: {
    projectTitle: 'API Documentation Update',
    mode: 'technical',
    status: 'completed',
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
};

export const Archived: Story = {
  args: {
    projectTitle: 'Legacy System Migration',
    mode: 'plain',
    status: 'archived',
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
};

export const LongTitle: Story = {
  args: {
    projectTitle: 'Enterprise Resource Planning System Implementation with Advanced Features',
    mode: 'technical',
    status: 'active',
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
};

export const WithoutActions: Story = {
  args: {
    projectTitle: 'Customer Portal Enhancement',
    mode: 'plain',
    status: 'active',
  },
};

export const CustomBreadcrumb: Story = {
  args: {
    projectTitle: 'Analytics Dashboard',
    mode: 'technical',
    status: 'active',
    breadcrumbItems: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'My Projects', href: '/projects' },
      { label: 'Internal Tools', href: '/projects?category=internal' },
      { label: 'Analytics Dashboard' },
    ],
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
};

// Interactive demo
export const Interactive = {
  render: () => {
    const handleDownload = () => alert('Downloading project documents...');
    const handleDelete = () => {
      if (confirm('Are you sure you want to delete this project?')) {
        alert('Project deleted!');
      }
    };

    return (
      <div>
        <ProjectHeader
          projectTitle="Interactive Project Demo"
          mode="technical"
          status="active"
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Try it:</strong> Click the Download or Delete buttons to see interactions.
          </p>
        </div>
      </div>
    );
  },
};

// With full page context
export const InPageContext = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <ProjectHeader
          projectTitle="E-Commerce Platform Redesign"
          mode="technical"
          status="active"
          onDownload={() => console.log('Download')}
          onDelete={() => console.log('Delete')}
        />
        <div className="mt-6 grid gap-6">
          <div className="p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This section would contain project details, progress overview, and documents.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Timeline of project updates and document generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Mobile view
export const MobileView: Story = {
  args: {
    projectTitle: 'Mobile App MVP',
    mode: 'plain',
    status: 'active',
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    projectTitle: 'Accessible Project Header',
    mode: 'technical',
    status: 'active',
    onDownload: () => console.log('Download'),
    onDelete: () => console.log('Delete'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The project header includes proper ARIA labels, keyboard navigation, and semantic HTML for screen readers.',
      },
    },
  },
};

