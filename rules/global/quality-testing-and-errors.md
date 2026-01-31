# Quality, testing, and error handling

## Quality priority

- Quality (correctness, safety, robustness, verifiability) takes priority over speed or convenience.

## Verification and automation

- Run the smallest relevant set of lint/typecheck/test/build checks using repo-standard commands.
- Before any commit, run lint/test/build; if any are missing, add them in the same change set.
- Set up commit-time automation (pre-commit hook or repo-native equivalent) to run lint/test/build.
- If you cannot run a required check, explain why and list the exact commands for the user.
- For user-visible UI changes, verify in a real browser using agent-browser; if not possible, explain and provide manual steps.

## Tests (required for behavior changes)

- Follow test-first: add/update tests and observe failure before implementing fixes.
- Add/update automated tests for all behavior changes and add regression coverage.
- Cover success, failure, boundary, invalid input, and key state transitions; include representative concurrency/retry/recovery where relevant.
- Keep tests deterministic; minimize time/random/external I/O; inject when needed.
- For deterministic output files, use full-content snapshot/golden tests.
- When adding/changing links, add tests that verify the target resolves; if not feasible, document manual verification.

## E2E specifics

- Always add E2E tests for user-visible changes; if no harness exists, add one.
- Configure E2E to fail fast and avoid auto-opening browsers (headless/no-open).
- For Next.js E2E, prefer next build + next start.
- If Playwright tests fail to launch, clear playwright/.cache and retry.

## Exceptions

- If required tests are impractical, document the coverage gap, provide a manual verification plan, and get explicit user approval before skipping.

## Error handling and validation

- Never swallow errors; fail fast or return early with explicit errors.
- Error messages must reflect actual state and include relevant input context.
- Do not prompt without context; for yes/no prompts, Enter means "Yes" and n means "No".
- Validate config and external inputs at boundaries; fail with actionable guidance.
- Log minimally but with diagnostic context; never log secrets or personal data.
