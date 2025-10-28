import { FileText, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ActivityType = 'created' | 'updated' | 'completed' | 'deleted';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  projectName?: string;
}

export interface RecentActivityProps {
  activities: Activity[];
  maxItems?: number;
  onViewAll?: () => void;
  className?: string;
}

const RecentActivity = ({
  activities,
  maxItems = 10,
  onViewAll,
  className,
}: RecentActivityProps) => {
  const activityConfig = {
    created: {
      icon: Plus,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    updated: {
      icon: Edit,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    completed: {
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    deleted: {
      icon: Trash2,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className={cn('bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800', className)}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', config.bgColor)}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {activity.description}
                    </p>
                    {activity.projectName && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Project: {activity.projectName}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activities.length > maxItems && onViewAll && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onViewAll}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all activity →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

RecentActivity.displayName = 'RecentActivity';

export { RecentActivity };

