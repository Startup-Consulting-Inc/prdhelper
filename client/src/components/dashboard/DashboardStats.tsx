import { StatCard } from '../common/StatCard';
import { Layers, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DashboardStatsProps {
  totalProjects: number;
  activeProjects: number;
  completedDocuments: number;
  completionRate: number;
  projectsChange?: number;
  documentsChange?: number;
  className?: string;
}

const DashboardStats = ({
  totalProjects,
  activeProjects,
  completedDocuments,
  completionRate,
  projectsChange,
  documentsChange,
  className,
}: DashboardStatsProps) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      <StatCard
        label="Total Projects"
        value={totalProjects.toString()}
        icon={Layers}
        change={projectsChange}
        trend={projectsChange && projectsChange > 0 ? 'up' : projectsChange && projectsChange < 0 ? 'down' : undefined}
      />
      
      <StatCard
        label="Active Projects"
        value={activeProjects.toString()}
        icon={TrendingUp}
      />
      
      <StatCard
        label="Documents Generated"
        value={completedDocuments.toString()}
        icon={FileText}
        change={documentsChange}
        trend={documentsChange && documentsChange > 0 ? 'up' : documentsChange && documentsChange < 0 ? 'down' : undefined}
      />
      
      <StatCard
        label="Completion Rate"
        value={`${completionRate}%`}
        icon={CheckCircle}
      />
    </div>
  );
};

DashboardStats.displayName = 'DashboardStats';

export { DashboardStats };

