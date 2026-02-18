# Skill authoring standards

## SKILL.md format (Agent Skills open standard)

- Follow the Agent Skills open standard (agentskills.io/specification).
- SKILL.md frontmatter must contain only `name` and `description`; do not add platform-specific fields.
- `name`: lowercase alphanumeric and hyphens only, max 64 characters.
- `description`: explain when the skill should and should not trigger; this is the only text used for skill selection.

## Platform independence

- SKILL.md body must be platform-agnostic: do not reference platform-specific tool names
  (e.g., `Task`, `TeamCreate`, `codex exec`, Cursor-specific APIs).
- Write instructions in terms of intent ("launch a background agent", "track tasks",
  "create a team") and let each agent use its own tools.
- Platform-specific invocation examples (`/skill` for Claude Code, `$skill` for Codex)
  belong in README.md, not in SKILL.md.

## Distribution

- Each skill lives in its own repository.
- Use clear, descriptive repository names (e.g., `skill-manager`).
- Keep SKILL.md at the repository root for `npx skills add` compatibility.
- Install and manage skills via `npx skills add <owner>/<repo>` (vercel-labs/skills);
  do not build custom installers.

## Publishing

- Default to public repositories so skills are installable by anyone
  via `npx skills add`.
- Write SKILL.md and README.md with external users in mind:
  assume no prior knowledge of internal conventions.
- Include a LICENSE file (prefer MIT).

## Content guidelines

- Write SKILL.md body and README.md in English (developer-facing).
- Keep instructions concise, action-oriented, and testable.
- Do not duplicate rules already covered by AGENTS.md global rules
  (e.g., TDD, verification, planning gates); reference them instead.
