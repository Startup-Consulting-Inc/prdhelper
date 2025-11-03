/**
 * Document Management Table
 *
 * Table for viewing and managing all documents in the system.
 */

import { useState } from 'react';
import { Trash2, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAdminDocuments, useDeleteDocument } from '../../hooks/useAdmin';

type DocumentType = 'BRD' | 'PRD' | 'PROMPT_BUILD' | 'TASKS';
type DocumentStatus = 'DRAFT' | 'APPROVED';

interface Document {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    title: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export function DocumentManagementTable() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { documents, isLoading } = useAdminDocuments({
    type: typeFilter === 'ALL' ? undefined : typeFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });
  const { deleteDocument } = useDeleteDocument();

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (documentId: string, documentType: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete ${documentType} document from project "${projectTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteDocument({ documentId });
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  const handleView = (documentId: string) => {
    navigate(`/documents/${documentId}`);
  };

  const getTypeVariant = (type: DocumentType) => {
    switch (type) {
      case 'BRD':
        return 'primary';
      case 'PRD':
        return 'success';
      case 'PROMPT_BUILD':
        return 'warning';
      case 'TASKS':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusVariant = (status: DocumentStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'warning';
      case 'APPROVED':
        return 'success';
      default:
        return 'default';
    }
  };

  const columns: Column<Document>[] = [
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (document) => (
        <div>
          <Badge variant={getTypeVariant(document.type)}>
            {document.type}
          </Badge>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            v{document.version}
          </div>
        </div>
      ),
    },
    {
      key: 'project',
      header: 'Project',
      render: (document) => (
        <div className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">
          {document.project.title}
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (document) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {document.project.user.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {document.project.user.email}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (document) => (
        <Badge variant={getStatusVariant(document.status)}>
          {document.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (document) => new Date(document.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (document) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(document.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(document.id, document.type, document.project.title)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Document Management
        </h2>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'ALL')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
          >
            <option value="ALL">All Types</option>
            <option value="BRD">BRD</option>
            <option value="PRD">PRD</option>
            <option value="PROMPT_BUILD">Prompt Build</option>
            <option value="TASKS">Tasks</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'ALL')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={documents || []}
        keyExtractor={(document) => document.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="No documents found"
      />
    </div>
  );
}
