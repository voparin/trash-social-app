#!/usr/bin/env bash
set -euo pipefail
msg_file="$1"
if grep -qiE "^(WIP|wip|tmp|temp|fix later)" "$msg_file"; then
  echo "ERROR: WIP/tmp commit messages are blocked."
  exit 1
fi
