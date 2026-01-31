# Quality, testing, and error handling

## Quality priority

- Quality (correctness, safety, robustness, verifiability) takes priority over speed or convenience.

## Verification

- Run the smallest relevant set of lint/typecheck/test/build checks using repo-standard commands.
- Before committing code changes, run lint/test/build; if any are missing, add them in the same change set.
- Ensure commit-time automation (pre-commit or repo-native) runs lint/test/build for code changes when feasible.
- If required checks cannot be run, explain why and list the exact commands for the user.

## Tests (behavior changes)

- Follow test-first: add/update tests and observe failure before implementing fixes.
- Add/update automated tests for behavior changes and regression coverage.
- Cover success, failure, boundary, invalid input, and key state transitions; include representative concurrency/retry/recovery when relevant.
- Keep tests deterministic; minimize time/random/external I/O; inject when needed.
- For deterministic output files, use full-content snapshot/golden tests.

## Exceptions

- If required tests are impractical, document the coverage gap, provide a manual verification plan, and get explicit user approval before skipping.

## Error handling and validation

- Never swallow errors; fail fast or return early with explicit errors.
- Error messages must reflect actual state and include relevant input context.
- Validate config and external inputs at boundaries; fail with actionable guidance.
- Log minimally but with diagnostic context; never log secrets or personal data.
