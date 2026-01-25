# Agent Rules

This repository stores modular rule files that are composed into per-project `AGENTS.md` files.
It is intended to be added as a git submodule at each project root.

The compose tool lives in a separate repository: `agent-rules-tools/`.

## Structure

- `rules/`: reusable rule modules (Markdown)
  - `rules/global/`: rules applied to all projects
  - `rules/domains/`: rules for specific domains
- `agent-ruleset.json`: a per-project ruleset file stored at each project root

## Ruleset format

```json
{
  "output": "AGENTS.md",
  "domains": ["unreal"],
  "rules": ["agent-rules-local/custom.md"]
}
```

- `output` is resolved relative to the ruleset file.
- Global rules are always included from `rules/global/`.
- `domains` selects domain folders under `rules/domains/`.
- Each `rules` entry is resolved relative to the ruleset JSON file.
  - For project-specific rules, add modules in the project itself (e.g. `agent-rules-local/`) and reference them from `agent-ruleset.json`.

## Compose

From each project root:

```sh
node agent-rules-tools/tools/compose-agents.cjs
```

Optional arguments:

- `--root <path>`: project root (defaults to current working directory)
- `--ruleset <path>`: only compose a single ruleset
- `--ruleset-name <name>`: override the ruleset filename (default: `agent-ruleset.json`)

`AGENTS.md` files are generated output; edit the modules in `rules/global/` or
`rules/domains/` instead.

## Public vs private

This repository is intended for rules that are safe to keep public.
For private repositories, use a separate rules repository that includes additional confidentiality rules.
