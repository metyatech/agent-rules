# Rule composition and maintenance

- AGENTS.md is self-contained; place at project root. Shared rules centrally; project-local only for truly local policies.
- Before work in a repo with `agent-ruleset.json`, run `compose-agentsmd` to refresh AGENTS.md.
- Pre-commit hooks run `compose-agentsmd --compose` and auto-stage. Do not fail commits on drift or add freshness checks to CI.

## Update and editing

- Never edit AGENTS.md directly; update source rules and regenerate. "Update rules" = update module/ruleset, then regenerate.
- Persistent user instructions → encode in appropriate module (global vs local) in the same change set.
- New repos must meet all global rules (AGENTS.md, CI, linting, community health, docs, scanning) before reporting complete.
- Update rulesets for missing domain rules before proceeding. Omit AGENTS.md diffs unless asked.
- Infer core intent; prefer global over project-local. Keep rules MECE, concise, non-redundant, action-oriented ("do X", "never Z"). No hedging or numeric filename prefixes.
- Placement: based on where needed. Any-workspace → global; domain only for opt-in repos.

## Size budget

- Total ≤350 lines; per-module ≤30 (soft). Overage → extract procedural content to skills.
- **Rules** = invariants (always loaded, concise). **Skills** = procedures (on-demand, detailed).
