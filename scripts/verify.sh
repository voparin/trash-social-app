#!/usr/bin/env bash
set -euo pipefail

echo "== Verify repo hygiene =="

# must exist
test -f TASKS.md
test -f ADR.md
test -f RUNLOG.md

# basic node sanity
node -v
npm -v

# dependency sanity (if package-lock exists)
test -f package.json

echo "== Verify tasks have Verify steps =="
# fail if Sprint tasks exist without a Verify line
if grep -n "## Sprint (current)" -A200 TASKS.md | grep -q "^- \[ \]" ; then
  # Check every unchecked sprint item has a "Verify:" line somewhere below it (simple heuristic)
  awk '
    BEGIN{inSprint=0; inTask=0; ok=1;}
    /^## Sprint \(current\)/{inSprint=1; next}
    /^## /{if(inSprint) exit}
    inSprint && /^- \[ \]/{inTask=1; sawVerify=0; next}
    inSprint && inTask && /Verify:/{sawVerify=1}
    inSprint && inTask && /^- \[ \]/{ if(!sawVerify) ok=0; sawVerify=0; next}
    END{ if(inTask && !sawVerify) ok=0; if(!ok){print "ERROR: Some Sprint tasks are missing a Verify: step in TASKS.md"; exit 1} }
  ' TASKS.md
fi

echo "== OK =="
