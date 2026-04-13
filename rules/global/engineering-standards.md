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
- Failure paths MUST tear down resources and MUST NOT leave
  partial state. Verify cleanup runs on every error branch.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use synchronous I/O
  where responsiveness is expected.
- Prefer push, event, or signal synchronization over polling.
- Use polling only when no authoritative event path exists or
  the user requests it; document why and bound cadence and
  retries.

## API surfaces

- Avoid external command execution; prefer native SDKs.
- Prefer stable public APIs; isolate and document unavoidable
  internal or unstable APIs.
- Externalize large embedded strings, templates, and rule data
  into resource files.
- The agent MUST NOT commit build artifacts. Keep artifact
  directory names and `.gitignore` entries aligned.

## Linters, formatters, and static analysis

- Every repository MUST have one formatter and one linter or
  static analyzer per primary language, with versions pinned in
  lock files or manifests.
- The agent MUST NOT disable lint rules globally. Suppressions
  MUST be narrow, justified inline, and time-bounded.
- When editing a file managed by a formatter, run the
  formatter immediately before performing replace operations.

## CI enforcement

- CI MUST run formatting checks and linting on every pull
  request and require these for merge. CI MUST treat warnings
  as errors.

## Dependency and security scanning

- GitHub Actions repositories MUST configure Dependabot for
  every applicable ecosystem, including `github-actions`,
  unless they have no external update surface.
- A repository MUST enable dependency vulnerability scanning,
  secret scanning, and CodeQL for every supported language.
- A web UI project MUST enforce automated visual accessibility
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

- Design tools and services for agent-compatibility via
  standard interfaces. CLI conventions live in the `cli-design`
  skill.
- In a user-controlled repository with a stable seed checkout,
  initialize `mwt` before tracked edits if the repository is
  not already initialized.
- If `mwt` initialization cannot be completed safely or
  deterministically, the agent MUST stop short of tracked
  edits and report the exact blocker.
- In an `mwt`-initialized repository, create tracked-edit
  worktrees with `mwt create`; MUST NOT start tracked work from
  the seed checkout or ad hoc `git worktree`/`git checkout`
  flows.
- In an `mwt`-initialized repository, run `mwt deliver` before
  reporting completion.
- In an `mwt`-initialized repository, after successful `mwt
  deliver`, immediately run `mwt prune --merged --with-branches`
  for every delivered task worktree the agent created or owns
  unless the user asks to keep it.
- In an `mwt`-initialized repository, the agent MUST NOT
  report completion while its own delivered managed worktrees
  remain as residue.
- Safe automatic `mwt init` MUST treat `.mwt/config.toml` as
  tracked repo policy, commit that onboarding change before
  tracked task work, and leave no untracked `.mwt/` residue in
  the seed checkout.
- In an `mwt`-initialized repository, the agent MUST keep the
  seed or canonical checkout tracked-clean.

## Post-change deployment verification

Detailed deployment detection and verification procedures live
in the `post-deploy` skill.

- After modifying code, determine whether deployment steps
  beyond commit and push are needed before concluding.
- For globally linked packages, rebuild and verify the global
  binary before reporting completion.
- For running services, daemons, or scheduled tasks, rebuild,
  restart, and verify the running instance before claiming
  completion.
- Verify teardown of every agent-owned temporary resource
  before concluding. If cleanup fails, fix it. The agent MUST
  NOT leave residue.
