/** @jsxImportSource react */

/**
 * Why Agentic Coding Needs Better Requirements — Not Faster Vibes (2026)
 *
 * Fresh September 2026 update with new confessional angle on quality debt
 * and agentic coding requirements.
 */

import { PublicLayout } from '../../../components/layout/PublicLayout';
import { SEO } from '../../../components/SEO';
import { BlogPostLayout } from '../../../components/blog/BlogPostLayout';
import { AlertTriangle, CheckCircle, BookOpen, ArrowRight, Lightbulb } from 'lucide-react';

const faqs = [
  {
    question: 'What is the best BRD generator for AI projects?',
    answer:
      'The best BRD generator for AI projects combines structured formatting with tool-specific export. Look for generators that output Markdown for Cursor/Claude Code, JSON for v0/Replit, and plain-English for stakeholder review. ClearlyReqs is a free BRD generator designed specifically for AI workflows — it structures requirements into prompts that AI coding tools can parse without interpretation errors.',
  },
  {
    question: 'Can non-developers turn a BRD into a working app?',
    answer:
      'Yes, non-developers can turn a BRD into a working app by pairing a structured requirements document with no-code or AI-coding platforms. The workflow is: (1) generate a detailed BRD using a requirements tool, (2) export it as prompts for Lovable, v0, or Replit, (3) follow a guided build course to translate requirements into working software. BuildWithAI offers a 12-part non-developer series that teaches this exact workflow using BRDs generated from ClearlyReqs.',
  },
  {
    question: 'What should a product requirements document include in 2026?',
    answer:
      'A product requirements document in 2026 should include five sections optimized for AI coding tools: (1) Problem Definition with business context, (2) Scope Boundaries listing both in-scope and out-of-scope features, (3) User Personas with role-based permissions, (4) Success Metrics converted into testable acceptance criteria, and (5) Tool Output Format specifying how requirements will be exported to AI coding platforms like Cursor, Lovable, or Claude Code.',
  },
  {
    question: 'What is "quality debt" in AI development?',
    answer:
      'Quality debt in AI development is the cost of rebuilding software because requirements were vague or missing when AI agents generated the initial code. Unlike traditional technical debt (messy code), quality debt stems from building the wrong thing quickly. Builder.io identified this trend in May 2026, noting that agent productivity is accelerating output faster than requirements discipline can keep up. The fix is writing structured BRDs and PRDs before starting AI-generated builds.',
  },
  {
    question: 'BRD vs PRD — which comes first for AI projects?',
    answer:
      'For AI projects, the Business Requirements Document (BRD) always comes first, followed by the Product Requirements Document (PRD). The BRD defines business goals, stakeholders, and scope for stakeholder approval. The PRD translates those business requirements into technical specifications for AI coding tools. Non-developers should focus on the BRD; technical leads or AI tools generate the PRD. ClearlyReqs uses a 3-step wizard that enforces this sequence: Problem Definition → BRD → PRD.',
  },
];

