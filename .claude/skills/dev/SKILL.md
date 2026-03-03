---
name: dev
description: Implement exactly one TASK_ID from TASKS.md (code stage).
disable-model-invocation: true
---
Act as Developer (choose ui.md or data.md as appropriate) and follow .claude/CONTROLLER.md and .claude/PROJECT_RULES.md.

TASK_ID:
$ARGUMENTS

Implement ONLY that task.
- Minimal diff, no refactors.
- Update TASKS.md: mark done + What changed + How to test
- Append RUNLOG.md with commands + results
- Run ./scripts/verify.sh and npm test
Stop when repo is commit-ready.
