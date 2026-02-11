#!/bin/bash
# Create all 20 improvement issues on GitHub
# Usage: cd to repo root, then run: bash docs/improvement-issues/create-all-issues.sh
# Requires: gh CLI authenticated (gh auth login)

set -e
REPO="Startup-Consulting-Inc/prdhelper"

echo "Creating 20 improvement issues for Clearly..."
echo ""

# ============================================================
# CREATE LABELS (skip errors if they already exist)
# ============================================================
echo "Setting up labels..."
gh label create "critical"    --repo "$REPO" --color "B60205" --description "Critical priority" 2>/dev/null || true
gh label create "performance" --repo "$REPO" --color "E4E669" --description "Performance improvement" 2>/dev/null || true
gh label create "backend"     --repo "$REPO" --color "0E8A16" --description "Server-side change" 2>/dev/null || true
gh label create "frontend"    --repo "$REPO" --color "1D76DB" --description "Client-side change" 2>/dev/null || true
gh label create "ux"          --repo "$REPO" --color "C5DEF5" --description "User experience" 2>/dev/null || true
gh label create "security"    --repo "$REPO" --color "D93F0B" --description "Security related" 2>/dev/null || true
gh label create "tech-debt"   --repo "$REPO" --color "FBCA04" --description "Technical debt" 2>/dev/null || true
gh label create "testing"     --repo "$REPO" --color "BFD4F2" --description "Testing related" 2>/dev/null || true
gh label create "dx"          --repo "$REPO" --color "D4C5F9" --description "Developer experience" 2>/dev/null || true
echo "Labels ready."
echo ""

# ============================================================
# CRITICAL PRIORITY
# ============================================================

gh issue create --repo "$REPO" \
  --title "[Critical] Fix 'scan all projects' anti-pattern in document lookups" \
  --label "bug,performance,critical" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

`getById`, `regenerateDocument`, `exportDocument`, and `getVersionHistory` all scan **every project** in Firestore to find a single document. This is O(N) and will timeout as the project count grows.

**Affected files:**
- `server/src/routers/documents.ts` — 6 occurrences (lines ~159, ~302, ~407, ~509, ~586, ~671)
- `server/src/routers/ai.ts` — 2 occurrences (`regenerateDocument` line ~622, tool output generation)

**Current code:**
```typescript
const projectsSnapshot = await ctx.db.collection('projects').get();
for (const projectDoc of projectsSnapshot.docs) {
  const docSnapshot = await projectDoc.ref
    .collection('documents').doc(input.id).get();
  if (docSnapshot.exists) { break; }
}
```

## Suggested Fix

Add `projectId` to the `getDocumentByIdSchema` validation and use direct lookup:

```typescript
// In server/src/lib/validations/document.ts
export const getDocumentByIdSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
});

// In router:
const docRef = ctx.db.collection('projects').doc(input.projectId)
  .collection('documents').doc(input.id);
const docSnapshot = await docRef.get();
```

Update client-side hooks to pass `projectId` where available.

## Impact
- Current: 1 read per project per request (15 projects = 15 reads, 1000 projects = 1000 reads)
- After fix: 1 read per request regardless of project count
ISSUE_EOF
)"

echo "✅ Issue 1 created: Scan all projects anti-pattern"

gh issue create --repo "$REPO" \
  --title "[Critical] Fix O(N²) shared projects query in getAll" \
  --label "bug,performance,critical" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

`projects.getAll()` scans every project in Firestore and checks each one's `collaborators` subcollection for the current user. With 1000 projects, this is 1001+ Firestore reads per dashboard load.

**File:** `server/src/routers/projects.ts` (lines ~110-129)

**Current code:**
```typescript
const allProjectsSnapshot = await ctx.db.collection('projects').get();
for (const projectDoc of allProjectsSnapshot.docs) {
  const collaboratorSnapshot = await projectDoc.ref
    .collection('collaborators')
    .where('userId', '==', ctx.user.id)
    .get();
}
```

## Suggested Fix

Use Firestore `collectionGroup` query to find all collaborator records for the current user in one query:

