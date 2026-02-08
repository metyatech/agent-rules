# Superpowers integration

- If Superpowers skills are available in the current agent environment, use them to drive *how* you work (design, planning, debugging, TDD, review) instead of inventing an ad-hoc process.
- Do not duplicate Superpowers installation/usage instructions in this ruleset; follow Superpowers’ own guidance for loading/invoking skills.
- The hard gates in this ruleset still apply when using Superpowers workflows:
  - Before any state-changing work: present AC + AC->evidence + a plan, then wait for an explicit “yes”.
  - After changes: report AC -> evidence outcomes and the exact verification commands executed.
- When a Superpowers workflow asks for writing docs / commits / pushes, treat those as state-changing steps: include them in the plan and require explicit requester approval before doing them.
- If Superpowers skills are unavailable, proceed with these rules as the fallback.

