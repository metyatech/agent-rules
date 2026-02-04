# Linters, formatters, and static analysis

## General policy

- Every code repo must have a formatter and a linter/static analyzer for its primary languages.
- Prefer one formatter and one linter per language; avoid overlapping tools that fight each other.
- Prefer repository-standard tooling; if missing, add it using the defaults below.
- Enforce in CI: run formatting checks (verify-no-changes) and linting on pull requests and require them for merges.
- Treat warnings as errors in CI (or the closest equivalent).
- Do not disable rules globally; keep suppressions narrow, justified, and time-bounded.
- Pin tool versions (lockfiles/manifests) for reproducible CI.

## Security baseline

- Add dependency vulnerability scanning appropriate to the ecosystem (SCA) and require it for merges when feasible.
- Enable secret scanning (GitHub secret scanning or a repo-local scanner) and remediate findings; never commit secrets.
- Enable CodeQL (or equivalent) code scanning for supported languages when feasible.

## Default toolchain by language

### JavaScript / TypeScript (incl. React/Next)

- Format+lint: Biome (preferred for greenfield) or ESLint + Prettier (preferred when already established).
- Typecheck: `tsc` with strict settings for TS projects.
- Dependency scan: prefer `osv-scanner` or the package manager's audit tooling.

### Python

- Format+lint: Ruff.
- Typecheck: Pyright (preferred) or mypy.
- Dependency scan: pip-audit.

### Go

- Format: gofmt.
- Lint/static analysis: golangci-lint (includes staticcheck).
- Dependency scan: govulncheck.

### Rust

- Format: cargo fmt.
- Lint/static analysis: cargo clippy with warnings as errors.
- Dependency scan: cargo audit.

### Java

- Format: Spotless + google-java-format (or equivalent).
- Lint/static analysis: Checkstyle + SpotBugs.
- Dependency scan: OWASP Dependency-Check (or equivalent).

### Kotlin

- Format: ktlint (or Spotless + ktlint).
- Lint/static analysis: detekt.
- Compiler: enable warnings-as-errors for CI where practical.

### C#

- Format: dotnet format (verify-no-changes in CI).
- Lint/static analysis: enable .NET analyzers; treat warnings as errors; enable nullable reference types.
- Dependency scan: `dotnet list package --vulnerable` (or equivalent).

### C++

- Format: clang-format.
- Lint/static analysis: clang-tidy.
- Build: enable strong warnings and treat as errors; run sanitizers (ASan/UBSan) in CI where supported.

### PowerShell

- Format+lint: PSScriptAnalyzer (Invoke-Formatter + Invoke-ScriptAnalyzer).
- Runtime: Set-StrictMode -Version Latest; fail fast on errors.
- Tests: Pester when tests exist.

### Shell (sh/bash)

- Format: shfmt.
- Lint: shellcheck.

### Dockerfile

- Lint: hadolint.

### Terraform

- Format: terraform fmt -check.
- Validate: terraform validate.
- Lint: tflint.
- Security scan: tfsec (or equivalent).

### YAML

- Lint: yamllint.

### Markdown

- Lint: markdownlint.
