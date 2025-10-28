import type { Meta, StoryObj } from '@storybook/react';
import { ProjectList } from '@/components/project/ProjectList';

const meta = {
  title: 'Project/ProjectList',
  component: ProjectList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectList>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

const mockProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    description: 'Modernize the e-commerce platform with improved UX',
    mode: 'technical' as const,
    status: 'active' as const,
    progress: 65,
    createdAt: lastWeek,
    updatedAt: yesterday,
  },
  {
    id: '2',
    title: 'Mobile App MVP',
    description: 'Launch minimum viable product for iOS and Android',
    mode: 'plain' as const,
    status: 'active' as const,
    progress: 40,
    createdAt: lastMonth,
    updatedAt: lastWeek,
  },
  {
    id: '3',
    title: 'API Documentation Update',
    description: 'Update all API documentation with latest changes',
    mode: 'technical' as const,
    status: 'completed' as const,
    progress: 100,
    createdAt: lastMonth,
    updatedAt: lastWeek,
  },
  {
    id: '4',
    title: 'Customer Portal Enhancement',
    description: 'Add new features to customer self-service portal',
    mode: 'plain' as const,
    status: 'active' as const,
    progress: 25,
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: '5',
    title: 'Legacy System Migration',
    description: 'Migrate from monolith to microservices',
    mode: 'technical' as const,
    status: 'archived' as const,
    progress: 75,
    createdAt: lastMonth,
    updatedAt: lastMonth,
  },
  {
    id: '6',
    title: 'Analytics Dashboard',
    description: 'Build real-time analytics dashboard',
    mode: 'technical' as const,
    status: 'active' as const,
    progress: 50,
    createdAt: lastWeek,
    updatedAt: now,
  },
];

export const Default: Story = {
  args: {
    projects: mockProjects,
    onCreateProject: () => console.log('Create project'),
    onViewProject: (id) => console.log('View project:', id),
    onArchiveProject: (id) => console.log('Archive project:', id),
    onDeleteProject: (id) => console.log('Delete project:', id),
  },
};

export const EmptyState: Story = {
  args: {
    projects: [],
    onCreateProject: () => console.log('Create project'),
  },
};

export const Loading: Story = {
  args: {
    projects: [],
    isLoading: true,
  },
};

export const FewProjects: Story = {
  args: {
    projects: mockProjects.slice(0, 2),
    onCreateProject: () => console.log('Create project'),
    onViewProject: (id) => console.log('View project:', id),
    onArchiveProject: (id) => console.log('Archive project:', id),
    onDeleteProject: (id) => console.log('Delete project:', id),
  },
};

export const ManyProjects: Story = {
  args: {
    projects: [
      ...mockProjects,
      ...mockProjects.map((p, i) => ({
        ...p,
        id: `${p.id}-dup-${i}`,
        title: `${p.title} (Copy ${i + 1})`,
      })),
    ],
    onViewProject: (id) => console.log('View project:', id),
    onArchiveProject: (id) => console.log('Archive project:', id),
    onDeleteProject: (id) => console.log('Delete project:', id),
  },
};

// Interactive demo with search and filters
export const Interactive = {
  render: () => (
    <div>
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Try it out:</strong>
          <br />
          • Search for "mobile" or "api"
          <br />
          • Filter by status (Active, Completed, Archived)
          <br />• Sort by newest, oldest, name, or progress
        </p>
      </div>
      <ProjectList
        projects={mockProjects}
        onCreateProject={() => alert('Create new project')}
        onViewProject={(id) => alert(`View project: ${id}`)}
        onArchiveProject={(id) => alert(`Archive project: ${id}`)}
        onDeleteProject={(id) => {
          if (confirm('Delete this project?')) {
            alert(`Deleted project: ${id}`);
          }
        }}
      />
    </div>
  ),
};

// Active projects only
export const ActiveProjects = {
  render: () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Active Projects</h2>
      <ProjectList
        projects={mockProjects.filter((p) => p.status === 'active')}
        onViewProject={(id) => console.log('View:', id)}
      />
    </div>
  ),
};

// Completed projects
export const CompletedProjects = {
  render: () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Completed Projects</h2>
      <ProjectList
        projects={mockProjects.filter((p) => p.status === 'completed')}
        onViewProject={(id) => console.log('View:', id)}
      />
    </div>
  ),
};

// New user experience
export const NewUserExperience = {
  render: () => (
    <div>
      <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
        <p className="text-sm text-green-700 dark:text-green-300">
          <strong>Welcome to PRD Helper! 🎉</strong>
          <br />
          This is what new users see. The empty state encourages creating the first project.
        </p>
      </div>
      <ProjectList
        projects={[]}
        onCreateProject={() => alert('Let\'s create your first project!')}
      />
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    projects: mockProjects,
    onViewProject: (id) => console.log('View project:', id),
    onArchiveProject: (id) => console.log('Archive project:', id),
    onDeleteProject: (id) => console.log('Delete project:', id),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The project list includes accessible search, filters, and keyboard navigation for all project cards.',
      },
    },
  },
};

