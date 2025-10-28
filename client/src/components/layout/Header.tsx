import { useState } from 'react';
import { Button } from '../ui/Button';
import { Menu, X, User, Settings, LogOut, Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface HeaderProps {
  appName?: string;
  userName?: string;
  userEmail?: string;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  notificationCount?: number;
  showMobileMenu?: boolean;
  className?: string;
}

const Header = ({
  appName = 'PRD Helper',
  userName = 'John Doe',
  userEmail = 'john@example.com',
  onMenuClick,
  onNotificationsClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
  notificationCount = 0,
  showMobileMenu = true,
  className,
}: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className={cn('bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800', className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {showMobileMenu && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 dark:bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PR</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{appName}</span>
            </div>
          </div>

          {/* Right: Actions and User Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            {onNotificationsClick && (
              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userName}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                  </div>

                  {onProfileClick && (
                    <button
                      onClick={() => {
                        onProfileClick();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                  )}

                  {onSettingsClick && (
                    <button
                      onClick={() => {
                        onSettingsClick();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  )}

                  {onLogout && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-800 my-1" />
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };

