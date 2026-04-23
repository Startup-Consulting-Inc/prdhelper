/**
 * Blog Post: Agents vs Skills — skills, MCP, progressive disclosure
 * Source: docs/skills-vs-agents.md + docs/skills-vs-agents.png
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import skillsVsAgentsImg from '../../../assets/skills-vs-agents.png';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an Anthropic Skill, mechanically?',
    answer:
      'A Skill is a folder containing a SKILL.md file. The file has YAML frontmatter (name and one-line description) and a body of instructions. It can bundle reference docs, scripts, and templates. There is no new API, no framework, and no central registry required. At session start, only metadata loads; the full body and referenced files load when the task needs them (progressive disclosure).',
  },
  {
    question: 'What does "stop building agents" really mean?',
    answer:
      'The phrase from Anthropic’s messaging is rhetorically loud but technically softer than it sounds. The point is not "never build an agent again." It is: stop building a different specialized agent scaffold for every domain (legal, finance, HR, etc.) when one general-purpose agent with a filesystem, runtime, and a library of Skills can cover those jobs. Rebuild the expertise as Skills, not as duplicate agent chassis.',
  },
  {
    question: 'Are Skills replacing MCP?',
    answer:
      'No — they solve different problems. MCP provides capabilities (live APIs, auth, tools like Gmail or Playwright). Skills provide technique (how to do a job well: checklists, failure handling, definition of done). MCP tool definitions can consume a large fraction of the context window at session start; Skills only load full content when relevant. Production setups often use both: Skills for workflow playbooks, MCP for live access to services.',
  },
  {
    question: 'What is progressive disclosure for Skills?',
    answer:
      'Level 1: metadata (name + description, ~100 tokens per skill) loads at startup so the model knows what exists. Level 2: the full SKILL.md loads when the agent decides the skill applies (~thousands of tokens, bounded). Level 3: referenced files and scripts load on demand. That means you can keep hundreds of skills installed without paying the full token cost for all of them upfront.',
  },
  {
    question: 'When should I build a Skill vs an MCP server?',
    answer:
      'Build a Skill when you are repeating the same instructions, when procedural knowledge lives in someone’s head, or when you need consistent quality and a clear definition of done. Build or use MCP when you need live data, authentication, real-time state, or centralized governance — when the problem is access, not know-how.',
  },
  {
    question: 'Can non-developers write Skills?',
    answer:
      'Yes. Anthropic has described accounting, legal, and recruiting professionals already writing Skills because a Skill is mostly structured instructions in Markdown plus optional assets — closer to documenting a playbook than shipping a microservice.',
  },
  {
    question: 'What architecture should I aim for?',
    answer:
      'The convergent pattern is: one general-purpose agent runtime, a library of Skills for domain expertise loaded lazily, and MCP servers (or equivalent tools) for external systems. The expensive part to maintain is expertise; package it once, load it when needed, and avoid rebuilding identical agent shells per vertical.',
  },
];

export default function SkillsVsAgentsPost() {
  return (
    <BlogPostLayout
      title="Agents vs Skills: The Full Picture — One Agent, a Skill Library, and Where MCP Fits"
      author="Jaehee Song"
      date="2026-04-23"
      readTime="14 min read"
      category="AI & Development"
      excerpt="The “stop building agents” line is about duplicate scaffolding, not about deleting agents. Here is how Anthropic frames Skills, progressive disclosure, and why MCP and Skills are complementary — plus a clear old-vs-new mental model."
      slug="skills-vs-agents"
      coverImage="SV"
      coverGradient="from-violet-700 via-fuchsia-600 to-amber-500"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
        {
          slug: 'hermes-agent-cost-saving',
          title: 'The $30 Bill That Should Have Been $7: Cost-Saving Moves for a Real AI Agent',
          category: 'AI & Development',
          date: '2026-04-22',
        },
        {
          slug: 'graphify-wiki-build',
          title: 'From Scattered Notes to a Living Knowledge Graph: Building LLM Wiki + Graphify',
          category: 'AI & Development',
          date: '2026-04-21',
        },
        {
          slug: 'llm-wiki-hermes-agent',
          title: 'How I Built a Web-Based LLM Wiki with Hermes Agent (And Why I Skipped Obsidian)',
          category: 'AI & Development',
          date: '2026-04-16',
        },
      ]}
    >
      {/* Lead */}
      <div className="not-prose bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-7 my-10">
        <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-widest mb-4">
          The short version
        </p>
        <p className="text-base leading-8 text-gray-800 dark:text-gray-200">
          The viral framing — <em>“Stop building agents”</em> — is rhetorically loud, but it is
          technically softer than it sounds. People like Barry Zhang and Mahesh Murag (in public
          talks on this topic) are not saying you should never run an agent again. They are
          saying:{' '}
          <strong>stop building a different specialized agent for every domain</strong>. Instead,
          build <strong>one general-purpose agent</strong> and give it a <strong>library of Skills</strong>{' '}
          it can load when a task needs them.
        </p>
        <p className="text-base leading-8 text-gray-800 dark:text-gray-200 mt-5">
          The infographic below is the cleanest picture of the shift: from six siloed “domain
          agents” to <strong>one runtime</strong> plus <strong>composable SKILL.md</strong> playbooks. Everything
          below unpacks that diagram with mechanics, token math, and where MCP still belongs.
        </p>
      </div>

      <p>
        To understand the argument, you have to separate <strong>the agent shell</strong> (model +
        runtime + tools + filesystem) from <strong>the expertise</strong> (how to do a specific job well).
        The claim is that the shell converges, and the interesting work moves into Skills — not
        into yet another one-off agent repo.
      </p>

      {/* Infographic */}
      <figure className="not-prose my-10">
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 shadow-sm">
          <img
            src={skillsVsAgentsImg}
            alt="Comparison: old paradigm with six siloed domain agents (code, legal, finance, HR, sales, ops) versus new paradigm with one general agent and a library of SKILL.md files (pdf, xlsx, seo-audit, etc.)"
            className="w-full h-auto"
            loading="eager"
          />
        </div>
        <figcaption className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-800 dark:text-gray-200">Old vs new.</span>{' '}
          The left: duplicate scaffolding, no sharing. The right: a single general agent (model +
          runtime + filesystem) that pulls only the <code className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">SKILL.md</code>
          {' '}
          (and reference files) that the current task needs.
        </figcaption>
      </figure>

      <h2>The real diagnosis</h2>

      <p>
        Anthropic’s view is that a lot of recent agent development chased the wrong variable. The
        line that stuck with me: we used to assume agents in different domains would look very
        different. In practice, the <em>agent underneath</em> is more universal than that. Once
        you have a model connected to a runtime with a filesystem and code execution (the rough
        shape of the Claude Code pattern), the scaffolding does not need to be rebuilt for every
        use case. <strong>What actually varies is domain knowledge.</strong>
      </p>

      <p>
        The tax analogy lands because it is unfair to both sides. Would you rather have a
        300-IQ system that has never read the tax code, or a 20-year accountant? Today’s models
        are capable, but they still miss context you have not given them, cannot absorb your
        private expertise by default, and do not “learn your company” unless you put that
        knowledge somewhere they can use. <strong>Skills are where you package that expertise</strong> once,
        in a file tree, with progressive loading — instead of re-explaining it every session or
        hard-coding it into six different agents.
      </p>

      <h2>What a Skill actually is, mechanically</h2>

      <p>
        A Skill is a folder. Inside it, at minimum, a <code>SKILL.md</code>. The markdown has{' '}
        <strong>YAML frontmatter</strong> (a name and a one-line description) and a body of
        instructions. It can also ship supporting material: long reference documents, small Python
        scripts, templates. <strong>No new public API, no required framework, no central registry</strong> — it
        is a packaging convention, not a new cloud product.
      </p>

      <p>
        The part that changes cost curves is <strong>progressive disclosure</strong>, split into three
        levels. Here is the honest accounting of <em>when</em> each layer hits the context window.
      </p>

      <div className="not-prose overflow-x-auto my-10 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
                When it loads
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
                Rough cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">1 · Metadata</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 leading-7">
                Name + one-line description
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 leading-7">At startup</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">
                ~100 tokens / skill
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">2 · Skill body</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 leading-7">Full instructions in SKILL.md</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 leading-7">When the agent picks the skill</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">Up to ~5K tokens (typical cap)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">3 · References</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 leading-7">
                Extra docs, data, scripts, assets
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 leading-7">When the body points at them</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">On demand</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        At startup, the system only needs enough text to know <strong>that a skill exists and what it is for</strong>.
        {''} That means you can keep <strong>hundreds of skills</strong> “installed” without paying thousands of
        tokens per skill before the first user message. When a task matches, the model reads the
        full <code>SKILL.md</code>. If the body references other files, it can open them through normal
        filesystem and shell behavior; scripts can execute without their entire source being pasted
        into the chat window. Bundled content that is never used stays <strong>at zero context cost</strong>.
      </p>

      <h2>Skills and MCP: complementary, not competitors</h2>

      <p>
        This matters a lot if you are already <strong>heavy on MCP</strong> (Model Context Protocol). The two
        sit at different layers. A simple split that has held up in real conversations:
      </p>

      <div className="not-prose grid sm:grid-cols-2 gap-5 my-10">
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-900/20 p-6">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest mb-3">
            MCP
          </p>
          <p className="text-sm leading-7 text-gray-800 dark:text-gray-200">
            <strong>Capabilities</strong> — what the agent is allowed to <em>do</em>. Call Gmail, query GSC, post
            to Slack, control a browser. This is the “plumbing to the outside world.”
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-900/20 p-6">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-3">
            Skills
          </p>
          <p className="text-sm leading-7 text-gray-800 dark:text-gray-200">
            <strong>Technique</strong> — <em>how</em> to do a job well. Checklists, ordering, failure handling,
            what “done” means for your org. This is the “playbook,” not the socket.
          </p>
        </div>
      </div>

      <p>
        Why people compare them at all: a typical MCP-heavy session can shove a <strong>large</strong> share of
        the context window into <strong>tool definitions alone</strong> before a single end-user action. Connect
        several servers and the descriptions add up fast — in worst cases, a majority of a very
        large window, depending on your stack. MCP tends to <strong>load those descriptions in full at
        session start</strong>, whether the conversation will ever call half of the tools. Skills are
        designed to avoid that tax for domain knowledge: only metadata is always on.
      </p>

      <p>
        The production-friendly middle is not “Skills instead of MCP.” It is:{' '}
        <strong>use both</strong> — Skills describe the workflow, MCP servers (or your own tool layer)
        provide the <em>live</em> connections the workflow references. If you go all-in on skills and skip
        tools, the agent can read a brilliant playbook and still have nothing to <em>call</em>. If you
        go all-in on MCP, you can end up with tool sprawl and a pile of half-thin API wrappers. The
        architecture that wins in messy products is <strong>Skills + tools</strong> with a clear line between
        know-how and access.
      </p>

      <h2>The mental model that actually lands: processor, OS, apps</h2>

      <p>
        The cleanest analogy I have seen for this (and the one worth memorizing) is the classic
        three-layer picture:
      </p>

      <ul>
        <li>
          <strong>Models</strong> are like <strong>processors</strong> — huge investment, huge ceiling, not very useful
          as a box sitting alone on a desk.
        </li>
        <li>
          <strong>Agent runtimes</strong> are the <strong>operating system</strong> — scheduling, files, permissions,
          bringing work to the processor.
        </li>
        <li>
          <strong>Skills</strong> are <strong>applications</strong> — where real-world expertise and taste live, in the
          hands of people who are not, and should not have to be, OS authors.
        </li>
      </ul>

      <p>
        Only a handful of companies will ship “processors.” A modest number will ship
        “operating systems” for agents. <strong>Millions</strong> can ship <strong>apps</strong> if the app format is a folder
        and a <code>SKILL.md</code> — and that, in part, is the bet: open the <em>expertise layer</em> to people in
        legal, accounting, recruiting, and every other function that already has internal runbooks
        and checklists, not microservices in production.
      </p>

      <h2>When to build a Skill — and when to build something else</h2>

      <h3>Build a Skill when…</h3>
      <ul>
        <li>You keep pasting the same multi-step instructions into new chats.</li>
        <li>Procedural knowledge only lives in a senior person’s head.</li>
        <li>The job has a real “definition of done,” but the shape of that “done” depends on context.</li>
        <li>You need consistent style or quality across a recurring workflow (reports, reviews, handoffs).</li>
      </ul>

      <h3>Build or use MCP (or other tools) when…</h3>
      <ul>
        <li>
          The bottleneck is <strong>access</strong> — live data, sign-in, real-time system state, rate limits, org
          policy — not a missing paragraph of instructions.
        </li>
        <li>
          You need a governed, centralized integration that many agents or humans share (the right
          home for a server, not a static markdown file).
        </li>
      </ul>

      <h3>Do not build a one-off “domain agent from scratch” when…</h3>
      <p>
        A <strong>single general agent</strong> with the <strong>right Skills and tools</strong> can handle the work. This is
        the design critique behind the “stop building agents” slogan: a lot of teams rebuilt the
        same <em>chassis</em> (routing, file IO, error handling) for every vertical, when the chassis could
        be shared and the per-vertical part could be a Skill library.
      </p>

      <h2>A counter-point worth keeping</h2>

      <p>
        The narrative “Skills killed MCP” has thinned in the months since these ideas went wide.
        Teams running <strong>both</strong> in production often report a messier story: in pure coding agents,
        strong editor and documentation <strong>tools</strong> (sometimes delivered via MCP) are enough to
        make the model useful <em>most</em> of the time, and a Skill is not always the missing piece. The
        honest takeaway is not “Skills always win” or “MCP always wins.” It is:{' '}
        <strong>match the mechanism to the failure mode</strong> — is the gap primarily <em>access</em> to systems
        (MCP) or <em>technique</em> and taste (Skills)? In real products, the answer is frequently “some of
        each.”
      </p>

      <h2>What this means in practice (including multi-agent stacks)</h2>

      <p>
        If you run something like a “Hermes” style stack with separate automations for SEO,
        monitoring, reports, and content, ask a blunt question: which parts are <strong>actually different
        runtimes or isolation boundaries</strong> (parallelism, different trust zones, different triggers),
        and which are <strong>really different bodies of know-how</strong> that could be Skills for one agent? The
        first stays multiple processes if it must. The second is where duplication hurts.
      </p>

      <p>
        Progressive disclosure is especially strong for <strong>multi-site or multi-tenant</strong> editorial and
        SEO work. A <code>seo-audit</code> skill can carry per-site reference files and only read the one
        that matches the current property — <strong>leaner</strong> than shoving every site’s voice guidelines into
        one static system prompt, or running five separate “agents” for five blogs when one runtime
        would do. The same idea applies to bilingual or multi-format content: one <code>SKILL.md</code> for
        voice, plus small reference files per format, is easier to govern than re-explaining rules
        every time.
      </p>

      <h2>Bottom line</h2>

      <p>
        The shape that is converging is:{' '}
        <strong>one general-purpose agent runtime, a library of Skills for expertise, and tools (often
        MCP) for the outside world</strong>. The loud version of the message — “stop building agents” — is
        really: <em>stop rebuilding the same agent chassis for every domain.</em> The hard part is the
        expertise. Package it once, load it lazily, and let the shared runtime do the rest.
      </p>
    </BlogPostLayout>
  );
}
