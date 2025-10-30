import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { AuthLayout } from './components/auth/AuthLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { BRDWizardPage } from './pages/BRDWizardPage';
import { PRDWizardPage } from './pages/PRDWizardPage';
import { DocumentViewPage } from './pages/DocumentViewPage';
import { AdminPage } from './pages/AdminPage';
import './App.css';

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Something went wrong. Please try again.';
};

function AppContent() {
  const { user, isAuthenticated, isLoading, login, signup } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthLayout
        title={showSignup ? 'Create your account' : 'Welcome back'}
        subtitle={
          showSignup
            ? 'Start generating professional requirements documents with AI'
            : 'Sign in to continue to Clearly'
        }
        footer={
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {showSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setShowSignup(!showSignup);
                setLoginError(null);
                setSignupError(null);
              }}
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {showSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        }
      >
        {showSignup ? (
          <SignupForm
            onSubmit={async ({ confirmPassword: _confirmPassword, ...data }) => {
              setSignupError(null);
              setIsSignupSubmitting(true);
              try {
                await signup({
                  ...data,
                  modePreference: data.modePreference === 'technical' ? 'TECHNICAL' : 'PLAIN',
                });
              } catch (error) {
                setSignupError(extractErrorMessage(error));
              } finally {
                setIsSignupSubmitting(false);
              }
            }}
            isLoading={isSignupSubmitting}
            error={signupError ?? undefined}
          />
        ) : (
          <LoginForm
            onSubmit={async ({ rememberMe: _rememberMe, ...data }) => {
              setLoginError(null);
              setIsLoginSubmitting(true);
              try {
                await login(data.email, data.password);
              } catch (error) {
                setLoginError(extractErrorMessage(error));
              } finally {
                setIsLoginSubmitting(false);
              }
            }}
            isLoading={isLoginSubmitting}
            error={loginError ?? undefined}
          />
        )}
      </AuthLayout>
    );
  }

  // Authenticated - show app with routing
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/projects/new" element={<NewProjectPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="/projects/:projectId/wizard/brd" element={<BRDWizardPage />} />
      <Route path="/projects/:projectId/wizard/prd" element={<PRDWizardPage />} />
      <Route path="/documents/:documentId" element={<DocumentViewPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
