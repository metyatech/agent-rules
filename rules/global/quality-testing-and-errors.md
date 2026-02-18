# Quality, testing, and error handling

For AC definition, verification evidence, regression tests, and final reporting requirements, see Delivery hard gates.

## Quality priority

- Quality (correctness, safety, robustness, verifiability) takes priority over speed or convenience.

## Verification

- If you are unsure what constitutes the full suite, run the repo's default verify/CI commands rather than guessing.
- Enforce via CI: run the full suite on pull requests and on pushes to the default branch, and make it a required status check for merges; if no CI harness exists, add one using repo-standard commands.
- Configure required status checks on the default branch when you have permission; otherwise report the limitation.
- Do not rely on smoke-only gating or scheduled-only full runs for correctness; merges must require the full suite.
- Ensure commit-time automation (pre-commit or repo-native) runs the full suite and blocks commits.
- Never disable checks, weaken assertions, loosen types, or add retries solely to make checks pass.
- If the execution environment restricts test execution (no network, no database, sandboxed), run the available subset, document what was skipped, and ensure CI covers the remainder.

## Tests (behavior changes)

- Follow test-first: add/update tests, observe failure, implement the fix, then observe pass.
- Cover success, failure, boundary, invalid input, and key state transitions (including first-run/cold-start vs subsequent-run behavior when relevant); include representative concurrency/retry/recovery when relevant.
- Keep tests deterministic; minimize time/random/external I/O; inject when needed.
- For deterministic output files, use full-content snapshot/golden tests.
- Prefer making nondeterministic failures reproducible over adding sleeps/retries; do not mask flakiness.
- For timing/order/race issues, prefer deterministic synchronization (events, versioned state, acks/handshakes) over fixed sleeps.
- If a heuristic wait is unavoidable, it MUST be condition-based with a hard deadline and diagnostics, and requires explicit requester approval.
- For integration boundaries (network/DB/external services/UI flows), add an integration/E2E/contract test that exercises the boundary; avoid unit-only coverage for integration bugs.
- For non-trivial changes, create a small test matrix (scenarios × inputs × states) and cover the highest-risk combinations; document intentional gaps.

## Feedback loops and root causes

- Treat time-to-detect and time-to-fix as quality attributes; shorten the feedback loop with automation and observability rather than relying on manual QA.
- For any defect fix or incident remediation, perform a brief root-cause classification: implementation mistake, design deficit, and/or ambiguous/incorrect requirements.
- Feed the root cause upstream in the same change set: add or tighten tests/checks/alerts, update specs/acceptance criteria, and update design docs/ADRs when applicable.
- If the failure should have been detected earlier, add a gate at the earliest reliable point (lint/typecheck/tests/CI required checks or runtime alerts/health checks); skipping this requires explicit user approval.
- Record the prevention mechanism (what will catch it next time) in the PR description or issue comment; avoid "fixed" without a concrete feedback-loop improvement.

## Exceptions

- If required tests are impractical, document the coverage gap, provide a manual verification plan, and get explicit user approval before skipping.

## Error handling and validation

- Never swallow errors; fail fast or return early with explicit errors.
- Error messages must reflect actual state and include relevant input context.
- Validate config and external inputs at boundaries; fail with actionable guidance.
- Log minimally but with diagnostic context; never log secrets or personal data.
- Remove temporary debugging/instrumentation before the final patch.
