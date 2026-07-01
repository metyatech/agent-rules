# Compose-Agentsmd Self Composition

- For the `compose-agentsmd` repository only, generate instruction files using `npm run compose`.
- Do not run the globally installed `compose-agentsmd` binary to regenerate the `compose-agentsmd` repository's own `AGENTS.md`.
- After changing compose behavior, run `npm run verify`.
- After changing ruleset schema behavior, update tests and README examples in the same change set.