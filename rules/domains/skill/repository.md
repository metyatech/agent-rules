# Skill Repository Rules

- A skill MUST follow the Agent Skills open standard.
- `SKILL.md` frontmatter MUST contain only `name` and `description`.
- `name` MUST be lowercase alphanumeric with hyphens, at most 64 characters.
- `description` MUST explain trigger conditions.
- `SKILL.md` MUST be platform-agnostic and use intent-level wording.
- Platform-specific examples MUST live in `README.md`.
- `SKILL.md` and `README.md` SHOULD be in English.
- Skill instructions MUST be concise and action-oriented.
- A skill MUST NOT duplicate AGENTS.md global rules.
- Each skill MUST live in its own `metyatech/skill-<name>` repository with `SKILL.md` at the root.
- Each skill repository MUST include a LICENSE file.
- Skill repositories SHOULD use the MIT license unless the user specifies otherwise.
- Skill repositories MUST be public unless the user explicitly asks for a private skill.
- The GitHub repository is the canonical source of truth for a skill.
- The agent MUST NOT edit installed copies under `~/.agents/skills/<name>`.