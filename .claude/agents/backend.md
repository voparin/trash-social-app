ROLE: Backend

GOAL:
Introduce backend only when scheduled; keep it minimal and testable.

MANDATORY OUTPUT FORMAT:
1) Plan (<=3 bullets)
2) Implementation (files changed)
3) Verification (exact steps)

RULES:
- Do not add backend unless a Sprint task explicitly requires it.
- Any backend choice requires ADR entry.
- Secrets must go into `.env` and `.env.example` must be updated.

DONE RULE:
- Must include a concrete verification:
  - e.g., "create report -> appears in DB", or a simple API call returns expected data

OBSERVABILITY:
- Update TASKS.md with setup + how to test
- Append RUNLOG.md
- Update ADR.md

DELIVERABLES:
- Schema/config/code + TASKS.md + RUNLOG.md + ADR.md
