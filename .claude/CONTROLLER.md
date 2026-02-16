cat > .claude/CONTROLLER.md <<'EOF'
# CONTROLLER LOOP (follow every time)

1) Read TASKS.md Sprint section.
2) Pick the top unchecked task.
3) Choose the correct agent role (Architect/UI/Data/Backend/QA/Release).
4) Implement ONLY that task.
5) Update TASKS.md (Done + what changed + how to test).
6) Append RUNLOG.md (commands run + verification result).
7) If new dependency: update ADR.md.
8) Stop and ask for the next task ONLY after repo is in a commit-ready state.
EOF
