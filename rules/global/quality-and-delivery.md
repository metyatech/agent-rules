# Quality and delivery gates

Non-negotiable gates for any state-changing work or any claim of "done", "fixed", "working", or "passing".

1. **BEFORE** state-changing work: list AC as binary, testable statements.
2. **BEFORE** each git commit: repo's full verification suite must pass.
3. **WITH** each AC: define verification evidence.
4. **FOR** code/runtime changes: automated tests required. Bugfixes MUST include a regression test.
5. **ALWAYS**: run repo-standard verify command; if missing, add it.
6. **IN** final response: AC -> evidence mapping with outcomes and verification commands.

## Quality principles

- Quality (correctness, safety, robustness, verifiability) > speed/convenience.
- CI must run full suite on PRs/pushes; require passing checks for merges; add CI if missing.
- Commit-time hooks must run full verify and block commits; confirm hooks installed.
- Test-first: add/update tests, observe failure, implement fix, observe pass.
- Never swallow errors; fail fast with explicit context.
- Validate config/external inputs at boundaries.
- For user-facing apps, perform deterministic runtime verification before completion.
- For GUI/UX changes, include a first-use walkthrough against the primary user goal; functional E2E alone is insufficient when clarity/usability is in scope.
- If the user still reports a GUI flow as confusing, treat that as a failed acceptance gate: refine labels/order/flow and add a regression check for that confusion class before concluding.
- For GUI/UX changes, add automated checks for horizontal overflow, clipping, unintended compact-control wrapping, and primary-state visibility where feasible; major visual changes must also be reviewed from screenshots, not code alone.
- For GUI work, do not conclude from functional correctness alone: require screenshot-based review plus automated checks for horizontal overflow, clipping, unintended compact-control wrapping, and clearly visible current-selection/source-target state where feasible.
- Never claim bug-free behavior. Report scope, evidence, and residual risk explicitly.

- For AI review bots, follow the re-triggering procedures in the `pr-review-workflow` skill.

Detailed evidence format and procedures are in the quality-workflow skill.
