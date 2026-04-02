# Quality and delivery gates

Non-negotiable gates for any state-changing work or any claim of "done",
"fixed", "working", or "passing".

1. **BEFORE** state-changing work: list AC as binary, testable statements.
2. **BEFORE** each git commit: repo's full verification suite must pass.
3. **WITH** each AC: define verification evidence.
4. **FOR** code/runtime changes: automated tests required. Bugfixes MUST include
   a regression test.
5. **ALWAYS**: run repo-standard verify command; if missing, add it.
6. **IN** final response: keep completion reporting concise by default. Maintain
   AC/evidence internally, and surface explicit AC/evidence sections only when
   the user requests them or when higher-priority rules require path-by-path
   accounting.

## Quality principles

- Quality (correctness, safety, robustness, verifiability) > speed/convenience.
- CI must run full suite on PRs/pushes; require passing checks for merges; add
  CI if missing.
- Commit-time hooks must run full verify and block commits; confirm hooks
  installed.
- Test-first: add/update tests, observe failure, implement fix, observe pass.
- Never swallow errors; fail fast with explicit context and validate
  config/external inputs at boundaries.
- For user-facing apps, perform deterministic runtime verification before
  completion, define the claimed runtime environment matrix, and prefer the
  least costly faithful verification environment that covers each claimed
  behavior.
- For multi-client, multi-environment, or persisted-state systems, define the
  claimed primary path/state matrix up front and verify each claimed primary
  path/state before concluding. Detailed matrix procedure belongs in
  `quality-workflow`.
- When evidence differs by client, environment, or path, report each claimed
  client/environment/path separately as verified, reproduced-as-limitation, or
  unverified; never generalize evidence across them.
- Anything not directly verified must be reported as unverified or unsupported;
  use real devices or live environments only when lower-cost faithful
  environments cannot validate the behavior.
- For authentication, billing, authorization, data persistence, and other
  critical systems, passing unit/integration tests, CI, build, and health checks
  is necessary but insufficient; completion requires live or production-like
  end-to-end verification of the critical user journey.
- If an intended environment cannot be exercised with available tools or access,
  stop short of a completion claim, state the exact gap, and leave that
  environment unclaimed until verified.
- For GUI work, completion requires first-use walkthrough, screenshot-based
  review, layout/state visibility checks, and a whole-screen plausibility pass;
  if the primary flow or next action is not immediately understandable, treat
  the work as unfinished. Detailed GUI verification procedure belongs in
  `quality-workflow`.
- For user-facing systems, runtime verification must go beyond happy-path smoke
  tests and cover relevant interruption, retry, reload, invalid-input, and
  stale-state behavior.
- On every user-reported bug, identify the earliest deterministic gate that
  should have caught it and add or strengthen that gate in the same change set
  before concluding; a fix without a new catching gate is incomplete.
- Never claim bug-free behavior. Report scope, evidence, and residual risk
  explicitly, and do not let external checks or reviews justify concluding while
  a known gap against the requested outcome remains.
- For AI review bots, follow the re-triggering procedures in the
  `pr-review-workflow` skill. Detailed evidence format and procedures are in the
  quality-workflow skill.
