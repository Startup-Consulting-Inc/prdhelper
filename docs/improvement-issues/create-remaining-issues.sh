#!/bin/bash
# Create remaining issues 15-20 (issues 1-14 already created)
# Uses --body-file with temp files to avoid nested quoting issues
# Usage: cd to repo root, then run: bash docs/improvement-issues/create-remaining-issues.sh
# Requires: gh CLI authenticated (gh auth login)

set -e
REPO="Startup-Consulting-Inc/prdhelper"
TMPFILE=$(mktemp)
trap 'rm -f "$TMPFILE"' EXIT

echo "Creating remaining issues 15-20..."
echo ""

# ============================================================
# Issue 15: Share types between client and server
# ============================================================

cat > "$TMPFILE" <<'ISSUE_EOF'
## Problem

Types are duplicated between client and server. The client defines its own `Project`, `Message`, and `Document` interfaces that may drift from the server's Firestore schema. Several places use `as any` casts.

**Examples:**
- `client/src/hooks/useProjects.ts` — `Project` interface
- `client/src/hooks/useAI.ts` — `Message` interface
- `client/src/pages/DocumentViewPage.tsx` — `(doc as any).truncated`

## Suggested Fix

Create a shared types package:

```
shared/
  types.ts      # Project, Document, Message, etc.
  constants.ts  # Document types, phases, statuses
```

Both client and server import from `@shared/types`. tRPC already infers types for procedure inputs/outputs, but domain types should be explicitly shared.
ISSUE_EOF

gh issue create --repo "$REPO" \
  --title "[Medium] Share types between client and server" \
  --label "enhancement,tech-debt" \
  --body-file "$TMPFILE"

echo "✅ Issue 15 created: Shared types"

# ============================================================
# Issue 16: Fix useDocument query firing without valid ID
# ============================================================

cat > "$TMPFILE" <<'ISSUE_EOF'
## Problem

`useDocument()` hook fires the query even with an empty/undefined documentId, causing unnecessary Firestore reads and potential errors.

**File:** `client/src/hooks/useDocuments.ts` (line ~41)

**Current:**
```typescript
const { data: document, isLoading, error } = trpc.documents.getById.useQuery({
  id: documentId,
});
```

## Fix

Add `enabled` guard:

```typescript
const { data: document, isLoading, error } = trpc.documents.getById.useQuery(
  { id: documentId },
  { enabled: !!documentId }
);
```
ISSUE_EOF

gh issue create --repo "$REPO" \
  --title "[Medium] Fix useDocument query firing without valid ID" \
  --label "bug,frontend" \
  --body-file "$TMPFILE"

echo "✅ Issue 16 created: useDocument enabled guard"

# ============================================================
# Issue 17: Rename modal should close on backdrop click
# ============================================================

cat > "$TMPFILE" <<'ISSUE_EOF'
## Problem

The project rename modal on the dashboard only closes via the Cancel button or Escape key inside the input. Clicking the dark backdrop overlay should also dismiss it — this is standard modal behavior.

**File:** `client/src/pages/DashboardPage.tsx` (line ~209)

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

gh issue create --repo "$REPO" \
  --title "[Medium] Rename modal should close on backdrop click" \
  --label "enhancement,frontend,ux" \
  --body-file "$TMPFILE"

echo "✅ Issue 17 created: Modal backdrop click"

# ============================================================
# Issue 18: Add test coverage for critical paths
# ============================================================

cat > "$TMPFILE" <<'ISSUE_EOF'
## Problem

No test files exist for either client or server. `vitest` is in devDependencies but no tests are configured.

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

gh issue create --repo "$REPO" \
  --title "[Low] Add test coverage for critical paths" \
  --label "enhancement,testing,tech-debt" \
  --body-file "$TMPFILE"

echo "✅ Issue 18 created: Test coverage"

# ============================================================
# Issue 19: Validate required environment variables on startup
# ============================================================

cat > "$TMPFILE" <<'ISSUE_EOF'
## Problem

Missing environment variables (e.g., `OPENROUTER_API_KEY`) are only caught at runtime when the first request fails. Server should fail fast on startup.

**File:** `server/src/lib/services/ai.ts` (line ~56) checks at request time.

## Fix

Add startup validation in `server/src/index.ts`:

```typescript
const requiredEnvVars = [
  'OPENROUTER_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIRESTORE_DATABASE_ID',
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```
ISSUE_EOF

gh issue create --repo "$REPO" \
  --title "[Low] Validate required environment variables on startup" \
  --label "enhancement,backend,dx" \
  --body-file "$TMPFILE"

echo "✅ Issue 19 created: Env var validation"

# ============================================================
# Issue 20: Fix GCS bucket name inconsistency
# ============================================================

cat > "$TMPFILE" <<'ISSUE_EOF'
## Problem

Two files have different default GCS bucket names:
- `server/src/lib/storage.ts` → defaults to `prd-helper-uploads`
- `server/src/lib/health/storage.ts` → defaults to `clearly-prd-attachments`

If `GCS_BUCKET_NAME` env var is not set, health checks target a different bucket than actual storage operations.

## Fix

Extract the bucket name to a shared config:

```typescript
// server/src/lib/config.ts
export const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'prd-helper-uploads';
```

Import this constant in both `storage.ts` and `health/storage.ts`.
ISSUE_EOF

gh issue create --repo "$REPO" \
  --title "[Low] Fix GCS bucket name inconsistency" \
  --label "bug,backend" \
  --body-file "$TMPFILE"

echo "✅ Issue 20 created: Bucket name inconsistency"

echo ""
echo "============================================"
echo "✅ All remaining issues (15-20) created!"
echo "============================================"