```typescript
const sharedCollabs = await ctx.db
  .collectionGroup('collaborators')
  .where('userId', '==', ctx.user.id)
  .get();

const sharedProjectRefs = sharedCollabs.docs
  .map(d => d.ref.parent.parent)
  .filter(Boolean);

const sharedProjects = await Promise.all(
  sharedProjectRefs.map(ref => ref!.get())
);
```

**Note:** Requires a Firestore composite index on the `collaborators` collection group for the `userId` field.

## Impact
- Current: N+1 reads (N = total projects in system)
- After fix: 2 queries total regardless of project count
ISSUE_EOF
)"

echo "✅ Issue 2 created: O(N²) shared projects query"

# ============================================================
# HIGH PRIORITY
# ============================================================

gh issue create --repo "$REPO" \
  --title "[High] AI retry should respect Retry-After header" \
  --label "enhancement,backend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

The AI service retry logic uses fixed exponential backoff but ignores the `Retry-After` header from OpenRouter, risking cascading 429 rate limit errors.

**File:** `server/src/lib/services/ai.ts` (lines ~143-148)

## Suggested Fix

```typescript
// After catching a retryable error, check response headers:
const retryAfter = response?.headers?.get('Retry-After');
const delay = retryAfter
  ? parseInt(retryAfter) * 1000
  : Math.pow(2, attempt) * 1000;
await new Promise((resolve) => setTimeout(resolve, delay));
```

## Impact
Prevents rate limit snowballing during high-traffic periods.
ISSUE_EOF
)"

echo "✅ Issue 3 created: Retry-After header"

gh issue create --repo "$REPO" \
  --title "[High] Truncated document fallback serves incomplete content silently" \
  --label "bug,backend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

When AI output is truncated (finish_reason='length') and markers aren't found, the code falls back to raw content which may be incomplete. Users receive a broken document without clear indication.

**File:** `server/src/lib/services/documentGenerator.ts` (lines ~105-116, ~170-188, ~241-259)

**Current:**
```typescript
if (!content) {
  console.warn('BRD markers not found. Using full content as fallback.');
  content = rawContent.trim(); // Could be mid-sentence
}
```

## Suggested Fix

When truncation occurs AND markers are missing, explicitly flag it:

```typescript
if (!content) {
  content = rawContent.trim();
  if (response.truncated) {
    // Append visible warning to the document itself
    content += '\n\n---\n\n⚠️ **This document was truncated due to length limits. Please regenerate for a complete version.**';
  }
}
```

Also ensure the `truncated` and `warning` fields are always set so the client can display an alert banner.
ISSUE_EOF
)"

echo "✅ Issue 4 created: Truncated document fallback"

gh issue create --repo "$REPO" \
  --title "[High] Add rate limiting on AI generation endpoints" \
  --label "enhancement,security,backend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

`askQuestion`, `generateDocument`, and `regenerateDocument` have no per-user rate limits. A single user could trigger hundreds of expensive AI calls, running up costs.

**File:** `server/src/routers/ai.ts`

## Suggested Fix

Add per-user rate limiting via tRPC middleware or express-rate-limit:

```typescript
// Example tRPC middleware:
const rateLimitedProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const key = `ai:${ctx.user.id}`;
  const count = await rateLimitStore.increment(key, 60); // 60s window
  if (count > 30) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many AI requests. Please wait a moment.',
    });
  }
  return next();
});
```

**Suggested limits:**
- `askQuestion`: 60/hour per user
- `generateDocument`: 10/hour per user
- `regenerateDocument`: 10/hour per user
ISSUE_EOF
)"

echo "✅ Issue 5 created: Rate limiting on AI endpoints"

gh issue create --repo "$REPO" \
  --title "[High] Add input validation for wizard answers" \
  --label "enhancement,frontend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Wizard pages (BRD/PRD) accept any input including single-character answers. Short, unhelpful answers waste AI tokens and produce poor documents.

**Files:**
- `client/src/pages/PRDWizardPage.tsx`
- `client/src/pages/BRDWizardPage.tsx`

## Suggested Fix

Add minimum length validation before submission:

