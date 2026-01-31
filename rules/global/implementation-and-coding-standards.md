# Engineering and implementation standards

## Technology choices

- Default to TypeScript (.ts/.tsx); use JavaScript only for tool-required config files.
- Prefer official/standard approaches recommended by the framework or tooling.
- Prefer well-maintained external dependencies; build in-house only when no suitable option exists.
- Use established icon libraries; do not handcraft custom icons or inline SVGs.
- For reusable functionality, prefer existing internet-hosted tools/libraries; if none fit, externalize into a separate repo/module and depend on it remotely (never local filesystem paths).
- When a feature appears reusable across repositories, assess reuse first and propose a shared module/repo.

## Design principles

- Maintainability > testability > extensibility > readability.
- Single responsibility; keep modules narrowly scoped.
- Prefer composition over inheritance; keep dependency direction clean and swappable at boundaries.
- Avoid global mutable state; keep ownership and lifetime explicit.
- Avoid deep nesting; use guard clauses and small functions.
- Use clear, intention-revealing naming; avoid "Utils" dumping grounds.
- Prefer configuration/constants over hardcoding; consolidate change points.
- Keep everything DRY across code, specs, docs, tests, configs, and scripts.

## Change hygiene

- Fix root causes; avoid band-aid workarounds when a proper fix is feasible.
- If a bug is in a dependency you control, fix it there before app-level workarounds.
- Remove obsolete code/branches/comments/helpers introduced by changes.
- Remove unused functions/types/constants/files; if kept, state the reason.
- Externalize large embedded strings/templates/rules into separate files when possible.

## Repository hygiene and naming

- Do not commit build artifacts (follow the repo's .gitignore).
- Align file/folder names with their contents; keep naming conventions consistent.
