# Rule and skill system

## Compliance vocabulary

RFC 2119 / RFC 8174 keywords carry their RFC meanings. Omitted
keywords mean MUST.

## Composition

- The agent MUST NOT edit `AGENTS.md` directly; it is composed
  output and MUST be self-contained at the repository root.
- A new repository MUST include `agent-ruleset.json`, compose
  AGENTS.md, and satisfy the required global standards before
  being reported complete.
- compose-agentsmd procedures live in
  `compose-agentsmd/tools/tool-rules.md`.

## Authoring rules

- Rules MUST be MECE: each obligation appears in exactly one
  module. Cross-reference rather than duplicate.
- Each rule MUST be atomic, imperative, use explicit or implied
  compliance keywords, and be testable as a yes/no check without
  outside context. Rules MUST NOT contain hedges such as
  "ideally", "reasonable", or "perhaps".
- Placement: `rules/global/` for any-workspace rules;
  `rules/domains/<domain>/` for opt-in domains;
  `agent-rules-local/` for single-repo rules.
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

## Authoring skills

- A skill MUST follow the Agent Skills open standard. `SKILL.md`
  frontmatter MUST contain only `name` and `description`; `name`
  MUST be lowercase alphanumeric with hyphens, at most 64
  characters; `description` MUST explain trigger conditions.
- `SKILL.md` MUST be platform-agnostic and use intent-level
  wording; platform-specific examples MUST live in `README.md`.
  `SKILL.md` and `README.md` SHOULD be in English.
- Skill instructions MUST be concise and action-oriented. A skill
  MUST NOT duplicate AGENTS.md global rules; reference the rule
  module by name instead.

## Skill packaging and updates

- Each skill MUST live in its own `metyatech/skill-<name>`
  repository with `SKILL.md` at the root, a LICENSE file
  (MIT preferred), and public visibility.
- The GitHub repository is the canonical source of truth.
  The agent MUST NOT edit installed copies under
  `~/.agents/skills/<name>`; push to the source and re-install
  via `npx skills add metyatech/skill-<name> --yes --global`.