```typescript
const answerText = currentAnswer.trim();
if (answerText.length < 10) {
  setError('Please provide a more detailed answer (at least 10 characters)');
  return;
}
if (answerText.length > 5000) {
  setError('Answer is too long. Please keep it under 5000 characters.');
  return;
}
```

Also consider showing a character count indicator near the input.
ISSUE_EOF
)"

echo "✅ Issue 6 created: Wizard input validation"

gh issue create --repo "$REPO" \
  --title "[High] Add unsaved changes guard to wizard pages" \
  --label "enhancement,frontend,ux" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Users can accidentally navigate away from BRD/PRD wizard pages and lose all conversation progress. There is no "unsaved changes" warning.

**Files:**
- `client/src/pages/PRDWizardPage.tsx`
- `client/src/pages/BRDWizardPage.tsx`

## Suggested Fix

Add a `beforeunload` event listener and React Router navigation blocker:

```typescript
useEffect(() => {
  const handler = (e: BeforeUnloadEvent) => {
    if (messages.length > 0) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', handler);
  return () => window.removeEventListener('beforeunload', handler);
}, [messages]);
```

For React Router navigation, use `useBlocker` or `usePrompt` to show a confirmation dialog.
ISSUE_EOF
)"

echo "✅ Issue 7 created: Unsaved changes guard"

# ============================================================
# MEDIUM PRIORITY — UX Features
# ============================================================

gh issue create --repo "$REPO" \
  --title "[Medium] Add progress indicator for document generation" \
  --label "enhancement,frontend,ux" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Document generation takes 1-3 minutes but only shows a static "Generating Your PRD..." message. Users have no sense of progress and may think it's stuck.

## Suggested Fix

Add a step-based progress indicator:

1. "Analyzing requirements..." (0-10s)
2. "Building document structure..." (10-30s)
3. "Generating content..." (30s+)
4. "Finalizing document..." (near completion)

Implementation could use timed steps on the client side, or add server-sent events / polling for real progress.

```typescript
const [generationStep, setGenerationStep] = useState(0);
const steps = [
  'Analyzing requirements...',
  'Building document structure...',
  'Generating content...',
  'Finalizing document...',
];

useEffect(() => {
  if (!isGenerating) return;
  const timers = [
    setTimeout(() => setGenerationStep(1), 5000),
    setTimeout(() => setGenerationStep(2), 15000),
    setTimeout(() => setGenerationStep(3), 60000),
  ];
  return () => timers.forEach(clearTimeout);
}, [isGenerating]);
```
ISSUE_EOF
)"

echo "✅ Issue 8 created: Generation progress indicator"

gh issue create --repo "$REPO" \
  --title "[Medium] Allow editing project description from dashboard" \
  --label "enhancement,frontend,ux" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

The Edit menu on the project card only allows renaming the project title. Users should also be able to edit the project description.

## Suggested Fix

Expand the rename modal to include a description textarea field. The server's \`projects.update\` endpoint already accepts \`description\` as an optional field.

```typescript
// In DashboardPage.tsx handleEditProject:
setEditingProject({ id, title: currentTitle, description: currentDescription });

// Modal includes both title input and description textarea
```
ISSUE_EOF
)"

echo "✅ Issue 9 created: Edit project description"

gh issue create --repo "$REPO" \
  --title "[Medium] Add Duplicate Project feature" \
  --label "enhancement,frontend,backend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Users creating similar products need to start from scratch each time. There's no way to duplicate an existing project with its settings and conversation history.

## Suggested Fix

