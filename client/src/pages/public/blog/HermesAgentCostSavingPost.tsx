/**
 * Blog Post: The $30 Bill That Should Have Been $7 — Cost-Saving Moves for a Real AI Agent
 * Source: docs/02-hermes-agent-cost-saving.html
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How much can you realistically save on an OpenRouter AI agent bill?',
    answer:
      'In this case study, three configuration-only changes cut a 20-day bill from $30.66 to a projected $6.84 — a 78% reduction — with no loss of capability. The changes were: (1) stop using Claude Opus for tool-call loops, (2) pin Kimi to SiliconFlow and exclude slow/expensive providers, and (3) restructure prompts to push cache hit rate from 48% to 70%. No new model code was written.',
  },
  {
    question: 'Why is it a mistake to use Claude Opus for agent tool loops?',
    answer:
      'Tool loops are a "big prompt, tiny response" pattern — in the author\'s data, 60K input tokens produced 340 output tokens on average. That shape is exactly what cheap models handle well. Opus is 17x more expensive per call than Kimi K2.5 for equivalent structured-JSON tool-call output. Reserve Opus for complex planning, final synthesis, and hard debugging — tasks where one extra iteration of quality compounds downstream.',
  },
  {
    question: 'How do I pick the cheapest provider on OpenRouter?',
    answer:
      'Add explicit provider preferences in the request. Example for Kimi K2.5: set provider.order to ["SiliconFlow","Inceptron","Chutes"] and provider.ignore to ["Phala","Together","Novita","Moonshot AI","Parasail"]. The order list tries cheap/fast providers first; the ignore list prevents OpenRouter from ever routing to the outliers that charged 5–15x the median rate at multi-minute latency. Leaving this to the default router optimizes for availability, not your bill.',
  },
  {
    question: 'Why does cache hit rate vary so much between apps?',
    answer:
      'Cache hit rate is not a property of the model — it is a property of prompt structure. In the author\'s data, Hermes Agent hit 48.7%, PRD Helper 42.5%, and unlabeled deep-researcher requests 28.6% (with the Opus subset at 0%). The fix is prefix stability: move static content (system prompt, tool schemas, persistent context) to the top, never inject timestamps near the top, and share prompt prefixes across related skills so they all benefit from the same cache entry.',
  },
  {
    question: 'What is prompt bloat and how do you stop it?',
    answer:
      'Prompt bloat is when agent prompts grow to 120K+ tokens to produce 30–400 tokens of output — a 300:1 ratio — because the full conversation history is dragged forward every turn. Three techniques: (1) rolling summaries every N turns to cap context growth, (2) reference documents by ID instead of embedding full content, and (3) a hard context ceiling that errors or auto-summarizes beyond a threshold (50K tokens works for most agent loops).',
  },
  {
    question: 'What cost metrics should I monitor for a production AI agent?',
    answer:
      'Track six things: cost per day by model (alert at 20% above 7-day average), cache hit rate by model (alert on a 15-point drop vs last week), provider distribution (alert if any ignored provider gets requests), % of calls with finish_reason="length" (alert at >1%), average prompt token count (alert on >20% weekly growth), and p99 generation latency (alert above 90 seconds). These six catch almost every anti-pattern before it compounds.',
  },
  {
    question: 'Which model should I use for which kind of agent task?',
    answer:
      'A practical rule: Opus for frontier reasoning and final synthesis where quality compounds; Sonnet for tool use, synthesis loops, and most coding work; Kimi K2.5 on SiliconFlow for high-volume background agents and long-context processing; Gemini 3 Flash for quick summaries, drafts, and cheap vision tasks. Sonnet — not Opus — is the right default for production agent tool loops at roughly 20% of Opus\'s cost.',
  },
];

export default function HermesAgentCostSavingPost() {
  return (
    <BlogPostLayout
      title="The $30 Bill That Should Have Been $7: Cost-Saving Moves for a Real AI Agent"
      author="Jaehee Song"
      date="2026-04-22"
      readTime="15 min read"
      category="AI & Development"
      excerpt="A forensic audit of 936 OpenRouter calls over 20 days. Where the money leaked, how to plug it, and what your production AI agent is probably doing wrong too — three config-only moves that cut the bill by 78%."
      slug="hermes-agent-cost-saving"
      coverImage="CS"
      coverGradient="from-emerald-600 via-teal-600 to-indigo-700"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
        {
          slug: 'anthropic-vs-openrouter-opus',
          title: 'Anthropic API or OpenRouter for Claude Opus: An Honest Trade-off',
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
      {/* ── TL;DR ── */}
      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-7 my-10">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-4">
          What you'll get from this post
        </p>
        <p className="text-base leading-8 text-gray-800 dark:text-gray-200">
          Three concrete moves that took my AI agent's running cost from{' '}
          <strong>$30.66 over 20 days</strong> down to a projected <strong>$6.84</strong> — a{' '}
          <strong>78% reduction</strong> — without dropping any capability.
        </p>
        <p className="text-base leading-8 text-gray-800 dark:text-gray-200 mt-5">
          The moves are model routing, provider selection, and prompt caching. None of them require
          writing new model code. All of them apply to any agent built on OpenRouter or a similar
          gateway.
        </p>
      </div>

      <p className="leading-relaxed">
        I run a multi-agent stack called Hermes Agent. It manages five web properties — SEO
        snapshots, AI citation monitoring, automated Telegram reports, the whole operation. It
        ticks along in the background, makes a few hundred API calls a day, and sends me a nice
        Monday morning summary.
      </p>

      <p className="leading-relaxed">
        It is useful. And for most of April, it was quietly bleeding money.
      </p>

      <p className="leading-relaxed">
        The bleeding was gentle at first. A few cents here, a few dollars there. Then on April 8 I
        ran an experiment with Claude Opus 4.6 that cost me <strong>$19.81</strong> in a single
        afternoon — roughly two-thirds of my entire 20-day spend.
      </p>

      <p className="leading-relaxed">
        That got my attention. When I sat down to analyze the full dataset of 936 generations, what
        I found was not one expensive mistake. It was <strong>three separate cost leaks</strong>,
        each small on its own, adding up to real money.
      </p>

      {/* ── By the Numbers ── */}
      <div className="not-prose bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8 my-12">
        <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-7">
          The audit at a glance
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-rose-600 dark:text-rose-400">$19.81</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-6">
              single afternoon spend (65% of 20 days)
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">936</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-6">
              requests across 5 models, 13 providers
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">78%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-6">
              of requests were tool-call loops
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400">78%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-6">
              projected cost reduction after fixes
            </div>
          </div>
        </div>
      </div>

      <p className="leading-relaxed">
        Let me walk you through what I found, in the order of how much money each problem was
        costing me. The biggest leak is the most embarrassing, so we will start there.
      </p>

      {/* ── Section 1: Where the money went ── */}

      <h2>Where the Money Went</h2>

      <p className="leading-relaxed">
        Here is the thing I wish I had built into my monitoring from day one: a cost breakdown by
        model. When I finally looked at it, the answer was almost comic.
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Model
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                % of requests
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                % of total cost
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Avg $ / call
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              { model: 'Kimi K2.5', reqs: '81%', cost: '32%', per: '$0.013', tone: 'good' },
              { model: 'Claude Opus 4.6', reqs: '10%', cost: '65%', per: '$0.220', tone: 'bad' },
              { model: 'Gemini 2.5 Flash', reqs: '4%', cost: '2%', per: '$0.016', tone: 'good' },
              { model: 'Gemini 3 Flash', reqs: '4%', cost: '1%', per: '$0.011', tone: 'good' },
              { model: 'GLM 4.7', reqs: '1%', cost: '<1%', per: '$0.009', tone: 'neutral' },
            ] as const).map(({ model, reqs, cost, per, tone }) => (
              <tr
                key={model}
                className={
                  tone === 'bad'
                    ? 'bg-rose-50 dark:bg-rose-900/20'
                    : tone === 'good'
                      ? ''
                      : ''
                }
              >
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{model}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {reqs}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono ${
                    tone === 'bad'
                      ? 'text-rose-700 dark:text-rose-400 font-bold'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cost}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {per}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        Kimi K2.5 is doing the work. It is handling 757 of my 936 calls at an average cost of{' '}
        <strong>$0.013 per call</strong>. It is slow-ish — about 34 seconds average latency — but
        these are background jobs, so latency does not matter.
      </p>

      <p className="leading-relaxed">
        Claude Opus 4.6 handled 91 calls at an average of <strong>$0.22 per call</strong>. That is{' '}
        <strong>17x more per call</strong> than Kimi.
      </p>

      <p className="leading-relaxed">
        And here is where it gets painful: those 91 calls were all on April 8, all going through
        Hermes Agent, and all behaving exactly like Kimi calls — 60K-token inputs, ~340-token
        outputs, mostly tool_calls. I was not using Opus for its reasoning.
      </p>

      <p className="leading-relaxed">
        I was using it as <strong>an expensive Kimi substitute</strong>.
      </p>

      <div className="not-prose bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-400 dark:border-rose-500 rounded-r-xl p-7 my-10">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest mb-4">
          The core mistake
        </p>
        <p className="text-sm leading-7 text-gray-800 dark:text-gray-200">
          I used Opus 4.6 for a routine agent tool-loop. The "big thoughtful model" setting is good
          for synthesis, hard debugging, and final report generation — tasks where one extra
          iteration of quality compounds through the rest of the pipeline.
        </p>
        <p className="text-sm leading-7 text-gray-800 dark:text-gray-200 mt-4">
          It is <strong>catastrophically wasteful</strong> for function-call loops where the model
          is just emitting structured JSON to call the next tool.
        </p>
      </div>

      {/* ── Section 2: Provider routing ── */}

      <h2>The Provider Routing Problem</h2>

      <p className="leading-relaxed">
        Here is something people do not talk about enough. OpenRouter does not just give you access
        to models — it gives you access to <em>providers</em> who host those models.
      </p>

      <p className="leading-relaxed">
        For an open-weight model like Kimi K2.5, there are a dozen providers competing on price,
        latency, and quantization. You can pick, or you can let OpenRouter's default router pick
        for you.
      </p>

      <p className="leading-relaxed">
        I let it pick for me. Here is what I got.
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Provider
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Requests
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                $ / MTok
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Avg latency
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              { p: 'SiliconFlow', r: '72', c: '$0.139', l: '22.0s', tone: 'good' },
              { p: 'Inceptron', r: '70', c: '$0.404', l: '32.1s', tone: 'neutral' },
              { p: 'Chutes (default)', r: '598', c: '$0.311', l: '33.2s', tone: 'neutral' },
              { p: 'DeepInfra', r: '6', c: '$0.339', l: '35.5s', tone: 'neutral' },
              { p: 'AtlasCloud', r: '5', c: '$0.549', l: '15.5s', tone: 'neutral' },
              { p: 'Phala', r: '3', c: '$2.035', l: '6m 12s', tone: 'bad' },
              { p: 'Together', r: '2', c: '$2.083', l: '3m 51s', tone: 'bad' },
              { p: 'Novita', r: '1', c: '$1.715', l: '3m 15s', tone: 'bad' },
              { p: 'Moonshot AI', r: '2', c: '$2.517', l: '2m 28s', tone: 'bad' },
            ] as const).map(({ p, r, c, l, tone }) => (
              <tr
                key={p}
                className={
                  tone === 'good'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : tone === 'bad'
                      ? 'bg-rose-50 dark:bg-rose-900/20'
                      : ''
                }
              >
                <td
                  className={`px-4 py-3 ${
                    tone === 'good'
                      ? 'font-bold text-emerald-700 dark:text-emerald-400'
                      : tone === 'bad'
                        ? 'text-rose-700 dark:text-rose-400'
                        : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {p}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {r}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {c}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {l}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        Look at the spread. SiliconFlow charged me <strong>14 cents per million tokens</strong>.
        Chutes — the provider OpenRouter routed 598 of my requests to — charged me{' '}
        <strong>31 cents</strong>.
      </p>

      <p className="leading-relaxed">
        Same model. Same output quality (more or less). <strong>2.2x the price.</strong> And
        SiliconFlow was actually <em>faster</em>.
      </p>

      <p className="leading-relaxed">
        The bottom of the table is worse. Phala averaged a six-minute generation time. Six minutes.
        For a background agent that is fine once — it is a catastrophe when it happens at scale.
        And those slow providers charged 5–15x the median rate, presumably because they were
        routing through paths that had their own overhead.
      </p>

      <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-xl p-7 my-10">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-4">
          The lesson from one table
        </p>
        <p className="text-sm leading-7 text-gray-800 dark:text-gray-200">
          If you are using OpenRouter for open-weight models,{' '}
          <strong>set a provider preference explicitly</strong>. OpenRouter's default router is
          optimizing for availability, not for your bill. One line of config changes everything.
        </p>
      </div>

      {/* ── Section 3: Three fixes ── */}

      <h2>Three Moves That Cut the Bill by 78%</h2>

      <p className="leading-relaxed">
        Now we get to the practical part. Here are the three moves, in order of dollar impact. Each
        one took less than an hour to implement.
      </p>

      <div className="not-prose space-y-8 my-10">
        {/* Move 1 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-7">
          <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Move 1 · largest impact
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0 mb-0">
                Stop using Claude Opus for agent tool loops
              </h3>
            </div>
            <span className="flex-shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full uppercase tracking-wider">
              saves $19.05
            </span>
          </div>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            <strong>The problem:</strong> All 91 Opus calls were tool-call loops with tiny outputs.
            Average prompt: 59,544 tokens. Average completion: 339 tokens. That is a classic agent
            pattern — big context, small response — which is exactly what cheap models do well.
          </p>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            <strong>The fix:</strong> Route Opus only to tasks where its reasoning genuinely
            differentiates — complex planning, final synthesis, hard debugging. Never to
            function-call loops. In Hermes Agent, that meant moving one line in the router config:
          </p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto my-5">
{`route_rules = {
  "tool_loop":    "moonshotai/kimi-k2.5",        # cheap, good enough
  "synthesis":    "anthropic/claude-opus-4.7",    # reserve for this
  "simple_query": "google/gemini-3-flash",        # even cheaper
}`}
          </pre>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-0">
            <strong>Projected savings:</strong> $19.05 on the same workload. The math: 5.4M Opus
            input tokens at $5/MTok becomes 5.4M Kimi input tokens at roughly $0.14/MTok — and Kimi
            produced equivalent tool-call outputs in my spot checks.
          </p>
        </div>

        {/* Move 2 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-7">
          <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Move 2 · easy win
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0 mb-0">
                Pin Kimi to SiliconFlow, exclude the slow providers
              </h3>
            </div>
            <span className="flex-shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full uppercase tracking-wider">
              saves $4.77
            </span>
          </div>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            <strong>The problem:</strong> 598 of my Kimi calls were routed through Chutes at{' '}
            <code>$0.311 per million blended tokens</code>. SiliconFlow charges{' '}
            <code>$0.139</code> for the same model. Same output. Faster. No reason not to use it.
          </p>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            <strong>The fix:</strong> Add provider preferences in the OpenRouter request. This is
            the one line of config I wish I had written on day one:
          </p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto my-5">
{`{
  "model": "moonshotai/kimi-k2.5-0127",
  "provider": {
    "order":            ["SiliconFlow", "Inceptron", "Chutes"],
    "ignore":           ["Phala", "Together", "Novita", "Moonshot AI", "Parasail"],
    "allow_fallbacks":  true
  }
}`}
          </pre>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            <strong>Why ignore the bottom four?</strong> Those providers routed 8 of my requests,
            and they cost 5–15x the median rate while averaging multi-minute latency. Excluding
            them prevents OpenRouter from ever sending your request there, even during failover.
          </p>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-0">
            <strong>Projected savings:</strong> $4.77 over the 20-day window. At scale (30,000
            calls a month), this one config line saves roughly <strong>$7 per month per thousand
            calls</strong>.
          </p>
        </div>

        {/* Move 3 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-7">
          <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Move 3 · compounding over time
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0 mb-0">
                Restructure prompts to push cache hit rate from 48% to 70%
              </h3>
            </div>
            <span className="flex-shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full uppercase tracking-wider">
              saves $1.48+
            </span>
          </div>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            <strong>The problem:</strong> My Hermes Agent sends a median of 34K tokens of prompt
            per call, with a p99 of 122K. A lot of that is the same system prompt and tool
            definitions, repeated across 822 requests. I was getting 48.5% cache hits.
          </p>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            <strong>The fix:</strong> The cache works on <em>prefix stability</em>. Anything that
            changes at the top of the prompt breaks the cache for everything after it.
          </p>
          <ul className="text-sm leading-7 text-gray-700 dark:text-gray-300 space-y-3 mb-5 pl-5 list-disc">
            <li>
              <strong>Move stable content to the top.</strong> System prompt → tool schemas →
              persistent context → <em>then</em> variable task input. Not the other way around.
            </li>
            <li>
              <strong>Do not inject timestamps near the top.</strong> A line like "Today is
              2026-04-22 14:31:07 UTC" in your system prompt breaks the cache every second. Put the
              time at the bottom of the user message.
            </li>
            <li>
              <strong>Share prefixes across related skills.</strong> If three skills share 80% of
              their system prompt, pull that into one shared prefix. All three benefit from the
              same cache entry.
            </li>
          </ul>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-0">
            <strong>Projected savings:</strong> $1.48 on top of the existing $3.33 in Kimi cache
            savings. More importantly, this scales with your traffic — the more calls you make,
            the more this compounds.
          </p>
        </div>
      </div>

      <h3>The Cache Hit Rate That Varied by App</h3>

      <p className="leading-relaxed">
        Here is something I almost missed until I sliced the data differently. Cache hit rate is
        not a property of the model — it is a property of <em>how each app sends requests</em>.
        When I grouped by app name, the spread told a story I was not expecting.
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-7 my-10">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-5">
          Cache hit rate by application
        </p>
        <div className="space-y-6">
          {([
            { app: 'Hermes Agent', rate: 48.7, note: '822 reqs · Kimi + Opus + Gemini', color: 'bg-indigo-500' },
            { app: 'PRD Helper', rate: 42.5, note: '41 reqs · Gemini 2.5 Flash only', color: 'bg-emerald-500' },
            { app: '(unlabeled)', rate: 28.6, note: '73 reqs · Opus subset hit 0%', color: 'bg-rose-500' },
          ] as const).map(({ app, rate, note, color }) => (
            <div key={app}>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{app}</span>
                <span className="font-mono">{rate.toFixed(1)}%</span>
              </div>
              <div className="h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div className={`h-6 ${color} rounded-full`} style={{ width: `${rate}%` }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-7">{note}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="leading-relaxed">
        The unlabeled Opus calls were the painful discovery. 18 Opus requests, every single one at{' '}
        <strong>0% cache hit rate</strong>. Each shipped 87K–100K prompt tokens of fresh context.
      </p>

      <p className="leading-relaxed">
        That is 15-plus calls in a single research loop, with no cache markers, re-paying full
        input price on tokens that had appeared in the previous call 30 seconds earlier.
      </p>

      <div className="not-prose bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-400 dark:border-rose-500 rounded-r-xl p-7 my-10">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest mb-4">
          The math on the missed cache
        </p>
        <p className="text-sm leading-7 text-gray-800 dark:text-gray-200">
          18 unlabeled Opus requests × ~90K prompt tokens × 0% cache hits × $5/MTok input ={' '}
          <strong>roughly $8.10 in fresh-read charges</strong> that should have been ~$0.81 with
          caching enabled.
        </p>
        <p className="text-sm leading-7 text-gray-800 dark:text-gray-200 mt-4">
          The per-token gap between cached and uncached reads on Opus is <strong>10x</strong>. When
          you miss the cache, you do not just lose a small discount — you pay an order of magnitude
          more for the same bytes.
        </p>
      </div>

      <p className="leading-relaxed">
        Every app in your system should get its own app name in the OpenRouter request header.
        Without it, you cannot diagnose which workflow is the one leaking. Mine was hiding under
        "unknown" — which is why it took a CSV export to find.
      </p>

      {/* ── Section 4: Prompt bloat ── */}

      <h2>Prompt Bloat: The Silent 300-to-1 Leak</h2>

      <p className="leading-relaxed">
        This one surprised me when I sorted the dataset by prompt size. My top 50 most expensive
        Kimi calls sent 120K+ prompt tokens to get back 30 to 400 completion tokens.
      </p>

      <p className="leading-relaxed">
        That is a <strong>300-to-1 ratio</strong>. I was paying to ship a cargo container to
        deliver a postcard.
      </p>

      <p className="leading-relaxed">
        What was in those 120K tokens? Looking at the timestamps, the pattern was unmistakable: the
        same conversation history, the same file contents, the same accumulated tool results,
        re-appended turn after turn.
      </p>

      <p className="leading-relaxed">
        By the 8th iteration of a research loop, the prompt had collected every previous tool
        call, every previous assistant response, and every previous user input. Nothing was being
        pruned. Nothing was being summarized. The agent was just dragging its entire history
        forward, paying for every token of it, every time.
      </p>

      <h3>Three Techniques to Shrink the Bloat</h3>

      <div className="not-prose space-y-6 my-10">
        {/* Technique 1 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border-l-4 border-emerald-500 border border-gray-200 dark:border-gray-700 p-7">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3">
            Technique 1 · best ROI
          </p>
          <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0 mb-4">
            Rolling summaries instead of full conversation history
          </h4>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-5">
            After every N turns (I use 5), ask the model to summarize the conversation so far.
            Replace the full message list with{' '}
            <code>[system, summary, last_3_turns]</code>. This caps prompt growth regardless of how
            long the session runs.
          </p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto mb-0">
{`if turn_count % 5 == 0 and turn_count > 0:
    summary = summarize(messages[1:-6])  # everything except system + last 3 turns
    messages = [messages[0], summary_msg(summary), *messages[-6:]]`}
          </pre>
        </div>

        {/* Technique 2 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border-l-4 border-indigo-500 border border-gray-200 dark:border-gray-700 p-7">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Technique 2 · for document-heavy agents
          </p>
          <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0 mb-4">
            Reference by ID, not by content
          </h4>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-0">
            If your agent is working with files, wiki pages, or documents, pass a reference ID and
            a one-line description instead of embedding the full text. Let the model ask for
            specific chunks if it needs them. This is how RAG systems work, and it cuts prompt size
            by <strong>80% or more</strong> on content-heavy agents.
          </p>
        </div>

        {/* Technique 3 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border-l-4 border-amber-500 border border-gray-200 dark:border-gray-700 p-7">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-3">
            Technique 3 · the safety net
          </p>
          <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0 mb-4">
            Hard context ceiling
          </h4>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 mb-0">
            Configure your agent client to error out (or auto-summarize) when the prompt exceeds a
            threshold. I have set mine to <strong>50K tokens</strong> for Kimi agent loops. If a
            task genuinely needs more than that, it should be split into sub-tasks — not crammed
            into one megaprompt. The ceiling forces the architectural conversation you would
            otherwise keep putting off.
          </p>
        </div>
      </div>

      {/* ── Section 5: Right model for the right job ── */}

      <h2>Choosing the Right Model for the Right Job</h2>

      <p className="leading-relaxed">
        The $19 Opus mistake on April 8 was not really about Opus being expensive. It was about
        using a frontier reasoning model for a task that did not need frontier reasoning.
      </p>

      <p className="leading-relaxed">
        If I am honest, most of what Hermes Agent does — tool calls, file reads, short summaries —
        can be handled by models much further down the cost curve without any quality loss.
      </p>

      <p className="leading-relaxed">
        Here is the mental model I am adopting, based on what the token shape actually tells me
        about each task.
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Model
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Blended $/MTok
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Avg latency
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Best for
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              {
                model: 'Claude Opus 4.7',
                cost: '$3.64',
                lat: '7.8s',
                use: 'Frontier reasoning, novel problems, final synthesis where quality compounds',
              },
              {
                model: 'Claude Sonnet 4.6',
                cost: '$0.80',
                lat: '~2s',
                use: 'Tool use, synthesis loops, coding — most agent work most of the time',
              },
              {
                model: 'Kimi K2.5',
                cost: '$0.14',
                lat: '22s',
                use: 'High-volume background agents, long-context processing',
              },
              {
                model: 'Gemini 3 Flash',
                cost: '$0.57',
                lat: '3.8s',
                use: 'Quick summaries, drafts, vision tasks, low-stakes work',
              },
            ] as const).map(({ model, cost, lat, use }) => (
              <tr key={model} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{model}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {cost}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {lat}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 leading-relaxed">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-xl p-7 my-10">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-4">
          My new routing rule
        </p>
        <ul className="space-y-3 text-sm leading-7 text-gray-800 dark:text-gray-200 mb-0 pl-5 list-disc">
          <li>
            Frontier reasoning or final synthesis where quality matters most → <strong>Opus</strong>
          </li>
          <li>
            Tool loops, coding, research synthesis, most production agent work →{' '}
            <strong>Sonnet</strong>
          </li>
          <li>
            High-volume background chatter, long-context batch work →{' '}
            <strong>Kimi on SiliconFlow</strong>
          </li>
          <li>
            Drafts, quick summaries, cheap vision → <strong>Gemini Flash</strong>
          </li>
        </ul>
      </div>

      <p className="leading-relaxed">
        The thing I would emphasize: <strong>Sonnet is the right default for agent tool loops, not
        Opus</strong>. Opus is the right choice when you need the one-shot answer to be exceptional
        — final synthesis at the end of a long pipeline, hard debugging, complex planning. For
        everything in between, Sonnet is roughly 20% of Opus's cost at similar quality on most
        tasks.
      </p>

      {/* ── Section 6: Waterfall ── */}

      <h2>The Savings Waterfall</h2>

      <p className="leading-relaxed">
        Here is what the three core moves look like stacked together. Starting from <strong>$30.66</strong>,
        ending at <strong>$5.36</strong> for an equivalent 20 days of work. The prompt-bloat and
        model-downshifting fixes from the sections above compound on top of these.
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-7 my-10">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-6">
          Projected cost after each fix
        </p>
        <div className="space-y-4">
          {([
            { step: 'Current', running: 30.66, delta: null, tone: 'start' },
            { step: 'Drop Opus misuse', running: 11.61, delta: 19.05, tone: 'save' },
            { step: 'Kimi → SiliconFlow', running: 6.84, delta: 4.77, tone: 'save' },
            { step: 'Better caching', running: 5.36, delta: 1.48, tone: 'save' },
            { step: 'Projected', running: 5.36, delta: null, tone: 'end' },
          ] as const).map(({ step, running, delta, tone }) => {
            const pct = (running / 30.66) * 100;
            const bar =
              tone === 'start'
                ? 'bg-gray-500'
                : tone === 'end'
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-emerald-400 to-emerald-600';
            return (
              <div key={step} className="flex items-center gap-4">
                <div className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {step}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-6 ${bar} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-32 text-right text-sm font-mono">
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${running.toFixed(2)}
                  </span>
                  {delta && (
                    <span className="text-emerald-600 dark:text-emerald-400 ml-2">
                      −${delta.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 leading-7 italic">
          Each green step is a configuration change. No code was rewritten. No model capability was
          lost. The agent does the same work — it just stops paying for things it was not using.
        </p>
      </div>

      {/* ── Section 7: Two smaller things ── */}

      <h2>Two Smaller Things Worth Fixing</h2>

      <h3>Cap Your Output Tokens</h3>

      <p className="leading-relaxed">
        On April 22, two of my Gemini 2.5 Flash calls hit the 65,535-token maximum output length.
        Together they cost 33 cents on what should have been two-cent calls. Most likely a retry
        loop or a missing stop condition in the agent logic.
      </p>

      <p className="leading-relaxed">
        Whenever I see a completion that hits a round number like 65,535, 4,096, or 2,000, it is
        almost always a configuration problem — not a task that legitimately needed that much
        output.
      </p>

      <p className="leading-relaxed">
        The fix is simple: set <code>max_tokens</code> to something reasonable for your task. If
        your agent is emitting a tool call, 512 tokens is plenty. If it is writing a summary,
        1,500. If it hits the cap, you will see <code>finish_reason: "length"</code> in the
        response and you can decide whether to retry with a bigger budget or rethink the prompt.
      </p>

      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-xl p-7 my-10">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-4">
          A monitoring tip
        </p>
        <p className="text-sm leading-7 text-gray-800 dark:text-gray-200 mb-0">
          Add an alert for any call where <code>finish_reason == "length"</code>. Three of those in
          20 days is borderline. <strong>Thirty of those in a day is a bug hemorrhaging money</strong>.
        </p>
      </div>

      <h3>Check Your Cache Utilization Weekly</h3>

      <p className="leading-relaxed">
        Cache hit rate is the single most sensitive cost metric you have. If you see it drop from
        48% to 20% suddenly, something changed in your prompt structure — maybe someone added a
        timestamp, maybe someone reordered the system prompt, maybe your tool schemas got
        regenerated with different formatting.
      </p>

      <p className="leading-relaxed">
        These changes do not look like bugs. They look like housekeeping. But they can double your
        bill overnight.
      </p>

      {/* ── Section 8: Monitoring ── */}

      <h2>The Monitoring Dashboard I Wish I'd Built on Day One</h2>

      <p className="leading-relaxed">
        Looking back, every dollar of waste in this analysis could have been caught earlier with
        better visibility. Here is the minimum monitoring you need for any agent running at scale.
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                What to track
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Why it matters
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Alert threshold
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              {
                metric: 'Cost per day, by model',
                why: 'Catches model-mix drift before it compounds',
                alert: 'Any model >20% above its 7-day average',
              },
              {
                metric: 'Cache hit rate, by model',
                why: 'Prompt structure regressions break caching silently',
                alert: 'Drop of 15+ percentage points vs last week',
              },
              {
                metric: 'Provider distribution',
                why: "OpenRouter's default router can drift toward expensive providers",
                alert: 'Any provider in your "ignore" list getting >0 requests',
              },
              {
                metric: '% of requests hitting finish_reason: "length"',
                why: 'Runaway output loops',
                alert: '>1% of total calls',
              },
              {
                metric: 'Avg prompt token count',
                why: 'Context bloat — someone appended too much history',
                alert: '>20% growth week-over-week',
              },
              {
                metric: 'p99 generation latency',
                why: 'Catches routing to slow providers',
                alert: 'p99 >90 seconds',
              },
            ] as const).map(({ metric, why, alert }) => (
              <tr key={metric} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 align-top">
                  {metric}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 align-top leading-relaxed">
                  {why}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 align-top font-mono text-xs leading-relaxed">
                  {alert}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        I have since built this as a widget that drops into Hermes Agent's Monday morning Telegram
        report. Two minutes on Monday, and I know exactly where my money went the week before.
      </p>

      {/* ── Section 9: What I'm leaving alone ── */}

      <h2>What I'm Leaving Alone</h2>

      <p className="leading-relaxed">
        Not everything in the audit needed fixing. It is worth calling out what was working,
        because the temptation with this kind of analysis is to optimize every byte — and that is
        how you end up spending five hours saving 40 cents.
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-5 my-10">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">
            Working well
          </p>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0 mb-3">
            PRD Helper stays as-is
          </h4>
          <p className="text-xs leading-6 text-gray-600 dark:text-gray-400 mb-0">
            41 requests, $0.64 total, all on Gemini 2.5 Flash, sub-second latency, healthy
            prompt-to-completion ratio. Nothing to change.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3">
            Suboptimal but not broken
          </p>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0 mb-3">
            Kimi on Chutes
          </h4>
          <p className="text-xs leading-6 text-gray-600 dark:text-gray-400 mb-0">
            The agent's logic is sound; it is just running on the wrong provider. A routing config
            fix, not a code fix. Nothing to rebuild.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">
            Good tool choice
          </p>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0 mb-3">
            Gemini 2.5 Flash for docs
          </h4>
          <p className="text-xs leading-6 text-gray-600 dark:text-gray-400 mb-0">
            Fast, cheap, handles the quick-summary tasks well. The two runaway completions are a
            bug to fix, not a reason to replace the model.
          </p>
        </div>
      </div>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border-l-4 border-indigo-500 rounded-r-xl px-7 py-6 my-10">
        <p className="text-base italic leading-8 text-gray-700 dark:text-gray-300 mb-0">
          The goal is not to optimize every token. It is to stop paying three times more than
          necessary for the same output.
        </p>
      </div>

      {/* ── Section 10: What this means for you ── */}

      <h2>What This Means for Your Agent</h2>

      <p className="leading-relaxed">
        My Hermes Agent is small. A few hundred dollars a month at the high end. But the patterns
        that caused the leaks here — using the wrong model for the wrong task, letting the router
        pick providers, ignoring cache utilization, not capping output — those patterns do not
        scale down. They scale <em>up</em>.
      </p>

      <p className="leading-relaxed">
        Looking back, the $18+ of waste in this dataset came from <strong>four specific
        anti-patterns</strong>, and they are the same four anti-patterns I would bet are hiding in
        most production agent deployments.
      </p>

      <div className="not-prose space-y-5 my-10">
        {([
          {
            num: '01',
            title: 'Provider indifference',
            desc: "Letting OpenRouter pick the default when a 2x cheaper option exists one config line away.",
          },
          {
            num: '02',
            title: 'Cache blindness',
            desc: "Sending 90K-token prompts 15 times in a row without ever marking the static context for caching.",
          },
          {
            num: '03',
            title: 'Model overkill',
            desc: "Using Opus for agent tool loops that Sonnet or Kimi would handle equivalently at 5–26x lower cost.",
          },
          {
            num: '04',
            title: 'Unbounded context',
            desc: "Letting conversation history accumulate until a single turn costs more than an entire Sonnet session would have.",
          },
        ] as const).map(({ num, title, desc }) => (
          <div
            key={num}
            className="flex gap-5 items-start bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 flex items-center justify-center font-mono font-bold text-sm">
              {num}
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white mb-2">{title}</div>
              <p className="text-sm leading-7 text-gray-600 dark:text-gray-400 mb-0">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="leading-relaxed">
        If you are running a production agent and your bill is <strong>$500/month</strong>, these
        same four patterns probably save you <strong>$350</strong> once you address them. If your
        bill is <strong>$5,000/month</strong>, they probably save you <strong>$3,500</strong>. The
        math is linear because the mistakes are structural.
      </p>

      <p className="leading-relaxed">
        The agent itself is fine. The logic works. The outputs are good. What was broken was the
        infrastructure around the agent — the model choice, the provider routing, the prompt
        structure.
      </p>

      <p className="leading-relaxed">
        None of that shows up in your product's feature list. But all of it shows up in your
        monthly statement.
      </p>

      <p className="leading-relaxed">
        If you run agents through OpenRouter, go do this audit. Export your activity CSV. Group by
        provider. Sort by prompt tokens. Look for zero-cache requests.
      </p>

      <p className="leading-relaxed">
        <strong>The waste is probably there, and it is probably bigger than you think.</strong>
      </p>
    </BlogPostLayout>
  );
}
