import { useState, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { AuthLayout } from './components/auth/AuthLayout';
import { SessionExpirationWarning } from './components/auth/SessionExpirationWarning';
import { Spinner } from './components/ui/Spinner';
import { lazyWithRetry } from './lib/utils/lazyWithRetry';
import './App.css';

// Lazy load pages for code splitting (with retry on chunk load failure)
const LandingPage = lazyWithRetry(() => import('./pages/LandingPage'));
const AuthCallbackPage = lazyWithRetry(() => import('./pages/AuthCallbackPage'));
const PrivacyPage = lazyWithRetry(() => import('./pages/public/PrivacyPage'));
const TermsPage = lazyWithRetry(() => import('./pages/public/TermsPage'));
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'));
const DashboardPage = lazyWithRetry(() => import('./pages/DashboardPage'));
const NewProjectPage = lazyWithRetry(() => import('./pages/NewProjectPage'));
const ProjectDetailPage = lazyWithRetry(() => import('./pages/ProjectDetailPage'));
const ProblemDefinitionWizardPage = lazyWithRetry(() => import('./pages/ProblemDefinitionWizardPage'));
const BRDWizardPage = lazyWithRetry(() => import('./pages/BRDWizardPage'));
const PRDWizardPage = lazyWithRetry(() => import('./pages/PRDWizardPage'));
const DocumentViewPage = lazyWithRetry(() => import('./pages/DocumentViewPage'));
const ToolSelectionPage = lazyWithRetry(() => import('./pages/ToolSelectionPage'));
const ToolOutputPage = lazyWithRetry(() => import('./pages/ToolOutputPage'));
const AdminPage = lazyWithRetry(() => import('./pages/AdminPage'));

// Auth pages
const VerifyEmailPage = lazyWithRetry(() => import('./pages/VerifyEmailPage'));
const EmailVerificationPendingPage = lazyWithRetry(() => import('./pages/EmailVerificationPendingPage'));

// Public pages
const AboutPage = lazyWithRetry(() => import('./pages/public/AboutPage'));
const CaseStudiesPage = lazyWithRetry(() => import('./pages/public/CaseStudiesPage'));
const BlogPage = lazyWithRetry(() => import('./pages/public/BlogPage'));
const ScheduleDemoPage = lazyWithRetry(() => import('./pages/public/ScheduleDemoPage'));
const ContactUsPage = lazyWithRetry(() => import('./pages/public/ContactUsPage'));
const VibeCodingPage = lazyWithRetry(() => import('./pages/public/docs/VibeCodingPage'));
const BRDDocPage = lazyWithRetry(() => import('./pages/public/docs/BRDDocPage'));
const BRDGuidePage = lazyWithRetry(() => import('./pages/public/docs/BRDGuidePage'));
const PRDDocPage = lazyWithRetry(() => import('./pages/public/docs/PRDDocPage'));
const PRDGuidePage = lazyWithRetry(() => import('./pages/public/docs/PRDGuidePage'));
const SoftwareProcessPage = lazyWithRetry(() => import('./pages/public/docs/SoftwareProcessPage'));
const SoftwareProcessGuidePage = lazyWithRetry(() => import('./pages/public/docs/SoftwareProcessGuidePage'));
const HowToUsePage = lazyWithRetry(() => import('./pages/public/docs/HowToUsePage'));
const BRDGeneratorPage = lazyWithRetry(() => import('./pages/public/BRDGeneratorPage'));
const PRDGeneratorPage = lazyWithRetry(() => import('./pages/public/PRDGeneratorPage'));

// Blog posts
const WhyEveryAIProjectNeedsPRDPost = lazyWithRetry(() => import('./pages/public/blog/WhyEveryAIProjectNeedsPRDPost'));
const CompleteGuideToWritingBRDsPost = lazyWithRetry(() => import('./pages/public/blog/CompleteGuideToWritingBRDsPost'));
const AIAssistedDocumentationPost = lazyWithRetry(() => import('./pages/public/blog/AIAssistedDocumentationPost'));
const TranslateUserNeedsPost = lazyWithRetry(() => import('./pages/public/blog/TranslateUserNeedsPost'));
const HowToWriteABRD2026Post = lazyWithRetry(() => import('./pages/public/blog/HowToWriteABRD2026Post'));
const PRDTemplateGuidePost = lazyWithRetry(() => import('./pages/public/blog/PRDTemplateGuidePost'));
const BRDvsPRDPost = lazyWithRetry(() => import('./pages/public/blog/BRDvsPRDPost'));
const AIRequirementsGatheringPost = lazyWithRetry(() => import('./pages/public/blog/AIRequirementsGatheringPost'));
const UserStoriesVsRequirementsPost = lazyWithRetry(() => import('./pages/public/blog/UserStoriesVsRequirementsPost'));
const AcceptanceCriteriaExamplesPost = lazyWithRetry(() => import('./pages/public/blog/AcceptanceCriteriaExamplesPost'));
const RequirementsManagementTools2026Post = lazyWithRetry(() => import('./pages/public/blog/RequirementsManagementTools2026Post'));
const HowToWriteUserStoriesPost = lazyWithRetry(() => import('./pages/public/blog/HowToWriteUserStoriesPost'));
const FunctionalVsNonFunctionalPost = lazyWithRetry(() => import('./pages/public/blog/FunctionalVsNonFunctionalPost'));
const AICodingToolsRequirementsPost = lazyWithRetry(() => import('./pages/public/blog/AICodingToolsRequirementsPost'));
const BRDTemplatesByIndustryPost = lazyWithRetry(() => import('./pages/public/blog/BRDTemplatesByIndustryPost'));
const RequirementsElicitationPost = lazyWithRetry(() => import('./pages/public/blog/RequirementsElicitationPost'));
const ReduceScopeCreepPost = lazyWithRetry(() => import('./pages/public/blog/ReduceScopeCreepPost'));
const BRDMistakesPost = lazyWithRetry(() => import('./pages/public/blog/BRDMistakesPost'));
const AgileRequirementsPost = lazyWithRetry(() => import('./pages/public/blog/AgileRequirementsPost'));
const SRSDocumentGuidePost = lazyWithRetry(() => import('./pages/public/blog/SRSDocumentGuidePost'));
const DefiningTheRightProblemPost = lazyWithRetry(() => import('./pages/public/blog/DefiningTheRightProblemPost'));
const CSDegreeAIEraPost = lazyWithRetry(() => import('./pages/public/blog/CSDegreeAIEraPost'));
const DatabaseLandscapeAIEraPost = lazyWithRetry(() => import('./pages/public/blog/DatabaseLandscapeAIEraPost'));
const AgenticAIGuidePost = lazyWithRetry(() => import('./pages/public/blog/AgenticAIGuidePost'));
const DataGovernanceAIEraPost = lazyWithRetry(() => import('./pages/public/blog/DataGovernanceAIEraPost'));
const ResponsibleAIGuidePost = lazyWithRetry(() => import('./pages/public/blog/ResponsibleAIGuidePost'));
const EntryLevelTech2026Post = lazyWithRetry(() => import('./pages/public/blog/EntryLevelTech2026Post'));
const AIInterviewTransformationPost = lazyWithRetry(() => import('./pages/public/blog/AIInterviewTransformationPost'));
const HermesLLMWikiPost = lazyWithRetry(() => import('./pages/public/blog/HermesLLMWikiPost'));
const LLMWikiHermesAgentPost = lazyWithRetry(() => import('./pages/public/blog/LLMWikiHermesAgentPost'));
const GraphifyWikiBuildPost = lazyWithRetry(() => import('./pages/public/blog/GraphifyWikiBuildPost'));
const AnthropicVsOpenRouterOpusPost = lazyWithRetry(() => import('./pages/public/blog/AnthropicVsOpenRouterOpusPost'));
const HermesAgentCostSavingPost = lazyWithRetry(() => import('./pages/public/blog/HermesAgentCostSavingPost'));
const SkillsVsAgentsPost = lazyWithRetry(() => import('./pages/public/blog/SkillsVsAgentsPost'));

// Comparison & utility pages
const SitemapPage = lazyWithRetry(() => import('./pages/public/SitemapPage'));
const ClearlyVsChatPRDPage = lazyWithRetry(() => import('./pages/public/ClearlyVsChatPRDPage'));
const ClearlyVsManualPage = lazyWithRetry(() => import('./pages/public/ClearlyVsManualPage'));
const ClearlyVsConfluencePage = lazyWithRetry(() => import('./pages/public/ClearlyVsConfluencePage'));

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
  const publicRoutes = ['/', '/login', '/auth/callback', '/auth/verify-email', '/auth/verify-pending', '/privacy', '/terms', '/about', '/case-studies', '/blog', '/schedule-demo', '/contact', '/brd-generator', '/prd-generator', '/sitemap', '/clearly-vs-chatprd', '/clearly-vs-manual', '/clearly-vs-confluence'];
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
        <Route path="/projects/:projectId/wizard/problem-definition" element={<ProblemDefinitionWizardPage />} />
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
        <Route path="/brd-generator" element={<BRDGeneratorPage />} />
        <Route path="/prd-generator" element={<PRDGeneratorPage />} />
        {/* Blog posts */}
        <Route path="/blog/why-every-ai-project-needs-prd" element={<WhyEveryAIProjectNeedsPRDPost />} />
        <Route path="/blog/complete-guide-to-writing-brds" element={<CompleteGuideToWritingBRDsPost />} />
        <Route path="/blog/ai-assisted-documentation" element={<AIAssistedDocumentationPost />} />
        <Route path="/blog/translate-user-needs-to-requirements" element={<TranslateUserNeedsPost />} />
        <Route path="/blog/how-to-write-a-brd-2026" element={<HowToWriteABRD2026Post />} />
        <Route path="/blog/prd-template-guide" element={<PRDTemplateGuidePost />} />
        <Route path="/blog/brd-vs-prd" element={<BRDvsPRDPost />} />
        <Route path="/blog/ai-requirements-gathering" element={<AIRequirementsGatheringPost />} />
        <Route path="/blog/user-stories-vs-requirements" element={<UserStoriesVsRequirementsPost />} />
        <Route path="/blog/acceptance-criteria-examples" element={<AcceptanceCriteriaExamplesPost />} />
        <Route path="/blog/requirements-management-tools-2026" element={<RequirementsManagementTools2026Post />} />
        <Route path="/blog/how-to-write-user-stories" element={<HowToWriteUserStoriesPost />} />
        <Route path="/blog/functional-vs-non-functional-requirements" element={<FunctionalVsNonFunctionalPost />} />
        <Route path="/blog/ai-coding-tools-requirements" element={<AICodingToolsRequirementsPost />} />
        <Route path="/blog/brd-templates-by-industry" element={<BRDTemplatesByIndustryPost />} />
        <Route path="/blog/requirements-elicitation-guide" element={<RequirementsElicitationPost />} />
        <Route path="/blog/reduce-scope-creep-requirements" element={<ReduceScopeCreepPost />} />
        <Route path="/blog/brd-mistakes-to-avoid" element={<BRDMistakesPost />} />
        <Route path="/blog/agile-requirements-documentation" element={<AgileRequirementsPost />} />
        <Route path="/blog/how-to-write-srs-document" element={<SRSDocumentGuidePost />} />
        <Route path="/blog/defining-the-right-problem-ai-era" element={<DefiningTheRightProblemPost />} />
        <Route path="/blog/cs-degree-ai-era" element={<CSDegreeAIEraPost />} />
        <Route path="/blog/database-landscape-ai-era" element={<DatabaseLandscapeAIEraPost />} />
        <Route path="/blog/agentic-ai-guide" element={<AgenticAIGuidePost />} />
        <Route path="/blog/data-governance-ai-era" element={<DataGovernanceAIEraPost />} />
        <Route path="/blog/responsible-ai-guide" element={<ResponsibleAIGuidePost />} />
        <Route path="/blog/entry-level-tech-2026" element={<EntryLevelTech2026Post />} />
        <Route path="/blog/ai-interview-transformation-2026" element={<AIInterviewTransformationPost />} />
        <Route path="/blog/hermes-llm-wiki" element={<HermesLLMWikiPost />} />
        <Route path="/blog/llm-wiki-hermes-agent" element={<LLMWikiHermesAgentPost />} />
        <Route path="/blog/graphify-wiki-build" element={<GraphifyWikiBuildPost />} />
        <Route path="/blog/anthropic-vs-openrouter-opus" element={<AnthropicVsOpenRouterOpusPost />} />
        <Route path="/blog/hermes-agent-cost-saving" element={<HermesAgentCostSavingPost />} />
        <Route path="/blog/skills-vs-agents" element={<SkillsVsAgentsPost />} />
        {/* Comparison & utility pages */}
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/clearly-vs-chatprd" element={<ClearlyVsChatPRDPage />} />
        <Route path="/clearly-vs-manual" element={<ClearlyVsManualPage />} />
        <Route path="/clearly-vs-confluence" element={<ClearlyVsConfluencePage />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Suspense>
  );
}

export default App;
