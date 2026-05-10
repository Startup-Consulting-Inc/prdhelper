/**
 * Blog Post: The Engineer Who Got Hired to Wipe Bodies
 *
 * An essay on identity collapse after layoff, the hidden labor of caregiving,
 * and what hiring filters fail to measure.
 *
 * Source: docs/life.txt
 */

import type { ReactNode } from 'react';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import { Helmet } from 'react-helmet-async';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I explain a career gap caused by caregiving?',
    answer:
      'Explain it as a period of responsibility, not absence. Be factual about the timeline and emphasize transferable skills: reliability, communication under stress, ethical judgment, patience, and the ability to operate without perfect information. Then reconnect it to the role you want by showing continued craft (writing, building, learning, open-source, small shipped projects).',
  },
  {
    question: 'Should I take work that feels “beneath my experience” after a layoff?',
    answer:
      'Often, yes — if it keeps you in motion and stabilizes your life. The goal is not to downgrade your identity, but to buy time, protect cash flow, and maintain momentum while you rebuild your next professional chapter. Being employed can also reduce the emotional drag of prolonged rejection.',
  },
  {
    question: 'Why does unemployment feel like identity collapse?',
    answer:
      'Many people derive meaning and status from work. When that scaffolding is removed, it can create an “existential vacuum” — a sense of emptiness and disorientation. The feeling is common and not a personal failure; it’s a predictable psychological response to losing structure, community, and external validation.',
  },
  {
    question: 'What does Viktor Frankl mean by “creative value,” “love,” and “stance toward suffering”?',
    answer:
      'Frankl described three pathways to meaning: what you create (work or contribution), who you love (relationships and encounter), and the attitude you take toward unavoidable suffering (the stance you choose when you can’t change the facts). The point isn’t to romanticize hardship, but to regain agency when circumstances are constrained.',
  },
  {
    question: 'What do hiring filters and ATS systems miss about candidates?',
    answer:
      'They miss non-scalable human work: caregiving, moral decision-making, patience, and the ability to sit with ambiguity. Automated systems optimize for signals that compress well into text — titles, keywords, linear trajectories. But in an AI-shaped economy, judgment, ethics, communication, and resilience are increasingly the differentiators.',
  },
  {
    question: 'How can teams build fairer hiring processes in an AI era?',
    answer:
      'Make non-traditional experience legible instead of penalized. Use structured rubrics, allow narrative context, and ensure a human review path for edge cases like caregiving gaps. Evaluate candidates on role-relevant artifacts (writing, design docs, debugging, project work) and give them opportunities to demonstrate judgment rather than only resume pattern-matching.',
  },
];

const RELATED_POSTS = [
  {
    slug: 'entry-level-tech-2026',
    title: 'The New Rules of Entry-Level Tech: What Changed Between 2018 and 2026',
    category: 'AI & Education',
    date: '2026-04-15',
  },
  {
    slug: 'ai-interview-transformation-2026',
    title: 'The AI-Driven Interview: How Tech Hiring Was Rebuilt from Scratch',
    category: 'AI & Education',
    date: '2026-04-15',
  },
  {
    slug: 'defining-the-right-problem-ai-era',
    title: 'The Most Valuable Skill in the AI Era: Defining the Right Problem',
    category: 'AI & Development',
    date: '2026-03-25',
  },
];

/** Body copy: Medium-like size and line height (matches skills-vs-agents) */
function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-7 last:mb-0 text-[1.05rem] sm:text-[1.125rem] leading-[1.78] text-gray-800 dark:text-gray-200">
      {children}
    </p>
  );
}

/** Key line / pull quote — scan-friendly */
function KeyLine({ children }: { children: ReactNode }) {
  return (
    <p className="my-8 pl-5 border-l-[3px] border-emerald-600 dark:border-emerald-400 text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-14 first:mt-0 mb-6 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      {children}
    </h2>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-10 mb-4 text-base font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
      {children}
    </h3>
  );
}

function SectionRule() {
  return (
    <div
      className="my-12 h-px w-full bg-gradient-to-r from-transparent via-gray-300/90 dark:via-gray-600 to-transparent"
      aria-hidden
    />
  );
}

function ArticleShell({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose max-w-[680px] mx-auto w-full text-[1.05rem] sm:text-[1.125rem] leading-[1.78] text-gray-800 dark:text-gray-200">
      {children}
    </div>
  );
}

