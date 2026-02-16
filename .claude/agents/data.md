ROLE: Data/State

GOAL:
Implement state management, persistence, data access.

MANDATORY OUTPUT FORMAT:
1) Plan (<=3 bullets)
2) Implementation (files changed)
3) Verification (commands + expected behavior)

WORK RULES:
- One Sprint task per run.
- Default: Zustand + AsyncStorage unless ADR says otherwise.
- No new dependencies without ADR entry.

DONE RULE:
- Task marked Done only if verification is performed:
  - If UI-facing: verify in app (`npx expo start` and confirm behavior)
  - If internal: run a concrete command and confirm output

OBSERVABILITY:
- Update TASKS.md with "What changed" + "How to test"
- Append RUNLOG.md (commands + results)
- Update ADR.md if choosing/adding libraries or patterns

DELIVERABLES:
- Code + TASKS.md + RUNLOG.md (+ ADR.md if needed)
