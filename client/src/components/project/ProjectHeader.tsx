import { Breadcrumb } from '../common/Breadcrumb';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Download, Trash2, MoreVertical } from 'lucide-react';

type ProjectMode = 'plain' | 'technical' | 'unified';
type ProjectStatus = 'active' | 'completed' | 'archived';

export interface ProjectHeaderProps {
  projectTitle: string;
  mode: ProjectMode;
  status: ProjectStatus;
  breadcrumbItems?: { label: string; href?: string }[];
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

const ProjectHeader = ({
  projectTitle,
  mode,
  status,
  breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: projectTitle },
  ],
  onDownload,
  onDelete,
  className,
}: ProjectHeaderProps) => {
  const modeConfig = {
    plain: {
      label: 'Plain Mode',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    technical: {
      label: 'Technical Mode',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    },
    unified: {
      label: 'Unified',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
  };

  const statusConfig = {
    active: { variant: 'primary' as const, label: 'Active' },
    completed: { variant: 'success' as const, label: 'Completed' },
    archived: { variant: 'default' as const, label: 'Archived' },
  };

  return (
    <div className={className}>
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {projectTitle}
            </h1>
            <Badge variant={statusConfig[status].variant} size="sm">
              {statusConfig[status].label}
            </Badge>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${modeConfig[mode].color}`}
            >
              {modeConfig[mode].label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              iconLeft={<Download className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              iconLeft={<Trash2 className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            aria-label="More actions"
            iconLeft={<MoreVertical className="h-4 w-4" />}
          >
            <span className="sr-only">More actions</span>
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 border-b border-gray-200 dark:border-gray-800" />
    </div>
  );
};

ProjectHeader.displayName = 'ProjectHeader';

export { ProjectHeader };

