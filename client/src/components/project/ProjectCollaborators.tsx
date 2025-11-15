/**
 * ProjectCollaborators Component
 *
 * Displays list of project collaborators with management options
 */

import { UserPlus, MoreVertical, Trash2, Users, Crown, Eye, Edit3 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DropdownMenu, type DropdownMenuItem } from '../ui/DropdownMenu';
import { useProjectCollaborators, type Collaborator } from '@/hooks/useCollaborators';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ProjectCollaboratorsProps {
  projectId: string;
  isOwner: boolean;
  onInviteClick?: () => void;
  className?: string;
}

const ProjectCollaborators = ({
  projectId,
  isOwner,
  onInviteClick,
  className,
}: ProjectCollaboratorsProps) => {
  const {
    collaborators,
    isLoading,
    error,
    removeCollaborator,
    isRemoving,
    updateRole,
    isUpdatingRole,
  } = useProjectCollaborators(projectId);

  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);

  const handleRemove = (collaboratorId: string) => {
    if (confirm('Are you sure you want to remove this collaborator?')) {
      setSelectedCollaborator(collaboratorId);
      removeCollaborator(
        { projectId, collaboratorId },
        {
          onSettled: () => setSelectedCollaborator(null),
        }
      );
    }
  };

  const handleUpdateRole = (collaboratorId: string, newRole: 'VIEWER' | 'EDITOR') => {
    setSelectedCollaborator(collaboratorId);
    updateRole(
      { projectId, collaboratorId, role: newRole },
      {
        onSettled: () => setSelectedCollaborator(null),
      }
    );
  };

  const roleConfig = {
    VIEWER: {
      label: 'Viewer',
      icon: Eye,
      variant: 'default' as const,
      color: 'text-gray-600 dark:text-gray-400',
    },
    EDITOR: {
      label: 'Editor',
      icon: Edit3,
      variant: 'primary' as const,
      color: 'text-blue-600 dark:text-blue-400',
    },
  };

  const getCollaboratorActions = (collaborator: Collaborator): DropdownMenuItem[] => {
    if (!isOwner) return [];

    const actions: DropdownMenuItem[] = [];

    // Toggle role action
    const newRole = collaborator.role === 'VIEWER' ? 'EDITOR' : 'VIEWER';
    actions.push({
      label: `Change to ${roleConfig[newRole].label}`,
      icon: roleConfig[newRole].icon,
      onClick: () => handleUpdateRole(collaborator.id, newRole),
    });

    // Remove action
    actions.push({
      label: 'Remove',
      icon: Trash2,
      onClick: () => handleRemove(collaborator.id),
      variant: 'danger',
    });

    return actions;
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow p-6', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
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
          Failed to load collaborators: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Collaborators
          </h3>
          <Badge variant="default" className="ml-2">
            {collaborators.length}
          </Badge>
        </div>
        {isOwner && onInviteClick && (
          <Button onClick={onInviteClick} size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        )}
      </div>

      {/* Collaborators List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {collaborators.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No collaborators yet
            </p>
            {isOwner && onInviteClick && (
              <Button onClick={onInviteClick} size="sm" variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Invite your first collaborator
              </Button>
            )}
          </div>
        ) : (
          collaborators.map((collaborator) => {
            const RoleIcon = roleConfig[collaborator.role].icon;
            const isProcessing =
              selectedCollaborator === collaborator.id && (isRemoving || isUpdatingRole);

            return (
              <div
                key={collaborator.id}
                className={cn(
                  'p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                  isProcessing && 'opacity-50 pointer-events-none'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {collaborator.user.image ? (
                      <img
                        src={collaborator.user.image}
                        alt={collaborator.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {collaborator.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {collaborator.user.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {collaborator.user.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Joined {formatDate(collaborator.acceptedAt)}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div className="flex-shrink-0">
                    <Badge variant={roleConfig[collaborator.role].variant} className="gap-1.5">
                      <RoleIcon className="w-3 h-3" />
                      {roleConfig[collaborator.role].label}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                {isOwner && (
                  <div className="flex-shrink-0 ml-4">
                    <DropdownMenu items={getCollaboratorActions(collaborator)} position="left">
                      <button
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        disabled={isProcessing}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectCollaborators;
