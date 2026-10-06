# Rule system

RFC 2119 / RFC 8174 keywords carry their RFC meanings; omitted compliance
keywords mean MUST.

## Composition

- `AGENTS.md` and `CLAUDE.md` are generated outputs and MUST NOT be edited
  directly.
- A consuming repository MUST declare its ordered `sources` and `profile` in
  `agent-ruleset.json`; source-side `agent-profiles.json` selects the domains.
  Legacy `source`, `domains`, `extra`, and `agent-rules-local` configuration
  MUST NOT be used.
- Reusable rules belong in the appropriate shared rules source; truly private
  rules belong in a private source. compose-agentsmd procedures live in
  `compose-agentsmd/tools/tool-rules.md`.

## Authoring

- Rules MUST be MECE: each obligation belongs in one module. Cross-reference
  rather than duplicate it.
- Rules MUST be atomic, imperative, and testable as yes/no obligations. Do not
  use hedges such as "ideally", "reasonable", or "perhaps".
- Put any-workspace obligations in `rules/global/`; put selectively applied
  rules in `rules/domains/<domain>/`.
- Encode the underlying general principle rather than a surface example.
- Persistent user instructions MUST be encoded in the appropriate rule module
  unless scoped to the current task. In delegated mode, do not modify rules;
  report the gap to the delegator.
- Rules are the source of truth across sessions.

## Research provenance

- A general prescription claiming improved human outcomes, learning,
  usability, quality, productivity, decision making, or behavior requires
  directly relevant empirical evidence before becoming a rule.
- Prefer systematic reviews or meta-analyses; otherwise require strong,
  converging direct evidence. Match evidence to the prescription's scope,
  population, task, outcome, strength, boundary conditions, and material
  contrary evidence.
- Intuition, analogy, convention, logical derivation, or an existing rule alone
  MUST NOT support a general empirical prescription. If evidence is indirect,
  mixed, or insufficient, do not encode it as evidence-backed guidance.
- Explicit user-specific policy may be encoded as chosen policy without
  empirical support. Objective platform/API/tool contracts, deterministic
  invariants, law, safety requirements, and repository contracts may use
  authoritative sources instead.

## Mechanisation

- When rule compliance can be checked deterministically from source or build
  artifacts, enforce it with lint, schema, types, tests, or hooks so violations
  do not depend on model recall.
- Add the deterministic check with a new rule when feasible; when editing an
  existing rule, migrate mechanically checkable subsets into system checks in
  the same change set.
