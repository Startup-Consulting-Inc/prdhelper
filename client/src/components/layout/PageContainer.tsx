import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const PageContainer = ({
  children,
  maxWidth = 'xl',
  className,
}: PageContainerProps) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 py-6', maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
};

PageContainer.displayName = 'PageContainer';

export { PageContainer };

