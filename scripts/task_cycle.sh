#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/task_cycle.sh start S3.2 "camera capture for reporter"
#   scripts/task_cycle.sh finish S3.2 "enable camera capture for reporter"

CMD="${1:-}"
TASK_ID="${2:-}"
DESC="${3:-}"

if [[ -z "$CMD" || -z "$TASK_ID" ]]; then
  echo "Usage:"
  echo "  $0 start  Sx(.y)|QA-0  \"short-desc\""
  echo "  $0 finish Sx(.y)|QA-0  \"commit message tail\""
  exit 1
fi

BRANCH="feat/${TASK_ID//./_}-${DESC// /-}"
BRANCH="${BRANCH,,}" # lowercase

run_verify() {
  echo "== verify =="
  ./scripts/verify.sh
  echo "== tests =="
  npm test
}

case "$CMD" in
  start)
    if [[ -z "$DESC" ]]; then
      echo "ERROR: start requires a description"
      exit 1
    fi
    echo "== sync main =="
    git switch main
    git pull
    echo "== create branch: $BRANCH =="
    git switch -c "$BRANCH"
    echo
    echo "Branch ready: $BRANCH"
    echo "Next: run your agent / implement task. Then:"
    echo "  $0 finish $TASK_ID \"<what changed>\""
    ;;

  finish)
    if [[ -z "$DESC" ]]; then
      echo "ERROR: finish requires a commit message tail"
      exit 1
    fi

    CURRENT_BRANCH="$(git branch --show-current)"
    if [[ "$CURRENT_BRANCH" == "main" ]]; then
      echo "ERROR: You are on main. Switch to your feature branch first."
      exit 1
    fi

    run_verify

    echo "== git status =="
    git status

    echo "== commit =="
    git add .
    git commit -m "ui(${TASK_ID}): ${DESC}"

    echo "== push =="
    git push -u origin "$CURRENT_BRANCH"

    echo "== open PR =="
    gh pr create --fill --base main --head "$CURRENT_BRANCH" || {
      echo "PR create failed (maybe PR already exists)."
      echo "Try: gh pr view --web"
    }

    echo
    echo "Done. Next:"
    echo "  gh pr view --web"
    echo "  (merge when CI is green)"
    ;;

  *)
    echo "ERROR: Unknown command: $CMD"
    exit 1
    ;;
esac
