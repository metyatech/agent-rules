# Skill authoring standards

This module governs the authoring, packaging, and installation of agent
skills.

## Authoring

- A skill MUST follow the Agent Skills open standard
  (agentskills.io/specification).
- A `SKILL.md` file MUST contain only `name` and `description` in its
  frontmatter.
- The `name` MUST be lowercase alphanumeric with hyphens, at most 64
  characters.
- The `description` MUST explain the trigger conditions under which the
  skill applies.
- The body of `SKILL.md` MUST be platform-agnostic. The author MUST NOT
  name platform-specific tools or commands in `SKILL.md`; intent-level
  wording is required.
- Platform-specific examples MUST live in `README.md`, not in `SKILL.md`.
- `SKILL.md` and `README.md` MUST be written in English.
- Skill instructions MUST be concise and action-oriented and MUST use the
  compliance vocabulary defined in `rule-system`.
- A skill MUST NOT duplicate rules already defined in AGENTS.md global
  rules. The skill MUST reference the relevant rule module by name
  instead.

## Packaging

- Each skill MUST live in its own repository with `SKILL.md` at the
  repository root.
- User-managed installable skills MUST live in public
  `metyatech/skill-<name>` repositories.
- Each skill repository MUST include a LICENSE file (MIT preferred) and
  MUST default to public visibility.

## Installation and updates

- The GitHub `metyatech/skill-*` repository is the canonical source of
  truth for any installed skill. Installed copies under
  `~/.agents/skills/<name>` are derived mirrors.
- The agent MUST NOT edit installed skill copies. To update a skill, the
  agent MUST edit the source repository, push, and re-install via
  `npx skills add metyatech/skill-<name> --yes --global`.
