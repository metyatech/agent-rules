# Delivery hard gates

These are non-negotiable completion gates for feature work and bugfixes.

## Acceptance criteria (AC)

- Before implementation, list Acceptance Criteria (AC) as binary, testable statements.
- If AC are ambiguous or not testable, ask blocking questions before proceeding.

## Evidence and verification

- For each AC, define verification evidence (automated test preferred; otherwise a deterministic manual procedure).
- Maintain an explicit mapping: `AC -> evidence (tests/commands/manual steps)`.
- Bugfixes MUST include a regression test that fails before the fix and passes after.
- Run the repo's full verification suite (lint/format/typecheck/test/build) using repo-standard commands.
- If required checks cannot be run, stop and ask for explicit approval to proceed with partial verification, and provide an exact manual verification plan.

## Final response (MUST include)

- AC list.
- `AC -> evidence` mapping with outcomes (PASS/FAIL/NOT RUN).
- The exact verification commands executed and their outcomes.
