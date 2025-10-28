import { Home, Layers, FileText, Settings, HelpCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  count?: number;
  isActive?: boolean;
}

export interface SidebarProps {
  items?: NavItem[];
  onItemClick?: (id: string) => void;
  isOpen?: boolean;
  className?: string;
}

const Sidebar = ({
  items = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, isActive: true },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ],
  onItemClick,
  isOpen = true,
  className,
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        'bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all',
        isOpen ? 'w-64' : 'w-0 lg:w-20',
        className
      )}
    >
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                item.isActive
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="flex-1 text-left">{item.label}</span>}
              {isOpen && item.count !== undefined && (
                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';

export { Sidebar };

