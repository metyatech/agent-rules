# Quality, testing, and error handling

For AC definition, verification evidence, regression tests, and final reporting, see Delivery hard gates.

- Quality (correctness, safety, robustness, verifiability) takes priority over speed/convenience.

## Verification

- If full-suite scope is unclear, run repo-default verify/CI commands rather than guessing.
- CI must run the full suite on PRs and default-branch pushes, require passing status checks for merges; if no CI exists, add one. Do not rely on smoke-only or scheduled-only gates.
- Configure required default-branch checks when permitted; otherwise report the limitation.
- Commit-time automation must run full verify and block commits; before first commit in a session, confirm hooks are installed (install if needed). If impossible, run full verify manually before every commit.
- Never disable checks, weaken assertions/types, or add retries solely to make checks pass.
- If environment limits execution (network/db/sandbox), run the available subset, document skipped coverage, ensure CI covers the remainder.
- For user-facing tools/GUI, run end-to-end manual verification in addition to automated tests; when manual testing finds issues, add failing tests first, then fix.
- Verify scripts must enforce lock-file integrity (manifest/lock drift detection).

## Tests

- Test-first: add/update tests, observe failure, implement fix, observe pass.
- Keep tests deterministic; minimize time/random/external I/O via injection.
- Heuristic waits require condition-based logic, hard deadlines, diagnostics, and explicit requester approval.

## Error handling

- Never swallow errors; fail fast with explicit errors reflecting actual state and input context.
- Validate config/external inputs at boundaries with actionable failure guidance.
- Log minimally with diagnostic context; never log secrets/personal data; remove debugging instrumentation before final patch.
- If required tests are impractical, document the gap, provide manual verification plan, and get explicit approval.
