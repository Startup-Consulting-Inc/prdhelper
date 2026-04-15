/**
 * Blog Post: Do We Still Need CS Degrees in the Age of AI?
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Do you need a CS degree to get a software job in 2025?',
    answer:
      'Not necessarily. Nearly half of working developers are self-taught, and major employers including Google, Meta, and IBM have removed degree requirements for many roles. However, the credential still matters in practice — Harvard Business School found that fewer than 1 in 700 hires are actually affected by "degree-optional" policy changes. For product-building and startup roles, a strong portfolio matters more than a degree. For ML research, distributed systems, or enterprise employers, the degree still provides a meaningful advantage.',
  },
  {
    question: 'Is a CS degree worth it in the age of AI?',
    answer:
      "It depends on your goal. For roles building AI systems, infrastructure, or doing research, the degree is still worth it — the theoretical foundations (linear algebra, probability, systems architecture) are hard to replicate through self-study. For product builders and entrepreneurs, the ROI is less clear: a $7,000 online master's or intensive bootcamp can provide enough structure to break into the industry. The $100K+ four-year degree is hardest to justify unless you're targeting roles that specifically value the credential.",
  },
  {
    question: 'What does "vibe coding" mean?',
    answer:
      "Vibe coding is a term coined by Andrej Karpathy in early 2025 to describe a mode of software development where you express your intent in natural language, let an AI coding assistant handle the implementation, and iterate from there. It emphasizes the 'what' over the 'how' — shifting programming from syntax-level problem-solving toward higher-level intent specification. It has lowered the barrier to shipping working software but doesn't eliminate the need to understand what's happening under the hood.",
  },
  {
    question: 'Are self-taught developers as good as CS graduates?',
    answer:
      'For many roles, yes — particularly product-focused development, frontend engineering, and startup environments where shipping speed matters. Self-taught developers who have built substantial real-world projects often outperform recent graduates who have strong theory but limited practical experience. The gap tends to appear in areas requiring deep theoretical foundations: distributed systems at scale, ML model development, cryptography, and systems programming. In those areas, structured education provides knowledge that is difficult to acquire through project work alone.',
  },
  {
    question: 'What programming skills are most valuable in the AI era?',
    answer:
      "The skills that are most durable in an AI-assisted world are those AI cannot easily replicate: systems thinking (designing software that scales and fails gracefully), AI fluency (knowing how to direct AI tools effectively, catch their errors, and understand their limitations), and domain knowledge in adjacent fields like physics, biology, or finance. Pure syntax knowledge is increasingly commoditized — the ability to evaluate, debug, and architect what AI generates is the differentiator.",
  },
  {
    question: 'What is the cheapest way to get a CS education?',
    answer:
      "Georgia Tech's Online Master of Science in Computer Science (OMSCS) is widely considered the best value in formal CS education — a full master's degree for roughly $7,000 total. For undergrad equivalents, MIT OpenCourseWare, Stanford's online courses, and platforms like Coursera, edX, and fast.ai offer free or low-cost access to high-quality curriculum. The honest answer is that the curriculum is not the scarce resource — self-motivation, structured practice, and a portfolio of real projects are what turn free resources into job-ready skills.",
  },
];

export default function CSDegreeAIEraPost() {
  return (
    <BlogPostLayout
      title="Do We Still Need CS Degrees in the Age of AI?"
      author="Jaehee Song"
      date="2026-06-14"
      readTime="10 min read"
      category="AI & Education"
      excerpt="The golden ticket to tech is being questioned. Here's what the evidence actually says about CS degrees, vibe coding, and which path makes sense for you."
      slug="cs-degree-ai-era"
      coverImage="CS"
      coverGradient="from-indigo-700 via-blue-600 to-cyan-500"
      faqItems={FAQ_ITEMS}
    >
      <p>
        For most of the past thirty years, if you wanted to work in software, you knew the playbook.
        Four years of computer science, internship at a big tech company, six-figure job offer before
        graduation. The degree wasn't just a credential — it was the filter that separated those who
        "really understood computers" from everyone else.
      </p>

      <p>That filter is cracking. And not slowly.</p>

      <p>
        Between the rise of AI coding assistants, the proliferation of bootcamps, the explosion of
        YouTube tutorials, and tools that let non-programmers ship working products in a weekend, the
        question that once lived on the fringes of tech forums has moved into boardrooms:{' '}
        <strong>do we actually need a computer science degree anymore?</strong>
      </p>

      <div className="not-prose bg-gray-900 rounded-xl p-8 my-8 border border-gray-700">
        <p className="font-serif text-xl leading-relaxed text-gray-100 font-light">
          "We are living through a genuine inflection point. The barriers to acquiring high-level
          technical skills are crumbling, replaced by natural language prompts and personalized AI
          tutors.{' '}
          <em className="text-gray-400 not-italic">The rules are being rewritten in real time.</em>"
        </p>
      </div>

      <p>
        The answer is no longer a simple yes or no. It never really was — but right now, the gap
        between those two positions is wider and more consequential than it's ever been. Let's
        actually dig into it.
      </p>

      <h2>The Old Gate Is Rusting</h2>

      <p>
        The data is blunt. Developer Nation's survey found that{' '}
        <strong>43% of working developers are self-taught</strong>, while only 16.6% learned through
        traditional schooling. Stack Overflow's 2025 survey shows nearly half of working developers
        never followed the conventional university path at all.
      </p>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 text-center">
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">43%</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">of developers are self-taught (Developer Nation)</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 text-center">
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">53%</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">of employers have removed degree requirements (Harvard Business School)</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 text-center">
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">8%</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">drop in CS enrollment in 2025–26 — steepest of any major</p>
        </div>
      </div>

      <p>
        Those numbers reflect something real: the path into software has genuinely diversified. But
        they don't tell the whole story. Saying "nearly half of developers are self-taught" is a bit
        like saying "nearly half of restaurant owners never went to culinary school." True, but it
        doesn't tell you who's running a three-star kitchen and who's running a food truck. Both are
        legitimate — but they're different things.
      </p>

      <h3>The AI Co-Pilot Effect</h3>

      <p>
        The more fundamental shift isn't in education — it's in the tools themselves. AI coding
        assistants like GitHub Copilot, Cursor, and Claude Code have genuinely changed what "writing
        software" means on a day-to-day basis. Andrej Karpathy, the former Tesla AI director, coined
        the term <strong>"vibe coding"</strong> in early 2025 to describe a new mode of development:
        express your intent in natural language, let the AI handle the implementation, iterate from
        there.
      </p>

      <div className="not-prose border-l-4 border-indigo-500 pl-7 py-1 my-8">
        <p className="font-serif text-xl font-light italic leading-relaxed text-gray-800 dark:text-gray-200 mb-2">
          "Programming is becoming less about 'how' and more about 'what' — expressing intent."
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Andrej Karpathy · AI Researcher, former Tesla AI Director
        </p>
      </div>

      <p>
        Andrew Ng, whose DeepLearning.AI platform has trained millions of developers, launched "Vibe
        Coding 101" — a course that takes absolute beginners to a deployed web application in under
        94 minutes. His philosophy is clear: the bottleneck is no longer technical knowledge, it's
        the ability to collaborate with AI effectively, to give agents one task at a time, to debug
        iteratively, and to ship.
      </p>

      <p>
        This isn't fringe thinking. Anton Osika, CEO of Lovable (a vibe-coding platform recently
        valued at $1.5 billion), put it bluntly: "I wouldn't say it's worthless, but I do think the
        leverage has moved." For most people building most things, the credential isn't the entry
        ticket anymore. Curiosity and shipping speed matter more.
      </p>

      <h3>Skills-First Hiring Is Real</h3>

      <p>
        Google, Meta, Microsoft, Apple, IBM, and Tesla have all publicly removed degree requirements
        for at least some technical roles. When Elon Musk says degrees aren't necessary to work at
        Tesla as long as you can prove your skills, he's signaling a broader shift. IBM has gone
        further, removing degree requirements for roughly half of its US roles in favor of
        skills-based assessments.
      </p>

      <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 border-l-4 border-l-blue-600 dark:border-l-blue-400 rounded-r-xl p-6 my-8">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">
          The Important Caveat
        </p>
        <p className="text-gray-800 dark:text-gray-200 text-base">
          Harvard Business School found that while 53% of employers have removed degree requirements
          in policy, fewer than 1 in 700 hires are actually affected by those policy changes.
          Companies are saying degrees are optional faster than they're actually hiring without them.
        </p>
      </div>

      <p>The trend is real. But it's moving slower in practice than the headlines suggest.</p>

      <h2>Why the Degree Still Matters</h2>

      <p>
        Here's the thing that often gets lost in the "degrees are dying" narrative: the people most
        publicly confident about AI's abilities are also the ones who spent years building their
        foundational CS knowledge before AI tools existed. They know when the AI is wrong because
        they understand what right looks like.
      </p>

      <h3>The "Confident Liar" Problem</h3>

      <p>
        AI models hallucinate. They generate code that looks right but isn't. They suggest
        architectural patterns that will create problems at scale. They reference APIs that don't
        exist. For someone with deep CS foundations, catching these errors is second nature. For
        someone who only knows what the AI tells them, it's a disaster waiting to happen.
      </p>

      <p>
        Microsoft CEO Satya Nadella framed this well: AI "lowers the floor" (anyone can write some
        code) but "raises the ceiling" (understanding what the AI is actually doing becomes more
        valuable, not less). If you can't audit the output, you're not an engineer — you're an
        executor hoping the black box works.
      </p>

      <div className="not-prose border-l-4 border-indigo-500 pl-7 py-1 my-8">
        <p className="font-serif text-xl font-light italic leading-relaxed text-gray-800 dark:text-gray-200 mb-2">
          "Now anyone can be a software developer, but it's also raising the ceiling on what
          sophistication you need."
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Satya Nadella · CEO, Microsoft
        </p>
      </div>

      <p>
        This is the core tension. The degree's value isn't the syntax you memorized — it's the
        mental model you built. Data structures, algorithms, systems architecture, discrete math.
        None of that is what you use every day at work. But it's what you draw on when something
        breaks in a way that doesn't make sense, or when you're designing a system that needs to
        handle ten times the current load.
      </p>

      <h3>The Jensen Huang Pivot</h3>

      <p>
        Here's a surprising data point: Nvidia's CEO Jensen Huang — head of the world's most
        valuable company by market cap in 2025 — recently said that if he were a 22-year-old student
        today, he would study <strong>physical sciences</strong>, not computer science. Not because
        CS is dead, but because the next wave of AI requires understanding physics, robotics, and
        real-world systems.
      </p>

      <p>
        His point was the opposite of "don't get a technical degree." It was: the skills AI can't
        replicate are moving toward first-principles understanding of the physical world. Reasoning,
        causality, systems thinking. The kind of rigorous thinking that a strong CS or science degree
        develops — not the rote syntax training, but the deeper habits of mind.
      </p>

      <h3>Where the Degree Still Wins</h3>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-base mb-3">
            ▲
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            ML Research &amp; AI Infrastructure
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Roles building the models that power AI tools overwhelmingly favor (and often require)
            formal education in mathematics and CS theory.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-base mb-3">
            ▲
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Distributed Systems Design
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Designing systems at scale requires deep intuition about tradeoffs — consistency vs.
            availability, latency vs. throughput — that's hard to build without foundational
            exposure.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-base mb-3">
            ▲
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Security &amp; Cryptography
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Attack surfaces require the kind of adversarial thinking and mathematical grounding that
            CS programs are built to develop.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-base mb-3">
            ▲
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Robotics &amp; Physical AI
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            As AI moves into the physical world, understanding control theory, computer vision, and
            embedded systems becomes the real differentiator.
          </p>
        </div>
      </div>

      <p>
        Karim Meghji, president of Code.org, pushes back against the "AI kills CS" narrative
        directly: "There's a growing narrative that AI makes computer science obsolete, but it's just
        not the case. AI isn't killing computer science; it's making it more essential." What's
        changing isn't the value of CS knowledge — it's which aspects of that knowledge matter most.
      </p>

      <h2>What Industry Leaders Are Actually Saying</h2>

      <div className="not-prose divide-y divide-gray-200 dark:divide-gray-700 my-8">
        <div className="grid grid-cols-[56px_1fr] gap-5 py-6">
          <div className="w-[52px] h-[52px] rounded-xl bg-indigo-900 flex items-center justify-center text-white font-serif font-semibold text-lg flex-shrink-0">
            JH
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Jensen Huang</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">CEO, Nvidia</p>
            <p className="font-serif text-base italic text-gray-600 dark:text-gray-400 leading-relaxed">
              "The next wave requires us to understand the laws of physics... not just coding. If I
              were a student today, I'd study physical sciences."
            </p>
            <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              Nuanced: Deep skills still matter
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[56px_1fr] gap-5 py-6">
          <div className="w-[52px] h-[52px] rounded-xl bg-orange-600 flex items-center justify-center text-white font-serif font-semibold text-lg flex-shrink-0">
            SN
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Satya Nadella</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">CEO, Microsoft</p>
            <p className="font-serif text-base italic text-gray-600 dark:text-gray-400 leading-relaxed">
              "AI lowers the floor for coding, but simultaneously raises the ceiling — the
              sophistication required to build great software is growing, not shrinking."
            </p>
            <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              Pro-degree: Deep understanding more valuable
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[56px_1fr] gap-5 py-6">
          <div className="w-[52px] h-[52px] rounded-xl bg-emerald-700 flex items-center justify-center text-white font-serif font-semibold text-lg flex-shrink-0">
            AK
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
              Andrej Karpathy
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              AI Researcher, former Tesla &amp; OpenAI
            </p>
            <p className="font-serif text-base italic text-gray-600 dark:text-gray-400 leading-relaxed">
              "Vibe coding is a real thing. You express intent, AI handles implementation. The 'how'
              matters less than the 'what' now."
            </p>
            <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400">
              Pro-path: Traditional degree less critical for builders
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[56px_1fr] gap-5 py-6">
          <div className="w-[52px] h-[52px] rounded-xl bg-gray-600 flex items-center justify-center text-white font-serif font-semibold text-lg flex-shrink-0">
            AN
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Andrew Ng</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Founder, DeepLearning.AI</p>
            <p className="font-serif text-base italic text-gray-600 dark:text-gray-400 leading-relaxed">
              "Skills matter more than credentials — but understanding the plumbing of AI systems is
              crucial. The method of learning is changing; the need for depth is not."
            </p>
            <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              Nuanced: Skills over credentials, but depth required
            </span>
          </div>
        </div>
      </div>

      <h2>The Economic Reality Nobody Wants to Say Clearly</h2>

      <p>Let's talk about the numbers that don't make it into the LinkedIn thought-leadership posts.</p>

      <p>
        A CS degree from a top US program costs between $40,000 and $130,000 in tuition alone. Add
        four years of foregone income and the total real cost can exceed $300,000. Meanwhile, a
        motivated self-taught developer who starts learning at 22 and lands a $70,000 role at 24
        will bank roughly $350,000 over five years while a CS student is still finishing their junior
        year.
      </p>

      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 border-l-4 border-l-emerald-600 dark:border-l-emerald-400 rounded-r-xl p-6 my-8">
        <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
          <strong className="text-emerald-800 dark:text-emerald-200">
            The math is brutal for anyone without family wealth or access to affordable in-state
            tuition.
          </strong>{' '}
          Georgia Tech's Online MS in CS costs roughly $7,000 total — a full master's degree. That
          changes the calculus entirely for people who already work in the field and want to fill
          theoretical gaps.
        </p>
      </div>

      <p>
        The degree persists partly because of legitimate value — the rigor, the network, the signal
        — and partly because of institutional inertia. Government contractors, Fortune 500 HR
        departments with compliance requirements, and immigration systems still lean heavily on the
        four-year credential. That's not changing as fast as the tech startup world would have you
        believe.
      </p>

      <p>
        The curriculum lag is also real. Many university CS programs are still teaching frameworks
        and tools that have been partially superseded by AI. The "hot" technology a freshman
        encounters in week one of a four-year program may be significantly less relevant by
        graduation. Industry moves in quarters; academia moves in decades.
      </p>

      <h2>What to Actually Do With This Information</h2>

      <p>
        The degree isn't dying — its monopoly is over. That's a meaningful distinction. What we're
        seeing is a shift from a world where a CS degree was a <strong>requirement</strong> to a
        world where it's an <strong>option</strong>. One of several legitimate paths that lead to the
        same place.
      </p>

      <p>Here's an honest breakdown of which path makes sense for which goal:</p>

      <div className="not-prose space-y-4 my-8">
        <div className="border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 flex gap-5 items-start">
          <div className="text-2xl flex-shrink-0">🏗️</div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              You want to build AI, work in ML research, or design infrastructure at scale
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Get the degree. The theoretical foundation — linear algebra, probability theory,
              systems architecture, distributed computing — is genuinely hard to replicate through
              self-study, and the research environment accelerates your development in ways that
              bootcamps can't. The degree isn't just about employment; it's about depth of
              understanding.
            </p>
          </div>
        </div>
        <div className="border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 flex gap-5 items-start">
          <div className="text-2xl flex-shrink-0">🚀</div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              You want to build products, start companies, or change careers quickly
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              You don't need the degree. A bootcamp plus intensive self-study plus a strong GitHub
              profile has become a genuinely viable alternative path. What you ship matters more than
              your alma mater. Focus on demonstrating ability, not collecting credentials.
            </p>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 flex gap-5 items-start">
          <div className="text-2xl flex-shrink-0">🔁</div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              You're not sure yet — you're early in the process
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              The hybrid approach is winning. Start with free resources to test your actual
              commitment. Add structure (bootcamp or online program) once you know it's real. Then
              consider a part-time online CS degree like Georgia Tech's OMSCS once you're employed
              and can see exactly which theoretical gaps are holding you back. Don't pay $120,000 to
              find out if you like coding.
            </p>
          </div>
        </div>
      </div>

      <p>
        The deeper shift isn't about degrees at all — it's about what makes a strong technologist
        right now. Increasingly, it's the combination of <strong>systems thinking</strong> (which a
        CS degree develops well), <strong>AI fluency</strong> (which most CS programs are still
        catching up on), and the ability to ship real things fast (which you develop by actually
        shipping things). No single path gives you all three automatically.
      </p>

      <div className="not-prose border-l-4 border-indigo-500 pl-7 py-1 my-8">
        <p className="font-serif text-xl font-light italic leading-relaxed text-gray-800 dark:text-gray-200 mb-2">
          "Don't just learn to code. Learn to solve. In a world where everyone can code, the winners
          will be those who know what is worth building."
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          The takeaway
        </p>
      </div>

      <p>
        The fascinating part of this moment isn't the debate between degrees and bootcamps. It's that
        for the first time, the path genuinely doesn't matter as much as the destination — and the
        destination is someone who can think clearly about hard problems, build systems that work
        under real conditions, and keep learning as the tools keep changing.
      </p>

      <p>
        The gatekeepers are losing their keys. That's good news. What you do with the open door is
        still up to you.
      </p>

      <h2>Key Takeaways</h2>

      <div className="not-prose bg-gray-900 rounded-2xl p-10 mt-2 mb-8">
        <div className="space-y-6">
          <div className="grid grid-cols-[28px_1fr] gap-4 items-start">
            <span className="font-serif text-lg font-semibold text-indigo-400 leading-relaxed">01</span>
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-white">The degree's monopoly is over, but its value isn't.</strong>{' '}
              For research, infrastructure, and deep systems work, a CS degree still provides
              foundations that are genuinely hard to replicate elsewhere. For product-building and
              entrepreneurship, it's increasingly optional.
            </p>
          </div>
          <div className="grid grid-cols-[28px_1fr] gap-4 items-start">
            <span className="font-serif text-lg font-semibold text-indigo-400 leading-relaxed">02</span>
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-white">AI tools raise the ceiling while lowering the floor.</strong>{' '}
              Anyone can write some code now. But to audit what AI generates, catch architectural
              mistakes, and build systems that scale — you need the kind of mental model that deep
              technical education builds.
            </p>
          </div>
          <div className="grid grid-cols-[28px_1fr] gap-4 items-start">
            <span className="font-serif text-lg font-semibold text-indigo-400 leading-relaxed">03</span>
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-white">The skills-first hiring shift is real but slower than advertised.</strong>{' '}
              Policy changes outpace actual hiring changes. Traditional institutions (government
              contractors, compliance-heavy companies, immigration systems) still lean heavily on the
              credential.
            </p>
          </div>
          <div className="grid grid-cols-[28px_1fr] gap-4 items-start">
            <span className="font-serif text-lg font-semibold text-indigo-400 leading-relaxed">04</span>
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-white">The economics vary enormously by situation.</strong>{' '}
              A $7,000 online master's, a $15,000 bootcamp, and a $130,000 four-year degree are
              radically different bets. Choose the path based on your specific goal, not on which
              narrative is louder on LinkedIn right now.
            </p>
          </div>
          <div className="grid grid-cols-[28px_1fr] gap-4 items-start">
            <span className="font-serif text-lg font-semibold text-indigo-400 leading-relaxed">05</span>
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-white">Learning is the only permanent advantage.</strong>{' '}
              The tools, frameworks, and even the job titles will keep changing. The habit of
              continuous learning — whether through formal programs, AI-assisted self-study, or
              hands-on building — is the one skill that doesn't go obsolete.
            </p>
          </div>
        </div>
      </div>

      <h2>Frequently Asked Questions</h2>

      <div className="not-prose space-y-4 my-8">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <details
            key={question}
            className="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{question}</span>
              <span className="text-gray-400 flex-shrink-0 text-xs font-medium group-open:hidden">▼</span>
              <span className="text-gray-400 flex-shrink-0 text-xs font-medium hidden group-open:inline">▲</span>
            </summary>
            <div className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {answer}
            </div>
          </details>
        ))}
      </div>
    </BlogPostLayout>
  );
}
