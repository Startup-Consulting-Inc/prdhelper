/**
 * Public Routes — SSR-safe route tree
 *
 * Contains only public pages that have no dependency on Firebase, AuthContext,
 * or tRPC. Used by the SSR entry point to prerender public pages at build time.
 *
 * Blog post metadata lives in src/data/blogPosts.ts (single source of truth);
 * the slug → component wiring lives here. Every slug in blogPosts.ts MUST have
 * a matching component below — the assertion enforces this so a new post can
 * never be silently dropped from prerender/sitemap again.
 */

import { Routes, Route } from 'react-router-dom';
import type { ComponentType } from 'react';
import { blogPosts, blogRoutePaths } from './data/blogPosts';
import { authors } from './data/authors';

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
import CSDegreeAIEraPost from './pages/public/blog/CSDegreeAIEraPost';
import DatabaseLandscapeAIEraPost from './pages/public/blog/DatabaseLandscapeAIEraPost';
import AgenticAIGuidePost from './pages/public/blog/AgenticAIGuidePost';
import DataGovernanceAIEraPost from './pages/public/blog/DataGovernanceAIEraPost';
import ResponsibleAIGuidePost from './pages/public/blog/ResponsibleAIGuidePost';
import EntryLevelTech2026Post from './pages/public/blog/EntryLevelTech2026Post';
import AIInterviewTransformationPost from './pages/public/blog/AIInterviewTransformationPost';
import IdentityCollapseCaregivingPost from './pages/public/blog/IdentityCollapseCaregivingPost';
import HermesLLMWikiPost from './pages/public/blog/HermesLLMWikiPost';
import LLMWikiHermesAgentPost from './pages/public/blog/LLMWikiHermesAgentPost';
import GraphifyWikiBuildPost from './pages/public/blog/GraphifyWikiBuildPost';
import AnthropicVsOpenRouterOpusPost from './pages/public/blog/AnthropicVsOpenRouterOpusPost';
import HermesAgentCostSavingPost from './pages/public/blog/HermesAgentCostSavingPost';
import SkillsVsAgentsPost from './pages/public/blog/SkillsVsAgentsPost';
import BeyondVibeCodingPost01 from './pages/public/blog/BeyondVibeCodingPost01';
import BeyondVibeCodingPost02 from './pages/public/blog/BeyondVibeCodingPost02';
import BeyondVibeCodingPost03 from './pages/public/blog/BeyondVibeCodingPost03';
import BeyondVibeCodingPost04 from './pages/public/blog/BeyondVibeCodingPost04';
import BeyondVibeCodingPost05 from './pages/public/blog/BeyondVibeCodingPost05';

// Tool pages
import BRDGeneratorPage from './pages/public/BRDGeneratorPage';
import PRDGeneratorPage from './pages/public/PRDGeneratorPage';

// Comparison pages
import ClearlyVsChatPRDPage from './pages/public/ClearlyVsChatPRDPage';
import ClearlyVsManualPage from './pages/public/ClearlyVsManualPage';
import ClearlyVsConfluencePage from './pages/public/ClearlyVsConfluencePage';

// Public pages
import AboutPage from './pages/public/AboutPage';
import BlogPage from './pages/public/BlogPage';
import SitemapPage from './pages/public/SitemapPage';
import FAQPage from './pages/public/FAQPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import AuthorPage from './pages/public/AuthorPage';

// Docs pages
import BRDDocPage from './pages/public/docs/BRDDocPage';
import PRDDocPage from './pages/public/docs/PRDDocPage';
import BRDGuidePage from './pages/public/docs/BRDGuidePage';
import PRDGuidePage from './pages/public/docs/PRDGuidePage';
import VibeCodingPage from './pages/public/docs/VibeCodingPage';
import HowToUsePage from './pages/public/docs/HowToUsePage';
import SoftwareProcessPage from './pages/public/docs/SoftwareProcessPage';
import SoftwareProcessGuidePage from './pages/public/docs/SoftwareProcessGuidePage';

