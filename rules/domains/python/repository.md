# Python Repository Rules

- Prefer `pyproject.toml` as the source of truth for Python package metadata, dependencies, tooling, and build configuration.
- Use the repository's configured Python version and tooling instead of introducing a new package manager.
- Prefer existing verification commands from `pyproject.toml`, README, task files, or CI.
- If the repository uses `pytest`, run the relevant pytest suite after behavioral changes.
- If the repository uses `ruff`, `pyright`, `mypy`, or `pip-audit`, keep their configured checks passing.
- Do not commit virtual environments, caches, build outputs, wheel files, or local interpreter state.