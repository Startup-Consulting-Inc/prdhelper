import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1', className)}>
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 mx-1 text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    'text-gray-500 hover:text-gray-700',
                    'dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    'text-sm font-medium',
                    isLast
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };

