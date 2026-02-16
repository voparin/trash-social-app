# PROJECT RULES (MUST FOLLOW)

## Single source of truth
- TASKS.md is the task board.
- ADR.md records architectural decisions.

## Scope control
- One agent run = exactly ONE task ID from TASKS.md Sprint.
- If work expands, create a new task instead of extending scope.
- Prefer PR-sized diffs; keep changes minimal.

## Agent output format (MANDATORY)
Every run must produce:
1) Plan (<=3 bullets)
2) Implementation (files changed)
3) Verification (exact commands + expected result)

## Definition of Done (anti “looks done”)
A task may be marked Done only if:
- It is user-visible OR has a concrete verification step (not “should work”).
- You ran at least one verification step:
  - UI tasks: `npx expo start` and confirm the feature is visible in the app.
  - Non-UI tasks: a concrete command + expected output.
- TASKS.md updated with "What changed" + "How to test".
- RUNLOG.md appended.
- A commit is created.

## Dependencies
- No new npm dependency without an ADR entry:
  - Why this dependency
  - One alternative considered

## Secrets / env vars
- Never hardcode keys/tokens.
- Add new variables to `.env.example` and reference them via config.
- `.env` is gitignored.

## Conflict policy
- If you hit a merge conflict or unclear state, STOP and create a task "Fix conflicts / restore green state".
