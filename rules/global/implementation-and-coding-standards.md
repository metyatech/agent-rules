# Engineering and implementation standards

- Prefer official/standard approaches recommended by the framework or tooling.
- Prefer well-maintained external dependencies; build in-house only when no suitable option exists.
- If functionality appears reusable, assess reuse first and propose a shared module/repo; prefer remote dependencies (never local filesystem paths).
- Maintainability > testability > extensibility > readability.
- Single responsibility; keep modules narrowly scoped and prefer composition over inheritance.
- Keep dependency direction clean and swappable; avoid global mutable state.
- Avoid deep nesting; use guard clauses and small functions.
- Use clear, intention-revealing naming; avoid "Utils" dumping grounds.
- Prefer configuration/constants over hardcoding; consolidate change points.
- Keep everything DRY across code, specs, docs, tests, configs, and scripts; proactively refactor repeated procedures into shared configs/scripts with small, local overrides.
- Persist durable runtime/domain data in a database with a fully normalized schema (3NF/BCNF target): store each fact once with keys/constraints, and compute derived statuses/views at read time instead of duplicating them.
- Fix root causes; remove obsolete/unused code, branches, comments, and helpers.
- Externalize large embedded strings/templates/rules when possible.
- Do not commit build artifacts (follow the repo's .gitignore).
- Align file/folder names with their contents and keep naming conventions consistent.
- Do not assume machine-specific environments (fixed workspace directories, drive letters, per-PC paths). Prefer repo-relative paths and explicit configuration so workflows work in arbitrary clone locations.
