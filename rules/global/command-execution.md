# Workflow and command execution

- Do not add wrappers or pipes to commands unless the user explicitly asks.
- Prefer repository-standard scripts/commands (package.json scripts, README instructions).
- Reproduce reported command issues by running the same command (or closest equivalent) before proposing fixes.
- Avoid interactive git prompts by using --no-edit or setting GIT_EDITOR=true.
- If elevated privileges are required, use sudo where available; otherwise run as Administrator.
- Keep changes scoped to affected repositories; when shared modules change, update consumers and verify at least one.
- If no branch is specified, work on the current branch; direct commits to main/master are allowed.
- After addressing PR review feedback, resolve the corresponding review thread(s) before concluding; if you lack permission, state it explicitly.
- After pushing fixes for PR review feedback, re-request review from the same reviewer(s) when possible; if there are no current reviewers, ask who should review.
- For Codex re-review: comment `@codex review` on the PR.
- For Copilot re-review: remove Copilot from PR Reviewers and add it back (UI).
- After completing a PR, merge it, sync the target branch, and delete the PR branch locally and remotely.
