#!/usr/bin/env bash
set -euo pipefail
msg_file="$1"
pattern='^(arch|ui|data|qa|test|chore|release)\(([A-Z]+-[0-9]+|S[0-9]+(\.[0-9]+)?)\): '
if ! grep -qE "$pattern" "$msg_file"; then
  echo "ERROR: Commit message must match: type(Sx): ... or type(QA-0): ..."
  echo "Examples: ui(S3.1): add report saved screen"
  echo "          test(QA-0): add jest foundation"
  exit 1
fi
