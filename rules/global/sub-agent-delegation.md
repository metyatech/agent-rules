# Sub-agent delegation and dispatch

## Delegation

- Use platform-native delegation when available; do not install an external
  dispatcher. If unavailable, continue without it where possible or report the
  limitation. A delegation prompt MUST state delegated mode, scope, approval
  state, acceptance criteria, verification requirements, and needed task context;
  MUST NOT restate rules in `AGENTS.md`.
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

- Do not trust delegated completion claims without evidence. Results MUST
  identify changed files, verification evidence, assumptions, and residual risks;
  verify them before adoption. If verification fails/cannot run, or work is
  cross-system, high-blast-radius, release-, production-, or
  security-sensitive, a migration, or materially ambiguous, require independent
  review with `PASS` before completion. Other work MAY omit that review when
  repo verification passes and evidence is clear.
- Do not repeatedly respawn the same task while an agent is still running.
  After completion, shut down task-owned agents and clean up their resources.
