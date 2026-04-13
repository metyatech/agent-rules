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
  state, and verify cleanup.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use sync I/O where
  responsiveness is expected.
- Prefer push, event, or signal synchronization. Use polling
  only when no authoritative event path exists or requested;
  document why and bound cadence and retries.

## API surfaces

- Prefer native SDKs and stable APIs. Isolate and document
  unavoidable unstable APIs. Externalize large strings and
  templates.
- The agent MUST NOT commit build artifacts; keep artifact
  directories and `.gitignore` aligned.

## Linters, formatters, and static analysis

- Every repository MUST have one formatter and one linter or
  analyzer per primary language, pinned in manifests or lock
  files.
- The agent MUST NOT disable lint rules globally. Suppressions
  MUST be narrow, justified inline, and time-bounded. Run the
  formatter before replace operations in managed files.

## CI enforcement

- CI MUST run required formatting and lint checks on every pull
  request and treat warnings as errors.

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
  Paths MUST be relative and configuration explicit.
- Lifecycle hooks must succeed on a clean machine. Use project-
  managed runners and regenerate lock files with manifest
  changes.
- Agent-owned temporary files MUST live under the OS temporary
  directory unless the user explicitly approves otherwise.

## Tool integration

- Design tools and services for agent compatibility via
  standard interfaces. CLI rules live in `cli-design`.
- In user-controlled repositories with stable seed checkouts,
  initialize `mwt` before tracked edits if needed.
- If `mwt` init cannot complete safely or deterministically,
  stop tracked edits and report the blocker.
- In `mwt` repositories, create tracked-edit worktrees with
  `mwt create`; never start tracked work from the seed or ad
  hoc checkout flows.
- In an `mwt`-initialized repository, run `mwt deliver` before
  reporting completion.
- In `mwt` repositories, after `mwt deliver`, run `mwt prune
  --merged --with-branches` for delivered worktrees the agent
  created or owns unless asked to keep them.
- In `mwt` repositories, do not report completion while
  delivered worktrees remain. Safe automatic `mwt init` MUST
  track `.mwt/config.toml`, commit it before tracked work,
  leave no untracked `.mwt/` residue, and keep the seed
  clean.

## Post-change deployment verification

Deployment procedures live in `post-deploy`.

- After modifying code, determine whether deployment beyond
  commit and push is required.
- For globally linked packages, rebuild and verify the global
  binary before reporting completion. For running services,
  daemons, or scheduled tasks, rebuild, restart, and verify
  the running instance. Before concluding, tear down temp
  resources and leave no residue.
