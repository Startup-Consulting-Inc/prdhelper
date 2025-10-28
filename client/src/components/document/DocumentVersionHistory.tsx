import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RotateCcw, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface Version {
  id: string;
  version: string;
  description: string;
  author: string;
  timestamp: Date;
  isCurrent: boolean;
}

export interface DocumentVersionHistoryProps {
  versions: Version[];
  onRestore?: (versionId: string) => void;
  onViewVersion?: (versionId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const DocumentVersionHistory = ({
  versions,
  onRestore,
  onViewVersion,
  isLoading = false,
  className,
}: DocumentVersionHistoryProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {versions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No version history available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={cn(
                'p-4 rounded-lg border transition-all',
                version.isCurrent
                  ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800'
                  : 'bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Version {version.version}
                    </span>
                    {version.isCurrent && (
                      <Badge variant="primary" size="sm">
                        Current
                      </Badge>
                    )}
                    {index === 0 && !version.isCurrent && (
                      <Badge variant="default" size="sm">
                        Latest
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {version.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{version.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(version.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {onViewVersion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewVersion(version.id)}
                      disabled={isLoading}
                    >
                      View
                    </Button>
                  )}
                  {onRestore && !version.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(version.id)}
                      disabled={isLoading}
                      iconLeft={<RotateCcw className="h-3 w-3" />}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

DocumentVersionHistory.displayName = 'DocumentVersionHistory';

export { DocumentVersionHistory };

