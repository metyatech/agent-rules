# Rule composition and maintenance

## Scope and composition

- AGENTS.md is self-contained; do not rely on parent/child AGENTS for inheritance or precedence.
- Maintain shared rules centrally and compose per project; use project-local rules only for truly local policies.
- Place AGENTS.md at the project root; only add another AGENTS.md for nested independent projects.
- Before doing any work in a repository that contains `agent-ruleset.json`, run `compose-agentsmd` in that repository to refresh its AGENTS.md and ensure rules are current.

## AGENTS.md freshness

- Pre-commit hooks should run `compose-agentsmd --compose` and stage any AGENTS.md changes automatically. Do not fail the commit on AGENTS.md drift; let the updated file be included in the commit.
- Do not add AGENTS.md freshness checks to CI. AGENTS.md is generated from external rule sources; checking it in CI creates cross-repo coupling. Pre-commit hooks are sufficient.

## Update policy

- Never edit AGENTS.md directly; update source rules and regenerate AGENTS.md.
- A request to "update rules" means: update the appropriate rule module and ruleset, then regenerate AGENTS.md.
- If the user gives a persistent instruction (e.g., "always", "must"), encode it in the appropriate module (global vs local).
- When acknowledging a new persistent instruction, update the rule module in the same change set and regenerate AGENTS.md.
- When creating a new repository, verify that it meets all applicable global rules before reporting completion: rule files and AGENTS.md, CI workflow, linting/formatting, community health files, documentation, and dependency scanning. Do not treat repository creation as complete until full compliance is verified.
- When updating rules, infer the core intent; if it is a global policy, record it in global rules rather than project-local rules.
- If a task requires domain rules not listed in agent-ruleset.json, update the ruleset to include them and regenerate AGENTS.md before proceeding.
- Do not include composed `AGENTS.md` diffs in the final response unless the user explicitly asks for them.

## Editing standards

- Keep rules MECE, concise, and non-redundant.
- Use short, action-oriented bullets; avoid numbered lists unless order matters.
- Prefer the most general applicable rule to avoid duplication.
- Write rules as clear directives that prescribe specific behavior ("do X", "always Y", "never Z"). Do not use hedging language ("may", "might", "could", "consider") — if a behavior is required, state it as a requirement; if it is not required, omit it.
- Do not use numeric filename prefixes (e.g., `00-...`) to impose ordering; treat rule modules as a flat set. If ordering matters, encode it explicitly in composition/tooling rather than filenames.

## Rule placement (global vs domain)

- Decide rule placement based on **where the rule is needed**, not what topic it covers.
- If the rule could be needed from any workspace or repository, make it global.
- Only use domain rules when the rule is strictly relevant inside repositories that opt in to that domain.
- Before choosing domain, verify: "Will this rule ever be needed when working from a workspace that does not include this domain?" If yes, make it global.

## Size budget

- Global rules total: ≤350 lines. Individual module: ≤30 lines (soft target).
- Exceeding the budget signals procedural content that belongs in a skill; extract before merging.

## Rules vs skills

- **Rules** = invariants/constraints (always loaded, concise). **Skills** = procedures/workflows (on-demand, detailed). When a rule grows with procedural content, extract to a skill.
