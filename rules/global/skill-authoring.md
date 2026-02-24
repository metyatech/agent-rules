# Skill authoring standards

- Follow the Agent Skills open standard (agentskills.io/specification).
- SKILL.md frontmatter: only `name` (lowercase alphanumeric + hyphens, max 64 chars) and `description` (explain trigger conditions).
- SKILL.md body must be platform-agnostic: no platform-specific tool names. Write in terms of intent.
- Platform-specific examples belong in README.md, not SKILL.md.
- Each skill lives in its own repository with SKILL.md at root.
- Install/manage via `npx skills add <owner>/<repo> --yes --global`.
- Default to public repositories; include a LICENSE file (prefer MIT).
- Write SKILL.md and README.md in English; keep instructions concise and action-oriented.
- Do not duplicate rules already covered by AGENTS.md global rules; reference them instead.
