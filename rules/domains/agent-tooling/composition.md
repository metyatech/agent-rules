# Agent Tooling Composition

- Agent tooling repositories MUST keep generated instruction files reproducible from `agent-ruleset.json` and the selected `profile`.
- A consuming repository's `agent-ruleset.json` MUST declare the complete ordered `sources` list and `profile` needed by that repository.
- Profiles in `agent-profiles.json` MUST select the complete set of `rules/domains/*` domains needed by each repository type.
- Rule source changes MUST be made in `rules/global/`, `rules/domains/`, `agent-profiles.json`, or other canonical source files selected by the rules source.
- Generated `AGENTS.md` and `CLAUDE.md` diffs MUST be reviewed as generated instruction diffs, not hand-edited.
- If a generated instruction file is stale, regenerate it with `compose-agentsmd` or the repository's canonical compose command before reporting completion.
- Consuming repositories MUST NOT use legacy `source`, `domains`, or `extra` keys, and MUST NOT compensate for missing shared rules by adding repo-local extras or `agent-rules-local` files.
