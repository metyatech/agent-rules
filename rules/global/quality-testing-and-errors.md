# Quality, testing, and error handling

For AC definition, verification evidence, regression tests, and final reporting, see Delivery hard gates.

- Quality (correctness, safety, robustness, verifiability) > speed/convenience.
- If full-suite scope is unclear, run repo-default verify/CI commands rather than guessing.
- CI must run the full suite on PRs and default-branch pushes; require passing checks for merges; add CI if missing.
- Commit-time hooks must run full verify and block commits; confirm hooks installed before first commit in a session.
- Never disable checks, weaken assertions/types, or add retries solely to make checks pass.
- Test-first: add/update tests, observe failure, implement fix, observe pass.
- Never swallow errors; fail fast with explicit errors reflecting actual state and input context.
- Validate config/external inputs at boundaries with actionable failure guidance.

Detailed CI setup, environment constraints, test practices, and error handling procedures are in the `quality-workflow` skill.
