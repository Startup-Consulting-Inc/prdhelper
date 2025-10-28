import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from '@/components/project/ProjectCard';

const meta = {
  title: 'Project/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

export const Active: Story = {
  args: {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    description: 'Modernize the e-commerce platform with improved UX and mobile-first design',
    mode: 'technical',
    status: 'active',
    progress: 45,
    createdAt: lastWeek,
    updatedAt: yesterday,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
};

export const Completed: Story = {
  args: {
    id: '2',
    title: 'Mobile App MVP',
    description: 'Launch minimum viable product for iOS and Android platforms',
    mode: 'plain',
    status: 'completed',
    progress: 100,
    createdAt: lastMonth,
    updatedAt: lastWeek,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
};

export const Archived: Story = {
  args: {
    id: '3',
    title: 'Legacy System Migration',
    description: 'Migrate from old monolith to microservices architecture',
    mode: 'technical',
    status: 'archived',
    progress: 75,
    createdAt: lastMonth,
    updatedAt: lastMonth,
    onView: (id) => console.log('View project:', id),
  },
};

export const RecentlyCreated: Story = {
  args: {
    id: '4',
    title: 'Customer Portal Enhancement',
    description: 'Add new features to the customer self-service portal',
    mode: 'plain',
    status: 'active',
    progress: 10,
    createdAt: now,
    updatedAt: now,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
};

export const LongTitle: Story = {
  args: {
    id: '5',
    title: 'Enterprise Resource Planning System Implementation with Advanced Features and Integrations',
    description: 'A comprehensive ERP solution that integrates with existing systems, provides real-time analytics, and supports multi-tenancy with advanced security features',
    mode: 'technical',
    status: 'active',
    progress: 60,
    createdAt: lastWeek,
    updatedAt: yesterday,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
};

export const NoDescription: Story = {
  args: {
    id: '6',
    title: 'Quick Project Setup',
    mode: 'plain',
    status: 'active',
    progress: 25,
    createdAt: yesterday,
    updatedAt: yesterday,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
};

export const JustStarted: Story = {
  args: {
    id: '7',
    title: 'New Product Launch',
    description: 'Plan and execute the launch of our new product line',
    mode: 'plain',
    status: 'active',
    progress: 5,
    createdAt: now,
    updatedAt: now,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
};

export const NearCompletion: Story = {
  args: {
    id: '8',
    title: 'API Documentation Update',
    description: 'Update all API documentation with latest changes and examples',
    mode: 'technical',
    status: 'active',
    progress: 95,
    createdAt: lastWeek,
    updatedAt: now,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
};

// Dashboard view with multiple cards
export const DashboardGrid = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard
        id="1"
        title="E-Commerce Platform"
        description="Redesign the checkout flow"
        mode="technical"
        status="active"
        progress={65}
        createdAt={lastWeek}
        updatedAt={yesterday}
        onView={(id) => console.log('View:', id)}
        onArchive={(id) => console.log('Archive:', id)}
        onDelete={(id) => console.log('Delete:', id)}
      />
      <ProjectCard
        id="2"
        title="Mobile App MVP"
        description="Launch on iOS and Android"
        mode="plain"
        status="active"
        progress={40}
        createdAt={lastMonth}
        updatedAt={lastWeek}
        onView={(id) => console.log('View:', id)}
        onArchive={(id) => console.log('Archive:', id)}
        onDelete={(id) => console.log('Delete:', id)}
      />
      <ProjectCard
        id="3"
        title="API Documentation"
        mode="technical"
        status="completed"
        progress={100}
        createdAt={lastMonth}
        updatedAt={lastWeek}
        onView={(id) => console.log('View:', id)}
        onArchive={(id) => console.log('Archive:', id)}
      />
    </div>
  ),
};

// Interactive demo
export const Interactive = {
  render: () => {
    const handleView = (id: string) => alert(`Opening project: ${id}`);
    const handleArchive = (id: string) => {
      if (confirm('Archive this project?')) {
        alert(`Project ${id} archived`);
      }
    };
    const handleDelete = (id: string) => {
      if (confirm('Delete this project? This action cannot be undone.')) {
        alert(`Project ${id} deleted`);
      }
    };

    return (
      <div className="max-w-md">
        <ProjectCard
          id="demo"
          title="Interactive Demo Project"
          description="Click to view, hover for actions"
          mode="plain"
          status="active"
          progress={50}
          createdAt={lastWeek}
          updatedAt={yesterday}
          onView={handleView}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      </div>
    );
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    id: 'a11y',
    title: 'Accessible Project Card',
    description: 'Fully keyboard navigable with proper ARIA labels',
    mode: 'technical',
    status: 'active',
    progress: 70,
    createdAt: lastWeek,
    updatedAt: yesterday,
    onView: (id) => console.log('View project:', id),
    onArchive: (id) => console.log('Archive project:', id),
    onDelete: (id) => console.log('Delete project:', id),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Project cards are fully accessible with keyboard navigation, screen reader support, and proper focus management.',
      },
    },
  },
};

