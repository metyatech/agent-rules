# Quality, testing, and error handling

## Quality priority

- Quality (correctness, safety, robustness, verifiability) takes priority over speed or convenience.

## Definition of done

- Do not claim "fixed"/"done" unless it is verified by reproducing the issue and/or running the relevant checks.
- Prefer a green baseline: if relevant checks fail before you change anything, report it and get explicit user approval before proceeding.
- If you cannot reproduce/verify, do not guess a fix; request missing info or create a failing regression test.
- Always report verification: list the exact commands/steps run and their outcome; if anything is unverified, state why and how to verify.

## Verification

- Run the smallest relevant set of lint/typecheck/test/build checks the repo supports using repo-standard commands.
- If you are unsure what checks are relevant, run the repo's default full suite rather than guessing.
- Before committing code changes, run the applicable lint/test/build commands; if a relevant check is missing and feasible to add, add it in the same change set.
- Ensure commit-time automation (pre-commit or repo-native) runs applicable lint/test/build checks for code changes when feasible.
- If required checks cannot be run, explain why and list the exact commands for the user.
- Never disable checks, weaken assertions, loosen types, or add retries solely to make checks pass.

## Tests (behavior changes)

- Follow test-first: add/update tests, observe failure, implement the fix, then observe pass.
- For bug fixes, add a regression test that fails before the fix at the level where the bug occurs (unit/integration/E2E).
- Add/update automated tests for behavior changes and regression coverage.
- Cover success, failure, boundary, invalid input, and key state transitions (including first-run/cold-start vs subsequent-run behavior when relevant); include representative concurrency/retry/recovery when relevant.
- Keep tests deterministic; minimize time/random/external I/O; inject when needed.
- For deterministic output files, use full-content snapshot/golden tests.
- Prefer making nondeterministic failures reproducible over adding sleeps/retries; do not mask flakiness.
- For integration boundaries (network/DB/external services/UI flows), add an integration/E2E/contract test that exercises the boundary when feasible; avoid unit-only coverage for integration bugs.
- For non-trivial changes, create a small test matrix (scenarios × inputs × states) and cover the highest-risk combinations; document intentional gaps.

## Exceptions

- If required tests are impractical, document the coverage gap, provide a manual verification plan, and get explicit user approval before skipping.

## Error handling and validation

- Never swallow errors; fail fast or return early with explicit errors.
- Error messages must reflect actual state and include relevant input context.
- Validate config and external inputs at boundaries; fail with actionable guidance.
- Log minimally but with diagnostic context; never log secrets or personal data.
- Remove temporary debugging/instrumentation before the final patch.
