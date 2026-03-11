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
- Before implementation is considered complete, define the claimed runtime environment matrix and verify every claimed environment directly; anything not directly verified must be reported as unverified or unsupported, never implied as covered.
- Prefer the least costly faithful verification environment: use automated tests, local or production-like environments, emulators, and simulators whenever they provide equivalent coverage; require real devices or live environments only for behaviors that cannot be validated faithfully otherwise.
- For authentication, billing, authorization, or data-persistence changes, completion requires end-to-end verification in a live or production-like deployed environment, including post-deploy smoke coverage of the critical user journey.
- For critical systems, passing unit/integration tests, CI, build, and health checks is necessary but insufficient; do not conclude until runtime user flows succeed in each claimed environment.
- When an intended environment cannot be exercised with available tools or access, stop short of a completion claim, state the exact gap, and treat that environment as out of scope until verified.
- For GUI/UX changes, include a first-use walkthrough against the primary user goal; functional E2E alone is insufficient when clarity/usability is in scope.
- If the user still reports a GUI flow as confusing, treat that as a failed acceptance gate: refine labels/order/flow and add a regression check for that confusion class before concluding.
- For GUI work, do not conclude from functional correctness alone: require screenshot-based review plus automated checks for horizontal overflow, clipping, unintended compact-control wrapping, and clearly visible primary/current state where feasible.
- Never claim bug-free behavior. Report scope, evidence, and residual risk explicitly.
- For AI review bots, follow the re-triggering procedures in the `pr-review-workflow` skill.

Detailed evidence format and procedures are in the quality-workflow skill.
