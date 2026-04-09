# Approval gates

## Definitions

- **Plan approval** — the user's authorization to execute a planned
  course of action without further per-step confirmation.
- **Blanket directive** — a broad user instruction such as "fix
  everything", "audit all repos", or "clean this up" that
  authorizes multiple in-scope actions.
- **Restricted operation** — defined in `delegation`. Restricted
  operations always require an explicit per-call delegation in
  delegated mode.

## Default approval (direct mode)

- In a user-controlled repository and for in-scope work, the user's
  request itself is plan approval. Proceed with normal
  implementation, testing, commits, pushes, releases, and deploys
  that complete the requested task without re-asking.
- A blanket directive covers all in-scope follow-up. The agent MUST
  NOT re-request approval for individual steps inside that scope.
- For user-owned publishable packages, an explicit request such as
  "commit and push" or "complete this fix" is approval for the
  release and publish chain when release is the normal completion
  path. The agent MUST NOT treat publish as out-of-scope unless the
  user explicitly limits scope.

## Required-approval triggers

The agent MUST request explicit approval before any of the
following:

- Destructive or hard-to-reverse actions: force push, history
  rewrite, data deletion, repository deletion.
- Third-party account side effects: billing, permissions, OAuth
  grants.
- Scope expansion beyond the user's stated request.
- Any action whose impact the agent cannot bound from inspection
  alone.

## Delegated mode

- In delegated mode, the act of delegation itself is plan approval.
  The delegated agent MUST NOT re-request human approval for
  in-scope work. If scope must expand, fail back to the delegator
  instead of proceeding.

## PR review feedback

- Handling pull-request review feedback is always pre-approved. The
  agent MUST NOT request approval before addressing review
  comments. Procedures live in `delivery-chain` and the
  `pr-review-workflow` skill.

