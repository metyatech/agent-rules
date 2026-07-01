# Agent Tooling Composition

- Agent tooling repositories MUST keep generated instruction files reproducible from `agent-ruleset.json` and the selected profile.
- Agent tooling repositories MUST NOT rely on repo-local `agent-rules-local` rule files.
- Rule source changes MUST be made in `rules/global/`, `rules/domains/`, or `agent-profiles.json`.
- Generated `AGENTS.md` and `CLAUDE.md` diffs MUST be reviewed as generated instruction diffs, not hand-edited.
- If a generated instruction file is stale, regenerate it with `compose-agentsmd` or the repository's canonical compose command before reporting completion.
- A profile MUST select the complete set of domains needed by a repository type; consuming repositories MUST NOT compensate by listing domains or local extras.