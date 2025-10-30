import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@/components/common/EmptyState';
import {
  FileText,
  Layers,
  Search,
  Inbox,
  Users,
  AlertCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';

const meta = {
  title: 'Common/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'Get started by creating your first item.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: FileText,
    title: 'No documents yet',
    description: 'Create your first document to get started with your project.',
  },
};

export const WithAction: Story = {
  args: {
    icon: Layers,
    title: 'No projects yet',
    description:
      'Start your first project to generate requirements documents and task lists.',
    action: {
      label: 'Create Project',
      onClick: () => console.log('Create project clicked'),
      iconLeft: <Plus className="h-4 w-4" />,
    },
  },
};

export const WithSecondaryAction: Story = {
  args: {
    icon: Layers,
    title: 'No projects found',
    description:
      'Start a new project or import an existing one to get started.',
    action: {
      label: 'Create New Project',
      onClick: () => console.log('Create clicked'),
      iconLeft: <Plus className="h-4 w-4" />,
    },
    secondaryAction: {
      label: 'Import Project',
      onClick: () => console.log('Import clicked'),
    },
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: Search,
    title: 'No results found',
    description:
      'Try adjusting your search or filters to find what you\'re looking for.',
    action: {
      label: 'Clear Filters',
      onClick: () => console.log('Clear filters clicked'),
      variant: 'secondary',
    },
  },
};

export const NoNotifications: Story = {
  args: {
    icon: Inbox,
    title: 'No notifications',
    description: 'You\'re all caught up! Check back later for new updates.',
  },
};

export const NoTeamMembers: Story = {
  args: {
    icon: Users,
    title: 'No team members yet',
    description:
      'Invite team members to collaborate on projects and documents.',
    action: {
      label: 'Invite Team Members',
      onClick: () => console.log('Invite clicked'),
    },
  },
};

export const ErrorState: Story = {
  args: {
    icon: AlertCircle,
    title: 'Unable to load data',
    description:
      'We encountered an error while loading your data. Please try again.',
    action: {
      label: 'Retry',
      onClick: () => console.log('Retry clicked'),
      iconLeft: <RefreshCw className="h-4 w-4" />,
      variant: 'primary',
    },
    secondaryAction: {
      label: 'Contact Support',
      onClick: () => console.log('Contact support clicked'),
    },
  },
};

// Use Cases
export const EmptyProjectList = {
  render: () => (
    <div className="border rounded-lg p-8 bg-white dark:bg-gray-950">
      <EmptyState
        icon={Layers}
        title="No projects yet"
        description="Create your first project to generate BRD, PRD, and task lists powered by AI."
        action={{
          label: 'Create Your First Project',
          onClick: () => console.log('Create project'),
          iconLeft: <Plus className="h-4 w-4" />,
        }}
      />
    </div>
  ),
};

export const EmptyDocumentList = {
  render: () => (
    <div className="border rounded-lg p-8 bg-white dark:bg-gray-950">
      <EmptyState
        icon={FileText}
        title="No documents generated yet"
        description="Documents will appear here once they are generated from your project conversations."
        action={{
          label: 'Start Conversation',
          onClick: () => console.log('Start conversation'),
        }}
      />
    </div>
  ),
};

export const EmptySearchResults = {
  render: () => (
    <div className="border rounded-lg p-8 bg-white dark:bg-gray-950">
      <EmptyState
        icon={Search}
        title='No results for "react components"'
        description="Try searching with different keywords or check your spelling."
        action={{
          label: 'Clear Search',
          onClick: () => console.log('Clear search'),
          variant: 'secondary',
        }}
      />
    </div>
  ),
};

export const LoadingError = {
  render: () => (
    <div className="border rounded-lg p-8 bg-white dark:bg-gray-950">
      <EmptyState
        icon={AlertCircle}
        title="Failed to load projects"
        description="We couldn't retrieve your projects. This might be a temporary issue."
        action={{
          label: 'Try Again',
          onClick: () => console.log('Retry'),
          iconLeft: <RefreshCw className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: 'Go to Dashboard',
          onClick: () => console.log('Dashboard'),
        }}
      />
    </div>
  ),
};

export const OnboardingEmpty = {
  render: () => (
    <div className="min-h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
      <EmptyState
        icon={Layers}
        title="Welcome to Clearly"
        description="Let's create your first project. Our AI will help you generate comprehensive requirements documents in minutes."
        action={{
          label: 'Get Started',
          onClick: () => console.log('Get started'),
          iconLeft: <Plus className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: 'Learn More',
          onClick: () => console.log('Learn more'),
        }}
      />
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    icon: FileText,
    title: 'Accessible Empty State',
    description: 'This component uses semantic HTML and clear text for screen readers.',
    action: {
      label: 'Take Action',
      onClick: () => console.log('Action clicked'),
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'EmptyState provides clear context and actionable buttons for all users.',
      },
    },
  },
};

