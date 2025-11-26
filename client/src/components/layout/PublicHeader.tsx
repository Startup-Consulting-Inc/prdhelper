/**
 * Public Header Component
 * 
 * Header for public pages (landing, docs, etc.) with Clearly branding
 * and authentication navigation buttons.
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className }: PublicHeaderProps) {
  const navigate = useNavigate();

  return (
    <nav
      className={`border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 sticky top-0 z-50 ${className ?? ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Clearly"
              className="h-8 cursor-pointer"
              onClick={() => {
                // Check auth in localStorage (assuming JWT or session), fallback to / if missing
                const isLoggedIn = Boolean(localStorage.getItem('clearly_token'));
                navigate(isLoggedIn ? '/dashboard' : '/');
              }}
              tabIndex={0}
              role="link"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const isLoggedIn = Boolean(localStorage.getItem('clearly_token'));
                  navigate(isLoggedIn ? '/dashboard' : '/');
                }
              }}
              aria-label="Go to home"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

