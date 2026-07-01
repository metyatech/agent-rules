# GHWS Workspace Management

- Apply these rules only when the repository path is under the `ghws` workspace root.
- All folders in the `ghws` workspace, except rules-local folders, are Git repositories connected to GitHub.
- Some repositories are not owned by the user, but the user can commit and push to them.
- If the target repository already exists under the current `ghws` workspace, edit it in place.
- If the target repository is not present under the current `ghws` workspace, clone it from GitHub with `--recursive` and then work in the cloned folder.
- When adding a new repository, create it under the `ghws` workspace first and then push it to GitHub.
- For account-wide requests, treat all user-owned repositories as in scope.
- Repository creation, splitting, and deletion are allowed only when the user explicitly requests or approves them.
- Never clone repositories that are not managed by the user into the `ghws` workspace.
- Repository-local OpenCode workflows MUST live in `.opencode/commands/`.
- The canonical verification command MUST be the same command used for local validation before delivery.
- When no canonical verification command is configured, stop and report the missing bootstrap requirement instead of inventing a partial substitute.
- Bug fixes MUST add or strengthen a regression check before concluding.
- Irreversible operations such as destructive deletion, publish, release, force-push, or external side effects MUST remain approval-gated.