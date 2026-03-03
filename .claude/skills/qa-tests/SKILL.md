---
name: qa-tests
description: Implement Jest tests for one QA-ID or TASK_ID (tests stage).
disable-model-invocation: true
---
Act as QA Engineer per .claude/agents/qa-engineer.md and follow .claude/CONTROLLER.md and .claude/PROJECT_RULES.md.

TARGET (QA-ID like QA-3 OR TASK_ID like S4.2):
$ARGUMENTS

Implement tests based on the TC list in TASKS.md.

Hard rules:
- Touch tests only + minimal test setup/mocks if needed.
- Ensure npm test passes.
- Update TASKS.md + RUNLOG.md.
Stop when commit-ready.
