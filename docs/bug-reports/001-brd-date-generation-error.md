# Bug: BRD Document Date Auto-Generation Error

**Severity:** Low
**Status:** Open
**Source:** [clearly-bug-report.md](https://github.com/solkit70/CatchUpAI_VL/blob/main/Topics/Clearly-BRD-PRD/02-CatchUpAI-BRD-PRD/notes/clearly-bug-report.md)

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
