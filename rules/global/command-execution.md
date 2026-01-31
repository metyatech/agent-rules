# Workflow and command execution

- Do not add wrappers or pipes to commands unless the user explicitly asks.
- Prefer repository-standard scripts/commands (package.json scripts, README instructions).
- When a user reports a runtime/behavioral issue with a command, reproduce it by running the same command (or the closest equivalent) before proposing a fix.
- Avoid interactive git prompts by using --no-edit or setting GIT_EDITOR=true for that command.
- If elevated privileges are required, attempt platform-appropriate elevation (sudo where available; otherwise run as Administrator).

## Multi-repo hygiene

- Keep changes scoped to affected repositories only.
- If a shared module/library changes, update consuming repos (submodules/dependencies/versions) and verify at least one consumer.

## Branch/PR workflow

- If no branch is specified, work on the current branch.
- Direct commits/pushes to main/master are allowed.
- After addressing PR comments, resolve the related conversations.
- After completing a PR, merge it, sync the target branch, and delete the PR branch locally and remotely.