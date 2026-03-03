---
name: qa-plan
description: Add TC list + mocks + manual smoke for one TASK_ID (plan only).
disable-model-invocation: true
---
Act as QA Manager per .claude/agents/qa-manager.md and follow .claude/CONTROLLER.md and .claude/PROJECT_RULES.md.

TASK_ID:
$ARGUMENTS

Add a QA subsection in TASKS.md:
- Automated test cases (TC list)
- Manual smoke checks
- Required mocks/stubs

Hard rules:
- Plan only: modify TASKS.md (+ optionally scripts/smoke.md) and RUNLOG.md.
- Do NOT write test code.
Stop when commit-ready.
