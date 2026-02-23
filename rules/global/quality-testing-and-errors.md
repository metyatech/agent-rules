# Quality, testing, and error handling

For AC definition, verification evidence, regression tests, and final reporting requirements, see Delivery hard gates.

## Quality priority

- Quality (correctness, safety, robustness, verifiability) takes priority over speed or convenience.

## Verification

- If you are unsure what constitutes the full suite, run the repo's default verify/CI commands rather than guessing.
- Enforce via CI: run the full suite on pull requests and on pushes to the default branch, and make it a required status check for merges; if no CI harness exists, add one using repo-standard commands.
- Configure required status checks on the default branch when you have permission; otherwise report the limitation.
- Do not rely on smoke-only gating or scheduled-only full runs for correctness; merges must require the full suite.
- Ensure commit-time automation (pre-commit or repo-native) runs the full suite and blocks commits. This is a hard prerequisite: before making the first commit in a repository during a session, verify that pre-commit hooks are installed and functional; if not, install them before any other commits.
- If pre-commit hooks cannot be installed (environment restriction, no supported tool), manually run the repo's full verify command before every commit and confirm it passes; do not proceed to `git commit` until verify succeeds.
- Never disable checks, weaken assertions, loosen types, or add retries solely to make checks pass.
- If the execution environment restricts test execution (no network, no database, sandboxed), run the available subset, document what was skipped, and ensure CI covers the remainder.
- When delivering a user-facing tool or GUI, perform end-to-end manual verification (start the service, exercise each feature, confirm correct behavior) in addition to automated tests. Do not rely solely on unit tests for user-facing deliverables.
- When manual testing reveals issues or unexpected behavior, convert those findings into automated tests before fixing; the test must fail before the fix and pass after.
- The verify script must include a lock-file integrity check that catches manifest/lock-file drift locally, before CI. Verify that every dependency declared in the manifest has a corresponding entry in the lock file.

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
