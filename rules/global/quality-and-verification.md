# Quality and verification

This module defines the non-negotiable quality gates and the
verification posture the agent MUST satisfy. Detailed test coverage,
AC→evidence format, root-cause classification, and CI setup
procedures are defined in the `quality-workflow` skill. GUI-specific
verification rules live in `gui-standards`.

## Definitions

- **State-changing work** — any change that modifies repository
  contents, deployed services, published artifacts, persisted data,
  or external accounts.
- **Acceptance criterion (AC)** — a binary, testable statement of a
  required outcome.
- **Evidence** — the concrete commands, outputs, or manual steps
  that demonstrate an AC has been satisfied or has failed.
- **Critical-system journey** — an end-to-end user path through
  authentication, billing, authorization, persistence, or any
  other critical system whose failure carries direct user harm.
- **Environment matrix** — the explicit set of clients,
  environments, and persisted-state combinations the agent claims a
  change supports.

## Non-negotiable gates

For any state-changing work or any claim of "done", "fixed",
"working", or "passing", the agent MUST satisfy every gate below:

1. Before starting state-changing work, the agent MUST list AC as
   binary, testable statements.
2. Before each git commit, the agent MUST run the repository's
   full verification suite and MUST observe success.
3. With each AC, the agent MUST define the evidence that will
   demonstrate satisfaction.
4. For code or runtime changes, the agent MUST add automated tests.
   A bug fix MUST include a regression test.
5. The agent MUST run the repository-standard verify command. If no
   such command exists, the agent MUST add one in the same change
   set.
6. The agent MUST keep completion reporting concise by default. The
   agent MUST maintain AC and evidence internally and MUST surface
   explicit AC and evidence sections only when the user requests
   them or when higher-priority rules require it.

## Failure handling

- The agent MUST NOT swallow errors. The agent MUST fail fast with
  explicit context.
- The agent MUST validate configuration and external inputs at
  system boundaries.
- CI and commit hooks MUST enforce full verification. Code fixes
  MUST follow a failing-test-to-passing-test loop.
- When a verification step (`npm run verify`, `npm audit`, etc.)
  fails because of a known security vulnerability, the agent MUST
  attempt the documented automated fix (`npm audit fix` or
  equivalent). If the fix succeeds and verification passes, the
  agent MUST commit and push the fix to the active branch.

## Runtime verification

- For user-facing apps, multi-client systems, multi-environment
  systems, or persisted-state systems, the agent MUST define the
  claimed environment matrix up front and MUST perform
  deterministic runtime verification of every claimed primary path
  and state before concluding.
- The agent MUST report evidence per claimed client, environment,
  and path. Any path not directly verified MUST stay unclaimed.
- The agent MUST prefer the least-costly faithful verification
  environment that covers each claimed behavior. Real-device or
  live checks are justified only when lower-cost environments
  cannot cover the behavior.
- For a critical-system journey, unit, integration, build, and
  health checks are necessary but insufficient. Completion REQUIRES
  live or production-like end-to-end verification of the journey.
- Runtime verification MUST cover interruption, retry, reload,
  invalid-input, and stale-state behavior in addition to the happy
  path.
- If an intended environment cannot be exercised with the available
  tools or access, the agent MUST stop short of completion, MUST
  state the exact gap, and MUST leave that environment unclaimed.

## Bug handling

- On every user-reported bug, the agent MUST identify the earliest
  deterministic gate that should have caught the bug and MUST add
  or strengthen that gate in the same change set. A fix without a
  new catching gate is incomplete.
- The agent MUST NOT claim bug-free behavior. The agent MUST report
  scope, evidence, and residual risk, and MUST NOT conclude while
  a known gap against the requested outcome remains.

## AI review bots

- For pull-request review bots, the agent MUST follow the
  re-triggering procedures defined in the `pr-review-workflow`
  skill.
