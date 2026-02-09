#!/bin/bash
# Run this script locally (where gh is authenticated) to create GitHub issues
# Usage: ./create-issues.sh

REPO="Startup-Consulting-Inc/prdhelper"

echo "Creating Issue #1: BRD Document Date Auto-Generation Error (Low)"
gh issue create --repo "$REPO" --title "Bug: BRD Document Date Auto-Generation Error" --label "bug" --body "$(cat <<'EOF'
## Severity: Low

## Description
The BRD document header displays an outdated date instead of the current project creation date.

## Steps to Reproduce
1. Create Project
2. Complete BRD Wizard
3. Generate BRD
4. View Document

## Actual Behavior
Document header shows "2023-11-20" despite the project being created on 2026-02-08. Project details correctly display "Created 2/8/2026."

## Expected Behavior
BRD header date should match the actual project creation date (2026-02-08).

---
*Source: [clearly-bug-report.md](https://github.com/solkit70/CatchUpAI_VL/blob/main/Topics/Clearly-BRD-PRD/02-CatchUpAI-BRD-PRD/notes/clearly-bug-report.md)*
EOF
)"

echo "Creating Issue #2: Session Timeout During PRD Wizard (High)"
gh issue create --repo "$REPO" --title "Bug: Session Timeout During PRD Wizard Causes Data Loss" --label "bug" --body "$(cat <<'EOF'
## Severity: High

## Description
Users are unexpectedly logged out mid-workflow without warning, losing unsaved progress in the PRD Wizard.

## Steps to Reproduce
1. Approve BRD
2. Start PRD Wizard
3. Begin answering questions
4. Observe forced redirect to login

## Actual Behavior
While completing the second question, the application abruptly redirects to the login screen without any timeout notification. The first answer was already submitted but progress is lost.

## Expected Behavior
Sessions should remain active for extended periods (minimum 30 minutes). A warning should appear before session expiration to prevent data loss.

---
*Source: [clearly-bug-report.md](https://github.com/solkit70/CatchUpAI_VL/blob/main/Topics/Clearly-BRD-PRD/02-CatchUpAI-BRD-PRD/notes/clearly-bug-report.md)*
EOF
)"

echo "Creating Issue #3: Projects Inaccessible After Re-Authentication (Critical)"
gh issue create --repo "$REPO" --title "Bug: Projects Inaccessible After Re-Authentication" --label "bug" --body "$(cat <<'EOF'
## Severity: Critical

## Description
Project data becomes inaccessible after re-logging in following a session timeout.

## Steps to Reproduce
1. Session timeout forces logout
2. Re-login
3. Navigate to dashboard

## Actual Behavior
Dashboard statistics indicate "Total Projects: 2, Documents: 1," yet the "Your Projects" section displays "No projects yet." Search functionality returns no results. Page refresh provides no resolution.

## Expected Behavior
Previously created projects should display normally after re-authentication, enabling users to resume work.

## Impact
Users cannot access approved BRDs or continue PRD generation, potentially requiring complete project recreation.

---
*Source: [clearly-bug-report.md](https://github.com/solkit70/CatchUpAI_VL/blob/main/Topics/Clearly-BRD-PRD/02-CatchUpAI-BRD-PRD/notes/clearly-bug-report.md)*
EOF
)"

echo "Done! All 3 issues created."
