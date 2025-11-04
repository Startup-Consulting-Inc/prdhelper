/**
 * Token Usage Table
 *
 * Table for viewing token usage across users and projects with statistics.
 */

import { useState, useMemo } from 'react';
import { DataTable, Column } from '../ui/DataTable';
import { useTokenUsage, useTokenStats } from '../../hooks/useAdmin';
import { StatsCard } from './StatsCard';
import { Coins, Activity, Users, TrendingUp } from 'lucide-react';

interface TokenUsage {
  id: string;
  operation: string;
  model: string;
  tokensUsed: number;
  cost: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    title: string;
  };
}

export function TokenUsageTable() {
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { usage, isLoading: isLoadingUsage } = useTokenUsage({});
  const { stats, isLoading: isLoadingStats } = useTokenStats({});

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Sort usage data based on current sort key and direction
  const sortedUsage = useMemo(() => {
    if (!usage) return [];

    return [...usage].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortKey) {
        case 'user':
          aValue = a.user.name;
          bValue = b.user.name;
          break;
        case 'project':
          aValue = a.project?.title || '';
          bValue = b.project?.title || '';
          break;
        case 'operation':
          aValue = a.operation;
          bValue = b.operation;
          break;
        case 'model':
          aValue = a.model;
          bValue = b.model;
          break;
        case 'tokensUsed':
          aValue = a.tokensUsed;
          bValue = b.tokensUsed;
          break;
        case 'cost':
          aValue = a.cost || 0;
          bValue = b.cost || 0;
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
  }, [usage, sortKey, sortDirection]);

  const formatCost = (cost: number | undefined | null) => {
    if (!cost && cost !== 0) {
      return '$0.0000';
    }
    return `$${cost.toFixed(4)}`;
  };

  const formatTokens = (tokens: number | undefined | null) => {
    if (!tokens && tokens !== 0) {
      return '0';
    }
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(2)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  };

  const formatOperation = (operation: string) => {
    return operation
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const columns: Column<TokenUsage>[] = [
    {
      key: 'user',
      header: 'User',
      sortable: true,
      render: (usage) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {usage.user.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {usage.user.email}
          </div>
        </div>
      ),
    },
    {
      key: 'project',
      header: 'Project',
      sortable: true,
      render: (usage) =>
        usage.project ? (
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {usage.project.title}
          </span>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
        ),
    },
    {
      key: 'operation',
      header: 'Operation',
      sortable: true,
      render: (usage) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {formatOperation(usage.operation)}
        </span>
      ),
    },
    {
      key: 'model',
      header: 'Model',
      sortable: true,
      render: (usage) => (
        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
          {usage.model}
        </span>
      ),
    },
    {
      key: 'tokensUsed',
      header: 'Tokens',
      sortable: true,
      render: (usage) => (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {formatTokens(usage.tokensUsed)}
        </span>
      ),
    },
    {
      key: 'cost',
      header: 'Cost',
      sortable: true,
      render: (usage) => (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {formatCost(usage.cost)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (usage) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(usage.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  if (isLoadingUsage || isLoadingStats) {
    return <div className="text-center py-8">Loading token usage data...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Token Usage & Analytics
      </h2>

      {/* Statistics Overview */}
      {stats && stats.totalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tokens Used"
            value={formatTokens(stats.totalStats.totalTokens || 0)}
            icon={Activity}
          />
          <StatsCard
            title="Total Cost"
            value={formatCost(stats.totalStats.totalCost || 0)}
            icon={Coins}
          />
          <StatsCard
            title="Active Users"
            value={stats.topUsers?.length || 0}
            icon={Users}
          />
          <StatsCard
            title="Operations"
            value={stats.totalStats.operationCount || 0}
            icon={TrendingUp}
          />
        </div>
      )}

      {/* Top Operations */}
      {stats && stats.byOperation && stats.byOperation.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Usage by Operation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.byOperation.map((op) => (
              <div
                key={op.operation}
                className="bg-white dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {formatOperation(op.operation)}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTokens(op.tokensUsed)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatCost(op.cost)} • {op.requests} operations
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Users */}
      {stats && stats.topUsers && stats.topUsers.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top Users by Token Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.topUsers.slice(0, 5).map((user) => (
              <div
                key={user.userId}
                className="bg-white dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {user.userName}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTokens(user.totalTokens)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatCost(user.totalCost)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Usage
        </h3>
        <DataTable
          columns={columns}
          data={sortedUsage}
          keyExtractor={(usage) => usage.id}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No token usage data found"
        />
      </div>
    </div>
  );
}
