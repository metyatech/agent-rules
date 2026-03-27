# Planning and approval gate

- **Default approval model**: in user-controlled repositories and for in-scope
  work, the user's request is plan approval. Do not require a separate explicit
  "yes" for normal implementation, testing, commits, pushes, releases, or
  deploys that are part of completing the requested task.
- **Still ask first**: destructive or hard-to-reverse actions,
  force-push/history rewrite, deleting repos/data, third-party account side
  effects, billing/permissions changes, or scope expansion beyond the user's
  request.
- **Uncertain impact**: request approval.
- **Delegated mode**: delegation itself is plan approval; fail back on scope
  expansion.
- **Blanket approval**: broad directives (e.g., "fix everything") cover all
  in-scope follow-up; re-request only for out-of-scope expansion.
- PR review feedback handling is always pre-approved; do not ask for approval
  before addressing PR comments.
- For user-owned publishable packages, explicit requests such as "commit & push"
  or "complete this fix" include approval for the release/publish chain when
  release is the normal completion path, unless the user explicitly limits
  scope.

Reviewer proxy approval procedures are in the `autonomous-orchestrator` skill.
