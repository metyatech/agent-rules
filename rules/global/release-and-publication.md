# Release and publication

- Include LICENSE in published artifacts (copyright holder: metyatech).
- Do not ship build/test artifacts or local configs; ensure a clean environment can use the product via README steps.
- Define a SemVer policy and document what counts as a breaking change.
- Keep package version and Git tag consistent.
- Run dependency security checks before release.
- Verify published packages resolve and run correctly before reporting done.

## Public repository metadata

- For public repos, set GitHub Description, Topics, and Homepage.
- Assign Topics from the standard set below. Every repo must have at least one standard topic when applicable; repos that do not match any standard topic use descriptive topics relevant to their domain.
  - `agent-skill`: repo contains a SKILL.md (an installable agent skill).
  - `agent-tool`: CLI tool or MCP server used by agents (e.g., task-tracker, agents-mcp, compose-agentsmd).
  - `agent-rule`: rule source or ruleset repository (e.g., agent-rules).
  - `unreal-engine`: Unreal Engine plugin or sample project.
  - `qti`: QTI assessment ecosystem tool or library.
  - `education`: course content, teaching materials, or student-facing platform.
  - `docusaurus`: Docusaurus plugin or extension.
- Additional descriptive topics (language, framework, domain keywords) may be added freely alongside standard topics.
- Review and update the standard topic set when the repository landscape changes materially (new domain clusters emerge or existing ones become obsolete).
- Verify topics are set as part of the new-repository compliance gate.

## Delivery chain gate

- Before reporting a code change as complete in a publishable package, verify the full delivery chain (commit → push → version bump → release → publish → install verify). Do not stop mid-chain.
- Detailed delivery chain procedures are in the `release-publish` skill.
