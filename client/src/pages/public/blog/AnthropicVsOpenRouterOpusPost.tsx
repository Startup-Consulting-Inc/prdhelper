/**
 * Blog Post: Anthropic API or OpenRouter for Claude Opus — An Honest Trade-off
 * Source: docs/01-anthropic-vs-openrouter-opus.html
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is Claude Opus cheaper on Anthropic direct or OpenRouter?',
    answer:
      'Neither. The token prices are identical: $5 per million input tokens and $25 per million output tokens on both paths. OpenRouter makes its money on a 5.5% credit-purchase fee, not on a per-token markup. The savings — if any — come from features like prompt caching, the Batch API, and Fast Mode, not from the billing path itself.',
  },
  {
    question: 'Does OpenRouter give me provider diversity for Claude Opus?',
    answer:
      'In practice, no. For premium models like Opus, OpenRouter often has only one provider behind the scenes — typically Amazon Bedrock. Over a 20-day dataset, every one of the author\'s 91 Opus calls went through Bedrock. The "marketplace of providers" you expect from OpenRouter genuinely works for open-weight models like Kimi K2.5, but it weakens considerably for premium Anthropic models.',
  },
  {
    question: 'Why does prompt caching matter so much for Opus?',
    answer:
      'A cached read on Opus costs $0.50 per million tokens instead of $5 — a 90% discount. For an agent re-sending a 40K-token system prompt thousands of times a day, the difference between 0% and 80% cache hit rate can be several thousand dollars per month. Caching is where the real money on Opus hides, and it is where the two API paths actually differ in practice.',
  },
  {
    question: 'Can I use the Batch API through OpenRouter?',
    answer:
      'Not for Anthropic models. Anthropic\'s Batch API offers 50% off both input and output for async workloads (results within 24 hours), but it is only available when calling Anthropic directly. If your workload can wait a few hours — nightly document processing, data enrichment, eval runs — going direct cuts the bill in half.',
  },
  {
    question: 'What is Fast Mode and where can I use it?',
    answer:
      'Fast Mode is Anthropic\'s option for Opus 4.6 and later that generates output 2.5x faster at 6x the price. It is designed for latency-critical UX like live coding assistants. It is a first-party feature on the direct API; OpenRouter supports it by auto-routing to Anthropic first-party when the flag is set, but other providers cannot serve it.',
  },
  {
    question: 'What changed with Claude Opus 4.7?',
    answer:
      'The sticker price stayed the same ($5 in / $25 out per million tokens), but Opus 4.7 uses a new tokenizer that can produce up to 35% more tokens for the same input text — especially on code, structured data, and non-English content. Your Opus bill can go up 0–35% per request even though Anthropic did not raise prices. Migrate from 4.6 to 4.7 with measurement, not assumption.',
  },
  {
    question: 'Should I pick one path or run a hybrid?',
    answer:
      'For most teams at any meaningful scale, a hybrid is the best pattern: route your one high-volume production agent through Anthropic direct (for cache control and Batch access), and route everything else — prototyping, cross-model experiments, occasional Kimi or Gemini calls — through OpenRouter. The added complexity is two clients and two billing accounts; the upside is real cost control on the workload that actually dominates your bill.',
  },
];

export default function AnthropicVsOpenRouterOpusPost() {
  return (
    <BlogPostLayout
      title="Anthropic API or OpenRouter for Claude Opus: An Honest Trade-off"
      author="Jaehee Song"
      date="2026-04-22"
      readTime="13 min read"
      category="AI & Development"
      excerpt="Both paths reach the same model. The question is what you give up to get there — and one of them quietly eats your cache hit rate. A hands-on comparison with real pricing, latency data, and a $19.81 afternoon that taught me where Opus actually gets expensive."
      slug="anthropic-vs-openrouter-opus"
      coverImage="AO"
      coverGradient="from-indigo-700 via-violet-600 to-orange-500"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
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
        {
          slug: 'agentic-ai-guide',
          title: 'Agentic AI: The Complete Guide to Autonomous AI Systems in 2026',
          category: 'AI & Development',
          date: '2026-04-14',
        },
      ]}
    >
      {/* ── TL;DR ── */}
      <div className="not-prose bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-6 my-8">
        <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-widest mb-3">
          The short version
        </p>
        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
          Use <strong>Anthropic's API directly</strong> when you need prompt caching that actually
          sticks, extended thinking, Fast Mode, or zero markup on high-volume workloads. Use{' '}
          <strong>OpenRouter</strong> when you're prototyping across models, need one key for a small
          team, want automatic failover, or haven't decided whether Opus is the right model yet.
        </p>
        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 mt-4">
          For a production agent that sends the same 40K-token system prompt thousands of times a
          month — go direct. For everything else, OpenRouter is probably fine.
        </p>
      </div>

      <p className="leading-relaxed">
        Last month I ran an experiment. I took a Hermes Agent I had been building — the kind that
        loops through tool calls, burns through 40,000-token contexts, and makes hundreds of
        requests in an afternoon — and I routed it through Claude Opus 4.6 for one day. Just one
        day.
      </p>

      <p className="leading-relaxed">
        The bill came back at <strong>$19.81</strong>. That was 65% of my entire 20-day OpenRouter
        spend, done in a single afternoon.
      </p>

      <p className="leading-relaxed">
        Was Opus worth it? Sometimes. Was I using it correctly? No, not really. But the bigger
        question that came out of that experiment is the one I want to answer in this post: when
        you have decided you want Claude Opus — and you will, eventually, because it is genuinely
        the best model for certain hard problems — should you call Anthropic's API directly, or
        route through OpenRouter?
      </p>

      <p className="leading-relaxed">
        The honest answer depends on what you are optimizing for. Let me show you the trade-offs
        with real numbers.
      </p>

      {/* ── By the Numbers ── */}
      <div className="not-prose bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8 my-10">
        <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-6">
          By the Numbers
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">$19.81</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              one afternoon of uncached Opus calls
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">90%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              discount on cached prompt reads
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">38.2%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              actual cache utilization on OpenRouter
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">50%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              off with Batch API — direct only
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 1: The two paths ── */}

      <h2>The Two Paths Look Identical on Paper</h2>

      <p className="leading-relaxed">
        Here is the thing people do not realize when they first compare these two options:{' '}
        <strong>the token prices are the same</strong>. OpenRouter does not mark up inference. You
        pay $5 per million input tokens and $25 per million output tokens either way. That is not a
        typo — OpenRouter makes its money on a 5.5% credit-purchase fee, not on a per-token cut.
      </p>

      <p className="leading-relaxed">
        So if cost were the only thing that mattered, this would be a very short blog post. But cost
        is not the only thing that matters. Here is a clean side-by-side of what you are actually
        getting on each path.
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                What you get
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Anthropic API (direct)
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                OpenRouter
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              ['Base price (Opus 4.6)', '$5 in / $25 out per MTok', '$5 in / $25 out per MTok', 'neutral'],
              ['Platform fee', 'None', '5.5% on credit top-ups', 'anthropic'],
              ['Prompt caching', 'Full control, up to 90% savings', 'Works, but pass-through', 'anthropic'],
              ['Batch API (50% off)', 'Yes, native', 'Not available for Anthropic models', 'anthropic'],
              ['Fast Mode (Opus 4.7)', 'Yes, 2.5x faster at 6x price', 'Auto-routes to Anthropic 1P', 'anthropic'],
              ['Extended thinking', 'Full support', 'Supported via reasoning parameter', 'anthropic'],
              ['Automatic failover', 'No — you handle retries', 'Yes, Bedrock / Vertex / 1P', 'openrouter'],
              ['One key, many models', 'Claude only', '290+ models, one key', 'openrouter'],
              ['Zero-completion insurance', 'You pay for failed attempts', 'Only pay for successful runs', 'openrouter'],
              ['Enterprise SSO / audit logs', 'Full enterprise plan', 'Available on Enterprise tier', 'neutral'],
              ['Regional routing', 'Global, US, or region-specific', 'Enterprise and PAYG tiers only', 'anthropic'],
            ] as const).map(([feature, anthropic, openrouter, winner]) => (
              <tr key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 align-top">
                  {feature}
                </td>
                <td
                  className={`px-4 py-3 align-top ${
                    winner === 'anthropic'
                      ? 'text-indigo-700 dark:text-indigo-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {anthropic}
                </td>
                <td
                  className={`px-4 py-3 align-top ${
                    winner === 'openrouter'
                      ? 'text-orange-700 dark:text-orange-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {openrouter}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        Already you can see the shape of the trade-off. Anthropic gives you more control over the
        thing you are paying for. OpenRouter gives you more flexibility across what you can reach.
      </p>

      <h3>The "One Provider" Problem Nobody Talks About</h3>

      <p className="leading-relaxed">
        Here is a thing worth pointing out because it surprised me. OpenRouter's big marketing line
        is provider diversity — route across Bedrock, Vertex AI, Azure, and Anthropic first-party,
        get the best price automatically. For open-weight models like Kimi K2.5, that genuinely
        works. There are a dozen providers competing.
      </p>

      <p className="leading-relaxed">
        For Claude Opus? Not really. Every single one of my 91 Opus calls went through Amazon
        Bedrock. Not some. Not most. <strong>All of them.</strong>
      </p>

      <p className="leading-relaxed">
        The "marketplace of providers" I thought I was getting was actually one provider with one
        price. OpenRouter was adding a network hop, not a negotiation.
      </p>

      <div className="not-prose bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 dark:border-orange-500 rounded-r-xl p-6 my-8">
        <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-widest mb-3">
          The indirection trap
        </p>
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          For premium models like Opus, OpenRouter often has only one provider anyway. You are not
          getting fallback diversity — you are getting indirection. This is not OpenRouter's fault;
          it is a function of how Anthropic licenses Opus to cloud partners. But it does mean the
          "one key for everything" value proposition weakens considerably the further you move
          upmarket.
        </p>
      </div>

      <h3>The Pricing Simulation That Convinced Me</h3>

      <p className="leading-relaxed">
        I ran four realistic workloads through both billing paths using Anthropic's published rates
        ($5 per million input, $25 per million output, $0.50 per million cached read) and
        OpenRouter's effective rates on the same provider. Here is what came out.
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Scenario
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Anthropic direct
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                OpenRouter
              </th>
              <th className="text-right px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider">
                Difference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              ['Small task (10K in, 2K out)', '$0.100', '$0.100', '$0.00'],
              ['Medium doc (50K in, 8K out)', '$0.450', '$0.450', '$0.00'],
              ['Large analysis (100K in, 15K out)', '$0.875', '$0.875', '$0.00'],
              ['Agent loop (80K in, 3K out, 60K cached)', '$0.205', '$0.205', '$0.00'],
            ] as const).map(([scenario, direct, openrouter, diff]) => (
              <tr key={scenario} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{scenario}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {direct}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {openrouter}
                </td>
                <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                  {diff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        The numbers line up to the penny. For Opus specifically, you will not save money by
        switching from OpenRouter to Anthropic direct.
      </p>

      <p className="leading-relaxed">
        The savings live elsewhere — specifically, in how you structure your prompts and whether
        you are using features like caching and batch at all.
      </p>

      {/* ── Section 2: Cache problem ── */}

      <h2>The Cache Problem — Where the Real Money Hides</h2>

      <p className="leading-relaxed">
        If you only read one section of this post, read this one. Prompt caching is where the
        pricing on Opus actually matters.
      </p>

      <p className="leading-relaxed">
        Here is the setup: Claude Opus costs $5 per million input tokens. But a <em>cached</em>{' '}
        read costs $0.50 per million tokens — a 90% discount. If you are running an agent that
        re-sends the same 30,000-token system prompt and tool schema on every call, caching is not
        a nice-to-have.
      </p>

      <p className="leading-relaxed">
        <strong>It is the difference between a $200 bill and a $20 bill at the end of the month.</strong>
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-8">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          What caching does to your Opus bill
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          Modeled on a typical agent workload: 40K input tokens per call, 500 output tokens, 1,000
          calls per day.
        </p>
        <div className="space-y-3">
          {([
            { label: '0% cache', cost: 212.5, daily: '$212.50' },
            { label: '30% cache', cost: 158.5, daily: '$158.50' },
            { label: '60% cache', cost: 104.5, daily: '$104.50' },
            { label: '80% cache', cost: 68.5, daily: '$68.50' },
            { label: '90% cache', cost: 50.5, daily: '$50.50' },
          ] as const).map(({ label, cost, daily }) => {
            const pct = Math.round((cost / 212.5) * 100);
            return (
              <div key={label} className="flex items-center gap-4">
                <div className="w-24 text-sm font-mono text-gray-700 dark:text-gray-300">{label}</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-6 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-20 text-right text-sm font-mono text-gray-700 dark:text-gray-300">
                  {daily}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-5 leading-relaxed">
          At 80% cache hits, you save roughly $144/day vs no caching. Over a month, that is more
          than $4,300.
        </p>
      </div>

      <p className="leading-relaxed">
        Here is where the honest trade-off gets uncomfortable. Both paths support prompt caching.
        But the control you have over it is very different.
      </p>

      <p className="leading-relaxed">
        On Anthropic's direct API, you add a single <code>cache_control</code> field at the top of
        your request. You decide what gets cached, for how long (5 minutes or 1 hour), and where
        the breakpoints sit. You see cache read tokens and cache write tokens as separate line
        items in your usage. You can tune it.
      </p>

      <p className="leading-relaxed">
        On OpenRouter, caching happens automatically for supported models. That sounds nice — one
        less thing to configure. But it also means less visibility. The cache is being managed by
        the gateway layer on top of the provider, and if your request gets routed to a provider
        that handles caching differently than Anthropic's first-party endpoint, your hit rate can
        quietly collapse without anyone telling you.
      </p>

      <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-xl p-6 my-8">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-3">
          A real pitfall
        </p>
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          On my own OpenRouter data, I hit <strong>38.2% cache utilization</strong> on Claude Opus
          calls. On Kimi K2.5 through SiliconFlow, I hit 48.5%. Anthropic's own docs quote cache
          savings of up to 90%.
        </p>
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 mt-3">
          That 50-point gap is not the model's fault — it is what happens when you cannot see or
          control where your cache breakpoints are landing.
        </p>
      </div>

      <h3>What a 0% Cache Hit Actually Looks Like</h3>

      <p className="leading-relaxed">
        Let me make this concrete with one evening from my logs. On April 8, between 23:00 and
        23:35, my deep-researcher agent made 15 Opus calls in a row. The prompt size ranged from
        87K to 100K tokens each.
      </p>

      <p className="leading-relaxed">
        The cache hit rate on every single one of those calls? <strong>Zero.</strong> I paid full
        freight for roughly 1.4 million input tokens in 35 minutes — about $7 of pure waste that
        should have cost me 70 cents with caching on.
      </p>

      <p className="leading-relaxed">
        Would routing through Anthropic directly have saved me anything? Probably not. The cache
        does not care who is billing you. It cares whether you structured your request with{' '}
        <code>cache_control</code> markers in the right places. I had not. The indirection layer
        was not the problem — the prompt architecture was.
      </p>

      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-xl p-6 my-8">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3">
          What actually fixes this
        </p>
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 mb-3">
          On either path, add cache markers to your stable context blocks:
        </p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto mb-3">
{`{
  "type": "text",
  "text": "Your long system prompt...",
  "cache_control": { "type": "ephemeral" }
}`}
        </pre>
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          OpenRouter passes this through to Bedrock (or whichever provider is serving you).
          Anthropic direct consumes it natively. The billing outcome is identical. The savings show
          up the moment you actually send the marker.
        </p>
      </div>

      {/* ── Section 3: Latency ── */}

      <h2>Latency: The Part That Matters for Users</h2>

      <p className="leading-relaxed">
        Pricing is not the only axis. If you are building a user-facing product, latency eats your
        UX budget faster than cost eats your margin. And here the picture gets interesting.
      </p>

      <p className="leading-relaxed">
        From my own 20-day dataset routed through OpenRouter, Claude Opus 4.6 averaged{' '}
        <strong>7.8 seconds total generation time</strong> with a{' '}
        <strong>2.5-second time to first token</strong>. Those numbers are fine. But OpenRouter
        specifically routed most of my Opus calls through Amazon Bedrock, which has its own latency
        profile — not Anthropic's.
      </p>

      <p className="leading-relaxed">
        If you go direct, you can ask for Anthropic's Fast Mode on Opus 4.6. That is 2.5x faster
        output at 6x the price. It is absolutely not a default — but if you are building something
        like a live coding assistant where waiting six seconds for a function signature is a UX
        disaster, Fast Mode exists specifically for you.
      </p>

      <p className="leading-relaxed">
        OpenRouter supports Fast Mode too, but only by auto-routing to Anthropic first-party when
        you flag it. Other providers cannot serve it.
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-8">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Latency distribution in a real agent workload
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          Hermes Agent on OpenRouter, April 2026 — 936 requests across 5 models
        </p>
        <div className="space-y-4">
          {([
            { model: 'Gemini 2.5 Flash', ttft: 0.6, gen: 21.9 },
            { model: 'Gemini 3 Flash', ttft: 1.6, gen: 2.2 },
            { model: 'Claude Opus 4.6', ttft: 2.5, gen: 5.3 },
            { model: 'GLM 4.7', ttft: 2.5, gen: 8.6 },
            { model: 'Kimi K2.5', ttft: 6.8, gen: 27.6 },
          ] as const).map(({ model, ttft, gen }) => {
            const total = ttft + gen;
            const max = 34.4;
            const ttftPct = (ttft / max) * 100;
            const genPct = (gen / max) * 100;
            return (
              <div key={model}>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                  <span className="font-semibold text-gray-900 dark:text-white">{model}</span>
                  <span className="font-mono">{total.toFixed(1)}s total</span>
                </div>
                <div className="flex h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="bg-violet-400" style={{ width: `${ttftPct}%` }} title={`TTFT: ${ttft}s`} />
                  <div className="bg-violet-700" style={{ width: `${genPct}%` }} title={`Gen: ${gen}s`} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-violet-400" />
            Time to first token
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-violet-700" />
            Remaining generation
          </span>
        </div>
      </div>

      {/* ── Section 4: Honest pros/cons ── */}

      <h2>The Honest Pros and Cons</h2>

      <p className="leading-relaxed">
        I want to be fair here, because a lot of the trade-off discussion online reads like ad copy
        for whichever vendor wrote it. Here is the unvarnished version.
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border-t-4 border-indigo-600 dark:border-indigo-500 border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Anthropic direct
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-0">
            The trade-offs
          </h3>

          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-4 mb-2">
            Why you'd choose it
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-5">
            <li>First-party features — Batch API, Fast Mode, and new model drops arrive weeks before gateways</li>
            <li>Simpler debugging — one API, one status page, one set of error codes</li>
            <li>Lower latency floor — one less network hop, no routing layer</li>
            <li>Enterprise negotiation — at real scale, Anthropic will talk terms</li>
          </ul>

          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mt-4 mb-2">
            Where it hurts
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <li>Single provider lock-in — outages stop your system</li>
            <li>Account overhead — separate billing, rate limits, and keys per environment</li>
            <li>No model diversity — you get Claude; integrate Gemini or Kimi separately</li>
            <li>Tighter regional availability than Bedrock or Vertex</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl border-t-4 border-orange-500 dark:border-orange-500 border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2">
            OpenRouter
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-0">
            The trade-offs
          </h3>

          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-4 mb-2">
            Why you'd choose it
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-5">
            <li>Unified API — one key, one client, one response format for 290+ models</li>
            <li>Automatic fallback — Bedrock down? Routes to Vertex or 1P transparently</li>
            <li>Cost arbitrage on open-weight models — real savings on Kimi, GLM, etc.</li>
            <li>Unified billing — one invoice, one dashboard, one export</li>
          </ul>

          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mt-4 mb-2">
            Where it hurts
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <li>Provider opacity — price and latency vary silently based on routing</li>
            <li>Feature lag — new Anthropic features land on OpenRouter days or weeks later</li>
            <li>No Batch API for Anthropic models — you lose the 50% async discount</li>
            <li>For premium models, "diversity" is often just indirection to one provider</li>
          </ul>
        </div>
      </div>

      {/* ── Section 5: OpenRouter wins ── */}

      <h2>When OpenRouter Is the Better Choice</h2>

      <div className="not-prose space-y-4 my-8">
        {([
          {
            title: "You haven't decided which model to use yet",
            desc: "If you are prototyping or running evaluations across Opus, Sonnet, GPT-5, Gemini 3 Pro, and open-weight models, OpenRouter is the path of least resistance. One key. One billing account. Change a model string, rerun your test.",
          },
          {
            title: 'You want automatic failover',
            desc: "Anthropic occasionally has outages. When Opus on the first-party API is down, OpenRouter can fall back to Opus on Bedrock or Vertex AI automatically. Your agent does not stop. If your business depends on Claude being responsive, this alone can justify the 5.5% credit fee.",
          },
          {
            title: "You're a small team sharing access",
            desc: "OpenRouter's per-key rate limiting, spend caps, and team dashboards are simpler than Anthropic's enterprise setup for teams under about 10 people. You can give a junior developer a key with a $50 monthly cap and not worry about it.",
          },
          {
            title: 'You only pay for what works',
            desc: "This is the quiet win. OpenRouter's zero-completion insurance means if a request fails or gets cut off, you do not pay. Anthropic's API bills you for failed attempts the same way it bills for successful ones. At scale, this matters.",
          },
        ] as const).map(({ title, desc }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border-l-4 border-orange-400 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-0">{title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-0">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Section 6: Anthropic direct wins ── */}

      <h2>When Anthropic Direct Is the Better Choice</h2>

      <div className="not-prose space-y-4 my-8">
        {([
          {
            title: "You're sending the same prompt thousands of times",
            desc: "This is where caching control pays for itself in a week. An agent that re-sends a 40K-token system prompt 1,000 times a day burns roughly $200/day without caching. With properly tuned caching at 80% hit rate, that drops to under $60. You need the visibility that the direct API gives you to hit that 80%.",
          },
          {
            title: 'You need extended thinking on a tight latency budget',
            desc: "Opus 4.6 and 4.7 support a thinking mode where the model reasons through a problem before responding. On the direct API, you can set the thinking budget precisely. Through OpenRouter it is passed through, but the reasoning details need to be preserved carefully across turns, and the abstraction layer adds a step where things can go wrong.",
          },
          {
            title: 'You process data overnight, not in real-time',
            desc: "Anthropic's Batch API gives you 50% off both input and output. It is async — your results come back within 24 hours. For nightly document processing, data enrichment, or eval runs, this turns Opus from \"too expensive for that\" into \"why were we ever paying full price.\"",
          },
          {
            title: 'You need compliance, data residency, or audit trails',
            desc: "Enterprise workloads on Opus 4.7 can specify inference_geo: us for US-only routing (with a 1.1x surcharge). That kind of guarantee is not something a routing layer can give you cleanly — because the routing layer might send your prompt anywhere.",
          },
        ] as const).map(({ title, desc }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border-l-4 border-indigo-500 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-0">{title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-0">{desc}</p>
          </div>
        ))}
      </div>

      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-xl p-6 my-8">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3">
          The math on batch
        </p>
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          Process 10 million input tokens and 2 million output tokens on Opus. Synchronous direct
          API: <strong>$100</strong>. Batch API: <strong>$50</strong>. OpenRouter:{' '}
          <strong>$100</strong> (no batch discount on Anthropic models). If your workload can wait
          a few hours, the direct API cuts the bill in half.
        </p>
      </div>

      {/* ── Section 7: Decision ── */}

      <h2>The Decision, Visualized</h2>

      <div className="not-prose my-8">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-5 py-3 border border-amber-200 dark:border-amber-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
              Q1
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Are you using only Claude?
            </div>
          </div>

          <div className="ml-6 border-l-2 border-dashed border-gray-300 dark:border-gray-600 pl-5 space-y-4">
            <div className="flex items-start gap-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-5 py-3 border border-orange-200 dark:border-orange-800">
              <div className="flex-shrink-0 mt-0.5 text-xs font-bold text-orange-700 dark:text-orange-400 font-mono">
                NO
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  → OpenRouter
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  One key for 290+ models. Unified billing. The right starting point when you are
                  still comparing.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-5 py-3 border border-amber-200 dark:border-amber-800">
              <div className="flex-shrink-0 mt-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                YES
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                <strong>Q2:</strong> High-volume production with repeated prompts?
              </div>
            </div>

            <div className="ml-6 border-l-2 border-dashed border-gray-300 dark:border-gray-600 pl-5 space-y-3">
              <div className="flex items-start gap-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-5 py-3 border border-indigo-200 dark:border-indigo-800">
                <div className="flex-shrink-0 mt-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                  YES
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    → Anthropic direct
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Cache control, Batch API, Fast Mode. The features that actually cut your bill.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-5 py-3 border border-orange-200 dark:border-orange-800">
                <div className="flex-shrink-0 mt-0.5 text-xs font-bold text-orange-700 dark:text-orange-400 font-mono">
                  NO
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    → OpenRouter
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Failover, zero-completion insurance, team-friendly dashboards.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6 italic leading-relaxed">
            When unsure, start on OpenRouter and migrate to Anthropic when one workload dominates
            your bill.
          </p>
        </div>
      </div>

      {/* ── Section 8: Hybrid ── */}

      <h2>A Practical Hybrid Pattern</h2>

      <p className="leading-relaxed">
        You do not have to pick one. The teams I have seen run this well do something smarter: they
        use both, for different workloads.
      </p>

      <p className="leading-relaxed">
        Here is the pattern. Your production agent — the one making 10,000 calls a day with a
        cacheable prompt — goes straight to Anthropic. Everything else — prototyping, one-off
        experiments, comparison benchmarks against GPT-5 or Gemini, the occasional Kimi K2 call for
        a cheap task — routes through OpenRouter.
      </p>

      <p className="leading-relaxed">
        Two API clients, two billing accounts, two very different cost profiles.
      </p>

      <pre className="bg-gray-900 text-gray-100 rounded-lg p-5 text-sm overflow-x-auto my-6 leading-relaxed">
{`# Pseudocode for a hybrid router

def route_call(prompt, model, is_production_agent):
    if model.startswith("anthropic/") and is_production_agent:
        # Go direct — we want cache control and batch access
        return anthropic_client.messages.create(
            model=model.replace("anthropic/", ""),
            system=cached_system_prompt,  # with cache_control
            messages=messages,
        )
    else:
        # Go via OpenRouter — flexibility matters more than control here
        return openrouter_client.chat.completions.create(
            model=model,
            messages=messages,
        )`}
      </pre>

      <p className="leading-relaxed">
        The added complexity is not free — you are maintaining two clients, two sets of retry
        logic, two different observability pipelines. But for workloads at scale, the savings more
        than cover the engineering time.
      </p>

      <p className="leading-relaxed">
        A team running $500/month on Opus through OpenRouter could probably cut their bill to{' '}
        <strong>$150</strong> by moving the production workload direct and tuning their cache.
      </p>

      {/* ── Section 9: What I'd tell you ── */}

      <h2>What I'd Actually Tell You to Do</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border-t-4 border-indigo-600 dark:border-indigo-500 border border-indigo-200 dark:border-indigo-800 p-6">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Anthropic direct
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-0">
            Pick this when...
          </h3>
          <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="text-indigo-500 flex-shrink-0">&#10003;</span>
              You are running one repeated agent workload at scale
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 flex-shrink-0">&#10003;</span>
              You need cache control to hit 70%+ hit rates
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 flex-shrink-0">&#10003;</span>
              You can wait hours for batch jobs (50% off)
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 flex-shrink-0">&#10003;</span>
              You need Fast Mode or extended thinking with precise budget control
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 flex-shrink-0">&#10003;</span>
              Compliance or data residency is non-negotiable
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 flex-shrink-0">&#10003;</span>
              Your monthly Opus spend is already over $500
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl border-t-4 border-orange-500 border border-orange-200 dark:border-orange-800 p-6">
          <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-widest mb-3">
            OpenRouter
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-0">
            Pick this when...
          </h3>
          <ul className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="text-orange-500 flex-shrink-0">&#10003;</span>
              You are prototyping or evaluating across multiple models
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 flex-shrink-0">&#10003;</span>
              You need one key that also covers GPT-5, Gemini, Kimi, etc.
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 flex-shrink-0">&#10003;</span>
              You care about automatic failover more than cache precision
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 flex-shrink-0">&#10003;</span>
              Your team needs per-developer keys with spend caps
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 flex-shrink-0">&#10003;</span>
              You want zero-completion insurance on flaky workloads
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 flex-shrink-0">&#10003;</span>
              Your monthly Opus spend is under $200 and experimentation matters more
            </li>
          </ul>
        </div>
      </div>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border-l-4 border-violet-500 rounded-r-xl px-6 py-5 my-8">
        <p className="text-base italic leading-relaxed text-gray-700 dark:text-gray-300 mb-0">
          The question is not "which is better." It is "which is better for this specific workload,
          this specific team, this specific month." The answer changes as you grow.
        </p>
      </div>

      {/* ── Section 10: Real lesson ── */}

      <h2>The Real Lesson From $19.81</h2>

      <p className="leading-relaxed">
        Here is what that April 8 experiment actually taught me, and it is almost the opposite of
        what I expected going in.
      </p>

      <p className="leading-relaxed">
        <strong>The API gateway is not where Opus gets expensive. The architecture is.</strong>
      </p>

      <p className="leading-relaxed">
        Whether you pay Anthropic directly or OpenRouter indirectly, 91 uncached agent loops with
        60K-token prompts will cost roughly the same. The bars in my pricing simulation line up to
        the penny for a reason — the billing path is a commodity. What varies is what you put
        through it.
      </p>

      <p className="leading-relaxed">
        Looking back at that $19.81, almost none of the waste was attributable to OpenRouter. The
        waste was in:
      </p>

      <ul className="leading-relaxed">
        <li>Using Opus for a task that Kimi would have handled equivalently</li>
        <li>Re-sending 60K tokens of context without any cache markers</li>
        <li>Letting the agent loop without a spending alert in place</li>
        <li>Not checking whether my cache hit rate was 40% or 80% until after the bill arrived</li>
      </ul>

      <p className="leading-relaxed">
        Every one of those problems is fixable on either path. Going direct would not have rescued
        me from any of them. Staying on OpenRouter does not doom me to repeat them.
      </p>

      <p className="leading-relaxed">
        If you are already on OpenRouter and the workflow suits you, keep it. Just do not expect
        switching APIs to magically make Opus cheap. The price is the price. The waste is in how
        you use it.
      </p>

      {/* ── Section 11: Opus 4.7 ── */}

      <h2>One Last Thing About Opus 4.7</h2>

      <p className="leading-relaxed">
        Anthropic released Opus 4.7 on April 16, 2026. The sticker price stayed at $5 in / $25 out.
        But 4.7 uses a new tokenizer that can produce up to <strong>35% more tokens</strong> for
        the same input text — especially on code, structured data, and non-English content.
      </p>

      <p className="leading-relaxed">
        So your Opus bill can genuinely go up 0–35% per request even though Anthropic did not raise
        prices.
      </p>

      <p className="leading-relaxed">
        This matters for both paths. Direct, you will see it in your usage metrics immediately.
        Through OpenRouter, you will see it too, but the abstraction layer means you are one step
        further from noticing.
      </p>

      <p className="leading-relaxed">
        Either way, if you migrate from 4.6 to 4.7, <strong>measure your own token consumption
        before you commit</strong>. And if you are writing Korean or Chinese or any non-English
        content, the tokenizer change tends to hit harder — something I have seen firsthand on the
        Korean Brunch posts I publish.
      </p>

      <p className="leading-relaxed">
        You have got real options here. Both paths lead to the same model. What differs is how much
        control you want over the road.
      </p>
    </BlogPostLayout>
  );
}
