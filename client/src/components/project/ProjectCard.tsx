import { Layers, Calendar, MoreVertical, Trash2, Archive } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { DropdownMenu, type DropdownMenuItem } from '../ui/DropdownMenu';
import { cn } from '@/lib/utils/cn';

type ProjectStatus = 'active' | 'completed' | 'archived';
type ProjectMode = 'plain' | 'technical' | 'unified';

export interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  mode: ProjectMode;
  status: ProjectStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  onView?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const ProjectCard = ({
  id,
  title,
  description,
  mode,
  status,
  progress,
  createdAt,
  updatedAt,
  onView,
  onArchive,
  onDelete,
  className,
}: ProjectCardProps) => {
  const statusConfig = {
    active: { variant: 'primary' as const, label: 'Active' },
    completed: { variant: 'success' as const, label: 'Completed' },
    archived: { variant: 'default' as const, label: 'Archived' },
  };

  const modeConfig = {
    plain: { label: 'Plain Mode', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    technical: { label: 'Technical Mode', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    unified: { label: 'Unified', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const menuItems: DropdownMenuItem[] = [];
  if (onArchive && status !== 'archived') {
    menuItems.push({
      label: 'Archive',
      onClick: () => onArchive(id),
      icon: <Archive className="h-4 w-4" />,
    });
  }
  if (onDelete) {
    menuItems.push({
      label: 'Delete',
      onClick: () => onDelete(id),
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'danger',
    });
  }

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700',
        onView && 'cursor-pointer',
        className
      )}
      onClick={() => onView?.(id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Layers className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex gap-2">
            <Badge variant={statusConfig[status].variant} size="sm">
              {statusConfig[status].label}
            </Badge>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', modeConfig[mode].color)}>
              {modeConfig[mode].label}
            </span>
          </div>
        </div>

        {/* Actions menu */}
        {menuItems.length > 0 && (
          <DropdownMenu
            trigger={
              <button
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Project actions"
                type="button"
              >
                <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            }
            items={menuItems}
            align="right"
          />
        )}
      </div>

      {/* Title and Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Progress
          </span>
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
            {progress}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Created {formatDate(createdAt)}</span>
        </div>
        <div>
          <span>Updated {formatDate(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

ProjectCard.displayName = 'ProjectCard';

export { ProjectCard };
