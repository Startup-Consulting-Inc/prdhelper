/**
 * Public Layout Component
 *
 * Layout wrapper for public pages with header and footer
 */

import { ReactNode } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

export interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
