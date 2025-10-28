import { Stepper } from '../common/Stepper';
import { Badge } from '../ui/Badge';
import { FileText, Layers, ListChecks, CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type DocumentStatus = 'complete' | 'in-progress' | 'pending' | 'locked';
type ProjectMode = 'plain' | 'technical';

export interface ProgressOverviewProps {
  mode: ProjectMode;
  brdStatus: DocumentStatus;
  prdStatus: DocumentStatus;
  tasksStatus?: DocumentStatus; // Only for technical mode
  onNavigateToBRD?: () => void;
  onNavigateToPRD?: () => void;
  onNavigateToTasks?: () => void;
  className?: string;
}

const ProgressOverview = ({
  mode,
  brdStatus,
  prdStatus,
  tasksStatus,
  onNavigateToBRD,
  onNavigateToPRD,
  onNavigateToTasks,
  className,
}: ProgressOverviewProps) => {
  const getStepStatus = (status: DocumentStatus): 'complete' | 'current' | 'upcoming' => {
    if (status === 'complete') return 'complete';
    if (status === 'in-progress') return 'current';
    return 'upcoming';
  };

  // Build steps for stepper
  const steps = [
    {
      label: 'BRD',
      status: getStepStatus(brdStatus),
    },
    {
      label: 'PRD',
      status: getStepStatus(prdStatus),
    },
  ];

  if (mode === 'technical' && tasksStatus) {
    steps.push({
      label: 'Tasks',
      status: getStepStatus(tasksStatus),
    });
  }

  const statusConfig = {
    complete: {
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      label: 'Completed',
      badgeVariant: 'success' as const,
    },
    'in-progress': {
      icon: FileText,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
      label: 'In Progress',
      badgeVariant: 'primary' as const,
    },
    pending: {
      icon: FileText,
      color: 'text-gray-400 dark:text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      label: 'Pending',
      badgeVariant: 'default' as const,
    },
    locked: {
      icon: Lock,
      color: 'text-gray-400 dark:text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      label: 'Locked',
      badgeVariant: 'default' as const,
    },
  };

  const DocumentCard = ({
    title,
    description,
    status,
    icon: Icon,
    onClick,
  }: {
    title: string;
    description: string;
    status: DocumentStatus;
    icon: typeof FileText;
    onClick?: () => void;
  }) => {
    const config = statusConfig[status];
    const isClickable = onClick && (status === 'complete' || status === 'in-progress');

    return (
      <div
        onClick={isClickable ? onClick : undefined}
        className={cn(
          'p-6 rounded-lg border transition-all',
          isClickable && 'cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700',
          status === 'locked' && 'opacity-60',
          'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950'
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-lg', config.bgColor)}>
            <Icon className={cn('h-6 w-6', config.color)} />
          </div>
          <Badge variant={config.badgeVariant} size="sm">
            {config.label}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>

        {status === 'locked' && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Complete previous document to unlock
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Progress Overview
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your document generation progress
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <Stepper steps={steps} />
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DocumentCard
          title="Business Requirements Document"
          description="Define business goals, stakeholders, and high-level requirements"
          status={brdStatus}
          icon={FileText}
          onClick={onNavigateToBRD}
        />
        <DocumentCard
          title="Product Requirements Document"
          description="Detailed product specifications, features, and user stories"
          status={prdStatus}
          icon={Layers}
          onClick={onNavigateToPRD}
        />
        {mode === 'technical' && tasksStatus && (
          <DocumentCard
            title="Technical Task List"
            description="Development tasks with priorities, effort estimates, and dependencies"
            status={tasksStatus}
            icon={ListChecks}
            onClick={onNavigateToTasks}
          />
        )}
      </div>

      {/* Mode indicator */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Mode:</strong>{' '}
          {mode === 'technical' ? (
            <>
              <span className="text-purple-600 dark:text-purple-400">Technical Mode</span> - Includes
              BRD, PRD, and detailed task lists
            </>
          ) : (
            <>
              <span className="text-blue-600 dark:text-blue-400">Plain Mode</span> - Includes BRD and
              PRD only
            </>
          )}
        </p>
      </div>
    </div>
  );
};

ProgressOverview.displayName = 'ProgressOverview';

export { ProgressOverview };

