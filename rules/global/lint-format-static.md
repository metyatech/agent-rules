# Linters, formatters, and static analysis

## Required tooling per repository

- Every code repository MUST have a formatter and a linter or
  static analyzer for each primary language.
- A repository MUST use exactly one formatter and one linter per
  language; the agent MUST NOT introduce overlapping tools.
- Tool versions MUST be pinned via lock files or manifests for
  reproducible CI.

## CI enforcement

- CI MUST run formatting checks (verify-no-changes mode) and
  linting on every pull request and MUST require these checks for
  merge.
- CI MUST treat warnings as errors.
- The agent MUST NOT disable lint rules globally. Suppressions
  MUST be narrow, justified inline, and time-bounded.

## Dependency and security scanning

- A repository with GitHub Actions MUST configure Dependabot
  version updates for every applicable package ecosystem and for
  `github-actions`, unless the repository has no external
  dependency or update surface.
- A repository MUST enable dependency vulnerability scanning,
  secret scanning, and CodeQL for every supported language.

## Accessibility scanning

- A web UI project MUST enforce automated visual accessibility
  checks in CI.