/** slug → blog post component. Keys must match blogPosts.ts slugs exactly. */
const BLOG_COMPONENTS: Record<string, ComponentType> = {
  'brd-vs-prd': BRDvsPRDPost,
  'how-to-write-a-brd-2026': HowToWriteABRD2026Post,
  'prd-template-guide': PRDTemplateGuidePost,
  'ai-requirements-gathering': AIRequirementsGatheringPost,
  'user-stories-vs-requirements': UserStoriesVsRequirementsPost,
  'acceptance-criteria-examples': AcceptanceCriteriaExamplesPost,
  'requirements-management-tools-2026': RequirementsManagementTools2026Post,
  'how-to-write-user-stories': HowToWriteUserStoriesPost,
  'functional-vs-non-functional-requirements': FunctionalVsNonFunctionalPost,
  'ai-coding-tools-requirements': AICodingToolsRequirementsPost,
  'brd-templates-by-industry': BRDTemplatesByIndustryPost,
  'requirements-elicitation-guide': RequirementsElicitationPost,
  'reduce-scope-creep-requirements': ReduceScopeCreepPost,
  'brd-mistakes-to-avoid': BRDMistakesPost,
  'agile-requirements-documentation': AgileRequirementsPost,
  'how-to-write-srs-document': SRSDocumentGuidePost,
  'ai-assisted-documentation': AIAssistedDocumentationPost,
  'why-every-ai-project-needs-prd': WhyEveryAIProjectNeedsPRDPost,
  'complete-guide-to-writing-brds': CompleteGuideToWritingBRDsPost,
  'translate-user-needs-to-requirements': TranslateUserNeedsPost,
  'defining-the-right-problem-ai-era': DefiningTheRightProblemPost,
  'cs-degree-ai-era': CSDegreeAIEraPost,
  'database-landscape-ai-era': DatabaseLandscapeAIEraPost,
  'agentic-ai-guide': AgenticAIGuidePost,
  'data-governance-ai-era': DataGovernanceAIEraPost,
  'responsible-ai-guide': ResponsibleAIGuidePost,
  'entry-level-tech-2026': EntryLevelTech2026Post,
  'ai-interview-transformation-2026': AIInterviewTransformationPost,
  'engineer-caregiver-identity-collapse': IdentityCollapseCaregivingPost,
  'hermes-llm-wiki': HermesLLMWikiPost,
  'llm-wiki-hermes-agent': LLMWikiHermesAgentPost,
  'graphify-wiki-build': GraphifyWikiBuildPost,
  'anthropic-vs-openrouter-opus': AnthropicVsOpenRouterOpusPost,
  'hermes-agent-cost-saving': HermesAgentCostSavingPost,
  'skills-vs-agents': SkillsVsAgentsPost,
  'vibe-coded-app-why-it-breaks': BeyondVibeCodingPost01,
  'the-one-file-every-ai-developer-needs': BeyondVibeCodingPost02,
  'stop-losing-architectural-decisions': BeyondVibeCodingPost03,
  'two-docs-before-2am-crisis': BeyondVibeCodingPost04,
  'retrofit-engineering-discipline-in-a-day': BeyondVibeCodingPost05,
};

// Fail the build if a registered post has no component wired (prevents the
// silent prerender/sitemap drift this registry was created to fix).
const missingComponents = blogPosts
  .filter((p) => !BLOG_COMPONENTS[p.slug])
  .map((p) => p.slug);
if (missingComponents.length > 0) {
  throw new Error(
    `public-routes: no component wired for blog slug(s): ${missingComponents.join(', ')}`
  );
}

/** Non-blog public routes that are SSR-safe and should be prerendered. */
export const STATIC_PUBLIC_ROUTES: string[] = [
  '/about',
  '/blog',
  '/sitemap',
  '/faq',
  '/privacy',
  '/terms',
  '/brd-generator',
  '/prd-generator',
  '/clearly-vs-chatprd',
  '/clearly-vs-manual',
  '/clearly-vs-confluence',
  '/docs/brd',
  '/docs/prd',
  '/docs/brd-guide',
  '/docs/prd-guide',
  '/docs/vibe-coding',
  '/docs/how-to-use',
  '/docs/software-development-process',
  '/docs/software-development-process-guide',
];

/** Author bio pages, derived from the authors registry. */
export const AUTHOR_ROUTES: string[] = authors.map((a) => `/authors/${a.slug}`);

/** Every prerenderable public route (single source for prerender + sitemap). */
export const PUBLIC_ROUTES: string[] = [
  ...STATIC_PUBLIC_ROUTES,
  ...AUTHOR_ROUTES,
  ...blogRoutePaths,
];

export function PublicRoutes() {
  return (
    <Routes>
      {/* Blog posts — driven by the registry */}
      {blogPosts.map((post) => {
        const Component = BLOG_COMPONENTS[post.slug];
        return (
          <Route key={post.slug} path={`/blog/${post.slug}`} element={<Component />} />
        );
      })}

      {/* Tool pages */}
      <Route path="/brd-generator" element={<BRDGeneratorPage />} />
      <Route path="/prd-generator" element={<PRDGeneratorPage />} />

      {/* Comparison pages */}
      <Route path="/clearly-vs-chatprd" element={<ClearlyVsChatPRDPage />} />
      <Route path="/clearly-vs-manual" element={<ClearlyVsManualPage />} />
      <Route path="/clearly-vs-confluence" element={<ClearlyVsConfluencePage />} />

      {/* Public pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/authors/:slug" element={<AuthorPage />} />

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
