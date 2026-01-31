# Rule composition and maintenance

## Scope and composition

- AGENTS.md is self-contained; do not rely on parent/child AGENTS for inheritance or precedence.
- Maintain shared rules centrally and compose per project; use project-local rules only for truly local policies.
- Place AGENTS.md at the project root; only add another AGENTS.md for nested independent projects.

## Update policy

- Never edit AGENTS.md directly; update source rules and regenerate AGENTS.md.
- A request to "update rules" means: update the appropriate rule module and ruleset, then regenerate AGENTS.md.
- If the user gives a persistent instruction (e.g., "always", "must"), encode it in the appropriate module (global vs local).
- When acknowledging a new persistent instruction, update the rule module in the same change set and regenerate AGENTS.md.
- When creating a new repository, set up rule files (e.g., agent-ruleset.json and any local rules) so compose-agentsmd can run.
- When updating rules, infer the core intent; if it is a global policy, record it in global rules rather than project-local rules.
- If a task requires domain rules not listed in agent-ruleset.json, update the ruleset to include them and regenerate AGENTS.md before proceeding.
- When rule changes produce a diff, include it in the final response unless the user explicitly asks to omit it.

## Editing standards

- Keep rules MECE, concise, and non-redundant.
- Use short, action-oriented bullets; avoid numbered lists unless order matters.
- Prefer the most general applicable rule to avoid duplication.
