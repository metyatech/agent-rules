# Rule system

## Compliance vocabulary

RFC 2119 / RFC 8174 keywords carry their RFC meanings. Omitted
keywords mean MUST.

## Composition

- The agent MUST NOT edit `AGENTS.md` or `CLAUDE.md` directly; they are composed outputs.
- A repository using this rule system MUST include `agent-ruleset.json` with `source` and `domains`.
- A consuming repository MUST list only profile-selected domains in its ruleset; it MUST NOT list extra/local rule files directly.
- Profiles MUST be defined in `agent-profiles.json` at the rules source root.
- Domains under `rules/domains/<domain>/` are internal rule groupings selected by profiles.
- Project-specific rule files under `agent-rules-local/` MUST NOT be used. A rule that is reusable belongs in `agent-rules`; a truly private rule belongs in a private rules source.
- compose-agentsmd procedures live in `compose-agentsmd/tools/tool-rules.md`.

## Authoring rules

- Rules MUST be MECE: each obligation appears in exactly one
  module. Cross-reference rather than duplicate.
- Each rule MUST be atomic, imperative, use explicit or implied
  compliance keywords, and be testable as a yes/no check without
  outside context. Rules MUST NOT contain hedges such as
  "ideally", "reasonable", or "perhaps".
- Placement: `rules/global/` for any-workspace rules; `rules/domains/<domain>/` for profile-selected rules; `agent-profiles.json` for mapping profiles to domains.
- When updating a rule, encode the underlying general principle,
  not the surface example. Trace the update back to the reasoning
  error that permitted the original mistake.
- Persistent user instructions MUST be encoded in the appropriate
  rule module in the same change set unless explicitly scoped to
  the current task. In delegated mode, the agent MUST NOT modify
  rules; report gaps to the delegator.
- Session memory resets between sessions. Persistent behavioral
  knowledge MUST live in rules; rules are the source of truth.

## Mechanisation of rules

- When a rule's compliance can be verified deterministically from
  source or build artefacts, the agent MUST implement the check in
  a lint, schema, type system, or hook. Deterministic checks MUST
  run in the authoring pipeline so violations surface without
  relying on recall.
- Before adding a new rule, decide whether it is mechanically
  checkable; if so, ship the check in the same change set. When
  editing a rule, migrate any mechanically checkable subset into a
  system check in the same change set.
