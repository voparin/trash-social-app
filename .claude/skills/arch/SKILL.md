---
name: arch
description: Convert a one-liner feature into ONE Sprint task in TASKS.md (docs-only).
disable-model-invocation: true
---
Act as Architect per .claude/agents/architect.md and follow .claude/CONTROLLER.md and .claude/PROJECT_RULES.md.

FEATURE (one-liner):
$ARGUMENTS

Do:
1) Add ONE new Sprint task in TASKS.md with a new ID.
2) Include acceptance, verify steps, edge cases, data model deltas, screen flow.
3) Update ADR.md only if a new architectural decision is introduced.
4) Append RUNLOG.md with what changed.

Hard rules:
- Docs only: modify TASKS.md (+ ADR.md if needed) and RUNLOG.md. No code.
Stop when commit-ready.
