/**
 * Audit Logs Table
 *
 * Table for viewing system audit logs with filtering.
 */

import { useState, useMemo } from 'react';
import { DataTable, Column } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { useAuditLogs } from '../../hooks/useAdmin';

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function AuditLogsTable() {
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { logs, isLoading } = useAuditLogs({
    action: actionFilter === 'ALL' ? undefined : actionFilter,
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Helper function to extract target information from details JSON
  const extractTargetInfo = (details: any) => {
    if (!details || typeof details !== 'object') {
      return { targetType: null, targetId: null };
    }

    // Check for common ID fields and determine type
    if (details.projectId) {
      return { targetType: 'PROJECT', targetId: details.projectId };
    }
    if (details.documentId) {
      return { targetType: 'DOCUMENT', targetId: details.documentId };
    }
    if (details.userId || details.deletedUserId) {
      return { targetType: 'USER', targetId: details.userId || details.deletedUserId };
    }

    return { targetType: null, targetId: null };
  };

  // Transform and sort logs
  const transformedAndSortedLogs = useMemo(() => {
    if (!logs) return [];

    // First, transform the logs to extract target information
    const transformed = logs.map((log: any) => {
      const { targetType, targetId } = extractTargetInfo(log.details);
      return {
        ...log,
        targetType,
        targetId,
        metadata: log.details,
      };
    });

    // Then sort the transformed logs
    return [...transformed].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortKey) {
        case 'action':
          aValue = a.action;
          bValue = b.action;
          break;
        case 'user':
          aValue = a.user?.name || 'System';
          bValue = b.user?.name || 'System';
          break;
        case 'targetType':
          aValue = a.targetType || '';
          bValue = b.targetType || '';
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      // Compare values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = (aValue as number) - (bValue as number);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });
  }, [logs, sortKey, sortDirection]);

  const getActionVariant = (action: string) => {
    if (action.includes('DELETE')) return 'error';
    if (action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE')) return 'warning';
    return 'default';
  };

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatMetadata = (metadata: Record<string, any> | null) => {
    if (!metadata) return 'N/A';
    const entries = Object.entries(metadata);
    if (entries.length === 0) return 'N/A';
    return entries
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (log) => (
        <Badge variant={getActionVariant(log.action)}>
          {formatAction(log.action)}
        </Badge>
      ),
    },
    {
      key: 'user',
      header: 'User',
      sortable: true,
      render: (log) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {log.user ? log.user.name : 'System'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {log.user ? log.user.email : 'N/A'}
          </div>
        </div>
      ),
    },
    {
      key: 'targetType',
      header: 'Target Type',
      sortable: true,
      render: (log) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {log.targetType || 'N/A'}
        </span>
      ),
    },
    {
      key: 'metadata',
      header: 'Details',
      render: (log) => (
        <span className="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate block">
          {formatMetadata(log.metadata)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Timestamp',
      sortable: true,
      render: (log) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading audit logs...</div>;
  }

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set((logs || []).map((log) => log.action)));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Audit Logs
        </h2>
        <div className="flex gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
          >
            <option value="ALL">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {formatAction(action)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={transformedAndSortedLogs}
        keyExtractor={(log) => log.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="No audit logs found"
      />
    </div>
  );
}
