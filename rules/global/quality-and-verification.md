# Quality and verification

GUI verification lives in `gui-standards`. Procedural detail
lives in the `quality-workflow` skill.

## Definitions

- **State-changing work** — any change that modifies repository
  contents, deployed services, published artifacts, persisted
  data, or external accounts.
- **Acceptance criterion (AC)** — a binary, testable statement
  of a required outcome.
- **Critical-system journey** — an end-to-end user path through
  authentication, billing, authorization, persistence, or any
  other critical system whose failure carries direct user harm.

## Non-negotiable gates

For any state-changing work or any claim of "done", "fixed",
"working", or "passing":

1. Before starting, list AC as binary, testable statements.
2. Before each git commit, run the repository's full
   verification suite and observe success.
3. With each AC, define the evidence (concrete commands,
   outputs, or manual steps) that will demonstrate satisfaction.
4. For code or runtime changes, add automated tests. A bug fix
   MUST include a regression test.
5. Run the repository-standard verify command. If none exists,
   add one in the same change set.
6. Maintain AC and evidence internally; surface them only when
   the user requests.

## Failure handling

- The agent MUST NOT swallow errors. Fail fast with explicit
  context. Validate configuration and external inputs at system
  boundaries.
- CI and commit hooks MUST enforce full verification. Code
  fixes MUST follow a failing-test-to-passing-test loop.
- On a failing security audit, attempt the documented automated
  fix (`npm audit fix` or equivalent). If the fix succeeds and
  verification passes, commit and push.

## Runtime verification

- For user-facing apps, multi-client systems, multi-environment
  systems, or persisted-state systems, define the claimed
  environment matrix up front and verify every claimed primary
  path and state before concluding. Report evidence per claimed
  client, environment, and path. Any path not directly verified
  MUST stay unclaimed.
- For a critical-system journey, completion REQUIRES live or
  production-like end-to-end verification; unit, integration,
  build, and health checks alone are insufficient.
- Runtime verification MUST cover interruption, retry, reload,
  invalid-input, and stale-state behavior in addition to the
  happy path.
- If an intended environment cannot be exercised, stop short
  of completion, state the exact gap, and leave that
  environment unclaimed.

## Bug handling

- On every user-reported bug, identify the earliest
  deterministic gate that should have caught it and add or
  strengthen that gate in the same change set. A fix without a
  new catching gate is incomplete.
- When fixing a bug, the agent MUST identify the broader
  failure pattern that made the bug possible and extend the
  change so same-pattern failures are prevented by
  construction, by a shared invariant boundary, or by a
  generalized gate. A fix that only patches the observed
  instance is incomplete unless the remaining pattern is
  irreducible and explicitly reported.
- The agent MUST NOT claim bug-free behavior. Report scope,
  evidence, and residual risk.
