/**
 * Collaborators Hook
 *
 * Custom hook for project collaboration operations with tRPC.
 */

import { trpc } from '../lib/trpc';

// Type definitions
export interface Collaborator {
  id: string;
  projectId: string;
  userId: string;
  role: 'VIEWER' | 'EDITOR';
  invitedBy: string;
  invitedAt: Date | string;
  acceptedAt: Date | string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  inviter: {
    id: string;
    name: string;
  };
}

export interface ProjectInvite {
  id: string;
  projectId: string;
  invitedEmail: string;
  role: 'VIEWER' | 'EDITOR';
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  expiresAt: Date | string;
  createdAt: Date | string;
  project: {
    id: string;
    title: string;
    description: string;
    mode: 'PLAIN' | 'TECHNICAL';
  };
  inviter: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

/**
 * Hook for managing project collaborators
 */
export function useProjectCollaborators(projectId: string) {
  const utils = trpc.useUtils();

  // Query: Get collaborators for a project
  const {
    data: collaborators,
    isLoading,
    error,
    refetch,
  } = trpc.collaborators.getByProject.useQuery({ projectId });

  // Mutation: Invite collaborator
  const inviteCollaborator = trpc.collaborators.invite.useMutation({
    onSuccess: () => {
      utils.collaborators.getByProject.invalidate({ projectId });
      utils.projects.getAll.invalidate();
    },
  });

  // Mutation: Remove collaborator
  const removeCollaborator = trpc.collaborators.remove.useMutation({
    onSuccess: () => {
      utils.collaborators.getByProject.invalidate({ projectId });
    },
  });

  // Mutation: Update collaborator role
  const updateRole = trpc.collaborators.updateRole.useMutation({
    onSuccess: () => {
      utils.collaborators.getByProject.invalidate({ projectId });
    },
  });

  return {
    collaborators: collaborators || [],
    isLoading,
    error,
    refetch,
    inviteCollaborator: inviteCollaborator.mutate,
    inviteCollaboratorAsync: inviteCollaborator.mutateAsync,
    isInviting: inviteCollaborator.isPending,
    inviteError: inviteCollaborator.error,
    removeCollaborator: removeCollaborator.mutate,
    removeCollaboratorAsync: removeCollaborator.mutateAsync,
    isRemoving: removeCollaborator.isPending,
    updateRole: updateRole.mutate,
    updateRoleAsync: updateRole.mutateAsync,
    isUpdatingRole: updateRole.isPending,
  };
}

/**
 * Hook for managing user's pending invitations
 */
export function usePendingInvites() {
  const utils = trpc.useUtils();

  // Query: Get pending invitations
  const {
    data,
    isLoading,
    error,
    refetch,
  } = trpc.collaborators.getPendingInvites.useQuery({});

  // Mutation: Accept invitation
  const acceptInvite = trpc.collaborators.accept.useMutation({
    onSuccess: () => {
      utils.collaborators.getPendingInvites.invalidate();
      utils.projects.getAll.invalidate();
    },
  });

  // Mutation: Reject invitation
  const rejectInvite = trpc.collaborators.reject.useMutation({
    onSuccess: () => {
      utils.collaborators.getPendingInvites.invalidate();
    },
  });

  return {
    invites: data?.invites || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    refetch,
    acceptInvite: acceptInvite.mutate,
    acceptInviteAsync: acceptInvite.mutateAsync,
    isAccepting: acceptInvite.isPending,
    rejectInvite: rejectInvite.mutate,
    rejectInviteAsync: rejectInvite.mutateAsync,
    isRejecting: rejectInvite.isPending,
  };
}

/**
 * Hook for searching users to invite
 */
export function useUserSearch(projectId: string, query: string) {
  const {
    data: users,
    isLoading,
    error,
  } = trpc.collaborators.searchUsers.useQuery(
    { projectId, query },
    {
      enabled: query.length >= 2, // Only search if query is at least 2 characters
      staleTime: 30000, // Cache results for 30 seconds
    }
  );

  return {
    users: users || [],
    isLoading,
    error,
  };
}
