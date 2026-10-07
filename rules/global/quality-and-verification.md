# Quality and verification

GUI verification: `gui-standards`. Procedural detail: `quality-workflow`.

## Verification gates

- For state-changing work or a claim of completion, define binary acceptance
  criteria and concrete evidence internally. Use targeted checks in the inner
  loop, directly verify every changed externally visible contract, and run the
  repository-standard full verification only as the final gate.
- Code or runtime changes require automated tests. A code or runtime bug fix
  MUST include a regression test that fails against the defect and passes
  after the fix.
- Run the repository-standard verification command before completion; add one
  in the same change set if none exists. CI MUST enforce it. Commit hooks are
  early safeguards and MUST NOT be treated as the final quality gate.
- On a failing security audit, use the documented automated fix when
  available; if it succeeds, rerun verification before commit and push.
- Diagnose failures with the smallest reproducer. After a dependency or
  environment change, reproduce against the pre-change state before
  attributing the failure to that change.
- Fail fast with explicit context; do not swallow errors. Validate
  configuration and external inputs at system boundaries.

## Runtime verification

- For user-facing, multi-client, multi-environment, or persisted-state systems,
  verify every claimed primary environment and path; leave unverified paths
  unclaimed.
- Authentication, billing, authorization, persistence, or other
  high-consequence user journeys require live or production-like end-to-end
  verification. Where applicable, cover interruption, retry, reload,
  invalid-input, and stale-state behavior as well as the happy path.

## Bug handling

- For every reported bug, identify and strengthen the earliest deterministic
  gate that should have caught it.
- Address the broader failure pattern so same-pattern defects are prevented by
  construction or a generalized gate; an instance-only patch is incomplete
  unless the pattern is irreducible and reported.
- Do not claim bug-free behavior; report verified scope and residual risk.
