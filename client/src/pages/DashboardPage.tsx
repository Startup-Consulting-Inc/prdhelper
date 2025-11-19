/**
 * Dashboard Page
 * 
 * Main dashboard showing user stats, projects, and quick actions.
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { ProjectList } from '../components/project/ProjectList';
import PendingInvites from '../components/project/PendingInvites';
import { useProjects, useProjectStats, type Project } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import { calculateProjectProgress } from '../lib/utils/projectProgress';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    projects,
    isLoading: isLoadingProjects,
    deleteProjectAsync,
    archiveProjectAsync,
  } = useProjects();
  const { stats, isLoading: isLoadingStats } = useProjectStats();

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  const handleViewProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteProjectAsync({ id });
    } catch (error) {
      alert('Failed to delete project: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleArchiveProject = async (id: string) => {
    if (!confirm('Are you sure you want to archive this project?')) {
      return;
    }

    try {
      await archiveProjectAsync({ id });
    } catch (error) {
      alert('Failed to archive project: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Clearly
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateProject}
                >
                  New Project
                </Button>
                {user?.role === 'ADMIN' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here's an overview of your projects and documents.
            </p>
          </div>

          {/* Stats */}
          {isLoadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.totalProjects || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.completedProjects || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Documents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.totalDocuments || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.completionRate || 0}%
                </p>
              </div>
            </div>
          )}

          {/* Pending Invitations */}
          <PendingInvites />

          {/* Projects */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Your Projects
              </h3>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                variant="primary"
                size="sm"
                onClick={handleCreateProject}
              >
                New Project
              </Button>
            </div>
            <ProjectList
              projects={projects.map((p: Project) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                mode: p.mode.toLowerCase() as 'plain' | 'technical',
                status: p.status.toLowerCase() as 'active' | 'completed' | 'archived',
                progress: calculateProjectProgress(
                  { mode: p.mode },
                  p.documents || []
                ),
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt),
              }))}
              onCreateProject={handleCreateProject}
              onViewProject={handleViewProject}
              onArchiveProject={handleArchiveProject}
              onDeleteProject={handleDeleteProject}
              isLoading={isLoadingProjects}
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default DashboardPage;


