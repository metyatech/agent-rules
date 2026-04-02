# Rule composition and maintenance

- AGENTS.md is self-contained; place at project root. Shared rules centrally;
  project-local only for truly local policies.
- Before work in a repo with `agent-ruleset.json`, run `compose-agentsmd` to
  refresh AGENTS.md.
- Pre-commit hooks must run the repo's full verification suite, then
  `compose-agentsmd --compose`, then `git add AGENTS.md`. Do not fail commits on
  drift or add freshness checks to CI.

## Update and editing

- Never edit AGENTS.md directly; update source rules and regenerate. "Update
  rules" = update module/ruleset, then regenerate.
- Persistent user instructions, including requests about how the agent should
  behave in future interactions or sessions, are persistent by default; unless
  explicitly scoped to the current task/session, encode them in the appropriate
  module (global vs local) in the same change set.
- New repos must include `agent-ruleset.json`, compose `AGENTS.md`, and satisfy
  the required global repo standards before reporting complete.
- Update rulesets for missing domain rules before proceeding. Omit AGENTS.md
  diffs unless asked.
- Treat AGENTS.md diffs produced by compose-agentsmd as intentional updates: do
  not discard/revert them unless the requester explicitly asks to drop them.
- When the repository is git-managed, stage those intentional AGENTS.md updates
  normally (git add) unless the requester explicitly says to exclude them.
- Keep rules MECE, concise, non-redundant, and action-oriented; prefer global
  rules unless the policy is truly repo-local.
- When updating global rules, encode the underlying general principle rather
  than the incident-specific example; prefer the broadest wording that still
  gives clear action.
- Placement: based on where needed. Any-workspace → global; domain only for
  opt-in repos.

## Size budget

- Total ≤4500 tokens; per-module ≤400 tokens (soft, `o200k_base`). Overage →
  extract procedural content to skills.
- Keep invariants in rules; move procedures and checklists to skills.
