#!/bin/bash
# Creates the PRD generation failure issue
REPO="Startup-Consulting-Inc/prdhelper"

gh issue create --repo "$REPO" --title "Bug: PRD generation hangs then silently fails" --label "bug" --body "$(cat <<'ISSUE_EOF'
## Severity: High

## Description
Clicking "Generate PRD" shows "Generating Your PRD..." spinner for ~2 minutes, then silently returns to the Generate PRD screen with no error message and no document produced.

## Steps to Reproduce
1. Create a project, complete BRD wizard, approve BRD
2. Complete PRD wizard Q&A (answer enough questions)
3. Click "Generate PRD"
4. Wait ~2 minutes

## Actual Behavior
Spinner shows "Generating Your PRD..." for ~2 minutes, then the button reappears as if nothing happened. No error is shown. No PRD is generated.

## Expected Behavior
PRD should be generated and the user should be navigated to the project page, or a clear error message should be shown on failure.

## Root Cause Analysis
Three compounding issues:

1. **No timeout on OpenRouter API fetch** (`server/src/lib/services/ai.ts`): The `fetch()` call to OpenRouter has no `AbortSignal` timeout. If the API is slow or hangs, the request blocks indefinitely until the browser/network kills it.

2. **Silent error swallowing on client** (`client/src/pages/PRDWizardPage.tsx`): `setIsGenerating(false)` only runs in the `catch` block. If the promise resolves without navigating (e.g., browser timeout kills the connection and tRPC resolves with undefined), the generating state is never reset properly.

3. **No request timeout middleware** (`server/src/index.ts`): Express server has no request timeout configured, so long-running AI generation requests can hang indefinitely server-side.

---
*Source: User-reported bug, investigated via code analysis*
ISSUE_EOF
)"

echo "Done!"
