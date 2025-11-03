import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/layout/Footer';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

type VerificationStatus = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [message, setMessage] = useState('');

  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    // Verify the email
    verifyEmailMutation.mutate(
      { token },
      {
        onSuccess: async (data) => {
          setStatus('success');
          setMessage(data.message);

          // Auto-login user after successful verification
          if (data.token && data.user) {
            localStorage.setItem('auth_token', data.token);

            // Wait a moment to show success message
            setTimeout(() => {
              // Reload to trigger auth context update
              window.location.href = '/dashboard';
            }, 2000);
          }
        },
        onError: (error) => {
          setStatus('error');
          setMessage(error.message || 'Failed to verify email. Please try again.');
        },
      }
    );
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="mx-auto h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Verifying your email...
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Email Verified!
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Redirecting you to the dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-16 w-16 text-red-600 dark:text-red-400" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/auth/resend-verification')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Request New Verification Link
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