export default function IdentityCollapseCaregivingPost() {
  return (
    <BlogPostLayout
      title="The Engineer Who Got Hired to Wipe Bodies: A Field Report on Identity Collapse"
      author="Jaehee Song"
      date="2026-05-05"
      readTime="9 min read"
      category="Featured"
      excerpt="A laid-off engineer takes a near-minimum-wage caregiving job and discovers what hiring filters can’t measure: patience, ethical work that doesn’t scale, and the ability to sit with ambiguity when identity collapses."
      slug="engineer-caregiver-identity-collapse"
      coverImage="LIFE"
      coverGradient="from-gray-900 via-slate-800 to-emerald-800"
      faqItems={FAQ_ITEMS}
      relatedPosts={RELATED_POSTS}
    >
      <Helmet>
        <meta
          name="keywords"
          content="career identity collapse, layoff recovery, caregiving career gap, unemployed engineer, meaning after layoff, Viktor Frankl existential vacuum, hiring filters, ATS rejection, senior engineer job search, work and identity"
        />
        <meta property="article:published_time" content="2026-05-05" />
        <meta property="article:section" content="Featured" />
        <meta property="article:tag" content="career" />
        <meta property="article:tag" content="caregiving" />
        <meta property="article:tag" content="identity" />
        <meta property="article:tag" content="hiring" />
      </Helmet>

      <ArticleShell>
        {/* Opening — more whitespace + dropcap */}
        <p className="mb-8 text-[1.125rem] sm:text-[1.2rem] leading-[1.75] text-gray-800 dark:text-gray-200 first-letter:float-left first-letter:mr-2 first-letter:mt-0.5 first-letter:font-serif first-letter:text-[2.8rem] first-letter:font-bold first-letter:leading-[0.9] first-letter:text-emerald-700 dark:first-letter:text-emerald-400">
          The first time I had to say <em>“I am a caregiver”</em> out loud, the sentence stuck in my
          throat like a bone. We were at a party. My wife’s colleagues—people who didn’t know me.
          Someone asked the question everyone asks: <em>So what do you do?</em>
        </p>

        <P>
          I opened my mouth to say something about AI. About the consulting work. About the startup I
          was planning. Instead I said, <em>“I work in home care.”</em>
        </P>

        <KeyLine>
          The silence was brief but absolute. Then: <em>“Oh, that’s… rewarding.”</em>
        </KeyLine>

        <P>
          What I heard was demotion. Failure. <em>What happened to him?</em> I saw it in their faces.
          I saw it in my own face later, in the bathroom mirror at the immobile man’s house, washing
          my hands between feedings.
        </P>

        <div className="mb-10 rounded-2xl border border-gray-200/80 dark:border-gray-600/50 bg-gradient-to-b from-emerald-50/90 to-white dark:from-emerald-950/35 dark:to-gray-900/30 px-6 sm:px-8 py-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2">
            Field report
          </p>
          <p className="m-0 text-base leading-8 text-gray-700 dark:text-gray-300">
            I built data platforms at a Fortune 500 fintech for nearly twenty years. Now I lift bodies
            for almost minimum wage. This is a report from inside that gap — the space where your job
            ends and your identity keeps trying to use the old name.
          </p>
        </div>

        <SectionRule />

        <SectionTitle>The job you apply for when the doors stop opening</SectionTitle>

        <P>
          After the layoff, the first months felt like a sabbatical. Severance, unemployment, ski
          trips, postponed projects. I built a platform that scored job postings against my resume,
          tailored applications, tracked submissions.
        </P>

        <KeyLine>It collected rejections perfectly.</KeyLine>

        <P>
          The market was flooded with engineers who had my exact skill set. Month after month — silence,
          automated rejections, the polite “we’ve decided to move forward with another candidate.”
        </P>

        <P>
          So I tried lower. Factory work. Warehouse jobs. They wouldn’t hire me either.{' '}
          <em>Overqualified.</em> They saw twenty years of engineering and assumed I’d leave the moment
          something better came along. They weren’t wrong.
        </P>

        <div className="my-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-5 shadow-sm">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Trap #1
            </p>
            <p className="mt-2 mb-0 font-semibold text-gray-900 dark:text-gray-100">Too senior</p>
            <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">
              The senior roles already have hundreds of you waiting.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-5 shadow-sm">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Trap #2
            </p>
            <p className="mt-2 mb-0 font-semibold text-gray-900 dark:text-gray-100">Too risky</p>
            <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">
              The junior roles assume you’ll leave as soon as the market turns.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-5 shadow-sm">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Result
            </p>
            <p className="mt-2 mb-0 font-semibold text-gray-900 dark:text-gray-100">No doors</p>
            <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">
              They don’t slam. They just don’t open.
            </p>
          </div>
        </div>

        <P>
          Then a home care agency called. The pay was almost minimum wage. The work was lifting,
          cleaning, feeding, sitting with people who couldn’t thank me. I said yes.
        </P>

        <P>
          I was happy — actually happy — that someone wanted me. I could pay bills. I was no longer
          useless. I just couldn’t say what I’d become.
        </P>

        <SectionRule />

        <SectionTitle>What Frankl knew about the vacuum</SectionTitle>

        <P>
          Viktor Frankl wrote about the <em>existential vacuum</em> — the inner emptiness that arrives
          when meaning derived from work and status is removed. “The unemployed worker,” he wrote, “is
          harassed by a sense of emptiness and the resulting lack of meaning in his life.”
        </P>

        <div className="my-10 rounded-2xl border border-gray-200/80 dark:border-gray-600/50 bg-white dark:bg-gray-900/40 p-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
            Three pathways to meaning (Frankl)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 p-4">
              <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">Creative work</p>
              <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">What you build.</p>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 p-4">
              <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">Loving encounter</p>
              <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">Who you meet.</p>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 p-4">
              <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">Your stance</p>
              <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">How you endure.</p>
            </div>
          </div>
        </div>

        <P>
          When the scaffolding of your self gets pulled out, you don’t just adjust. You enter a
          vacuum. And the vacuum is where despair lives — the slow-onset kind that shows up at 3 AM
          when the mortgage is due.
        </P>

        <P>
          Frankl’s point isn’t to replace one badge with another. It’s to regain agency when the facts
          won’t move.
        </P>

        <SectionRule />

        <SectionTitle>The body becomes the tool</SectionTitle>

        <P>
          A man who built systems that scale now holds a body that cannot move. A man who taught
          optimization now bathes a man who cannot remember his wife’s name. The dissonance isn’t
          intellectual.
        </P>

        <P>
          It lives in the shoulders when I lift the immobile man from his chair. It lives in the knees
          when I kneel to tie an 88-year-old’s shoes.
        </P>

        <KeyLine>
          My body has become my primary tool. And unlike my code, it doesn’t improve with iteration.
        </KeyLine>

        <P>
          I have a regular client who can communicate only by opening or closing his mouth. Open means
          yes. Closed means no. That’s the entire protocol. One bit of information, no error
          correction, no acknowledgment packet.
        </P>

        <P>
          If I were still at my old desk, I’d call this a broken API and file a ticket. Instead I sit.
          I wait. I read the angle of his jaw and try to honor it as a signal rather than a null value.
        </P>

        <div className="my-10 rounded-2xl bg-gray-900 text-gray-100 border border-gray-700 px-6 sm:px-8 py-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-emerald-300 mb-3">
            What the work actually is
          </p>
          <p className="m-0 text-lg leading-8 font-serif font-light">
            The waiting — the willingness to sit in not-knowing without rushing to a conclusion that
            makes my life easier.
          </p>
        </div>

        <P>
          It turns out that’s a skill. It’s not on any resume. No recruiter screens for it. But it’s
          the one I most lacked when I was an engineer — and it’s the one I’m finally learning.
        </P>

        <SectionRule />

        <SectionTitle>What hiring filters don’t capture</SectionTitle>

        <P>
          I spent my career building systems that filtered candidates, scored resumes, optimized hiring
          pipelines. I know exactly how I became the outlier they discarded.
        </P>

        <KeyLine>
          The same logic I once wrote into code is now what keeps me from being hired.
        </KeyLine>

        <P>
          Caregiving is emotional and ethical work that is structurally inefficient — and that’s the
          point. Care doesn’t scale. It doesn’t parallelize. It can’t be load-balanced across a
          population.
        </P>

        <P>
          Every encounter is unique. Every Tuesday afternoon is a new ethical event. The person doing
          it is learning, in their hands and shoulders, the limits of the optimization mindset that AI
          is now forcing the entire economy to confront.
        </P>

        <div className="my-10 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/30 px-6 sm:px-8 py-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 mb-2">
            If you build AI products
          </p>
          <p className="m-0 text-base leading-8 text-gray-800 dark:text-gray-200">
            This isn’t a gap on a resume. It’s perspective your team is missing.
          </p>
        </div>

        <SectionRule />

        <SectionTitle>What I’d tell someone in the same place</SectionTitle>

        <P>
          If you’re reading this from inside the same gap — laid off, applying everywhere, watching your
          savings shrink while your identity quietly comes apart — I can’t tell you it gets fixed.
          Mine isn’t fixed.
        </P>

        <P>But three things have helped me keep moving.</P>

        <Subhead>1) Separate your worth from the market’s verdict</Subhead>
        <P>
          The market is wrong about a lot of people right now, especially senior ones. Its rejection of
          you is information about its current state, not about your value. Hold that line, even when
          it sounds like cope.
        </P>

        <Subhead>2) Take the work that’s available</Subhead>
        <P>
          Not because dignity lives in suffering, but because being in motion is better than being in
          stasis. The caregiver job didn’t restore my old identity. It gave me a new place to stand
          while I figure out what comes next.
        </P>

        <Subhead>3) Keep building</Subhead>
        <P>
          After every shift, I open my laptop and work on something — writing, tools, teaching
          material. Not because side projects will save me. Because they remind me I’m still a
          builder. Frankl called this <em>creative value</em>. It’s a rope. It works.
        </P>

        <KeyLine>
          The mouth opens. The mouth closes. That’s the whole sentence I now live inside.
        </KeyLine>

        <div className="mt-12 rounded-2xl border border-gray-200/80 dark:border-gray-600/50 bg-gray-900 px-6 sm:px-8 py-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-gray-300 mb-3">
            Continue the series
          </p>
          <p className="m-0 text-base leading-8 text-gray-100">
            I published the full series (eight articles plus an epilogue) at{' '}
            <a
              href="https://life.ai-biz.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
            >
              life.ai-biz.app
            </a>
            .
          </p>
        </div>
      </ArticleShell>
    </BlogPostLayout>
  );
}

