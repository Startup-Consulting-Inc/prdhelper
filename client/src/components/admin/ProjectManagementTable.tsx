/**
 * Project Management Table
 *
 * Table for viewing and managing all projects in the system.
 */

import { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAdminProjects, useDeleteProject } from '../../hooks/useAdmin';

type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  mode: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    documents: number;
  };
}

export function ProjectManagementTable() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { projects, isLoading } = useAdminProjects({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });
  const { deleteProject } = useDeleteProject();

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete project "${projectTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteProject({ projectId });
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const handleView = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const getStatusVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'Project',
      sortable: true,
      render: (project) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {project.title}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
            {project.description}
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Owner',
      render: (project) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {project.user.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {project.user.email}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (project) => (
        <Badge variant={getStatusVariant(project.status)}>
          {project.status}
        </Badge>
      ),
    },
    {
      key: 'mode',
      header: 'Mode',
      render: (project) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {project.mode}
        </span>
      ),
    },
    {
      key: 'documents',
      header: 'Documents',
      sortable: true,
      render: (project) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {project._count.documents}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (project) => new Date(project.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(project.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(project.id, project.title)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Project Management
        </h2>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={projects || []}
        keyExtractor={(project) => project.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="No projects found"
      />
    </div>
  );
}
