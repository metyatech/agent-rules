# Agent Tooling Composition

- Agent tooling repositories MUST keep generated instruction files reproducible from `agent-ruleset.json` and the selected `domains`.
- Agent tooling repositories MUST NOT rely on repo-local `agent-rules-local` rule files.
- Rule source changes MUST be made in `rules/global/`, `rules/domains/`, or other canonical source files selected by the rules source.
- Generated `AGENTS.md` and `CLAUDE.md` diffs MUST be reviewed as generated instruction diffs, not hand-edited.
- If a generated instruction file is stale, regenerate it with `compose-agentsmd` or the repository's canonical compose command before reporting completion.
- A consuming repository's `agent-ruleset.json` MUST select the complete set of domains needed by that repository.
- A consuming repository MUST NOT compensate for missing shared rules by adding repo-local extras or `agent-rules-local` files.
