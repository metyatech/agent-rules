# Rule and skill system

## Compliance vocabulary

RFC 2119 / RFC 8174 keywords carry their RFC meanings.
Omitted keywords mean MUST.

## Composition

- The agent MUST NOT edit `AGENTS.md` directly. It is composed
  output and MUST be self-contained at the repository root.
- A new repository MUST include `agent-ruleset.json`, compose
  AGENTS.md, and satisfy the required global standards before
  being reported complete.
- compose-agentsmd procedures live in
  `compose-agentsmd/tools/tool-rules.md`.

## Authoring rules

- Rules MUST be MECE: each obligation appears in exactly one
  module. Cross-reference rather than duplicate.
- Each rule MUST be atomic, imperative, use explicit or
  implied compliance keywords, and be testable as a yes/no
  check without outside context.
- Rules MUST NOT contain hedges such as "ideally", "reasonable",
  or "perhaps". Replace them with explicit conditions.
- Placement: `rules/global/` for any-workspace rules;
  `rules/domains/<domain>/` only for opt-in domains;
  `agent-rules-local/` only when no other repository will need
  it.
- When updating a rule, encode the underlying general
  principle, not the incident-specific surface example. Trace
  each update back to the reasoning error that permitted the
  original mistake.
- Persistent user instructions about future agent behavior MUST
  be encoded in the appropriate rule module in the same change
  set unless explicitly scoped to the current task.
- Treat rule/skill gaps, redundancy, misplacement, and
  recurring review feedback as systemic; fix the underlying
  issue and similar instances in the same change set.
- In delegated mode, the agent MUST NOT modify rules directly;
  report rule-gap suggestions to the delegator.
- Session memory resets between sessions. Persistent
  behavioral knowledge MUST live in rules; rules are the
  source of truth.

## Mechanisation of rules

- When a rule's compliance can be verified deterministically
  from the source or build artefacts (AST shape, prop
  presence, lexical patterns, file paths, schema conformance,
  numeric bounds), the agent MUST implement the check in a
  lint, schema, type system, or hook rather than as a written
  rule. Deterministic checks MUST run in the authoring
  pipeline (dev server, pre-commit, or CI) so violations
  surface without relying on human or agent recall.
- Written rules MUST be limited to (a) principles explaining
  why a system check exists, (b) judgement-based guidance
  that no deterministic check can capture, and (c) short
  cross-references to the system that enforces the rule.
- Before adding a new rule, the agent MUST decide whether it
  is mechanically checkable. If it is, the agent MUST ship
  the check in the same change set; text alone is not a
  complete delivery.
- When editing an existing written rule, the agent MUST
  migrate any mechanically checkable subset into a system
  check in the same change set and reduce the remaining text
  to the judgement-only residue.
- Skills follow the same division: reserve `SKILL.md` for
  principles and judgement guidance; push every deterministic
  check into the matching platform package, linter, or
  schema.

## Authoring skills

- A skill MUST follow the Agent Skills open standard.
- `SKILL.md` frontmatter MUST contain only `name` and
  `description`; `name` MUST be lowercase alphanumeric with
  hyphens and at most 64 characters; `description` MUST explain
  trigger conditions.
- `SKILL.md` MUST be platform-agnostic, use intent-level
  wording, and omit platform-specific tool names. Such
  examples MUST live in `README.md`.
- `SKILL.md` and `README.md` SHOULD be in English. Reference
  content MAY use the user's language when preserving direct
  linkage to user-facing artifacts.
- Skill instructions MUST be concise and action-oriented.
  Normative claims SHOULD use the compliance vocabulary.
- A skill MUST NOT duplicate AGENTS.md global rules; reference
  the rule module by name instead.

## Skill packaging and updates

- Each skill MUST live in its own repository with `SKILL.md`
  at the repository root. User-managed installable skills MUST
  live in public `metyatech/skill-<name>` repositories. Each
  skill repository MUST include a LICENSE file (MIT preferred)
  and MUST default to public visibility.
- The GitHub `metyatech/skill-*` repository is the canonical
  source of truth. Installed copies under
  `~/.agents/skills/<name>` are derived mirrors.
- The agent MUST NOT edit installed skill copies. Edit the
  source repository, push, and re-install via
  `npx skills add metyatech/skill-<name> --yes --global`.
