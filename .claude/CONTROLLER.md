# CONTROLLER LOOP (follow every time)

## 0) Determine the active task
- If the command/run specifies a TASK ID (e.g. S4.2, QA-3), that is the ONLY active task.
- If no TASK ID is specified, pick the top unchecked task in TASKS.md Sprint section.
- One run = ONE task. Do not implement additional tasks.

## 1) Minimal context / file scope
- Identify the minimal set of files required and open only those.
- Avoid scanning the whole repository.
- If you need more than ~6 files, split the work into smaller tasks.

## 2) Execute the task
1) Read TASKS.md for the active task’s acceptance + verification steps.
2) Choose the correct agent role (Architect/UI/Data/Backend/QA Manager/QA Engineer/Reviewer/Release).
3) Implement ONLY the active task with a minimal diff (no unrelated refactors).

## 3) Observability (mandatory)
4) Update TASKS.md:
   - mark the task Done only when completion checklist passes
   - add “What changed” + “How to test”
5) Append RUNLOG.md:
   - commands run + outcomes (including failures)
6) If a new dependency or architectural decision is introduced: update ADR.md (or create an Architect task).

## 4) Completion checklist (must all be true)
A task is complete only when:
- the implementation matches acceptance criteria
- ./scripts/verify.sh was executed (recorded in RUNLOG.md)
- npm test was executed if tests exist/enabled (recorded in RUNLOG.md)
- TASKS.md was updated for the active task
- no unrelated files/tasks were modified

## 5) Stall prevention
- Do not generate large batches in one run (e.g., 50 tests).
- If work is bigger than ~10 test cases or touches >5 files, create follow-up tasks and stop.

## 6) Stop condition
Stop as soon as the repo is commit-ready for the active task.
