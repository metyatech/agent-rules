# Engineering and design standards

## Tooling and dependencies

- Prefer official, maintained, latest-stable tools and
  dependencies. Prefer OSS or free-tier services; document paid
  or proprietary tradeoffs.
- Before building a system, verify whether an existing official
  or maintained system already satisfies the need. Build custom
  logic only for verified gaps.

## System design

- Designs MUST be compositional with clean dependency
  direction, shallow control flow, intention-revealing names,
  and centralized change points.
- Keep code, docs, tests, and configuration DRY. Fix root
  causes, remove obsolete code in the same change set, and
  repair broken tools at the source.
- Failure paths MUST tear down resources, leave no partial
  state, and verify cleanup on every error branch.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use sync I/O where
  responsiveness is expected.
- Prefer push, event, or signal synchronization. Use polling
  only when no authoritative event path exists or the user
  requests it; document why and bound cadence and retries.

## API surfaces

- Prefer native SDKs and stable public APIs. Isolate and
  document unavoidable unstable APIs. Externalize large
  embedded strings, templates, and rule data.
- The agent MUST NOT commit build artifacts. Keep artifact
  directory names and `.gitignore` entries aligned.

## Linters, formatters, and static analysis

- Every repository MUST have one formatter and one linter or
  analyzer per primary language, pinned in manifests or lock
  files.
- The agent MUST NOT disable lint rules globally. Suppressions
  MUST be narrow, justified inline, and time-bounded. Run the
  formatter before replace operations in formatter-managed
  files.

## CI enforcement

- CI MUST run formatting checks and linting on every pull
  request and require these for merge. CI MUST treat warnings
  as errors.

## Dependency and security scanning

- GitHub Actions repositories MUST configure Dependabot for
  every applicable ecosystem, including `github-actions`,
  unless no external update surface exists.
- Repositories MUST enable dependency vulnerability scanning,
  secret scanning, and CodeQL for every supported language.
- Web UI projects MUST enforce automated visual accessibility
  checks in CI.

## Environment portability

- The agent MUST NOT introduce machine-specific environments.
  Paths MUST be relative; configuration MUST be explicit.
- Lifecycle hooks must succeed on a clean machine. Invoke tools
  via the project-managed runner and regenerate lock files in
  the same change set as manifest changes.
- Agent-owned temporary files MUST live under the OS temporary
  directory unless the user explicitly approves otherwise.

## Tool integration

- Design tools and services for agent compatibility via
  standard interfaces. CLI conventions live in `cli-design`.
- In user-controlled repositories with stable seed checkouts,
  initialize `mwt` before tracked edits if not already
  initialized.
- If `mwt` initialization cannot complete safely or
  deterministically, stop short of tracked edits and report
  the blocker.
- In `mwt` repositories, create tracked-edit worktrees with
  `mwt create`; never start tracked work from the seed or ad
  hoc `git worktree`/`git checkout` flows.
- In an `mwt`-initialized repository, run `mwt deliver` before
  reporting completion.
- In an `mwt`-initialized repository, after `mwt deliver`, run
  `mwt prune --merged --with-branches` for every delivered
  task worktree the agent created or owns unless asked to
  keep it.
- In `mwt` repositories, do not report completion while
  delivered managed worktrees remain. Safe automatic `mwt
  init` MUST treat `.mwt/config.toml` as tracked repo policy,
  commit it before tracked work, leave no untracked `.mwt/`
  residue, and keep the seed tracked-clean.

## Post-change deployment verification

Deployment procedures live in `post-deploy`.

- After modifying code, determine whether deployment beyond
  commit and push is required before concluding.
- For globally linked packages, rebuild and verify the global
  binary before reporting completion.
- For running services, daemons, or scheduled tasks, rebuild,
  restart, and verify the running instance. Before concluding,
  tear down every temporary resource and leave no residue.
