/**
 * Session Expiration Warning
 *
 * Displays a fixed banner when the user's session is about to expire
 * due to inactivity. Dismisses automatically on user activity.
 */

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function SessionExpirationWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleWarning = () => {
      setVisible(true);
    };

    // Dismiss on any user activity
    const handleActivity = () => {
      if (visible) {
        setVisible(false);
      }
    };

    window.addEventListener('session-expiring', handleWarning);
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('session-expiring', handleWarning);
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-950 px-4 py-3 text-center text-sm font-medium shadow-md flex items-center justify-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      Your session will expire soon due to inactivity. Move your mouse or press any key to stay signed in.
    </div>
  );
}
