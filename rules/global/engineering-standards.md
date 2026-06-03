# Engineering and design standards

## Tooling and dependencies

- Prefer official, maintained, latest-stable tools and free-tier
  services; document paid/proprietary tradeoffs.
- Verify whether an existing solution already satisfies the need
  before building custom logic.

## System design

- Designs MUST be compositional with clean dependency direction,
  shallow control flow, intention-revealing names, and centralized
  change points.
- Keep code, docs, tests, and config DRY; fix root causes and
  remove obsolete code in the same change set.
- Failure paths MUST tear down resources, leave no partial state,
  verify cleanup, and preserve last-known-good authoritative state
  until replacement state is validated.
- Updates, syncs, migrations, self-updates, and generated-runtime
  replacement MUST validate replacement state off the authoritative
  path and switch through a narrow final cutover.
- Multi-step state transitions MUST persist enough durable state for
  deterministic resume/reconcile after interruption.
- Superseded or failed staged artifacts that cannot be deleted
  immediately MUST stay outside the authoritative path, have bounded
  retention, and be retried for cleanup later.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use sync I/O where
  responsiveness is expected.
- The agent MUST NOT depend on timing luck, partial staging,
  non-deterministic ordering, or loosely bounded waits when a
  deterministic design is available.
- Prefer push, event, or signal synchronization. Polling is allowed
  only when no authoritative event path exists; document why and
  bound cadence/retries.
- Treat flaky, timing-sensitive, or non-deterministic behavior as a
  defect to reduce or remove.
- Async, queue, retry, and timeout flows MUST use explicit state
  transitions, authoritative events, idempotent reconciliation, and
  diagnostics that make stalled states inspectable.
- The agent MUST NOT dismiss an unexplained intermittent failure as
  "just flaky" before identifying the source.

## API surfaces

- Prefer native SDKs and stable APIs; isolate unavoidable unstable
  APIs and externalize large strings/templates.
- The agent MUST NOT commit build artifacts; keep artifact dirs and
  `.gitignore` aligned.

## Linters, formatters, and static analysis

- Every repo MUST have one formatter and one linter/analyzer per
  primary language, pinned in manifests or lockfiles.
- The agent MUST NOT disable lint rules globally. Suppressions MUST
  be narrow, justified inline, and time-bounded.
- New repos MUST configure formatter automation before completion;
  existing repos MUST preserve or add it when changing
  formatter-managed files.
- Repositories MUST run formatter automation across editor,
  pre-commit, and CI layers; CI formatter checks MUST NOT mutate
  repository contents. Layer procedure: `code-quality-setup`.

## CI enforcement

- CI MUST run formatting/lint checks on every pull request and treat
  warnings as errors.

## GitHub Actions runtime currency

- GitHub Actions JavaScript actions MUST run on GitHub's current GA
  Node major; migration windows MUST use the documented
  workflow-scope opt-in variable and remove it once obsolete.
  Procedure: `code-quality-setup`.
- Treat runtime deprecation annotations as defects to fix in the same
  change set. Do not pin workflows, action metadata, or setup actions
  to deprecated runtime majors unless the user explicitly requests it
  and documents the risk.

## Accessibility checks

- Web UI projects MUST enforce visual accessibility checks.

## Environment portability

- The agent MUST NOT introduce machine-specific environments; use
  relative paths and explicit configuration.
- Lifecycle hooks MUST succeed on a clean machine; regenerate
  lockfiles with manifest changes.
- Agent-owned temp files MUST live under the OS temp dir unless
  explicitly approved otherwise.

## Tool integration

- Design tools/services for agent compatibility via standard
  interfaces. CLI: `cli-design`.

## Post-change deployment verification

- After code changes, determine whether deployment beyond commit/push
  is needed. Procedures: `post-deploy`.
- For globally linked packages and running services, rebuild, restart
  where applicable, verify the live instance, and tear down temp
  resources before concluding.
