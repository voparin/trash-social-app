cat > scripts/task_cycle.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"
if [[ -z "$TASK_ID" ]]; then
  echo "Usage: scripts/task_cycle.sh <TASK_ID>"
  exit 1
fi

echo "== Starting task cycle: $TASK_ID =="

# 1) sanity
./scripts/verify.sh

# 2) show task context
echo
echo "== TASK CONTEXT =="
grep -n "$TASK_ID" -A6 TASKS.md || true
echo

echo "Now run Claude Code with the relevant agent prompt for $TASK_ID."
echo "After Claude finishes, come back and run:"
echo "  ./scripts/verify.sh"
echo "  npx expo start  (for UI tasks)"
echo "  git status / git diff"
echo "  git commit -m \"<agent>($TASK_ID): <message>\""
echo "  git push"
EOF

chmod +x scripts/task_cycle.sh
