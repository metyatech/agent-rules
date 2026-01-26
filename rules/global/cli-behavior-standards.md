# CLI behavior standards

- Provide `--help`/`-h` with clear usage, options, and examples.
- Provide `--version` so automation can pin or verify installed versions.
- When the CLI reads or writes data, support stdin/stdout piping and allow output to be redirected (e.g., `--output` when files are created).
- Offer a machine-readable output mode (e.g., `--json`) when the CLI emits structured data.
- For actions that modify or delete data, provide a safe preview (`--dry-run`) and an explicit confirmation bypass (`--yes`/`--force`).
- Provide controllable logging (`--quiet`, `--verbose`, or `--trace`) so users can diagnose failures without changing code.
- Use deterministic exit codes (0 success, non-zero failure) and avoid silent fallbacks.
