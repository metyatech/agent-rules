# Linters, formatters, and static analysis

- Every code repo must have a formatter and a linter/static analyzer for its
  primary languages.
- Prefer one formatter and one linter per language; avoid overlapping tools.
- Enforce in CI: run formatting checks (verify-no-changes) and linting on pull
  requests and require them for merges.
- Treat warnings as errors in CI.
- Do not disable rules globally; keep suppressions narrow, justified, and
  time-bounded.
- Pin tool versions (lockfiles/manifests) for reproducible CI.
- Repositories with GitHub Actions must configure Dependabot version updates for
  applicable package ecosystems and for `github-actions`, unless the repository
  has no external dependency/update surface.
- For web UI projects, enforce automated visual accessibility checks in CI.
- Require dependency vulnerability scanning, secret scanning, and CodeQL for
  supported languages.