1. Add a "Duplicate" option to the project card kebab menu
2. Create a server endpoint \`projects.duplicate\` that:
   - Copies project metadata (title + " (Copy)", description, mode, language)
   - Copies conversation history from subcollections
   - Resets phase to initial state
   - Does NOT copy generated documents (user should regenerate)

## Acceptance Criteria
- [ ] Duplicate menu option in project card
- [ ] Server endpoint copies project + conversations
- [ ] New project starts at BRD phase with copied conversations
- [ ] User is redirected to the new project
ISSUE_EOF
)"

echo "✅ Issue 10 created: Duplicate project"

gh issue create --repo "$REPO" \
  --title "[Medium] Add document version diff/comparison view" \
  --label "enhancement,frontend,ux" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

When regenerating a document, users can't compare the old version vs new version. The version history panel exists but lacks a side-by-side diff view.

## Suggested Fix

Add a "Compare" button in the version history modal that shows a side-by-side or inline diff:

1. Use a lightweight diff library (e.g., \`diff\` npm package)
2. Render additions in green, deletions in red
3. Allow comparing any two versions, not just current vs previous

## Acceptance Criteria
- [ ] "Compare" button on each version history entry
- [ ] Side-by-side diff view in a modal
- [ ] Additions highlighted in green, deletions in red
- [ ] Can compare any two versions
ISSUE_EOF
)"

echo "✅ Issue 11 created: Document version diff"

gh issue create --repo "$REPO" \
  --title "[Medium] Add Export All Documents as ZIP" \
  --label "enhancement,frontend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Users can export individual documents (Markdown/PDF) but cannot download all project documents as a single bundle.

## Suggested Fix

Add an "Export All" button on the project detail page that generates a ZIP containing:
- BRD (markdown + PDF)
- PRD (markdown + PDF)
- Tasks list
- Vibe Coding Prompt (if applicable)

Use a client-side ZIP library like \`jszip\` to bundle the files:

```typescript
import JSZip from 'jszip';

const zip = new JSZip();
zip.file('BRD.md', brdContent);
zip.file('PRD.md', prdContent);
zip.file('Tasks.md', tasksContent);
const blob = await zip.generateAsync({ type: 'blob' });
saveAs(blob, `${projectTitle}_documents.zip`);
```
ISSUE_EOF
)"

echo "✅ Issue 12 created: Export all as ZIP"

gh issue create --repo "$REPO" \
  --title "[Medium] Add project templates" \
  --label "enhancement,frontend,backend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Users starting similar projects (e.g., multiple mobile apps, multiple e-commerce sites) have to go through the same wizard questions each time.

## Suggested Fix

1. Allow users to save a completed project as a template
2. When creating a new project, offer template selection
3. Templates pre-fill conversation history and project settings

**Server:**
- New \`templates\` collection in Firestore
- \`templates.create\` endpoint (from existing project)
- \`templates.list\` endpoint
- Modify \`projects.create\` to accept optional \`templateId\`

**Client:**
- "Save as Template" button on completed projects
- Template selection step in project creation flow
ISSUE_EOF
)"

echo "✅ Issue 13 created: Project templates"

gh issue create --repo "$REPO" \
  --title "[Medium] Add collaboration notifications" \
  --label "enhancement,frontend,backend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

When a collaborator modifies a document (edit, approve, regenerate), the project owner receives no notification. Changes can go unnoticed.

## Suggested Fix

1. Add a \`notifications\` subcollection per user in Firestore
2. Create notifications on key events:
   - Document approved/regenerated/edited by collaborator
   - New collaborator joined
   - Document generation completed
3. Add notification bell icon in the header with unread count
4. Notification dropdown showing recent activity

## Acceptance Criteria
- [ ] Notifications created on document changes by collaborators
- [ ] Bell icon with unread count in header
- [ ] Notification dropdown with mark-as-read
- [ ] Clicking notification navigates to relevant document/project
ISSUE_EOF
)"

echo "✅ Issue 14 created: Collaboration notifications"

# ============================================================
# MEDIUM PRIORITY — Code Quality
# ============================================================

gh issue create --repo "$REPO" \
  --title "[Medium] Share types between client and server" \
  --label "enhancement,tech-debt" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Types are duplicated between client and server. The client defines its own \`Project\`, \`Message\`, and \`Document\` interfaces that may drift from the server's Firestore schema. Several places use \`as any\` casts.

**Examples:**
- \`client/src/hooks/useProjects.ts\` — \`Project\` interface
- \`client/src/hooks/useAI.ts\` — \`Message\` interface
- \`client/src/pages/DocumentViewPage.tsx\` — \`(doc as any).truncated\`

## Suggested Fix

Create a shared types package:

```
shared/
  types.ts      # Project, Document, Message, etc.
  constants.ts  # Document types, phases, statuses
