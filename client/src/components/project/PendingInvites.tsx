/**
 * PendingInvites Component
 *
 * Displays list of pending project collaboration invitations
 */

import { Mail, Check, X, Eye, Edit3, Clock, User } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { usePendingInvites, type ProjectInvite } from '@/hooks/useCollaborators';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

export interface PendingInvitesProps {
  className?: string;
}

const PendingInvites = ({ className }: PendingInvitesProps) => {
  const {
    invites,
    isLoading,
    error,
    acceptInvite,
    isAccepting,
    rejectInvite,
    isRejecting,
  } = usePendingInvites();

  const [processingInviteId, setProcessingInviteId] = useState<string | null>(null);

  const handleAccept = (token: string, inviteId: string) => {
    setProcessingInviteId(inviteId);
    acceptInvite(
      { token },
      {
        onSettled: () => setProcessingInviteId(null),
      }
    );
  };

  const handleReject = (inviteId: string) => {
    if (confirm('Are you sure you want to reject this invitation?')) {
      setProcessingInviteId(inviteId);
      rejectInvite(
        { inviteId },
        {
          onSettled: () => setProcessingInviteId(null),
        }
      );
    }
  };

  const roleConfig = {
    VIEWER: {
      label: 'Viewer',
      description: 'View only',
      icon: Eye,
      variant: 'default' as const,
    },
    EDITOR: {
      label: 'Editor',
      description: 'Can edit',
      icon: Edit3,
      variant: 'primary' as const,
    },
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatExpiryDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays < 7) return `Expires in ${diffDays} days`;
    return `Expires ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (isLoading) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow p-6', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow p-6', className)}>
        <div className="text-red-600 dark:text-red-400">
          Failed to load invitations: {error.message}
        </div>
      </div>
    );
  }

  if (invites.length === 0) {
    return null; // Don't show anything if there are no pending invites
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pending Invitations
          </h3>
          <Badge variant="primary" className="ml-2">
            {invites.length}
          </Badge>
        </div>
      </div>

      {/* Invitations List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {invites.map((invite) => {
          const RoleIcon = roleConfig[invite.role].icon;
          const isProcessing = processingInviteId === invite.id && (isAccepting || isRejecting);

          return (
            <div
              key={invite.id}
              className={cn(
                'p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                isProcessing && 'opacity-50 pointer-events-none'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Invitation Details */}
                <div className="flex-1 min-w-0">
                  {/* Project Title */}
                  <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {invite.project.title}
                  </h4>

                  {/* Project Description */}
                  {invite.project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {invite.project.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {/* Inviter */}
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        Invited by <span className="font-medium">{invite.inviter.name}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(invite.createdAt)}</span>
                    </div>

                    {/* Expiry */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-600 dark:text-orange-400">
                        {formatExpiryDate(invite.expiresAt)}
                      </span>
                    </div>
                  </div>

                  {/* Role & Mode Badges */}
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant={roleConfig[invite.role].variant} className="gap-1.5">
                      <RoleIcon className="w-3 h-3" />
                      {roleConfig[invite.role].label}
                    </Badge>
                    <Badge variant="default">
                      {invite.project.mode === 'PLAIN' ? 'Plain Mode' : 'Technical Mode'}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleAccept(invite.token, invite.id)}
                    size="sm"
                    className="gap-1.5"
                    disabled={isProcessing}
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleReject(invite.id)}
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PendingInvites;
