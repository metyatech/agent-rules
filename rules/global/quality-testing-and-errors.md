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

## Tests

- Follow test-first: add/update tests, observe failure, implement the fix, then observe pass.
- Keep tests deterministic; minimize time/random/external I/O; inject when needed.
- If a heuristic wait is unavoidable, it MUST be condition-based with a hard deadline and diagnostics, and requires explicit requester approval.

## Exceptions

- If required tests are impractical, document the coverage gap, provide a manual verification plan, and get explicit user approval before skipping.

## Error handling and validation

- Never swallow errors; fail fast or return early with explicit errors.
- Error messages must reflect actual state and include relevant input context.
- Validate config and external inputs at boundaries; fail with actionable guidance.
- Log minimally but with diagnostic context; never log secrets or personal data.
- Remove temporary debugging/instrumentation before the final patch.
