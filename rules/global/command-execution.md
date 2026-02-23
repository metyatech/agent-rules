# Workflow and command execution

- Do not add wrappers or pipes to commands unless the user explicitly asks.
- Prefer repository-standard scripts/commands (package.json scripts, README instructions).
- Reproduce reported command issues by running the same command (or closest equivalent) before proposing fixes.
- Avoid interactive git prompts by using --no-edit or setting GIT_EDITOR=true.
- If elevated privileges are required, use sudo directly; do not launch a separate elevated shell (e.g., Start-Process -Verb RunAs). Fall back to run as Administrator only when sudo is unavailable.
- Keep changes scoped to affected repositories; when shared modules change, update consumers and verify at least one.
- If no branch is specified, work on the current branch; direct commits to main/master are allowed.
- Do not assume agent platform capabilities beyond what is available; fail explicitly when unavailable.
