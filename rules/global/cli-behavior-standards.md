# CLI and config standards

- Provide --help/-h with clear usage, options, and examples; include required parameters in examples.
- Provide --version (use -V); reserve -v for --verbose.
- Support stdin/stdout piping; allow output redirection (e.g., --output for file creation).
- Offer machine-readable output (e.g., --json) when emitting structured data.
- For modifying/deleting actions, provide --dry-run and an explicit bypass (--yes/--force).
- Provide controllable logging (--quiet, --verbose, or --trace).
- Use deterministic exit codes (0 success, non-zero failure) and avoid silent fallbacks.
- For JSON configuration, define/update a JSON Schema and validate config on load.