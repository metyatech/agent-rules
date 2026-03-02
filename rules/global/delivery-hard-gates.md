# Delivery hard gates

Non-negotiable gates for any state-changing work or any claim of "done", "fixed", "working", or "passing".

1. **BEFORE** state-changing work: list AC as binary, testable statements (aim 1-3 items). Ask blocking questions if ambiguous.
2. **BEFORE** each `git commit`: repo's full verification suite must pass in the current working tree.
3. **WITH** each AC: define verification evidence (automated test preferred; deterministic manual procedure otherwise).
4. **FOR** code/runtime changes: automated tests required (requester may explicitly approve skipping). Bugfixes MUST include a regression test.
5. **ALWAYS**: run repo-standard `verify` command; if missing, add it. Enforce via commit-time hooks and CI.
6. **IN** final response: AC→evidence mapping with outcomes (PASS/FAIL/NOT RUN/N/A) and exact verification commands executed.

Detailed evidence format, partial-verification procedures, and response templates are in the `quality-workflow` skill.
