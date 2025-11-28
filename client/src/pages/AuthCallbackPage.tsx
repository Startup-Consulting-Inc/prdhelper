/**
 * Auth Callback Page
 *
 * Legacy OAuth callback page - no longer used with Firebase Auth.
 * Firebase handles OAuth flow client-side, so this redirects to login.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Firebase Auth handles OAuth client-side, so redirect to login
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}

export default AuthCallbackPage;
