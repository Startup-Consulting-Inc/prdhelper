/**
 * Blog Post: 7 Common BRD Mistakes That Derail Projects (And How to Fix Them)
 */

import { BlogPostLayout } from '../../../components/blog/BlogPostLayout';

export default function BRDMistakesPost() {
  return (
    <BlogPostLayout
      title="7 Common BRD Mistakes That Derail Projects (And How to Fix Them)"
      author="Michael Rodriguez"
      date="2026-02-08"
      readTime="9 min read"
      category="Best Practices"
      excerpt="Most project failures can be traced back to a bad BRD. Here are the 7 most common Business Requirements Document mistakes — and exactly how to avoid each one."
      slug="brd-mistakes-to-avoid"
      coverImage="⚠️"
      coverGradient="from-yellow-600 via-amber-600 to-orange-600"
    >
      <h2>Why a Bad BRD Is So Expensive</h2>
      <p>
        The IBM Systems Sciences Institute found that fixing a requirements defect after
        deployment costs 100 times more than fixing it during the requirements phase. That
        statistic has been cited so often it's almost cliché — but it keeps getting cited
        because it keeps being true. Requirements errors compound. A vague requirement becomes
        a misbuilt feature. A misbuilt feature requires rework. Rework pushes the timeline.
        A delayed timeline creates pressure to cut scope. Cut scope means unhappy stakeholders.
        Unhappy stakeholders question the entire project.
      </p>
      <p>
        The Business Requirements Document (BRD) is the first major artifact in any project.
        Its mistakes are the most expensive kind, because they travel forward into every
        subsequent phase. An engineer who builds to a wrong requirement isn't just wasting
        engineering time — they're building something that will need to be undone and rebuilt.
      </p>
      <p>
        Here are the seven mistakes that show up most often in BRDs, what they look like in
        practice, and how to avoid them.
      </p>

      <h2>Mistake 1: Writing Solutions Instead of Requirements</h2>
      <p>
        <strong>What it looks like:</strong> "The system shall display a dropdown menu on the
        homepage that allows users to filter products by category." This sentence is a solution.
        It prescribes a dropdown menu — a specific UI implementation — rather than expressing
        the underlying business need.
      </p>
      <p>
        <strong>The consequence:</strong> When you write solutions into a BRD, you lock
        designers and engineers into implementation decisions before they've had a chance to
        evaluate alternatives. You might get a dropdown when a search bar, faceted filters, or
        a tabbed category view would have served users better. You've optimized for the wrong
        thing — describing the how instead of the what.
      </p>
      <p>
        <strong>The fix:</strong> Write requirements in terms of business need and user capability,
        not implementation. The correct version of the above requirement: "Users shall be able to
        narrow the product catalog by category to find relevant items efficiently." This tells
        design and engineering what outcome to achieve — and gives them the latitude to figure
        out the best way to achieve it.
      </p>
      <p>
        A good test: if your requirement contains words like "button," "dropdown," "screen,"
        "modal," or any specific technology name, it's probably a solution, not a requirement.
      </p>

      <h2>Mistake 2: Skipping Stakeholder Analysis</h2>
      <p>
        <strong>What it looks like:</strong> The BRD is written by the PM and reviewed by the
        project sponsor. The document gets approved. Development begins. Three weeks in, the
        compliance team flags that the feature needs audit logging. Customer support points out
        that they need an admin view that wasn't in scope. The legal team discovers a data
        retention requirement that affects the database architecture.
      </p>
      <p>
        <strong>The consequence:</strong> Stakeholders who weren't involved during requirements
        gathering surface requirements during development or, worse, at launch. Each late
        discovery is expensive. Some cause significant rework. Some delay the launch. A few
        will require architectural changes that nobody budgeted for.
      </p>
      <p>
        <strong>The fix:</strong> Before writing a single requirement, create a stakeholder
        register. List every group that will be affected by the project — not just those who
        will use the product, but those who will support it, approve it, audit it, or integrate
        with it. For each group, identify a representative, document their primary concerns,
        and schedule time to gather their requirements before the first BRD draft. Then circulate
        the draft to all stakeholders before sign-off, not just the sponsor.
      </p>

      <h2>Mistake 3: Vague Success Criteria</h2>
      <p>
        <strong>What it looks like:</strong> "The project will improve the user experience and
        increase customer satisfaction." This is the most common type of success criterion in
        BRDs — and it's nearly useless. You can't measure it. You can't test it. And when the
        project ends, you can't tell whether you achieved it.
      </p>
      <p>
        <strong>The consequence:</strong> When success criteria are vague, everyone gets to
        define success in their own terms. The PM declares victory because the feature shipped.
        Engineering is satisfied because the code is clean. Business stakeholders are
        disappointed because the KPIs didn't move. The post-project review is full of
        conflicting perspectives on whether the project succeeded, and nobody learns anything
        actionable for next time.
      </p>
      <p>
        <strong>The fix:</strong> Write SMART success criteria: Specific, Measurable, Achievable,
        Relevant, and Time-bound. "Reduce checkout abandonment rate from 68% to 55% within 90
        days of launch." "Achieve an NPS score of 40+ on the new onboarding flow within 60 days."
        "Process 10,000 concurrent transactions with response times under 200ms." These criteria
        are testable, unambiguous, and give the project a clear definition of done.
      </p>

      <h2>Mistake 4: Ignoring Non-Functional Requirements</h2>
      <p>
        <strong>What it looks like:</strong> The BRD exhaustively documents what the system
        will do but says nothing about how well it will do it. No performance targets. No
        security requirements. No scalability expectations. No accessibility standards.
      </p>
      <p>
        <strong>The consequence:</strong> Non-functional gaps show up in production, not in
        development. The system works fine for 50 concurrent users in testing and falls over
        at 5,000 in production. The security audit conducted three weeks before launch uncovers
        a fundamental architectural issue. The accessibility review reveals that half the
        application fails WCAG 2.1 AA, which is now a legal requirement in several markets.
        Each of these is a major, expensive problem that was entirely preventable at the
        requirements stage.
      </p>
      <p>
        <strong>The fix:</strong> Non-functional requirements deserve their own section in
        every BRD. At minimum, address: performance (response times, throughput, load targets),
        security (authentication, authorization, data encryption, compliance standards),
        scalability (user growth expectations, data volume projections), availability (uptime
        requirements, disaster recovery), and accessibility (WCAG level, assistive technology
        support). These aren't engineering concerns — they're business decisions. Engineering
        implements them, but the business must define them.
      </p>

      <h2>Mistake 5: No Out-of-Scope Section</h2>
      <p>
        <strong>What it looks like:</strong> The BRD documents everything the project will
        deliver. It says nothing about what the project won't deliver.
      </p>
      <p>
        <strong>The consequence:</strong> Scope creep begins immediately. Because the boundary
        between "in scope" and "out of scope" is never explicitly drawn, any reasonable-sounding
        request can be justified as necessary to fulfill the stated requirements. "The BRD says
        users can manage their accounts — doesn't that include account deletion?" "We documented
        reporting features — didn't that include the executive dashboard?" Without explicit
        out-of-scope declarations, these arguments are almost impossible to refute.
      </p>
      <p>
        <strong>The fix:</strong> Add an "Out of Scope" section immediately after your
        in-scope requirements. For Phase 1 projects, document Phase 2 features here. Document
        integrations that were considered and deferred. Document use cases that are related but
        explicitly excluded. For each item, note the rationale. This section is often as
        valuable as the requirements themselves — possibly more so.
      </p>

      <h2>Mistake 6: Single-Author BRD</h2>
      <p>
        <strong>What it looks like:</strong> One person — usually the project sponsor, the lead
        BA, or the PM — writes the entire BRD. Others review it, but the document reflects one
        person's understanding of the business need.
      </p>
      <p>
        <strong>The consequence:</strong> A single author's blind spots become the document's
        blind spots. Requirements from departments the author doesn't work closely with get
        underspecified. Use cases the author doesn't encounter personally get missed. Assumptions
        the author makes unconsciously never get examined. The result is a BRD that looks
        comprehensive but has systematic gaps that correspond to the author's vantage point.
      </p>
      <p>
        <strong>The fix:</strong> Structure BRD creation as a collaborative process. Use one
        author to coordinate and write — but solicit requirements directly from representatives
        of each affected stakeholder group through structured interviews or workshops. Have
        section owners from different departments review the sections that affect them. Run a
        final review session with all stakeholder representatives before sign-off. The goal
        isn't to write by committee (which produces incoherent documents) — it's to ensure
        that one coherent document incorporates many perspectives.
      </p>

      <h2>Mistake 7: Treating the BRD as a One-Time Document</h2>
      <p>
        <strong>What it looks like:</strong> The BRD is written, approved, filed, and never
        updated again. The project evolves. Decisions are made. Requirements change. But the
        BRD still reflects the state of understanding from three months ago. By the time
        the project ships, the BRD bears only a passing resemblance to what was actually built.
      </p>
      <p>
        <strong>The consequence:</strong> The BRD loses its utility as a reference document.
        When questions arise during development, nobody consults the BRD because everyone
        knows it's out of date. When the project ends, there's no accurate record of what
        was decided and why. When the next project starts, institutional knowledge from this
        project is lost — and the team starts from scratch.
      </p>
      <p>
        <strong>The fix:</strong> Treat the BRD as a living document. Maintain a version
        history and changelog. When decisions are made that affect the requirements, update
        the BRD. Assign an owner who is responsible for keeping it current. Don't overwrite
        changed requirements — mark the change, note the date and reason, and preserve the
        previous version in the history. A BRD that evolves with the project is infinitely
        more valuable than one that accurately reflects a decision made at kickoff and nothing
        since.
      </p>

      <h2>BRD Review Checklist</h2>
      <p>
        Before approving any BRD, run through these ten questions. If the answer to any of
        them is "no" or "I'm not sure," the document needs more work before sign-off.
      </p>

      <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
        <h3 className="text-lg font-bold text-amber-900 mb-4">10 Questions to Ask Before Approving a BRD</h3>
        <ol className="space-y-3">
          {[
            'Does every requirement describe a business need or user capability — not a specific implementation or technology?',
            'Have all affected stakeholder groups (business, legal, compliance, support, engineering, design) reviewed and contributed to the document?',
            'Are the success criteria specific and measurable? Could a reasonable person determine after the project ends whether each criterion was met?',
            'Does the document include non-functional requirements covering performance, security, scalability, and accessibility?',
            'Is there an explicit out-of-scope section that documents what this project will NOT deliver?',
            'Has the document been reviewed by more than one person, and are the reviewers representative of different stakeholder perspectives?',
            'Does the document have a version number and a changelog tracking what has changed since the first draft?',
            'Is there a designated document owner who will be responsible for keeping the BRD updated during the project?',
            'Have all requirements been traced to a business objective? Is it clear why each requirement exists?',
            'Has the BRD been formally approved by all relevant stakeholders, with signatures or timestamped digital approvals?',
          ].map((question, i) => (
            <li key={i} className="flex gap-3 text-sm text-amber-800">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center font-bold text-amber-900 text-xs">
                {i + 1}
              </span>
              <span>{question}</span>
            </li>
          ))}
        </ol>
      </div>

      <h2>The Cost of Getting It Right Now vs. Getting It Wrong Later</h2>
      <p>
        Every hour spent avoiding these seven mistakes during requirements is an investment
        that returns ten to one hundred times during development, testing, and deployment.
        The conversation that feels tedious at the BRD review meeting — "should we add an
        out-of-scope section?" — prevents the emergency sprint three months later when
        someone realizes the scope has doubled without the timeline changing.
      </p>
      <p>
        Good BRDs don't happen by accident. They happen when teams follow a deliberate
        process: collaborative stakeholder input, solution-agnostic requirement writing,
        measurable success criteria, explicit scope boundaries, and a commitment to treating
        the document as a living artifact rather than a one-time deliverable.
      </p>
      <p>
        Get those seven things right, and your BRD becomes the single source of truth that
        keeps your project aligned from kickoff to launch.
      </p>
    </BlogPostLayout>
  );
}
