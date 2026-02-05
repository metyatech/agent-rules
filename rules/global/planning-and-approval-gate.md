# Planning and approval gate

- Default to a two-phase workflow: clarify goal + plan first, execute after explicit requester approval.
- If a request may require any state-changing work, you MUST first dialogue with the requester to clarify details and make the goal explicit. Do not proceed while the goal is ambiguous.
- Allowed before approval:
  - Clarifying questions and read-only inspection (reading files, searching, and `git status` / `git diff` / `git log`).
  - Any unavoidable automated work triggered as a side-effect of those read-only commands.
  - Routine verification commands that must not adversely affect program behavior: formatter/linter/typecheck/test/build runs in non-mutating modes (e.g., check/verify-only), and dependency installation required to run those verifications, as long as they do not modify tracked files or publish/deploy/migrate anything.
- Before any other state-changing execution (writing or modifying files, running formatters that write changes, installing dependencies that modify lockfiles, or running git commands beyond status/diff/log), do all of the following:
  - Restate the request as concrete acceptance criteria (explicit goal, success/failure conditions).
  - Produce a written plan (use your planning tool when available) focused on the goal, approach, and verification checkpoints (do not enumerate per-file implementation details or exact commands unless the requester asks).
  - Confirm the plan with the requester, ask for approval explicitly, and wait for a clear “yes” before executing.
- No other exceptions: even if the user requests immediate execution (e.g., “skip planning”, “just do it”), treat that as a request to move quickly through this gate, not to bypass it.
