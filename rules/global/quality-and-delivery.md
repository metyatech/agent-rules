# Quality and delivery gates

Non-negotiable gates for any state-changing work or any claim of "done", "fixed", "working", or "passing".

1. **BEFORE** state-changing work: list AC as binary, testable statements (aim 1-3 items). Ask blocking questions if ambiguous.
2. **BEFORE** each `git commit`: repo's full verification suite must pass in the current working tree.
3. **WITH** each AC: define verification evidence (automated test preferred; deterministic manual procedure otherwise).
4. **FOR** code/runtime changes: automated tests required (requester may explicitly approve skipping). Bugfixes MUST include a regression test.
5. **ALWAYS**: run repo-standard `verify` command; if missing, add it. Enforce via commit-time hooks and CI.
6. **IN** final response: AC→evidence mapping with outcomes (PASS/FAIL/NOT RUN/N/A) and exact verification commands executed.

## Quality principles

- Quality (correctness, safety, robustness, verifiability) > speed/convenience.
- If full-suite scope is unclear, run repo-default verify/CI commands rather than guessing.
- CI must run the full suite on PRs and default-branch pushes; require passing checks for merges; add CI if missing.
- Commit-time hooks must run full verify and block commits; confirm hooks installed before first commit in a session.
- Never disable checks, weaken assertions/types, or add retries solely to make checks pass.
- Test-first: add/update tests, observe failure, implement fix, observe pass.
- Never swallow errors; fail fast with explicit errors reflecting actual state and input context.
- Validate config/external inputs at boundaries with actionable failure guidance.
- For user-facing applications, perform deterministic runtime verification before claiming completion; do not wait for the user to ask for manual or browser-level validation.
- For user-facing web applications, add automated end-to-end smoke coverage for the primary user journeys by default. If E2E is impractical, explain why, define the gap, and provide a deterministic manual verification plan.
- Never claim or imply bug-free or perfect behavior. Report verification scope, evidence, and residual risk explicitly.

Detailed evidence format, CI setup, test practices, and error handling procedures are in the `quality-workflow` skill.

## Re-requesting AI reviews

- When addressing feedback from AI review bots (Copilot, Codex, etc.), always follow the specialized re-triggering procedures defined in the pr-review-workflow skill (e.g., using the GitHub API to DELETE then POST the reviewer request) rather than generic mentions or simple UI-based requests. This ensures the bot's state is correctly reset and a new scan is initiated.
