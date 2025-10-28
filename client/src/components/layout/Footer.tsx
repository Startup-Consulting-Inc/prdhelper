import { cn } from '@/lib/utils/cn';

export interface FooterProps {
  appName?: string;
  year?: number;
  links?: { label: string; href: string }[];
  className?: string;
}

const Footer = ({
  appName = 'PRD Helper',
  year = new Date().getFullYear(),
  links = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Support', href: '/support' },
  ],
  className,
}: FooterProps) => {
  return (
    <footer className={cn('bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800', className)}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {year} {appName}. All rights reserved.
          </p>
          
          <nav className="flex gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export { Footer };

