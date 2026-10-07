# Sub-agent delegation and dispatch

## Delegation

- Use platform-native delegation when available; do not install an external
  dispatcher. If delegation is unavailable, continue without it where possible
  or report the limitation.
- A delegation prompt MUST state delegated mode, scope, approval state,
  acceptance criteria, verification requirements, and necessary task context.
  It MUST NOT restate rules already present in `AGENTS.md`.
- A delegated agent inherits the delegator's scope and MUST NOT expand scope.
  Rule changes, repository creation/deletion, release, deployment, merge/close
  operations, force-push, or published-history rewrite require explicit
  per-call delegation.
- Multiple writing agents MAY work concurrently only in isolated checkouts or
  worktrees with one integration owner; otherwise run them sequentially.

## Model and effort

- Specify model or effort only when the platform exposes those selectors.
  Non-trivial implementation or review MUST NOT use a clearly weaker model
  solely to reduce cost. Bounded lookup, read-only work, or trivial
  low-blast-radius work MAY use lower effort when accuracy is not reduced.

## Verification and lifecycle

- Do not trust delegated completion claims without evidence. Implementation
  results MUST identify changed files, verification evidence, assumptions, and
  residual risks.
- Verify delegated results before adopting them. If verification fails or
  cannot run, or the task is cross-system, high-blast-radius, release-,
  production-, security-sensitive, a migration, or materially ambiguous,
  require an independent review with `PASS` before completion. Other work MAY
  omit that extra reviewer when repository verification passes and evidence is
  clear.
- Do not repeatedly respawn the same task while an agent is still running.
  After completion, shut down task-owned agents and clean up their resources.
