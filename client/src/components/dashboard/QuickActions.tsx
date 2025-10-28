import { Button } from '../ui/Button';
import { Plus, FileText, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Plus;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface QuickActionsProps {
  onCreateProject?: () => void;
  onViewDocuments?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  customActions?: QuickAction[];
  className?: string;
}

const QuickActions = ({
  onCreateProject,
  onViewDocuments,
  onSettings,
  onHelp,
  customActions,
  className,
}: QuickActionsProps) => {
  const defaultActions: QuickAction[] = [
    {
      id: 'create',
      label: 'Create Project',
      description: 'Start a new project with AI guidance',
      icon: Plus,
      onClick: onCreateProject || (() => {}),
      variant: 'primary',
    },
    {
      id: 'documents',
      label: 'View Documents',
      description: 'Browse all generated documents',
      icon: FileText,
      onClick: onViewDocuments || (() => {}),
      variant: 'outline',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Manage your account and preferences',
      icon: Settings,
      onClick: onSettings || (() => {}),
      variant: 'outline',
    },
    {
      id: 'help',
      label: 'Help & Support',
      description: 'Get help and view documentation',
      icon: HelpCircle,
      onClick: onHelp || (() => {}),
      variant: 'outline',
    },
  ];

  const actions = customActions || defaultActions.filter(
    (action) => {
      if (action.id === 'create') return !!onCreateProject;
      if (action.id === 'documents') return !!onViewDocuments;
      if (action.id === 'settings') return !!onSettings;
      if (action.id === 'help') return !!onHelp;
      return true;
    }
  );

  return (
    <div className={cn('bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800', className)}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
      </div>

      <div className="p-6 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={cn(
                'w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left',
                'hover:bg-gray-50 dark:hover:bg-gray-900',
                'border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
            >
              <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                action.variant === 'primary'
                  ? 'bg-primary-100 dark:bg-primary-900/30'
                  : 'bg-gray-100 dark:bg-gray-800'
              )}>
                <Icon className={cn(
                  'h-5 w-5',
                  action.variant === 'primary'
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400'
                )} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                  {action.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

QuickActions.displayName = 'QuickActions';

export { QuickActions };

