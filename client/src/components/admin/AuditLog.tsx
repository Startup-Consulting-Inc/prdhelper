import { User, FileText, Settings, Trash2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ActionType = 'create' | 'update' | 'delete' | 'view';

export interface AuditEntry {
  id: string;
  action: ActionType;
  resource: string;
  resourceId: string;
  user: string;
  timestamp: Date;
  details?: string;
}

export interface AuditLogProps {
  entries: AuditEntry[];
  maxEntries?: number;
  className?: string;
}

const AuditLog = ({
  entries,
  maxEntries = 50,
  className,
}: AuditLogProps) => {
  const actionConfig = {
    create: { label: 'Created', color: 'text-green-600 dark:text-green-400' },
    update: { label: 'Updated', color: 'text-blue-600 dark:text-blue-400' },
    delete: { label: 'Deleted', color: 'text-red-600 dark:text-red-400' },
    view: { label: 'Viewed', color: 'text-gray-600 dark:text-gray-400' },
  };

  const displayedEntries = entries.slice(0, maxEntries);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800', className)}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Audit Log</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Showing {displayedEntries.length} of {entries.length} entries
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {displayedEntries.map((entry) => {
            const config = actionConfig[entry.action];
            
            return (
              <div key={entry.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-medium">{entry.user}</span>
                    {' '}
                    <span className={cn('font-medium', config.color)}>{config.label}</span>
                    {' '}
                    <span className="text-gray-600 dark:text-gray-400">{entry.resource}</span>
                  </p>
                  {entry.details && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {entry.details}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(entry.timestamp)}
                    </span>
                    <span>ID: {entry.resourceId.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

AuditLog.displayName = 'AuditLog';

export { AuditLog };

