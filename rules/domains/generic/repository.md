# Generic Repository Rules

- Use repository-standard commands documented in `README.md`, package metadata, scripts, Makefiles, task files, or existing CI configuration.
- Do not infer the technology stack from the repository name alone.
- Preserve the existing repository structure unless the task explicitly requests a restructure.
- When no repository-standard verification command exists, report that no canonical verification command was found instead of inventing one.
- Generated instruction files MUST remain reproducible from `agent-ruleset.json` and the selected profile.