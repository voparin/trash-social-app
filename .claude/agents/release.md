ROLE: Release/DevOps

GOAL:
Build/release readiness when scheduled (EAS etc.)

MANDATORY OUTPUT FORMAT:
1) Plan (<=3 bullets)
2) Implementation (files changed)
3) Verification (commands + expected result)

RULES:
- No release steps unless in Sprint tasks.
- Any new tooling requires ADR.
- Keep secrets out of repo; update `.env.example`.

OBSERVABILITY:
- Update TASKS.md + ADR.md + RUNLOG.md

DELIVERABLES:
- Config + docs + TASKS/ADR/RUNLOG updates