export default function AgenticCodingNeedsRequirementsSep2026Post() {
  return (
    <PublicLayout>
      <SEO
        title="Why Agentic Coding Needs Better Requirements — Not Faster Vibes (2026) | ClearlyReqs"
        description="Builder.io proved apps can be built from PRDs in 60 min. They didn't measure rebuilds. Learn why structured BRDs prevent AI quality debt."
        path="/blog/agentic-coding-needs-requirements-sep-2026"
        type="article"
      />
      <BlogPostLayout
        title="Why Agentic Coding Needs Better Requirements — Not Faster Vibes (2026)"
        date="September 24, 2026"
        readTime="9 min read"
        category="AI & Development"
        author="ClearlyReqs Team"
      >
        {/* Hook Section */}
        <section className="mb-10">
          <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            <strong className="text-gray-900 dark:text-white">
              Builder.io just proved 270 people can build an app from a PRD in 60 minutes. They didn't measure how many had to rebuild it the next week.
            </strong>
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            That's the part nobody's talking about. Not because they're hiding something, but because "rebuilt in 7 days" doesn't make for a good headline. We love the story of the solo founder who vibed their way to a working product. We don't love the follow-up where they spend three weekends untangling authentication flows they never defined.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
            Here's what I can tell you after watching this play out for the past year: agentic coding isn't failing because the AI is getting worse. It's failing because we're getting lazier about the one thing that actually matters.
          </p>
        </section>

        {/* The Speed Trap */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            The Speed Trap Nobody Saw Coming
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Aha! Builder went GA last month and promised product managers they could build apps with zero technical skills. What they didn't mention: the rebuild cycle that hits at week three when your requirements were vague.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            I've seen this pattern now in a dozen founders. They fire up Cursor or Lovable, paste in a ChatGPT-generated PRD, and watch the AI spit out functional code. It feels like magic. For about 48 hours.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Then the edge cases arrive. The user who needs a different permission level. The feature that "should be simple" but touches three parts of the codebase. The integration that needs API credentials you never documented.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Suddenly that 60-minute build becomes a 60-hour refactor. And here's the kicker: the AI is still just as fast. The bottleneck is you, figuring out what you actually wanted in the first place.
          </p>
        </section>

        {/* Quality Debt Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            What "Quality Debt" Actually Means (And Why Builder.io Warned Us)
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            In May 2026, Builder.io published something that should have been a headline everywhere. They called it "quality debt" — the cost of building fast without building right.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Traditional technical debt is messy code. Quality debt is something worse: it's building the wrong thing efficiently. AI agents don't question your requirements. They execute the fastest interpretation of whatever you gave them. If your PRD says "users can sign up," the AI builds the simplest auth flow it knows. It doesn't ask about OAuth, or password complexity rules, or what happens when someone tries to register with a disposable email.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            You didn't forget those details. You just never wrote them down. And AI doesn't read minds — it reads prompts.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
            The Builder.io team put it bluntly: agent productivity is accelerating output faster than requirements discipline can keep up. That gap is where quality debt lives.
          </p>
        </section>

        {/* Personal Confession */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            The Confession I Have to Make
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            I need to tell you about Marcus. He came to us after his third "vibe coding" attempt imploded.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Marcus is a former marketing director who wanted to build a niche SaaS tool for content teams. Smart guy. Hired a developer originally, but the quotes were $15K-$25K for an MVP. So he went the AI route instead.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            <strong>First attempt:</strong> Lovable, six hours of prompting, got something that looked right. Launched to beta. Realized he'd never defined what "content approval" actually meant — did the manager get notified? Could they comment? What about rejection workflows? His users were confused. The rebuild took four days.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            <strong>Second attempt:</strong> Cursor this time, more technical. He generated a PRD first (progress!), but copy-pasted it from ChatGPT. No structure, no scope boundaries, just 2,000 words of generic "the system shall" statements. The AI built something that technically worked. But the user roles were wrong — he'd said "admin" and "user" but meant "editor," "approver," and "viewer." Three weeks of user complaints later, he was rewriting authentication from scratch.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            <strong>Third attempt:</strong> That's when he found us. We walked him through generating an actual BRD first. Not a ChatGPT dump — a structured document with explicit scope, user personas, and success metrics. He told me later it felt slower at the start. "I just wanted to build," he said. "But those extra 45 minutes saved me probably 40 hours of rebuilding."
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Marcus's story isn't unique. It's just the one that sticks with me because I saw the frustration in his messages. He wasn't failing because he couldn't code. He was failing because he thought AI could replace the thinking, not just the typing.
          </p>
        </section>

        {/* BRD Must-Haves */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            What a BRD for AI Projects Must Include (2026 Edition)
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            If you're going to hand requirements to an AI coding agent, you need a different standard than the BRDs of 2020. Here's what's actually working right now:
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                1. Problem Definition → AI Context Block
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Don't just say what you're building. Say why it matters. The "why" becomes the guardrails that keep AI agents aligned. Format it like this: [Business problem] + [User pain] + [Current workaround].
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                2. Scope Boundaries → Guardrails
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Every BRD needs two lists: what's in scope, and what's explicitly out of scope. AI agents are helpful to a fault. If you don't say "notifications are version 2," they might build notification logic because it seems implied.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                3. User Personas → Role Matrix
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Don't just list personas. Map them to permissions. Format: Persona | Goal | Permission Level | Edge Case. This prevents the "what if an admin wants to see everything" scramble in week two.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                4. Success Metrics → Test Criteria
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Convert "fast load times" into "page load &lt; 2 seconds on 3G." Convert "intuitive UI" into "new user completes first task without help documentation." AI agents can generate tests from these criteria. They can't generate tests from "good UX."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                5. Tool Output Format → Prompt-Ready Export
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                One document, multiple formats: Markdown for Cursor/Claude Code, JSON for v0/Replit, plain-English for stakeholders. Non-developers need the human-readable version; AI tools need structured prompts.
              </p>
            </div>
          </div>
        </section>

        {/* Non-Developer Workflow */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            The Non-Developer Workflow That Actually Works
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Here's the two-step process we're seeing work for non-technical founders:
          </p>
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Step 1: Generate BRD with ClearlyReqs (15 minutes)</h4>
                  <p className="text-gray-700 dark:text-gray-300">Use the wizard: Problem Definition → BRD → PRD. The output is structured Markdown plus AI-ready prompts. No blank-page syndrome.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Step 2: Learn to Build with BuildWithAI</h4>
                  <p className="text-gray-700 dark:text-gray-300">This is the bridge most people miss. Requirements are the curriculum. Building is the homework. BuildWithAI's 12-part series teaches non-developers how to take those requirements and actually ship.</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            The BRD you generate becomes the textbook. The AI coding tool becomes the compiler. You become the product manager.
          </p>
        </section>

        {/* Gotchas */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            The Gotchas Nobody Warns You About
          </h2>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 p-5 rounded-r-lg">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                The "Vibe First, Define Later" Trap
              </h4>
              <p className="text-amber-800 dark:text-amber-300">
                <strong>Mistake:</strong> Start coding in Cursor/Lovable, then try to write the BRD retroactively.
                <br /><br />
                <strong>Why it fails:</strong> Retroactive BRDs capture what you built, not what you needed. They become documentation, not requirements.
                <br /><br />
                <strong>Fix:</strong> Write the BRD before generating the first line of code. Use the BRD as the system prompt.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 p-5 rounded-r-lg">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                The ChatGPT BRD (Unstructured Prose)
              </h4>
              <p className="text-amber-800 dark:text-amber-300">
                <strong>Mistake:</strong> "Write me a BRD for a fitness app" → 2,000 words of generic prose.
                <br /><br />
                <strong>Why it fails:</strong> AI coding tools need structure (tables, headers, explicit scope). Unstructured prose forces the AI to interpret, which introduces errors.
                <br /><br />
                <strong>Fix:</strong> Use a structured generator (ClearlyReqs, formal templates) that enforces sections and formatting.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 p-5 rounded-r-lg">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                The Missing "Out of Scope" Section
              </h4>
              <p className="text-amber-800 dark:text-amber-300">
                <strong>Mistake:</strong> Defining what the product does, but never stating what it explicitly does <em>not</em> do.
                <br /><br />
                <strong>Why it fails:</strong> AI agents will "helpfully" add features they assume are implied. Scope creep becomes automatic.
                <br /><br />
                <strong>Fix:</strong> Every BRD needs a bullet list of "Explicitly Out of Scope" items.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 p-5 rounded-r-lg">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Confusing BRD and PRD Timing
              </h4>
              <p className="text-amber-800 dark:text-amber-300">
                <strong>Mistake:</strong> Writing a PRD before the BRD is approved, or merging both into one messy document.
                <br /><br />
                <strong>Why it fails:</strong> Stakeholders sign off on business requirements (BRD) but get confused by technical specs (PRD).
                <br /><br />
                <strong>Fix:</strong> BRD first → stakeholder sign-off → PRD second → engineering handoff.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 p-5 rounded-r-lg">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Forgetting the Non-Developer Handoff
              </h4>
              <p className="text-amber-800 dark:text-amber-300">
                <strong>Mistake:</strong> Technical PM writes a great BRD, but the non-developer builder can't read it.
                <br /><br />
                <strong>Why it fails:</strong> AI coding tools are becoming accessible to non-developers, but requirement docs are still written in PM jargon.
                <br /><br />
                <strong>Fix:</strong> Generate two exports — one technical (for AI tools) and one plain-English (for human stakeholders).
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            Aha! Builder vs. ClearlyReqs + BuildWithAI
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Dimension</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Aha! Builder</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">ClearlyReqs + BuildWithAI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-gray-50 dark:even:bg-gray-800/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">Lock-in</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Aha! ecosystem only</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Tool-agnostic</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">Target</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Product managers</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Non-developers + PMs</td>
                </tr>
                <tr className="even:bg-gray-50 dark:even:bg-gray-800/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">Requirements layer</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Basic (Aha! native)</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">AI-generated, structured</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">Export to Cursor/Lovable/v0</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">No</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Yes (9 formats)</td>
                </tr>
                <tr className="even:bg-gray-50 dark:even:bg-gray-800/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">Learning curve</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Moderate (new platform)</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Low (web wizard + book)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">Price</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">$$$ (Aha! subscription)</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">Freemium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Different Way to Think */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            A Different Way to Think About Requirements
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            We've been sold a story that AI makes requirements obsolete. That you can just "vibe" your way to software.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            The truth is messier. AI doesn't eliminate requirements — it just changes who writes them and when they get discovered.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            In traditional development, you discover missing requirements during the planning phase. In agentic coding, you discover them in production.
          </p>
          <div className="bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-xl p-6 my-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                The choice isn't "requirements vs no requirements." It's "requirements now vs requirements later, when rebuilding costs 10x more."
              </p>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Structured BRDs aren't bureaucracy. They're the spell that makes the magic work.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            Start Small, Start Now
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            You don't need to become a requirements wizard overnight. You just need to do one thing differently on your next build: Write the BRD first. Not after. Not alongside. First.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            Spend 15 minutes in ClearlyReqs generating a structured BRD. Define the scope. List what's out. Map your user personas. Convert your success metrics into test criteria.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
            Then — and only then — open Cursor, or Lovable, or v0. Paste in your requirements as the system prompt. Watch what happens when the AI actually knows what you want.
          </p>

          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to stop rebuilding?</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Generate your structured BRD in ~15 minutes. Export to 9 AI coding formats. Build once, ship right.
            </p>
            <a
              href="https://clearlyreqs.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Generate your BRD free →
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-4 text-sm text-primary-200">
              Want the full workflow for non-developers? Grab the{' '}
              <a
                href="https://buildwithai.com"
                className="underline hover:text-white"
              >
                BuildWithAI series
              </a>{' '}
              on Amazon, Apple Books, or Google Play.
            </p>
          </div>
        </section>

        {/* Related Posts */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/blog/brd-vs-prd"
              className="block p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                BRD vs PRD: What's the Difference?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When to use each, which comes first, and outline-style sections you can copy.
              </p>
            </a>
            <a
              href="/blog/how-to-write-a-brd-2026"
              className="block p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                How to Write a BRD in 2026
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete step-by-step guide with AI-assisted writing and common pitfalls.
              </p>
            </a>
          </div>
        </section>
      </BlogPostLayout>
    </PublicLayout>
  );
}
