/**
 * Public Routes — SSR-safe route tree
 *
 * Contains only public pages that have no dependency on Firebase, AuthContext,
 * or tRPC. Used by the SSR entry point to prerender public pages at build time.
 */

import { Routes, Route } from 'react-router-dom';

// Blog posts
import BRDvsPRDPost from './pages/public/blog/BRDvsPRDPost';
import HowToWriteABRD2026Post from './pages/public/blog/HowToWriteABRD2026Post';
import PRDTemplateGuidePost from './pages/public/blog/PRDTemplateGuidePost';
import AIRequirementsGatheringPost from './pages/public/blog/AIRequirementsGatheringPost';
import UserStoriesVsRequirementsPost from './pages/public/blog/UserStoriesVsRequirementsPost';
import AcceptanceCriteriaExamplesPost from './pages/public/blog/AcceptanceCriteriaExamplesPost';
import RequirementsManagementTools2026Post from './pages/public/blog/RequirementsManagementTools2026Post';
import HowToWriteUserStoriesPost from './pages/public/blog/HowToWriteUserStoriesPost';
import FunctionalVsNonFunctionalPost from './pages/public/blog/FunctionalVsNonFunctionalPost';
import AICodingToolsRequirementsPost from './pages/public/blog/AICodingToolsRequirementsPost';
import BRDTemplatesByIndustryPost from './pages/public/blog/BRDTemplatesByIndustryPost';
import RequirementsElicitationPost from './pages/public/blog/RequirementsElicitationPost';
import ReduceScopeCreepPost from './pages/public/blog/ReduceScopeCreepPost';
import BRDMistakesPost from './pages/public/blog/BRDMistakesPost';
import AgileRequirementsPost from './pages/public/blog/AgileRequirementsPost';
import SRSDocumentGuidePost from './pages/public/blog/SRSDocumentGuidePost';
import AIAssistedDocumentationPost from './pages/public/blog/AIAssistedDocumentationPost';
import WhyEveryAIProjectNeedsPRDPost from './pages/public/blog/WhyEveryAIProjectNeedsPRDPost';
import CompleteGuideToWritingBRDsPost from './pages/public/blog/CompleteGuideToWritingBRDsPost';
import TranslateUserNeedsPost from './pages/public/blog/TranslateUserNeedsPost';
import DefiningTheRightProblemPost from './pages/public/blog/DefiningTheRightProblemPost';

// Tool pages
import BRDGeneratorPage from './pages/public/BRDGeneratorPage';
import PRDGeneratorPage from './pages/public/PRDGeneratorPage';

// Comparison pages
import ClearlyVsChatPRDPage from './pages/public/ClearlyVsChatPRDPage';
import ClearlyVsManualPage from './pages/public/ClearlyVsManualPage';
import ClearlyVsConfluencePage from './pages/public/ClearlyVsConfluencePage';

// Public pages
import AboutPage from './pages/public/AboutPage';
import CaseStudiesPage from './pages/public/CaseStudiesPage';
import BlogPage from './pages/public/BlogPage';
import SitemapPage from './pages/public/SitemapPage';

// Docs pages
import BRDDocPage from './pages/public/docs/BRDDocPage';
import PRDDocPage from './pages/public/docs/PRDDocPage';
import BRDGuidePage from './pages/public/docs/BRDGuidePage';
import PRDGuidePage from './pages/public/docs/PRDGuidePage';
import VibeCodingPage from './pages/public/docs/VibeCodingPage';
import HowToUsePage from './pages/public/docs/HowToUsePage';
import SoftwareProcessPage from './pages/public/docs/SoftwareProcessPage';
import SoftwareProcessGuidePage from './pages/public/docs/SoftwareProcessGuidePage';

export function PublicRoutes() {
  return (
    <Routes>
      {/* Blog posts */}
      <Route path="/blog/brd-vs-prd" element={<BRDvsPRDPost />} />
      <Route path="/blog/how-to-write-a-brd-2026" element={<HowToWriteABRD2026Post />} />
      <Route path="/blog/prd-template-guide" element={<PRDTemplateGuidePost />} />
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
      <Route path="/blog/ai-assisted-documentation" element={<AIAssistedDocumentationPost />} />
      <Route path="/blog/why-every-ai-project-needs-prd" element={<WhyEveryAIProjectNeedsPRDPost />} />
      <Route path="/blog/complete-guide-to-writing-brds" element={<CompleteGuideToWritingBRDsPost />} />
      <Route path="/blog/translate-user-needs-to-requirements" element={<TranslateUserNeedsPost />} />
      <Route path="/blog/defining-the-right-problem-ai-era" element={<DefiningTheRightProblemPost />} />

      {/* Tool pages */}
      <Route path="/brd-generator" element={<BRDGeneratorPage />} />
      <Route path="/prd-generator" element={<PRDGeneratorPage />} />

      {/* Comparison pages */}
      <Route path="/clearly-vs-chatprd" element={<ClearlyVsChatPRDPage />} />
      <Route path="/clearly-vs-manual" element={<ClearlyVsManualPage />} />
      <Route path="/clearly-vs-confluence" element={<ClearlyVsConfluencePage />} />

      {/* Public pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/case-studies" element={<CaseStudiesPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />

      {/* Docs pages */}
      <Route path="/docs/brd" element={<BRDDocPage />} />
      <Route path="/docs/prd" element={<PRDDocPage />} />
      <Route path="/docs/brd-guide" element={<BRDGuidePage />} />
      <Route path="/docs/prd-guide" element={<PRDGuidePage />} />
      <Route path="/docs/vibe-coding" element={<VibeCodingPage />} />
      <Route path="/docs/how-to-use" element={<HowToUsePage />} />
      <Route path="/docs/software-development-process" element={<SoftwareProcessPage />} />
      <Route path="/docs/software-development-process-guide" element={<SoftwareProcessGuidePage />} />
    </Routes>
  );
}
