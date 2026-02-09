# Bug: Session Timeout During PRD Wizard Causes Data Loss

**Severity:** High
**Status:** Open
**Source:** [clearly-bug-report.md](https://github.com/solkit70/CatchUpAI_VL/blob/main/Topics/Clearly-BRD-PRD/02-CatchUpAI-BRD-PRD/notes/clearly-bug-report.md)

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
