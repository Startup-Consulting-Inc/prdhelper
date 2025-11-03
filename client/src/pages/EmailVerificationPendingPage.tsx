import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { Footer } from '../components/layout/Footer';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export default function EmailVerificationPendingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);

  const resendMutation = trpc.auth.resendVerification.useMutation();

  const handleResend = async () => {
    if (!email) {
      setMessage('Email address not found. Please sign up again.');
      setResendStatus('error');
      return;
    }

    if (cooldown) {
      return;
    }

    setResendStatus('loading');

    resendMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          setResendStatus('success');
          setMessage(data.message);

          // Set cooldown for 60 seconds
          setCooldown(true);
          setTimeout(() => {
            setCooldown(false);
            setResendStatus('idle');
          }, 60000);
        },
        onError: (error) => {
          setResendStatus('error');
          setMessage(error.message || 'Failed to resend verification email');

          // Reset status after 5 seconds
          setTimeout(() => {
            setResendStatus('idle');
            setMessage('');
          }, 5000);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Mail className="mx-auto h-16 w-16 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a verification link to
          </p>
          {email && (
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {email}
            </p>
          )}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Next Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Check your inbox for an email from Clearly</li>
              <li>Click the verification link in the email</li>
              <li>You'll be automatically redirected to log in</li>
            </ol>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Didn't receive the email? Check your spam folder or request a new one.
            </p>

            {resendStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  {message}
                </p>
              </div>
            )}

            {resendStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {message}
                </p>
              </div>
            )}

            <button
              onClick={handleResend}
              disabled={resendStatus === 'loading' || cooldown}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {resendStatus === 'loading' ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : cooldown ? (
                'Email Sent - Wait 60s'
              ) : (
                'Resend Verification Email'
              )}
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          The verification link will expire in 24 hours
        </p>
      </div>
      <Footer />
    </div>
  );
}
