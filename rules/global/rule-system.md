# Rule and skill system

## Compliance vocabulary

RFC 2119 / RFC 8174 keywords carry their RFC meanings.
Omitted keywords mean MUST.

## Composition

- The agent MUST NOT edit `AGENTS.md` directly. AGENTS.md is
  the composed output of rule modules and a per-repository
  ruleset, and MUST be self-contained at the repository root.
- A new repository MUST include `agent-ruleset.json`, MUST
  compose AGENTS.md, and MUST satisfy the required global
  standards before reporting the repository as complete.
- compose-agentsmd procedures live in
  `compose-agentsmd/tools/tool-rules.md`.

## Authoring rules

- Rules MUST be MECE: each obligation appears in exactly one
  module. Cross-reference rather than duplicate.
- Each rule MUST be atomic (one bullet, one testable
  obligation), use the imperative mood with an explicit
  compliance keyword (or implied MUST), and be testable as a
  yes/no check without outside context.
- Rules MUST NOT contain hedges such as "ideally", "where
  appropriate", "reasonable", or "perhaps". Replace hedges with
  explicit conditions.
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
  set unless the user explicitly scopes the instruction to the
  current task.
- Treat rule/skill gaps, redundancy, misplacement, and
  recurring review feedback as systemic; fix the underlying
  issue and similar instances in the same change set.
- In delegated mode, the agent MUST NOT modify rules directly;
  report rule-gap suggestions to the delegator.
- Session memory resets between sessions. Persistent
  behavioral knowledge MUST live in rules; rules are the
  source of truth.

## Authoring skills

- A skill MUST follow the Agent Skills open standard
  (agentskills.io/specification). A `SKILL.md` frontmatter
  MUST contain only `name` and `description`. The `name` MUST
  be lowercase alphanumeric with hyphens, at most 64
  characters. The `description` MUST explain trigger
  conditions.
- The body of `SKILL.md` MUST be platform-agnostic; intent-level
  wording is required and platform-specific tool names MUST
  NOT appear. Platform-specific examples MUST live in
  `README.md`.
- `SKILL.md` and `README.md` SHOULD be written in English.
  Reference content (lookup tables, language-locked UI labels)
  MAY use the user's natural language when keeping the original
  preserves direct linkage to user-facing artifacts.
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
