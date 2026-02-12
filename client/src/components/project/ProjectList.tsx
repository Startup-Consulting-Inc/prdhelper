import { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../common/EmptyState';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Layers, Search, Plus } from 'lucide-react';

type ProjectStatus = 'active' | 'completed' | 'archived';
type ProjectMode = 'plain' | 'technical' | 'unified';
type SortOption = 'newest' | 'oldest' | 'name' | 'progress';

export interface Project {
  id: string;
  title: string;
  description?: string;
  mode: ProjectMode;
  status: ProjectStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectListProps {
  projects: Project[];
  onCreateProject?: () => void;
  onViewProject?: (id: string) => void;
  onEditProject?: (id: string, currentTitle: string) => void;
  onArchiveProject?: (id: string) => void;
  onDeleteProject?: (id: string) => void;
  onDuplicateProject?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

const ProjectList = ({
  projects,
  onCreateProject,
  onViewProject,
  onEditProject,
  onArchiveProject,
  onDeleteProject,
  onDuplicateProject,
  isLoading = false,
  className,
}: ProjectListProps) => {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    // Status filter
    if (statusFilter !== 'all' && project.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      case 'progress':
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'progress', label: 'Progress' },
  ];

  if (isLoading) {
    return (
      <div className={className}>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-full sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              aria-label="Filter by status"
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Project Grid or Empty State */}
      {sortedProjects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={
            searchQuery || statusFilter !== 'all'
              ? 'No projects found'
              : 'No projects yet'
          }
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Get started by creating your first project. Our AI will guide you through generating comprehensive requirements documents.'
          }
          action={
            onCreateProject && !searchQuery && statusFilter === 'all'
              ? {
                  label: 'Create Project',
                  onClick: onCreateProject,
                  iconLeft: <Plus className="h-4 w-4" />,
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onView={onViewProject}
              onEdit={onEditProject}
              onArchive={onArchiveProject}
              onDelete={onDeleteProject}
              onDuplicate={onDuplicateProject}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {sortedProjects.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedProjects.length} of {projects.length} project
          {projects.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

ProjectList.displayName = 'ProjectList';

export { ProjectList };

