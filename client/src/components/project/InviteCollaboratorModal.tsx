/**
 * InviteCollaboratorModal Component
 *
 * Modal for inviting collaborators via email or username search
 */

import { useState, useEffect } from 'react';
import { Mail, Search, Eye, Edit3, User, Check } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useProjectCollaborators, useUserSearch, type UserSearchResult } from '@/hooks/useCollaborators';
import { cn } from '@/lib/utils/cn';

export interface InviteCollaboratorModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type InviteMode = 'email' | 'search';
type CollaboratorRole = 'VIEWER' | 'EDITOR';

const InviteCollaboratorModal = ({
  projectId,
  open,
  onOpenChange,
}: InviteCollaboratorModalProps) => {
  const [mode, setMode] = useState<InviteMode>('email');
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [role, setRole] = useState<CollaboratorRole>('EDITOR');

  const { inviteCollaborator, isInviting, inviteError } = useProjectCollaborators(projectId);
  const { users, isLoading: isSearching } = useUserSearch(projectId, searchQuery);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setEmail('');
      setSearchQuery('');
      setSelectedUser(null);
      setRole('EDITOR');
    }
  }, [open]);

  const handleInvite = () => {
    if (mode === 'email') {
      if (!email.trim() || !email.includes('@')) {
        return;
      }
      inviteCollaborator(
        { projectId, email: email.trim(), role },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else if (mode === 'search' && selectedUser) {
      inviteCollaborator(
        { projectId, userId: selectedUser.id, role },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  const roleConfig = {
    VIEWER: {
      label: 'Viewer',
      description: 'Can view the project and documents',
      icon: Eye,
    },
    EDITOR: {
      label: 'Editor',
      description: 'Can view and edit the project',
      icon: Edit3,
    },
  };

  const canInvite = mode === 'email' ? email.trim().includes('@') : selectedUser !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Invite Collaborator"
      description="Invite someone to collaborate on this project"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isInviting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={!canInvite || isInviting}
          >
            {isInviting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setMode('email')}
            className={cn(
              'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              mode === 'email'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setMode('search')}
            className={cn(
              'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              mode === 'search'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Search Users
          </button>
        </div>

        {/* Email Input */}
        {mode === 'email' && (
          <div>
            <Input
              type="email"
              label="Email Address"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Enter the email address of the person you want to invite"
              autoFocus
            />
          </div>
        )}

        {/* User Search */}
        {mode === 'search' && (
          <div className="space-y-3">
            <Input
              type="text"
              label="Search Users"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              helperText="Search for existing users in the system"
              autoFocus
            />

            {/* Search Results */}
            {searchQuery.length >= 2 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Searching...
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={cn(
                          'w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left',
                          selectedUser?.id === user.id && 'bg-blue-50 dark:bg-blue-900/20'
                        )}
                      >
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        {selectedUser?.id === user.id && (
                          <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected User */}
            {selectedUser && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        )}

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(roleConfig) as CollaboratorRole[]).map((r) => {
              const config = roleConfig[r];
              const RoleIcon = config.icon;
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    'p-4 border-2 rounded-lg text-left transition-all',
                    role === r
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <RoleIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {config.label}
                    </span>
                    {role === r && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {config.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {inviteError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {inviteError.message}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default InviteCollaboratorModal;
