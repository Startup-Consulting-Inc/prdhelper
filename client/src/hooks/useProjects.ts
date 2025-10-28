/**
 * Projects Hook
 * 
 * Custom hook for project operations with tRPC.
 */

import { trpc } from '../lib/trpc';

export function useProjects(filters?: {
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  mode?: 'PLAIN' | 'TECHNICAL';
}) {
  const utils = trpc.useUtils();

  // Query: Get all projects
  const {
    data,
    isLoading,
    error,
    refetch,
  } = trpc.projects.getAll.useQuery(filters || {});

  // Mutation: Create project
  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.getAll.invalidate();
      utils.projects.getStats.invalidate();
    },
  });

  // Mutation: Update project
  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      utils.projects.getAll.invalidate();
      utils.projects.getById.invalidate();
    },
  });

  // Mutation: Archive project
  const archiveProject = trpc.projects.archive.useMutation({
    onSuccess: () => {
      utils.projects.getAll.invalidate();
      utils.projects.getStats.invalidate();
    },
  });

  // Mutation: Delete project
  const deleteProject = trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.getAll.invalidate();
      utils.projects.getStats.invalidate();
    },
  });

  return {
    projects: data?.projects || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    refetch,
    createProject: createProject.mutate,
    createProjectAsync: createProject.mutateAsync,
    isCreating: createProject.isPending,
    updateProject: updateProject.mutate,
    updateProjectAsync: updateProject.mutateAsync,
    isUpdating: updateProject.isPending,
    archiveProject: archiveProject.mutate,
    archiveProjectAsync: archiveProject.mutateAsync,
    isArchiving: archiveProject.isPending,
    deleteProject: deleteProject.mutate,
    deleteProjectAsync: deleteProject.mutateAsync,
    isDeleting: deleteProject.isPending,
  };
}

export function useProject(projectId: string) {
  const utils = trpc.useUtils();

  // Query: Get project by ID
  const {
    data: project,
    isLoading,
    error,
  } = trpc.projects.getById.useQuery({ id: projectId });

  // Mutation: Update phase
  const updatePhase = trpc.projects.updatePhase.useMutation({
    onSuccess: () => {
      utils.projects.getById.invalidate({ id: projectId });
    },
  });

  return {
    project,
    isLoading,
    error,
    updatePhase: updatePhase.mutate,
    updatePhaseAsync: updatePhase.mutateAsync,
    isUpdatingPhase: updatePhase.isPending,
  };
}

export function useProjectStats() {
  const { data, isLoading, error } = trpc.projects.getStats.useQuery();

  return {
    stats: data,
    isLoading,
    error,
  };
}

