/**
 * Blog Post: Agentic AI — The Complete Guide to Autonomous AI Systems in 2026
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is agentic AI?',
    answer:
      'Agentic AI refers to AI systems that go beyond answering questions to autonomously setting goals, making plans, using tools, and executing multi-step tasks to achieve complex objectives. Unlike a chatbot that responds to a single prompt, an agentic system can browse the web, write and run code, call APIs, and chain many actions together — all without human intervention at each step.',
  },
  {
    question: 'How is agentic AI different from generative AI?',
    answer:
      'Generative AI operates in a stateless request-response loop — you ask, it answers, the interaction ends. Agentic AI maintains state across a session, decomposes complex goals into sub-tasks, uses external tools to gather information and take actions, and can self-correct when a step fails. Generative AI creates content; agentic AI executes workflows.',
  },
  {
    question: 'What are the main risks of deploying agentic AI in enterprise?',
    answer:
      'The top enterprise concerns are: hallucinated actions (82% of leaders concerned) — agents confidently executing wrong operations; security and data privacy risks (75%) from prompt injection attacks; lack of predictability (68%) in long multi-step chains; high compute costs (55%) from multiple LLM calls per task; and latency issues (40%) that make some real-time use cases impractical today.',
  },
  {
    question: 'Which industries are deploying agentic AI the most?',
    answer:
      'Software engineering leads with ~35% of enterprise agentic AI investment, focused on autonomous coding and DevOps. Financial services (20%) uses agents for deep research and real-time risk modeling. Customer support (20%) deploys agents for end-to-end ticket resolution. Healthcare (15%) focuses on clinical workflow automation. Retail (10%) targets dynamic supply chain optimization.',
  },
  {
    question: 'What are the leading agentic AI frameworks and platforms?',
    answer:
      'Development frameworks include LangChain/LangGraph and LlamaIndex. Multi-agent orchestration tools include Microsoft AutoGen and CrewAI. Autonomous systems include Devin for software engineering and AutoGPT for general tasks. Enterprise platforms include Microsoft Copilot Studio and Salesforce Agentforce for no/low-code agent deployment.',
  },
  {
    question: 'How much does it cost to run an agentic AI workflow?',
    answer:
      'A single complex agentic workflow can consume $0.50 to $2.00 in API credits due to multiple LLM calls for planning, tool use, and self-correction. Enterprise deployments at scale require cost optimization strategies including caching, using smaller models for sub-tasks, and limiting tool call depth.',
  },
];

export default function AgenticAIGuidePost() {
  return (
    <BlogPostLayout
      title="Agentic AI: The Complete Guide to Autonomous AI Systems in 2026"
      author="Jaehee Song"
      date="2026-04-14"
      readTime="14 min read"
      category="AI & Development"
      excerpt="From chatbots that answer to agents that act — a comprehensive guide to how agentic AI works, which industries are deploying it first, the tools driving adoption, and the risks you can't ignore."
      slug="agentic-ai-guide"
      coverImage="AI"
      coverGradient="from-teal-600 via-emerald-500 to-cyan-500"
      faqItems={FAQ_ITEMS}
    >
      <p>
        Something fundamental shifted in enterprise AI around 2025. The conversation stopped being
        about what AI could <em>say</em> and started being about what AI could <em>do</em>.
      </p>

      <p>
        That shift has a name: agentic AI. And it's moving faster than almost anyone predicted.
        According to recent enterprise surveys, 40% of organizations have already deployed agentic
        AI in some form, and 86% of executives now rate it a strategic priority — not a future
        experiment, a current initiative.
      </p>

      <div className="not-prose bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-8 my-8">
        <p className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide mb-6">
          By the Numbers
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-teal-700 dark:text-teal-400">40%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              of enterprises already deploying agentic AI
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-teal-700 dark:text-teal-400">86%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              of executives call it a strategic priority
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-teal-700 dark:text-teal-400">$47.8B</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              projected market size by 2030
            </div>
          </div>
        </div>
      </div>

      <p>
        This guide covers the full picture: what agentic AI actually is, how it works under the
        hood, where enterprises are deploying it first, which tools are driving adoption, what risks
        you need to manage, and where this is heading over the next three to five years.
      </p>

      <h2>What Makes AI "Agentic"?</h2>

      <p>
        There are three distinct generations of AI in production today, and conflating them causes
        real confusion. Here's how they differ:
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">Traditional AI</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pattern recognition, classification, and prediction from historical data. Highly
            specialized and deterministic — no generative or planning capabilities.
          </p>
          <div className="mt-4 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">
            Focus: Analysis
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">Generative AI</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Creates novel text, images, and code from prompts. Stateless — operates in a single
            request-response loop without persistent memory or tool use.
          </p>
          <div className="mt-4 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">
            Focus: Creation
          </div>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border-2 border-teal-400 dark:border-teal-600">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">Agentic AI</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Maintains state, breaks complex goals into tasks, uses external tools, and autonomously
            executes multi-step workflows toward a defined objective.
          </p>
          <div className="mt-4 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
            Focus: Action & Execution
          </div>
        </div>
      </div>

      <p>
        The critical distinction is <strong>agency</strong>: the capacity to perceive an
        environment, make decisions, take actions, and adapt based on results — all without a human
        approving each step. A generative AI writes a report when asked. An agentic AI decides what
        reports to write, gathers the data, writes them, and files them — on a schedule you define
        once.
      </p>

      <h2>How Agents Work: The Four-Phase Loop</h2>

      <p>
        Every agentic system — regardless of how it's branded — runs some version of a closed
        feedback loop. The most complete version has four phases:
      </p>

      <div className="not-prose space-y-3 my-8">
        {(
          [
            {
              num: '01',
              label: 'Sense',
              desc: 'The agent perceives its environment: user intent, available tools, current data state, and memory from prior interactions. This is the input-processing layer — quality here determines the accuracy of everything downstream.',
            },
            {
              num: '02',
              label: 'Reason & Plan',
              desc: 'Using techniques like Chain-of-Thought prompting, the agent decomposes complex requests into a sequence of smaller, achievable sub-tasks and selects appropriate tools for each step.',
            },
            {
              num: '03',
              label: 'Act',
              desc: 'The agent executes — browsing the web, calling APIs, writing and running code, querying databases, or delegating to a specialized sub-agent. This is where actions happen and where most security controls must be applied.',
            },
            {
              num: '04',
              label: 'Learn & Adapt',
              desc: 'Outcome feedback loops back into the next cycle. Agents update their working memory, flag failures, retry with different approaches, and refine future planning based on what worked and what did not.',
            },
          ] as const
        ).map(({ num, label, desc }) => (
          <div
            key={num}
            className="flex gap-4 items-start bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 flex items-center justify-center font-mono font-bold text-sm">
              {num}
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white mb-1">{label}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p>Here's what that loop looks like on a real-world task:</p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-6 border border-gray-700">
        <p className="font-mono text-sm text-gray-400 mb-4">
          User: "Research our top 3 competitors, summarize their Q3 earnings, and draft an email to
          the sales team."
        </p>
        <div className="font-mono text-sm space-y-1.5">
          <p>
            <span className="text-teal-400">[Planning]</span>{' '}
            <span className="text-gray-300">Identifying top 3 competitors from CRM context...</span>
          </p>
          <p>
            <span className="text-blue-400">[Action]</span>{' '}
            <span className="text-gray-300">Browsing web for Competitor A Q3 earnings report...</span>
          </p>
          <p>
            <span className="text-blue-400">[Action]</span>{' '}
            <span className="text-gray-300">Extracting key metrics: revenue, YoY growth, guidance...</span>
          </p>
          <p>
            <span className="text-blue-400">[Action]</span>{' '}
            <span className="text-gray-300">Repeating for Competitors B and C...</span>
          </p>
          <p>
            <span className="text-yellow-400">[Reasoning]</span>{' '}
            <span className="text-gray-300">Synthesizing findings into comparative summary...</span>
          </p>
          <p>
            <span className="text-blue-400">[Action]</span>{' '}
            <span className="text-gray-300">Drafting email in company tone from style guide...</span>
          </p>
          <p>
            <span className="text-green-400">[Complete]</span>{' '}
            <span className="text-gray-300">Draft ready. Awaiting user approval before send.</span>
          </p>
        </div>
      </div>

      <p>
        That last line matters. The best agentic systems today still insert a human-in-the-loop
        checkpoint before irreversible actions. This isn't a limitation — it's deliberate design.
      </p>

      <h2>The Five Architectural Building Blocks</h2>

      <p>
        Under the hood, enterprise-grade agents are built from five core components. Understanding
        them helps you evaluate tools, diagnose failures, and set realistic expectations.
      </p>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        {(
          [
            {
              icon: '👁️',
              title: 'Perception Engine',
              desc: 'Processes multi-modal inputs — text, images, structured data, API responses — into a unified context the model can reason about. Quality here determines the accuracy of everything downstream.',
            },
            {
              icon: '🧠',
              title: 'Planning & Reasoning Module',
              desc: 'Decomposes goals into sub-tasks, selects appropriate tools for each step, and manages the execution graph. Chain-of-Thought and Tree-of-Thought techniques live here.',
            },
            {
              icon: '💾',
              title: 'Memory System',
              desc: 'Manages working memory (the current session context), episodic memory (what happened in prior sessions), and semantic memory (retrieved knowledge from vector databases or enterprise knowledge bases).',
            },
            {
              icon: '⚡',
              title: 'Execution Layer',
              desc: 'Interfaces with the outside world: web browsers, code interpreters, database connectors, REST APIs, and other agents. This is where actions happen and where most security controls need to be applied.',
            },
            {
              icon: '🤝',
              title: 'Multi-Agent Coordination',
              desc: "Enables Manager-Worker patterns where an orchestrator agent delegates specialized sub-tasks to domain-specific agents. Critical for complex workflows that span multiple systems or knowledge domains.",
            },
          ] as const
        ).map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-2xl mb-3">{icon}</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
          </div>
        ))}
        <div className="sm:col-span-2 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 border border-teal-200 dark:border-teal-800">
          <p className="text-sm text-teal-800 dark:text-teal-300">
            <strong>Architecture note:</strong> Most production failures occur at boundaries — between
            the Perception Engine and Reasoning Module (ambiguous context), and between the Execution
            Layer and external systems (auth failures, unexpected API responses, rate limits). Design
            your error-handling strategy around these seams.
          </p>
        </div>
      </div>

      <h2>Where Enterprises Are Deploying Agents First</h2>

      <p>
        Projected enterprise investment in agentic AI is not evenly distributed. Software engineering
        captures the largest share today, but the verticals moving fastest in actual deployed
        workflows are healthcare and financial services.
      </p>

      <div className="not-prose space-y-4 my-8">
        {(
          [
            {
              sector: 'Software Engineering',
              pct: '35%',
              metric: 'Up to 60% reduction in bug resolution time',
              desc: "Agents act as autonomous engineers: they read a GitHub issue, understand the codebase, write a fix, run tests, debug failures, and submit a pull request — without human intervention. GitHub Copilot Workspace and Devin have brought this from research to production for many engineering teams.",
            },
            {
              sector: 'Financial Services',
              pct: '20%',
              metric: '15+ analyst hours saved per week on data collection',
              desc: "Agents autonomously crawl earnings filings, regulatory disclosures, news feeds, and alternative data sources. Morgan Stanley's internal AI deployment reduced analyst research preparation time by 40%. Real-time risk model adjustment is the next deployment wave.",
            },
            {
              sector: 'Customer Support',
              pct: '20%',
              metric: '35% improvement in First Contact Resolution (FCR) rates',
              desc: "Moving beyond FAQ bots, agentic support systems access internal databases, process refunds, provision accounts, and update order details — completely resolving tickets without escalation. The cost-per-resolution savings here are the primary driver of rapid adoption.",
            },
            {
              sector: 'Healthcare',
              pct: '15%',
              metric: '40% reduction in physician administrative burden',
              desc: "Agents pre-chart patient visits by extracting relevant history from EHRs, draft clinical notes from audio transcripts, and trigger referral workflows for physician review. HIPAA compliance and FDA requirements slow deployment relative to other sectors.",
            },
            {
              sector: 'Retail & E-commerce',
              pct: '10%',
              metric: 'Improved inventory turnover; fewer stockout events',
              desc: "Agents monitor inventory levels, competitor pricing, demand forecasts, and logistics disruptions. They autonomously reorder stock, adjust dynamic pricing, and reroute shipments — eliminating the lag between data signal and business response.",
            },
          ] as const
        ).map(({ sector, pct, metric, desc }) => (
          <div
            key={sector}
            className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white">{sector}</h3>
              <span className="flex-shrink-0 text-sm font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                {pct} of investment
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {metric}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <h2>The Agent Ecosystem: Frameworks, Platforms, and Models</h2>

      <p>
        The tooling landscape has fragmented into three layers: development frameworks for building
        custom agents, enterprise platforms for deploying agents without deep engineering, and the
        foundation models that power everything.
      </p>

      <h3>Development Frameworks and Orchestration Tools</h3>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {(
          [
            {
              name: 'LangChain / LangGraph',
              tag: 'Framework',
              tagColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
              desc: 'The foundational framework for LLM applications. LangGraph adds cyclic graph capabilities essential for agentic loops — where an agent can revisit earlier steps based on new information.',
            },
            {
              name: 'LlamaIndex',
              tag: 'Framework',
              tagColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
              desc: 'Specializes in connecting private enterprise data to LLMs. Critical for agentic systems that need access to internal knowledge bases, documents, and structured databases.',
            },
            {
              name: 'Microsoft AutoGen',
              tag: 'Multi-Agent',
              tagColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
              desc: 'Enables multi-agent conversations where specialized agents collaborate — a researcher agent passes findings to a coder, who hands off to a QA agent — all coordinated by an orchestrator.',
            },
            {
              name: 'CrewAI',
              tag: 'Multi-Agent',
              tagColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
              desc: 'Role-playing multi-agent framework. Define agents with specific personas (analyst, developer, reviewer), then let CrewAI coordinate their collaboration on complex tasks.',
            },
            {
              name: 'Devin (Cognition)',
              tag: 'Autonomous System',
              tagColor: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
              desc: "Positioned as the first fully autonomous AI software engineer. Given a GitHub issue, Devin navigates the codebase, implements a fix, debugs test failures, and opens a pull request.",
            },
            {
              name: 'AutoGPT',
              tag: 'Autonomous System',
              tagColor: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
              desc: "Open-source pioneer that demonstrated GPT-4's capacity for long-horizon autonomous task execution. Primarily used for research and experimentation rather than production deployments.",
            },
          ] as const
        ).map(({ name, tag, tagColor, desc }) => (
          <div
            key={name}
            className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">{name}</h4>
              <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded ${tagColor}`}>
                {tag}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <h3>Enterprise Platforms</h3>

      <p>
        For organizations that want to deploy agents without building custom infrastructure, two
        enterprise platforms have emerged as dominant options:
      </p>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Microsoft Copilot Studio</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Low/no-code agent builder deeply integrated with Microsoft 365, Azure, and enterprise data
            connectors. Best for organizations already in the Microsoft ecosystem who need agents
            operating across Teams, Outlook, SharePoint, and Dynamics.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Salesforce Agentforce</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Salesforce's agentic layer built directly into its CRM platform. Enables agents that
            autonomously handle sales outreach, customer support escalations, and service workflows
            — with full access to Salesforce data and automation rules.
          </p>
        </div>
      </div>

      <h3>Foundation Models: Which Powers What</h3>

      <p>
        The choice of underlying model shapes the agent's capabilities, costs, and constraints.
        Here's how the leading foundation models compare on the dimensions that matter for agentic
        deployments:
      </p>

      <div className="not-prose overflow-x-auto my-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="text-left p-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                Model
              </th>
              <th className="text-left p-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                Strengths for Agents
              </th>
              <th className="text-left p-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
                Context Window
              </th>
              <th className="text-left p-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                Best For
              </th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                {
                  model: 'GPT-4o / o3',
                  strengths: 'Strong tool use, broad capability coverage, large ecosystem of integrations',
                  ctx: '128K tokens',
                  bestFor: 'General-purpose agents, enterprise deployments via Azure OpenAI',
                },
                {
                  model: 'Claude Opus 4.6',
                  strengths:
                    'Long-context reasoning, low hallucination rate, strong instruction-following for complex multi-step plans',
                  ctx: '200K tokens',
                  bestFor:
                    'Document-heavy workflows, high-stakes reasoning chains, safety-critical applications',
                },
                {
                  model: 'Gemini 1.5 Pro',
                  strengths:
                    'Native multimodal input (text/image/video/audio), Google ecosystem integration, 1M token context',
                  ctx: '1M tokens',
                  bestFor: 'Media analysis, cross-modal tasks, Google Workspace integrations',
                },
                {
                  model: 'GLM-4',
                  strengths:
                    'Strong multilingual capability, cost-efficient for high-volume Asian market deployments',
                  ctx: '128K tokens',
                  bestFor: 'Multilingual agents, cost-sensitive high-volume deployments',
                },
              ] as const
            ).map(({ model, strengths, ctx, bestFor }, i) => (
              <tr
                key={model}
                className={
                  i % 2 === 0
                    ? 'bg-white dark:bg-gray-900/30'
                    : 'bg-gray-50 dark:bg-gray-800/20'
                }
              >
                <td className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">
                  {model}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  {strengths}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                  {ctx}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  {bestFor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>The Risks You Cannot Ignore</h2>

      <p>
        Giving AI systems the ability to take actions — not just generate text — introduces a
        qualitatively different risk profile. A hallucinated sentence in a chatbot is annoying. A
        hallucinated action in an autonomous agent can delete production data, send emails to
        customers, or exfiltrate sensitive documents. Enterprise leaders are acutely aware of this:
      </p>

      <div className="not-prose space-y-4 my-8">
        {(
          [
            {
              pct: '82%',
              barColor: 'bg-red-500',
              badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
              severity: 'Critical',
              title: 'Hallucinated Actions',
              desc: "Agents can confidently execute destructive operations based on incorrect premises — deleting a database table that doesn't exist as assumed, submitting duplicate orders, or sending conflicting messages. In multi-step chains, a single hallucination early on propagates through every subsequent action.",
            },
            {
              pct: '75%',
              barColor: 'bg-orange-500',
              badgeColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
              severity: 'High',
              title: 'Security & Prompt Injection',
              desc: "Granting agents API keys and read/write permissions creates large attack surfaces. Prompt injection attacks — where malicious content in a webpage or document hijacks the agent's instruction set — can force agents to exfiltrate private data, bypass access controls, or take actions on behalf of an attacker.",
            },
            {
              pct: '68%',
              barColor: 'bg-yellow-500',
              badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
              severity: 'High',
              title: 'Lack of Predictability',
              desc: "Long agentic chains involving multiple LLM calls, external API responses, and branching logic are inherently non-deterministic. The same high-level task can produce meaningfully different action sequences on different runs, making auditing and compliance difficult in regulated industries.",
            },
            {
              pct: '55%',
              barColor: 'bg-blue-500',
              badgeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
              severity: 'Significant',
              title: 'High Compute Costs',
              desc: 'A single complex agentic workflow can cost $0.50–$2.00 in API credits due to the number of LLM calls required for planning, tool use, and self-correction. At enterprise scale, unoptimized agentic deployments generate unexpected infrastructure bills.',
            },
            {
              pct: '40%',
              barColor: 'bg-gray-400',
              badgeColor: 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400',
              severity: 'Moderate',
              title: 'Latency in Execution',
              desc: 'Multi-step reasoning with external tool calls introduces latency that makes agents impractical for real-time customer-facing interactions today. Current best practice is to reserve agentic architectures for asynchronous workflows where a response within minutes — not milliseconds — is acceptable.',
            },
          ] as const
        ).map(({ pct, barColor, badgeColor, severity, title, desc }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-center min-w-[52px]">
                <div
                  className={`text-xl font-extrabold text-white ${barColor} rounded-lg px-2 py-1.5 text-center`}
                >
                  {pct}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">concerned</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${badgeColor}`}>
                    {severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-8 my-8 border border-gray-700">
        <p className="font-serif text-xl leading-relaxed text-gray-100 font-light">
          "The challenge with agentic AI isn't capability — it's controllability. We're building
          systems that are increasingly good at taking actions, and increasingly difficult to predict.
          The winner in this space won't be the company with the most autonomous agents. It'll be the
          company with the best{' '}
          <em className="text-teal-400">human-agent collaboration design</em>."
        </p>
        <p className="text-sm text-gray-500 mt-4">— Enterprise AI adoption research, 2026</p>
      </div>

      <h2>Future Outlook: Three Horizons</h2>

      <p>
        The trajectory of agentic AI is moving from isolated, specialized execution toward
        collaborative systems that operate across entire enterprise software stacks. Here's how the
        next five years likely unfold:
      </p>

      <div className="not-prose space-y-6 my-8 relative pl-2">
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {(
          [
            {
              horizon: 'Present',
              dotColor: 'bg-gray-400',
              title: 'Single-Domain Agents',
              desc: 'Agents are highly specialized — coding only, customer support only, or financial research only. They require strict human-in-the-loop oversight for any consequential action and operate in tightly sandboxed environments with limited tool access. This is where most production deployments live today.',
            },
            {
              horizon: 'Near Term (1–2 years)',
              dotColor: 'bg-teal-500',
              title: 'Multi-Agent Collaboration',
              desc: "Systems where Manager Agents delegate to specialized Worker Agents emerge as the dominant architecture for complex workflows. A research agent passes structured data to a coding agent, reviewed by a QA agent — all coordinated by an orchestrator. Standardized inter-agent protocols (like Anthropic's MCP) enable interoperability between agents from different providers.",
            },
            {
              horizon: 'Long Term (3–5 years)',
              dotColor: 'bg-emerald-400',
              title: 'Cross-Platform Enterprise Autonomy',
              desc: 'Agents navigate complex GUI environments via Computer Use APIs, operating identically to human employees across desktop applications, web apps, and internal databases. Regulatory frameworks for agent accountability mature. Supervision is required only for high-stakes decisions or novel edge cases outside the training distribution.',
            },
          ] as const
        ).map(({ horizon, dotColor, title, desc }) => (
          <div key={horizon} className="relative pl-12">
            <div
              className={`absolute left-3.5 top-1.5 w-3 h-3 rounded-full ${dotColor} ring-4 ring-white dark:ring-gray-900`}
            />
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {horizon}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Getting Started: A Practical Checklist</h2>

      <p>
        If your organization is moving from "exploring agentic AI" to "deploying agentic AI," these
        are the questions that actually matter before you write a single line of agent code:
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 my-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          {[
            'Start with a bounded, well-defined workflow — not an open-ended "automate everything" initiative.',
            'Identify the exact APIs, databases, and services the agent needs access to, and apply the principle of least privilege.',
            'Build human-in-the-loop checkpoints before any irreversible action: sending an email, making a payment, modifying production data.',
            "Implement comprehensive logging of every tool call and decision — you'll need this for debugging and compliance.",
            'Set a budget cap on LLM API calls per workflow run before your first runaway cost event.',
            'Test adversarially: try to inject malicious instructions into content your agent will process before deploying to production.',
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center mt-0.5">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <p>
        The organizations that will get the most out of agentic AI over the next three years won't
        necessarily be the ones that deploy the most agents. They'll be the ones that design the
        right human-agent boundaries, build appropriate guardrails from the start, and treat agent
        reliability the same way they treat software reliability — with monitoring, testing, and
        continuous improvement.
      </p>

      <p>
        The shift from "AI that generates" to "AI that acts" is real, it's accelerating, and the
        window for thoughtful adoption is now.
      </p>
    </BlogPostLayout>
  );
}
