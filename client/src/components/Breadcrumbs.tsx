/**
 * Breadcrumbs Component
 *
 * Renders accessible breadcrumb navigation + BreadcrumbList JSON-LD schema.
 * Add to any page that is 2+ levels deep from the homepage.
 */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string; // omit for current (last) item
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const BASE_URL = 'https://www.clearlyreqs.com';

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: 'Home', path: '/' }, ...items];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${BASE_URL}${item.path}` : undefined,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <span key={index} className="flex items-center gap-1.5">
              {index === 0 && <Home className="h-3.5 w-3.5 flex-shrink-0" />}
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-gray-700 dark:text-gray-200 font-medium' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />}
            </span>
          );
        })}
      </nav>
    </>
  );
}
