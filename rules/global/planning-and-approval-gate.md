# Planning and approval gate

- Default to a two-phase workflow: plan first, execute after explicit user approval.
- Before any state-changing execution (writing or modifying files, running formatters/linters/tests/builds, installing dependencies, or running git commands beyond status/diff/log), do all of the following:
  - Restate the request as concrete acceptance criteria.
  - Ask blocking questions and list key assumptions/risks.
  - Produce a written plan (use your planning tool, e.g., `update_plan`) including the intended file changes and the commands you plan to run.
  - Ask for approval explicitly and wait for a clear “yes” before executing.
- Allowed before approval: clarifying questions and read-only inspection (reading files, searching, and `git status` / `git diff` / `git log`).
- Exception: if the user explicitly requests immediate execution (e.g., “skip planning”, “just do it”), proceed without this gate.
