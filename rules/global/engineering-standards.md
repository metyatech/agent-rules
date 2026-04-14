# Engineering and design standards

## Tooling and dependencies

- Prefer official, maintained, latest-stable tools and deps.
  Prefer OSS/free-tier services; document paid/proprietary
  tradeoffs.
- Before building, verify whether an existing official or
  maintained system already satisfies the need; build custom
  logic only for verified gaps.

## System design

- Designs MUST be compositional with clean dependency
  direction, shallow control flow, intention-revealing names,
  and centralized change points.
- Keep code, docs, tests, and config DRY. Fix root causes,
  remove obsolete code in the same change set, and repair
  broken tools at the source.
- Failure paths MUST tear down resources, leave no partial
  state, and verify cleanup.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use sync I/O where
  responsiveness is expected.
- Prefer push, event, or signal synchronization; use polling
  only when no authoritative event path exists or requested;
  document why and bound cadence/retries.

## API surfaces

- Prefer native SDKs and stable APIs; isolate unavoidable
  unstable APIs and externalize large strings/templates.
- The agent MUST NOT commit build artifacts; keep artifact dirs
  and `.gitignore` aligned.

## Linters, formatters, and static analysis

- Every repo MUST have one formatter and one linter/analyzer
  per primary language, pinned in manifests or lockfiles.
- The agent MUST NOT disable lint rules globally. Suppressions
  MUST be narrow, justified inline, and time-bounded. Run
  formatters before replace operations.

## CI enforcement

- CI MUST run formatting/lint checks on every pull request and
  treat warnings as errors.

## Dependency and security scanning

- GitHub Actions repos MUST configure Dependabot for all
  applicable ecosystems, including `github-actions`, unless
  no external update surface exists.
- Repos MUST enable dependency scanning, secret scanning, and
  CodeQL.
- Web UI projects MUST enforce visual accessibility checks.

## Environment portability

- The agent MUST NOT introduce machine-specific environments;
  use relative paths and explicit configuration.
- Lifecycle hooks MUST succeed on a clean machine. Use project
  runners and regenerate lockfiles with manifest changes.
- Agent-owned temp files MUST live under the OS temp dir unless
  explicitly approved otherwise.

## Tool integration

- Design tools/services for agent compatibility via standard
  interfaces. CLI: `cli-design`.
- Every tracked edit in a user-controlled repo MUST go through
  `mwt create`; the agent MUST NOT edit seed checkouts directly
  and MUST NOT commit to seed branches, regardless of whether
  `mwt` is already initialised in the repo.
- If the repo is not yet `mwt`-initialised, the agent MUST run
  `mwt init` in the same session before the first tracked edit.
  `mwt init` MUST track `.mwt/config.toml`, commit it before
  any tracked work, leave no untracked `.mwt/` residue, and
  keep the seed clean.
- If `mwt init` or `mwt create` cannot complete safely or
  deterministically, the agent MUST stop tracked edits and
  report the blocker rather than fall back to direct seed
  editing.
- Run `mwt deliver` before completion in `mwt` repos.
- After `mwt deliver`, run `mwt prune --merged --with-branches`
  for owned worktrees unless asked to keep them.
- In `mwt` repos, do not report completion while delivered
  worktrees remain.

## Post-change deployment verification

- Deployment procedures: `post-deploy`. After code changes,
  determine whether deployment beyond commit/push is needed.
- For globally linked packages, rebuild and verify the global
  binary before reporting completion. For running services,
  daemons, or scheduled tasks, rebuild, restart, and verify
  the running instance. Before concluding, tear down temp
  resources and leave no residue.
