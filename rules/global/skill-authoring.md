# Skill authoring standards

## Authoring

- A skill MUST follow the Agent Skills open standard
  (agentskills.io/specification).
- A `SKILL.md` frontmatter MUST contain only `name` and
  `description`.
- The `name` MUST be lowercase alphanumeric with hyphens, at most
  64 characters.
- The `description` MUST explain trigger conditions.
- The body of `SKILL.md` MUST be platform-agnostic; intent-level
  wording is required and platform-specific tool names MUST NOT
  appear.
- Platform-specific examples MUST live in `README.md`, not
  `SKILL.md`.
- `SKILL.md` and `README.md` MUST be written in English.
- Skill instructions MUST be concise and action-oriented and MUST
  use the compliance vocabulary defined in `rule-system`.
- A skill MUST NOT duplicate AGENTS.md global rules; reference the
  rule module by name instead.

## Packaging

- Each skill MUST live in its own repository with `SKILL.md` at the
  repository root.
- User-managed installable skills MUST live in public
  `metyatech/skill-<name>` repositories.
- Each skill repository MUST include a LICENSE file (MIT preferred)
  and MUST default to public visibility.

## Installation and updates

- The GitHub `metyatech/skill-*` repository is the canonical source
  of truth. Installed copies under `~/.agents/skills/<name>` are
  derived mirrors.
- The agent MUST NOT edit installed skill copies. To update a
  skill, edit the source repository, push, and re-install via
  `npx skills add metyatech/skill-<name> --yes --global`.
