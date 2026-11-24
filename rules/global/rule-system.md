# Rule system

RFC 2119 / RFC 8174 keywords carry their RFC meanings; omitted compliance
keywords mean MUST.

## Composition

- Never edit generated `AGENTS.md` or `CLAUDE.md` directly.
- Consumers MUST declare ordered `sources` and `profile` in `agent-ruleset.json`;
  source-side `agent-profiles.json` selects domains. MUST NOT use legacy
  `source`, `domains`, or `extra` config or `agent-rules-local` files.
- Put reusable rules in appropriate shared sources; keep truly private rules in
  private sources. compose-agentsmd procedures: `compose-agentsmd/tools/tool-rules.md`.

## Authoring

- Rules MUST be MECE (one obligation/module; cross-reference, not duplicate),
  atomic, imperative, yes/no-testable, and unhedged. Review existing coverage:
  prefer revising, merging, or deleting redundant or obsolete rules over adding.
  Add only if existing rules and sound judgment are insufficient and the benefit
  justifies token and maintenance cost. Preserve necessary obligations.
- Put any-workspace rules in `rules/global/` and selective rules in
  `rules/domains/<domain>/`; encode principles, not surface examples.
- Persistent user instructions MUST use appropriate modules unless task-scoped.
  In delegated mode, change rules only with explicit delegation; otherwise report
  the gap to the delegator.
- Rules are the source of truth across sessions.

## Research provenance

- General prescriptions claiming improved human outcomes, learning, usability,
  quality, productivity, decision making, or behavior MUST have directly
  relevant empirical evidence before becoming rules.
- Prefer systematic reviews/meta-analyses; otherwise require strong, converging
  direct evidence matched to scope/population/task/outcome/strength/boundary
  conditions and material contrary evidence.
- Intuition, analogy, convention, logical derivation, or existing rules alone
  MUST NOT support general empirical prescriptions; indirect, mixed, or
  insufficient evidence MUST NOT be encoded as evidence-backed guidance.
- User-specific policy may be chosen without empirical support. Objective
  platform/API/tool contracts, deterministic invariants, law, safety requirements,
  and repo contracts may instead rely on authoritative sources.

## Mechanisation

- When source/build artifacts permit deterministic rule checks, enforce them
  with lint, schema, types, tests, or hooks instead of model recall.
- Add feasible deterministic checks with new rules; when editing a rule, migrate
  mechanically checkable subsets into system checks in the same change set.
