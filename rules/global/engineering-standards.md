# Engineering and design standards

## Tooling and dependencies

- Prefer official, well-maintained, latest-stable tools and
  dependencies. Prefer OSS or free-tier services; when using a
  paid or proprietary service, call out the tradeoff in
  documentation or commit message.
- Before designing or building a system, verify whether the
  whole system or any decomposed subsystem can be satisfied by
  an existing official or well-maintained system. Use the
  existing system by default; build custom logic only for
  verified gaps.

## System design

- Designs MUST be compositional; dependency direction MUST be
  clean (high-level depends on low-level abstractions).
  Control flow MUST be shallow. Naming MUST be
  intention-revealing. Change points MUST be centralized in
  configuration or constants.
- Keep code, docs, tests, and configuration DRY. Fix root
  causes; remove obsolete code in the same change set; repair
  broken tools at the source.
- Failure paths MUST tear down resources and MUST NOT leave
  partial state. Verify cleanup runs on every error branch.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use synchronous I/O
  where responsiveness is expected.
- Prefer push-, event-, or signal-driven synchronization over
  periodic polling. Polling MAY be used only when no reliable
  authoritative event path exists OR the user explicitly
  requests it; document why and bound cadence and retry
  behavior in code.

## API surfaces

- Avoid external command execution; prefer native SDKs.
- Prefer stable public APIs; isolate and document any
  unavoidable use of internal or unstable APIs.
- Externalize large embedded strings, templates, and rule data
  into resource files.
- The agent MUST NOT commit build artifacts. Keep artifact
  directory names and `.gitignore` entries aligned.

## Linters, formatters, and static analysis

- Every code repository MUST have exactly one formatter and
  one linter (or static analyzer) per primary language. Tool
  versions MUST be pinned via lock files or manifests.
- The agent MUST NOT disable lint rules globally. Suppressions
  MUST be narrow, justified inline, and time-bounded.
- When editing a file managed by a formatter, run the
  formatter immediately before performing replace operations.

## CI enforcement

- CI MUST run formatting checks and linting on every pull
  request and require these for merge. CI MUST treat warnings
  as errors.

## Dependency and security scanning

- A repository with GitHub Actions MUST configure Dependabot
  version updates for every applicable package ecosystem and
  for `github-actions`, unless the repository has no external
  dependency or update surface.
- A repository MUST enable dependency vulnerability scanning,
  secret scanning, and CodeQL for every supported language.
- A web UI project MUST enforce automated visual accessibility
  checks in CI.

## Environment portability

- The agent MUST NOT introduce machine-specific environments.
  Paths MUST be relative; configuration MUST be explicit.
- Lifecycle hooks (install, build, test) MUST succeed on a
  clean machine. Invoke developer tools via `npm exec` or the
  equivalent project-managed runner. Regenerate and commit
  lock files in the same change set when the manifest changes.
- Agent-owned temporary files MUST live under the OS temporary
  directory unless the user explicitly approves otherwise.

## Tool integration

- Design tools and services for agent-compatibility via
  standard interfaces. CLI conventions live in the `cli-design`
  skill.
- When tracked edits are required in a user-controlled
  repository with a stable local seed checkout, the agent MUST
  initialize `managed-worktree-system` (`mwt`) from that seed
  checkout before editing if the repository is not already
  initialized.
- If `mwt` initialization cannot be completed safely or
  deterministically, the agent MUST stop short of tracked
  edits and report the exact blocker.
- In an `mwt`-initialized repository, the agent MUST create
  tracked-edit worktrees with `mwt create` and MUST NOT start
  tracked work from the seed checkout or from ad hoc
  `git worktree` or `git checkout` flows.
- In an `mwt`-initialized repository, the agent MUST integrate
  tracked changes with `mwt deliver` and MUST clean up task
  worktrees with `mwt prune` or the repository's declared
  managed-worktree cleanup command.
- In an `mwt`-initialized repository, the agent MUST keep the
  seed or canonical checkout tracked-clean.

## Post-change deployment verification

Detailed deployment detection and verification procedures live
in the `post-deploy` skill.

- After modifying code, determine whether deployment steps
  beyond commit and push are needed before concluding.
- If the affected repository powers a globally linked package
  (an npm package whose global install path is a symlink to
  the local working tree), rebuild the package and verify the
  global binary is functional before reporting completion.
- If the affected repository powers a running service, daemon,
  or scheduled task, rebuild, restart, and verify the running
  instance with deterministic evidence. The agent MUST NOT
  claim completion until the running instance reflects the
  changes.
- Verify teardown of every agent-owned temporary resource
  (services, daemons, browser sessions, temporary clones,
  patch files) before concluding. If cleanup fails, fix the
  harness or the cleanup path. The agent MUST NOT leave
  residue.