```

Both client and server import from \`@shared/types\`. tRPC already infers types for procedure inputs/outputs, but domain types should be explicitly shared.
ISSUE_EOF
)"

echo "✅ Issue 15 created: Shared types"

gh issue create --repo "$REPO" \
  --title "[Medium] Fix useDocument query firing without valid ID" \
  --label "bug,frontend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

\`useDocument()\` hook fires the query even with an empty/undefined documentId, causing unnecessary Firestore reads and potential errors.

**File:** \`client/src/hooks/useDocuments.ts\` (line ~41)

**Current:**
```typescript
const { data: document, isLoading, error } = trpc.documents.getById.useQuery({
  id: documentId,
});
```

## Fix

Add \`enabled\` guard:

```typescript
const { data: document, isLoading, error } = trpc.documents.getById.useQuery(
  { id: documentId },
  { enabled: !!documentId }
);
```
ISSUE_EOF
)"

echo "✅ Issue 16 created: useDocument enabled guard"

gh issue create --repo "$REPO" \
  --title "[Medium] Rename modal should close on backdrop click" \
  --label "enhancement,frontend,ux" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

The project rename modal on the dashboard only closes via the Cancel button or Escape key inside the input. Clicking the dark backdrop overlay should also dismiss it — this is standard modal behavior.

**File:** \`client/src/pages/DashboardPage.tsx\` (line ~209)

## Fix

Add click handler on the overlay div:

```typescript
<div
  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  onClick={(e) => {
    if (e.target === e.currentTarget) {
      setEditingProject(null);
      setEditTitle('');
    }
  }}
>
```
ISSUE_EOF
)"

echo "✅ Issue 17 created: Modal backdrop click"

# ============================================================
# LOW PRIORITY
# ============================================================

gh issue create --repo "$REPO" \
  --title "[Low] Add test coverage for critical paths" \
  --label "enhancement,testing,tech-debt" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

No test files exist for either client or server. \`vitest\` is in devDependencies but no tests are configured.

## Suggested Priority Tests

**Server (highest value):**
1. Document generation service — unit tests with mocked AI responses
2. GCS content storage/resolution — test the size threshold and reference format
3. tRPC router integration tests for CRUD operations
4. Auth middleware — token verification, role checks

**Client:**
1. Wizard page flow — mock tRPC, verify question/answer cycle
2. Document view page — test truncation warning display
3. Project card — test menu items render based on callbacks
4. Auth context — test token refresh and timeout logic

## Setup

```json
// package.json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```
ISSUE_EOF
)"

echo "✅ Issue 18 created: Test coverage"

gh issue create --repo "$REPO" \
  --title "[Low] Validate required environment variables on startup" \
  --label "enhancement,backend,dx" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Missing environment variables (e.g., \`OPENROUTER_API_KEY\`) are only caught at runtime when the first request fails. Server should fail fast on startup.

**File:** \`server/src/lib/services/ai.ts\` (line ~56) checks at request time.

## Fix

Add startup validation in \`server/src/index.ts\`:

```typescript
const requiredEnvVars = [
  'OPENROUTER_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIRESTORE_DATABASE_ID',
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(\`Missing required environment variable: \${envVar}\`);
  }
}
```
ISSUE_EOF
)"

echo "✅ Issue 19 created: Env var validation"

gh issue create --repo "$REPO" \
  --title "[Low] Fix GCS bucket name inconsistency" \
  --label "bug,backend" \
  --body "$(cat <<'ISSUE_EOF'
## Problem

Two files have different default GCS bucket names:
- \`server/src/lib/storage.ts\` → defaults to \`prd-helper-uploads\`
- \`server/src/lib/health/storage.ts\` → defaults to \`clearly-prd-attachments\`

If \`GCS_BUCKET_NAME\` env var is not set, health checks target a different bucket than actual storage operations.

## Fix

Extract the bucket name to a shared config:

```typescript
// server/src/lib/config.ts
export const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'prd-helper-uploads';
```

Import this constant in both \`storage.ts\` and \`health/storage.ts\`.
ISSUE_EOF
)"

echo "✅ Issue 20 created: Bucket name inconsistency"

echo ""
echo "============================================"
echo "✅ All 20 issues created successfully!"
echo "============================================"
