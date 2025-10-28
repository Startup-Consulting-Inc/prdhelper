/**
 * Admin Hooks
 *
 * React Query hooks for admin operations.
 */

import { trpc } from '../lib/trpc';

/**
 * Get system statistics
 */
export function useSystemStats() {
  const { data, isLoading, error } = trpc.admin.getSystemStats.useQuery();

  return {
    stats: data,
    isLoading,
    error,
  };
}

/**
 * Get all users with pagination
 */
export function useUsers(limit = 50, offset = 0) {
  const { data, isLoading, error } = trpc.admin.getAllUsers.useQuery({ limit, offset });

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    error,
  };
}

/**
 * Update user role
 */
export function useUpdateUserRole() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.getAllUsers.invalidate();
    },
  });

  return {
    updateRole: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Delete user
 */
export function useDeleteUser() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.getAllUsers.invalidate();
    },
  });

  return {
    deleteUser: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Get system prompts
 */
export function useSystemPrompts() {
  const { data, isLoading, error } = trpc.admin.getSystemPrompts.useQuery();

  return {
    prompts: data ?? [],
    isLoading,
    error,
  };
}

/**
 * Update system prompt
 */
export function useUpdateSystemPrompt() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.updateSystemPrompt.useMutation({
    onSuccess: () => {
      utils.admin.getSystemPrompts.invalidate();
      utils.admin.getPromptVersionHistory.invalidate();
    },
  });

  return {
    updatePrompt: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Get all projects (admin view)
 */
export function useAdminProjects(filters?: {
  userId?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  limit?: number;
  offset?: number;
}) {
  const { data, isLoading, error } = trpc.admin.getAllProjects.useQuery(filters ?? {});

  return {
    projects: data?.projects ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    error,
  };
}

/**
 * Delete project (admin)
 */
export function useDeleteProject() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.deleteProject.useMutation({
    onSuccess: () => {
      utils.admin.getAllProjects.invalidate();
    },
  });

  return {
    deleteProject: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Get audit logs
 */
export function useAuditLogs(filters?: {
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  const { data, isLoading, error } = trpc.admin.getAuditLogs.useQuery(filters ?? {});

  return {
    logs: data?.logs ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    error,
  };
}

/**
 * Get token usage data
 */
export function useTokenUsage(filters?: {
  userId?: string;
  projectId?: string;
  operation?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  const { data, isLoading, error } = trpc.admin.getTokenUsage.useQuery(filters ?? {});

  return {
    usage: data?.usage ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    error,
  };
}

/**
 * Get token statistics
 */
export function useTokenStats(filters?: { startDate?: string; endDate?: string }) {
  const { data, isLoading, error } = trpc.admin.getTokenStats.useQuery(filters ?? {});

  return {
    stats: data,
    isLoading,
    error,
  };
}

/**
 * Delete system prompt
 */
export function useDeleteSystemPrompt() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.deleteSystemPrompt.useMutation({
    onSuccess: () => {
      utils.admin.getSystemPrompts.invalidate();
    },
  });

  return {
    deletePrompt: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Get prompt version history
 */
export function usePromptVersionHistory(promptId?: string) {
  const { data, isLoading, error } = trpc.admin.getPromptVersionHistory.useQuery(
    { promptId: promptId! },
    { enabled: !!promptId }
  );

  return {
    versions: data ?? [],
    isLoading,
    error,
  };
}

/**
 * Restore prompt version
 */
export function useRestorePromptVersion() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.restorePromptVersion.useMutation({
    onSuccess: () => {
      utils.admin.getSystemPrompts.invalidate();
      utils.admin.getPromptVersionHistory.invalidate();
    },
  });

  return {
    restoreVersion: mutation.mutateAsync,
    isRestoring: mutation.isPending,
    error: mutation.error,
  };
}
