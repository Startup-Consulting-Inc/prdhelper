/**
 * System Overview Component
 *
 * Dashboard showing key system metrics.
 */

import { Users, FolderKanban, FileText, CheckCircle, Coins, Activity } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Spinner } from '../ui/Spinner';
import { useSystemStats } from '../../hooks/useAdmin';

export function SystemOverview() {
  const { stats, isLoading } = useSystemStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Failed to load system statistics
      </div>
    );
  }

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        System Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} />

        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
        />

        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Activity}
        />

        <StatsCard
          title="Total Documents"
          value={stats.totalDocuments}
          icon={FileText}
        />

        <StatsCard
          title="Approved Documents"
          value={stats.approvedDocuments}
          icon={CheckCircle}
        />

        <StatsCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon={CheckCircle}
        />

        <StatsCard
          title="Total Tokens Used"
          value={formatTokens(stats.totalTokensUsed)}
          icon={Activity}
        />

        <StatsCard
          title="Total API Cost"
          value={formatCost(stats.totalCost)}
          icon={Coins}
        />
      </div>
    </div>
  );
}
