---
name: finish
description: Release helper — run verify/tests and prepare for commit (you execute git commands).
---
Act as Release/DevOps per agents/release.md. Follow CONTROLLER.md and PROJECT_RULES.md.

ARGS: TYPE TASK_ID MESSAGE
Example: ui S4.2 add camera capture

$ARGUMENTS

Do:
1) Tell the user the exact commands to run:
   - ./scripts/verify.sh
   - npm test
   - git status
   - git add -A
   - git commit -m "TYPE(TASK_ID): MESSAGE"
   - git push -u origin <current-branch>
2) Confirm what to look for in outputs.
Do NOT run git commands yourself.
