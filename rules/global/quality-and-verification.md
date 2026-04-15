# Quality and verification

GUI verification: `gui-standards`. Procedural detail: `quality-workflow`.

## Definitions

- **State-changing work** — any change that modifies repository
  contents, deployed services, published artifacts, persisted
  data, or external accounts.
- **Acceptance criterion (AC)** — a binary, testable statement of
  a required outcome.
- **Critical-system journey** — an end-to-end user path through
  authentication, billing, authorization, or persistence whose
  failure carries direct user harm.

## Non-negotiable gates

For any state-changing work or any claim of "done", "fixed",
"working", or "passing":

1. Before starting, list AC as binary, testable statements.
2. Before each git commit, run the full verification suite and
   observe success.
3. With each AC, define concrete evidence (commands, outputs, or
   manual steps) that will demonstrate satisfaction.
4. Before concluding, enumerate the changed externally visible
   contract surface and map each item to direct verification
   evidence. Contract surface includes documented commands,
   subcommands, flags, API endpoints, UI controls, views, states,
   file formats, and other user-visible behavior.
5. For code or runtime changes, add automated tests. A bug fix
   MUST include a regression test.
6. Run the repository-standard verify command; add one in the same
   change set if none exists.
7. Maintain AC and evidence internally; surface them only when the
   user requests.

## Failure handling

- The agent MUST NOT swallow errors. Fail fast with explicit
  context. Validate configuration and external inputs at system
  boundaries.
- CI and commit hooks MUST enforce full verification. Code fixes
  MUST follow a failing-test-to-passing-test loop.
- On a failing security audit, attempt the documented automated
  fix. If it succeeds and verification passes, commit and push.

## Runtime verification

- For user-facing apps, multi-client, multi-environment, or
  persisted-state systems, define the claimed environment matrix
  up front and verify every claimed primary path and state.
  Report evidence per client, environment, and path; leave any
  unverified path unclaimed.
- For a critical-system journey, completion REQUIRES live or
  production-like end-to-end verification; unit, integration,
  build, and health checks alone are insufficient.
- Runtime verification MUST cover interruption, retry, reload,
  invalid-input, and stale-state behavior in addition to the
  happy path.

## Bug handling

- On every user-reported bug, identify the earliest deterministic
  gate that should have caught it and add or strengthen that gate
  in the same change set.
- When fixing a bug, identify the broader failure pattern and
  extend the fix so same-pattern failures are prevented by
  construction or a generalized gate. A fix that only patches the
  observed instance is incomplete unless the pattern is
  irreducible and explicitly reported.
- The agent MUST NOT claim bug-free behavior. Report scope,
  evidence, and residual risk.
