import { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { AuthLayout } from './components/auth/AuthLayout';
import { SessionExpirationWarning } from './components/auth/SessionExpirationWarning';
import { Spinner } from './components/ui/Spinner';
import './App.css';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/public/TermsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NewProjectPage = lazy(() => import('./pages/NewProjectPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const BRDWizardPage = lazy(() => import('./pages/BRDWizardPage'));
const PRDWizardPage = lazy(() => import('./pages/PRDWizardPage'));
const DocumentViewPage = lazy(() => import('./pages/DocumentViewPage'));
const ToolSelectionPage = lazy(() => import('./pages/ToolSelectionPage'));
const ToolOutputPage = lazy(() => import('./pages/ToolOutputPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Auth pages
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const EmailVerificationPendingPage = lazy(() => import('./pages/EmailVerificationPendingPage'));

// Public pages
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const CaseStudiesPage = lazy(() => import('./pages/public/CaseStudiesPage'));
const BlogPage = lazy(() => import('./pages/public/BlogPage'));
const ScheduleDemoPage = lazy(() => import('./pages/public/ScheduleDemoPage'));
const ContactUsPage = lazy(() => import('./pages/public/ContactUsPage'));
const VibeCodingPage = lazy(() => import('./pages/public/docs/VibeCodingPage'));
const BRDDocPage = lazy(() => import('./pages/public/docs/BRDDocPage'));
const BRDGuidePage = lazy(() => import('./pages/public/docs/BRDGuidePage'));
const PRDDocPage = lazy(() => import('./pages/public/docs/PRDDocPage'));
const PRDGuidePage = lazy(() => import('./pages/public/docs/PRDGuidePage'));
const SoftwareProcessPage = lazy(() => import('./pages/public/docs/SoftwareProcessPage'));
const SoftwareProcessGuidePage = lazy(() => import('./pages/public/docs/SoftwareProcessGuidePage'));
const HowToUsePage = lazy(() => import('./pages/public/docs/HowToUsePage'));

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
  const { user, isAuthenticated, isLoading, login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/auth/callback', '/auth/verify-email', '/auth/verify-pending', '/privacy', '/terms', '/about', '/case-studies', '/blog', '/schedule-demo', '/contact'];
  const isPublicRoute = publicRoutes.includes(location.pathname) ||
                        location.pathname.startsWith('/docs/') ||
                        location.pathname.startsWith('/blog/');

  // Google OAuth login handler
  const handleGoogleLogin = async () => {
    setLoginError(null);
    setSignupError(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Navigation handled by useEffect when isAuthenticated becomes true
      // This prevents race condition where we navigate before auth state updates
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setLoginError(errorMessage);
      setSignupError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && location.pathname === '/login') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

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
    // If on /login page, show login form
    if (location.pathname === '/login') {
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
                  const result = await signup({
                    ...data,
                    modePreference: data.modePreference === 'technical' ? 'TECHNICAL' : 'PLAIN',
                  });

                  // Redirect to email verification pending page
                  navigate('/auth/verify-pending', {
                    state: { email: result.email },
                  });
                } catch (error) {
                  setSignupError(extractErrorMessage(error));
                } finally {
                  setIsSignupSubmitting(false);
                }
              }}
              onGoogleLogin={handleGoogleLogin}
              isLoading={isSignupSubmitting}
              isGoogleLoading={isGoogleLoading}
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
              onGoogleLogin={handleGoogleLogin}
              isLoading={isLoginSubmitting}
              isGoogleLoading={isGoogleLoading}
              error={loginError ?? undefined}
            />
          )}
        </AuthLayout>
      );
    }

    // If accessing a protected route (not a public route), redirect to login
    if (!isPublicRoute) {
      return <Navigate to="/login" replace />;
    }

    // For public routes when not authenticated, let them through to the main App router
    return null;
  }

  // Authenticated - show app with routing
  return (
    <>
    <SessionExpirationWarning />
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Spinner size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/:projectId/wizard/brd" element={<BRDWizardPage />} />
        <Route path="/projects/:projectId/wizard/prd" element={<PRDWizardPage />} />
        <Route path="/projects/:projectId/tools" element={<ToolSelectionPage />} />
        <Route path="/projects/:projectId/tool-output/:documentId" element={<ToolOutputPage />} />
        <Route path="/projects/:projectId/documents/:documentId" element={<DocumentViewPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
    </>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Spinner size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/verify-pending" element={<EmailVerificationPendingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/schedule-demo" element={<ScheduleDemoPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/docs/vibe-coding" element={<VibeCodingPage />} />
        <Route path="/docs/brd" element={<BRDDocPage />} />
        <Route path="/docs/brd-guide" element={<BRDGuidePage />} />
        <Route path="/docs/prd" element={<PRDDocPage />} />
        <Route path="/docs/prd-guide" element={<PRDGuidePage />} />
        <Route path="/docs/software-development-process" element={<SoftwareProcessPage />} />
        <Route path="/docs/software-development-process-guide" element={<SoftwareProcessGuidePage />} />
        <Route path="/docs/how-to-use" element={<HowToUsePage />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Suspense>
  );
}

export default App;
