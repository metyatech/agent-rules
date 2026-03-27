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
- For systems whose primary behavior depends on multiple clients, environments,
  or handoff paths, define the claimed primary path matrix up front and make
  automated verification of each claimed primary path a completion gate, using
  the least-cost faithful layer that exercises the boundary.
- For systems whose behavior depends on persisted or carried state across runs
  or handoffs (for example local storage, cookies, caches, saved sessions, URL
  tokens, reconnect state, or server restarts), define the claimed primary state
  matrix up front and make automated verification of fresh-state, resumed-state,
  and stale-state transitions a completion gate for each affected primary path.
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
- For GUI work, include a first-use walkthrough against the primary user goal,
  and do not conclude from functional correctness alone: require
  screenshot-based review plus automated checks for overflow, clipping,
  wrapping, non-occluded required content/controls, preserved user
  position/selection across background refreshes, and clearly visible
  primary/current state where feasible; if the user still reports confusion,
  treat that as a failed acceptance gate and add a regression check for that
  confusion class before concluding.
- For GUI work that affects first-use flow, information hierarchy, navigation,
  or user guidance, require a separate agent review before concluding; the
  reviewer must assess the rendered UI from the primary user goal and report
  whether the next action and result location are immediately understandable.
- For GUI work, perform a whole-screen plausibility review: if the result would
  look obviously wrong, broken, or visually incoherent to a reasonable user at a
  glance, treat it as unfinished even when tests pass.
- For runtime verification of user-facing systems, perform a QA-grade
  adversarial pass, not just happy-path smoke tests: exercise interruptions,
  retries, reload/reopen, repeated actions, invalid or partial inputs, stale
  carried state, and cross-client/path transitions relevant to the claimed
  behavior before concluding.
- On every user-reported bug, identify the earliest deterministic gate that
  should have caught it and add or strengthen that gate in the same change set
  before concluding; a fix without a new catching gate is incomplete.
- For GUI states that intentionally block progress (for example auth walls,
  modal dialogs, overlays, loading covers, or permission prompts), treat each
  blocking state as a primary UI state and verify at every primary viewport that
  it visually dominates, suppresses background interaction, and keeps the next
  action obvious.
- Never claim bug-free behavior. Report scope, evidence, and residual risk
  explicitly, and do not let external checks or reviews justify concluding while
  a known gap against the requested outcome remains.
- For AI review bots, follow the re-triggering procedures in the
  `pr-review-workflow` skill. Detailed evidence format and procedures are in the
  quality-workflow skill.
