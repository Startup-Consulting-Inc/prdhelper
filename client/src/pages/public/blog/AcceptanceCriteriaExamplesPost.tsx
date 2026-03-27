/**
 * Blog Post: 10 Acceptance Criteria Examples (With Templates) for Product Teams
 */

import { BlogPostLayout } from '../../../components/blog/BlogPostLayout';

export default function AcceptanceCriteriaExamplesPost() {
  return (
    <BlogPostLayout
      title="10 Acceptance Criteria Examples (With Templates) for Product Teams"
      author="Michael Rodriguez"
      date="2026-03-05"
      readTime="10 min read"
      category="Best Practices"
      excerpt="Acceptance criteria make or break software delivery. Here are 10 real-world examples with templates, covering different feature types and acceptance criteria formats."
      slug="acceptance-criteria-examples"
      coverImage="✓"
      coverGradient="from-green-600 via-emerald-600 to-teal-600"
    >
      <h2>What Are Acceptance Criteria?</h2>
      <p>
        Acceptance criteria are the specific conditions that a software feature must satisfy to be considered
        complete and acceptable by the product owner or customer. They're written alongside user stories, and they
        transform a vague description of a feature into a concrete, testable definition of "done."
      </p>
      <p>
        Without acceptance criteria, "done" means something different to every person on the team. To the developer,
        done might mean the code works on their machine. To QA, done means it passed all test cases. To the product
        manager, done means it behaves exactly as envisioned. Acceptance criteria align all three before development
        even starts.
      </p>

      <h2>Why Acceptance Criteria Matter</h2>

      <h3>Shared Understanding Before Development Starts</h3>
      <p>
        The best time to discover a misunderstanding is before a developer spends three days building in the wrong
        direction. Acceptance criteria force the conversation about edge cases, error states, and exact behavior
        to happen at the planning stage, not during code review.
      </p>

      <h3>Testability by Design</h3>
      <p>
        Every acceptance criterion should be directly testable. If you can't write a test for it — automated or
        manual — it's probably not specific enough. Good acceptance criteria make QA's job significantly easier
        because the test cases are already implied by the criteria themselves.
      </p>

      <h3>A Clear Definition of Done</h3>
      <p>
        Acceptance criteria prevent scope creep in both directions. They stop developers from under-delivering
        ("I thought that was out of scope") and over-delivering ("I added a few extra features while I was in
        there"). When all criteria pass, the story is done — full stop.
      </p>

      <h2>Two Formats for Writing Acceptance Criteria</h2>
      <p>
        There are two widely used formats for acceptance criteria. Both are valid, and many teams use them
        interchangeably depending on the complexity of the feature.
      </p>

      <h3>Format 1: Given/When/Then (Gherkin Style)</h3>
      <p>
        This format, popularized by Behavior-Driven Development (BDD), describes behavior in terms of a starting
        state, a triggering action, and an expected outcome. It's particularly useful for complex user interactions
        and flows that need to be automated.
      </p>
      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 my-6">
        <p className="text-emerald-900 dark:text-emerald-100 font-mono text-sm">
          <strong>Given</strong> [some context or precondition]<br />
          <strong>When</strong> [some action is taken]<br />
          <strong>Then</strong> [some expected result occurs]
        </p>
      </div>

      <h3>Format 2: Checklist Style</h3>
      <p>
        A simpler bulleted list of conditions that must all be true for the feature to be accepted. This works
        well for features with many independent requirements that don't follow a linear flow. It's easier to
        read at a glance and works well in tools like Jira or Linear.
      </p>

      <h2>10 Real-World Acceptance Criteria Examples</h2>
      <p>
        Below are 10 examples covering a range of common feature types. Each example includes both the
        Given/When/Then format and the checklist format, so you can choose what works best for your team.
      </p>

      <h3>1. User Login</h3>
      <p>
        <em>User Story: As a registered user, I want to log in with my email and password so that I can access
        my account.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Given/When/Then</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-mono">
          Given a registered user with a valid email and password<br />
          When they submit the login form with correct credentials<br />
          Then they are redirected to their dashboard within 2 seconds<br /><br />
          Given a registered user<br />
          When they submit with an incorrect password<br />
          Then an error message "Invalid email or password" is shown and the account is locked after 5 failed attempts
        </p>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 mt-5">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Login succeeds with valid email and password</li>
          <li>Login fails with incorrect password; error message shown</li>
          <li>Account locks after 5 consecutive failed login attempts</li>
          <li>"Forgot password" link is visible and functional</li>
          <li>Login form is accessible via keyboard navigation</li>
          <li>Session persists for 30 days if "Remember me" is checked</li>
        </ul>
      </div>

      <h3>2. Search Feature</h3>
      <p>
        <em>User Story: As a user, I want to search for products by keyword so that I can find items quickly
        without browsing all categories.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Given/When/Then</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-mono">
          Given a user on any page of the application<br />
          When they type a keyword in the search bar and press Enter<br />
          Then results matching the keyword appear within 500ms, sorted by relevance<br /><br />
          Given a user who searches for a term with no matching results<br />
          When the results page loads<br />
          Then a "No results found" message is shown with suggested alternative searches
        </p>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 mt-5">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Search results appear in under 500ms for typical queries</li>
          <li>Results are sorted by relevance by default</li>
          <li>Search is case-insensitive</li>
          <li>Partial matches are included in results</li>
          <li>Empty search query shows all products or is disabled</li>
          <li>Zero-result state shows helpful messaging and alternatives</li>
          <li>Search history is retained for the session</li>
        </ul>
      </div>

      <h3>3. Payment Processing</h3>
      <p>
        <em>User Story: As a customer, I want to pay for my order with a credit card so that I can complete my
        purchase securely.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Given/When/Then</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-mono">
          Given a customer at checkout with items in their cart<br />
          When they enter valid card details and click "Pay Now"<br />
          Then a payment is processed, an order confirmation is shown, and a confirmation email is sent within 1 minute<br /><br />
          Given a customer whose card is declined<br />
          When payment fails<br />
          Then an error message specifies the reason (insufficient funds, expired card) and the cart is preserved
        </p>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 mt-5">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Accepts Visa, Mastercard, Amex, and Discover</li>
          <li>Card number input validates format in real time</li>
          <li>CVV field is masked</li>
          <li>Successful payment shows order confirmation number</li>
          <li>Confirmation email sent within 60 seconds of successful payment</li>
          <li>Declined card shows specific error; cart is not cleared</li>
          <li>Payment form is PCI DSS compliant (handled via Stripe or equivalent)</li>
          <li>Double-submission is prevented (button disabled after first click)</li>
        </ul>
      </div>

      <h3>4. Email Notifications</h3>
      <p>
        <em>User Story: As a user, I want to receive email notifications for account activity so that I stay
        informed about important events.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Email sent within 2 minutes of triggering event</li>
          <li>Email renders correctly on Gmail, Outlook, and Apple Mail</li>
          <li>Email renders correctly on mobile devices</li>
          <li>Unsubscribe link is present and functional in all emails</li>
          <li>Notification preferences can be managed in account settings</li>
          <li>Transactional emails (password reset, order confirmation) cannot be unsubscribed from</li>
          <li>Emails do not contain sensitive data such as passwords or full credit card numbers</li>
        </ul>
      </div>

      <h3>5. File Upload</h3>
      <p>
        <em>User Story: As a user, I want to upload documents to my account so that I can store and share files
        with my team.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Given/When/Then</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-mono">
          Given a user on the documents page<br />
          When they select a valid file (PDF, DOCX, PNG under 25MB) and click Upload<br />
          Then the file uploads with a progress bar visible, and appears in their document list upon completion<br /><br />
          Given a user who attempts to upload a file over 25MB<br />
          When they select the file<br />
          Then an error message appears before upload begins explaining the size limit
        </p>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 mt-5">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Accepts PDF, DOCX, XLSX, PNG, JPG, and ZIP files</li>
          <li>Maximum file size is 25MB; larger files show an error before upload</li>
          <li>Upload progress is shown with a progress bar</li>
          <li>Failed uploads show a retry option</li>
          <li>Duplicate file names are handled gracefully (append number or prompt user)</li>
          <li>Uploaded file is accessible immediately after upload completes</li>
          <li>Files are virus-scanned before being made available</li>
        </ul>
      </div>

      <h3>6. Data Export</h3>
      <p>
        <em>User Story: As an admin, I want to export user data as a CSV so that I can analyze it in
        spreadsheet tools.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Export produces a valid UTF-8 encoded CSV file</li>
          <li>All visible table columns are included in the export</li>
          <li>Date format in export is ISO 8601 (YYYY-MM-DD)</li>
          <li>Export respects active filters (exporting filtered results, not all data)</li>
          <li>Large exports (&gt;10,000 rows) are processed asynchronously and emailed when ready</li>
          <li>Download starts automatically or a download link is clearly visible</li>
          <li>Export is only available to users with Admin or Manager roles</li>
        </ul>
      </div>

      <h3>7. User Profile Editing</h3>
      <p>
        <em>User Story: As a user, I want to edit my profile information so that my account details stay
        current.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Given/When/Then</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-mono">
          Given a logged-in user on the profile settings page<br />
          When they update their display name and click Save<br />
          Then the new name is reflected immediately across the app without requiring a page refresh<br /><br />
          Given a user who tries to save a profile with an invalid email format<br />
          When they click Save<br />
          Then inline validation shows an error on the email field and save is prevented
        </p>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 mt-5">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>User can update: display name, email, phone number, and profile photo</li>
          <li>Email change requires re-verification via confirmation email</li>
          <li>Password change requires current password confirmation</li>
          <li>Invalid inputs show inline error messages before form submission</li>
          <li>Successful save shows a confirmation toast notification</li>
          <li>Unsaved changes prompt a confirmation dialog if user navigates away</li>
          <li>Profile photo accepts JPG and PNG, max 5MB, and is cropped to square</li>
        </ul>
      </div>

      <h3>8. Permission System</h3>
      <p>
        <em>User Story: As an admin, I want to assign roles to team members so that I can control access to
        sensitive features.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Three roles exist: Admin, Manager, and Viewer</li>
          <li>Admins can assign and remove roles for any other user</li>
          <li>Managers cannot change Admin roles</li>
          <li>Viewers have read-only access to all non-admin pages</li>
          <li>Role changes take effect immediately without requiring the affected user to log out</li>
          <li>All role change actions are logged in the audit trail with timestamp and acting admin</li>
          <li>The system must have at least one Admin at all times; the last Admin cannot be demoted</li>
        </ul>
      </div>

      <h3>9. API Rate Limiting</h3>
      <p>
        <em>User Story: As a platform, I need to enforce API rate limits so that no single client can
        degrade performance for others.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Given/When/Then</p>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-mono">
          Given an API client that has made 1,000 requests in the past 60 seconds<br />
          When they make an additional request<br />
          Then the API returns HTTP 429 with a Retry-After header indicating when the limit resets<br /><br />
          Given an API client within their rate limit<br />
          When they make a valid API request<br />
          Then X-RateLimit-Remaining and X-RateLimit-Reset headers are included in all responses
        </p>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 mt-5">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>Default limit is 1,000 requests per minute per API key</li>
          <li>Rate limit is enforced per API key, not per IP address</li>
          <li>Exceeded limit returns HTTP 429 with a Retry-After header</li>
          <li>All responses include X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers</li>
          <li>Enterprise tier has a configurable rate limit up to 10,000 requests per minute</li>
          <li>Rate limit counters reset on a sliding 60-second window</li>
        </ul>
      </div>

      <h3>10. Mobile Responsiveness</h3>
      <p>
        <em>User Story: As a mobile user, I want the application to work well on my phone so that I can use it
        without a desktop computer.</em>
      </p>
      <div className="not-prose bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Checklist</p>
        <ul className="text-gray-800 dark:text-gray-200 text-sm space-y-1 list-disc list-inside">
          <li>All pages render correctly on viewports from 375px (iPhone SE) to 1440px (desktop)</li>
          <li>No horizontal scrolling occurs on any page at mobile viewport widths</li>
          <li>Touch targets (buttons, links) are at least 44x44px</li>
          <li>Text is legible without zooming (minimum 16px base font size)</li>
          <li>Navigation collapses to a hamburger menu on mobile</li>
          <li>All forms are usable with a mobile keyboard (correct input types, no layout shifts)</li>
          <li>Core Web Vitals pass on mobile: LCP &lt;2.5s, CLS &lt;0.1, FID &lt;100ms</li>
          <li>Tested and functional on iOS Safari and Android Chrome</li>
        </ul>
      </div>

      <h2>Tips for Writing Great Acceptance Criteria</h2>

      <h3>Write Them Before Development Starts</h3>
      <p>
        Acceptance criteria written after development are just test cases written in a nicer format. Their real
        value is in forcing conversations before a single line of code is written. Write them during backlog
        refinement, not during QA.
      </p>

      <h3>Include the Unhappy Path</h3>
      <p>
        Every feature has a happy path (user does the right thing) and unhappy paths (user enters bad data, network
        fails, permissions are wrong). Make sure your acceptance criteria cover both. Most bugs live in the unhappy
        paths that nobody wrote criteria for.
      </p>

      <h3>Be Specific About Numbers</h3>
      <p>
        "The page should load quickly" is not an acceptance criterion. "The page should load in under 2 seconds on
        a 4G connection" is. Wherever you use relative terms like "fast," "large," or "soon," replace them with
        specific, measurable values.
      </p>

      <h3>One Condition Per Criterion</h3>
      <p>
        Avoid acceptance criteria with "and" that bundle multiple conditions. "The user can log in and the session
        lasts 30 days and the login is logged in the audit trail" is three criteria, not one. Keep each criterion
        to a single testable condition.
      </p>

      <h3>Get Developer and QA Sign-Off</h3>
      <p>
        Before a story is pulled into a sprint, the developer who will build it and the QA engineer who will test
        it should both read and agree to the acceptance criteria. If either party has questions, that's a sign the
        criteria need more work — not that the story should move forward anyway.
      </p>
    </BlogPostLayout>
  );
}
