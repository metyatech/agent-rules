# Quality and verification

Detailed test coverage, AC→evidence format, root-cause
classification, runtime-verification matrix procedures, and CI
setup procedures live in the `quality-workflow` skill. GUI-specific
verification rules live in `gui-standards`.

## Definitions

- **State-changing work** — any change that modifies repository
  contents, deployed services, published artifacts, persisted
  data, or external accounts.
- **Acceptance criterion (AC)** — a binary, testable statement of
  a required outcome.
- **Evidence** — the concrete commands, outputs, or manual steps
  that demonstrate an AC has been satisfied or has failed.
- **Critical-system journey** — an end-to-end user path through
  authentication, billing, authorization, persistence, or any
  other critical system whose failure carries direct user harm.
- **Environment matrix** — the explicit set of clients,
  environments, and persisted-state combinations the agent claims
  a change supports.

## Non-negotiable gates

For any state-changing work or any claim of "done", "fixed",
"working", or "passing", the agent MUST satisfy every gate below:

1. Before starting state-changing work, list AC as binary,
   testable statements.
2. Before each git commit, run the repository's full verification
   suite and observe success.
3. With each AC, define the evidence that will demonstrate
   satisfaction.
4. For code or runtime changes, add automated tests. A bug fix
   MUST include a regression test.
5. Run the repository-standard verify command. If none exists, add
   one in the same change set.
6. Keep completion reporting concise by default. Maintain AC and
   evidence internally; surface explicit AC and evidence sections
   only when the user requests them.

## Failure handling

- The agent MUST NOT swallow errors. Fail fast with explicit
  context. Validate configuration and external inputs at system
  boundaries.
- CI and commit hooks MUST enforce full verification. Code fixes
  MUST follow a failing-test-to-passing-test loop.
- When a verification step fails because of a known security
  vulnerability, attempt the documented automated fix
  (`npm audit fix` or equivalent). If the fix succeeds and
  verification passes, commit and push the fix to the active
  branch.

## Runtime verification

- For user-facing apps, multi-client systems, multi-environment
  systems, or persisted-state systems, define the claimed
  environment matrix up front and verify every claimed primary
  path and state before concluding.
- Report evidence per claimed client, environment, and path. Any
  path not directly verified MUST stay unclaimed.
- Prefer the least-costly faithful verification environment that
  covers each claimed behavior. Real-device or live checks are
  justified only when lower-cost environments cannot cover the
  behavior.
- For a critical-system journey, completion REQUIRES live or
  production-like end-to-end verification of the journey; unit,
  integration, build, and health checks alone are insufficient.
- Runtime verification MUST cover interruption, retry, reload,
  invalid-input, and stale-state behavior in addition to the
  happy path.
- If an intended environment cannot be exercised with available
  tools or access, stop short of completion, state the exact gap,
  and leave that environment unclaimed.

## Bug handling

- On every user-reported bug, identify the earliest deterministic
  gate that should have caught the bug and add or strengthen that
  gate in the same change set. A fix without a new catching gate
  is incomplete.
- The agent MUST NOT claim bug-free behavior. Report scope,
  evidence, and residual risk; do not conclude while a known gap
  against the requested outcome remains.
