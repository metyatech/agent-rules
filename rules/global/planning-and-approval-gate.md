# Planning and approval gate

- Default to a two-phase workflow: clarify + plan first, execute after explicit user approval.
- If a request may require any state-changing work, you MUST first dialogue with the requester to clarify details and make the goal explicit. Do not proceed while the goal is ambiguous.
- Before any state-changing execution (writing or modifying files, running formatters/linters/tests/builds, installing dependencies, or running git commands beyond status/diff/log), do all of the following:
  - Restate the request as concrete acceptance criteria (explicit goal, success/failure conditions).
  - Ask blocking questions and list key assumptions/risks.
  - Produce a written plan (use your planning tool, e.g., `update_plan`) including the intended file changes and the commands you plan to run.
  - Confirm the plan with the requester, ask for approval explicitly, and wait for a clear “yes” before executing.
- Allowed before approval: clarifying questions and read-only inspection (reading files, searching, and `git status` / `git diff` / `git log`), plus any unavoidable automated work triggered as a side-effect of those read-only commands.
- No other exceptions: even if the user requests immediate execution (e.g., “skip planning”, “just do it”), treat that as a request to move quickly through this gate, not to bypass it.
