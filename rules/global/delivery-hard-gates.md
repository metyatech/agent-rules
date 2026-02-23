# Delivery hard gates

These are non-negotiable completion gates for any state-changing work and for any response that claims "done", "fixed", "working", or "passing".

## Acceptance criteria (AC)

- Before state-changing work, list Acceptance Criteria (AC) as binary, testable statements.
- For read-only tasks, AC may be deliverables/questions answered; keep them checkable.
- If AC are ambiguous or not testable, ask blocking questions before proceeding.
- Keep AC compact by default (aim: 1-3 items). Expand only when risk/complexity demands it or when the requester asks.

## Evidence and verification

- Do not run `git commit` until the repo's full verification command has passed in the current working tree. This applies to every commit, not only the final delivery.
- For each AC, define verification evidence (automated test preferred; otherwise a deterministic manual procedure).
- Maintain an explicit mapping: `AC -> evidence (tests/commands/manual steps)`.
- The mapping may be presented in a compact per-item form (one line per AC including evidence + outcome) to reduce verbosity.
- For code or runtime-behavior changes, automated tests are required unless the requester explicitly approves skipping.
- Bugfixes MUST include a regression test that fails before the fix and passes after.
- Run the repo's full verification suite (lint/format/typecheck/test/build) using a single repo-standard `verify` command when available; if missing, add it.
- Enforce verification locally via commit-time hooks (pre-commit or repo-native) and in CI; skipping requires explicit requester approval.
- For non-code changes, run the relevant subset and justify.
- If required checks cannot be run, stop and ask for explicit approval to proceed with partial verification, and provide an exact manual verification plan.

## Final response (MUST include)

- A compact goal+verification report. Labels may be `Goal`/`Verification` instead of `AC` as long as it is equivalent.
- `AC -> evidence` mapping with outcomes (PASS/FAIL/NOT RUN/N/A), possibly in compact per-item form.
- The exact verification commands executed and their outcomes.
