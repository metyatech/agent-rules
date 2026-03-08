# Quality and delivery gates

Non-negotiable gates for any state-changing work or any claim of "done", "fixed", "working", or "passing".

1. **BEFORE** state-changing work: list AC as binary, testable statements (aim 1-3 items).
2. **BEFORE** each git commit: repo's full verification suite must pass.
3. **WITH** each AC: define verification evidence (automated test preferred).
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
- Never claim bug-free behavior. Report scope, evidence, and residual risk explicitly.

## Re-requesting AI reviews

- For AI review bots, always follow the specific re-triggering procedures defined in the pr-review-workflow skill (e.g., API sequences for Copilot, comments for Codex).

Detailed evidence format and procedures are in the quality-workflow skill.
