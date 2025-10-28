import { Button } from '../ui/Button';
import { ThumbsUp, ThumbsDown, Edit, Share2, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ApprovalStatus = 'approved' | 'rejected' | 'pending';

export interface DocumentActionsProps {
  approvalStatus?: ApprovalStatus;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  isLoading?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  showApproval?: boolean;
  className?: string;
}

const DocumentActions = ({
  approvalStatus = 'pending',
  onApprove,
  onReject,
  onEdit,
  onShare,
  onDownload,
  isLoading = false,
  canApprove = true,
  canReject = true,
  showApproval = true,
  className,
}: DocumentActionsProps) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800',
        className
      )}
    >
      {/* Approval actions */}
      {showApproval && (
        <>
          {onApprove && (
            <Button
              variant={approvalStatus === 'approved' ? 'primary' : 'outline'}
              size="sm"
              onClick={onApprove}
              disabled={!canApprove || isLoading || approvalStatus !== 'pending'}
              iconLeft={<ThumbsUp className="h-4 w-4" />}
            >
              {approvalStatus === 'approved' ? 'Approved' : 'Approve'}
            </Button>
          )}

          {onReject && (
            <Button
              variant={approvalStatus === 'rejected' ? 'outline' : 'outline'}
              size="sm"
              onClick={onReject}
              disabled={!canReject || isLoading || approvalStatus !== 'pending'}
              iconLeft={<ThumbsDown className="h-4 w-4" />}
              className={cn(
                approvalStatus === 'rejected' &&
                  'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400'
              )}
            >
              {approvalStatus === 'rejected' ? 'Rejected' : 'Reject'}
            </Button>
          )}

          {(onApprove || onReject) && (onEdit || onShare || onDownload) && (
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
          )}
        </>
      )}

      {/* Document actions */}
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={isLoading}
          iconLeft={<Edit className="h-4 w-4" />}
        >
          Edit
        </Button>
      )}

      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          disabled={isLoading}
          iconLeft={<Share2 className="h-4 w-4" />}
        >
          Share
        </Button>
      )}

      {onDownload && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          disabled={isLoading}
          iconLeft={<Download className="h-4 w-4" />}
        >
          Download
        </Button>
      )}

      {/* Status badge */}
      {showApproval && approvalStatus !== 'pending' && (
        <div className="ml-auto">
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
              approvalStatus === 'approved' &&
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
              approvalStatus === 'rejected' &&
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {approvalStatus === 'approved' ? '✓ Approved' : '✗ Rejected'}
          </span>
        </div>
      )}
    </div>
  );
};

DocumentActions.displayName = 'DocumentActions';

export { DocumentActions };

