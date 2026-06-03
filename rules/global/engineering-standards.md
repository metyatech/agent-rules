# Engineering and design standards

## Tooling and dependencies

- Prefer official, maintained, latest-stable tools and free-tier
  services. Document paid/proprietary tradeoffs.
- Verify whether an existing solution already satisfies the need
  before building custom logic.

## System design

- Designs MUST be compositional with clean dependency direction,
  shallow control flow, intention-revealing names, and centralized
  change points.
- Keep code, docs, tests, and config DRY. Fix root causes and
  remove obsolete code in the same change set.
- Failure paths MUST tear down resources, leave no partial state,
  verify cleanup, and preserve the last known-good authoritative
  state until replacement state is fully prepared and validated.
- For updates, syncs, migrations, self-update flows, and generated-
  runtime replacement, the agent MUST prepare and validate
  replacement state off the authoritative path and switch to it
  only through a narrow final cutover.
- Multi-step state transitions MUST persist enough durable state to
  distinguish completed work from interrupted or failed attempts
  and to reconcile deterministically on the next safe trigger.
- When superseded or failed staged artifacts cannot be deleted
  immediately, the agent MUST keep them outside the authoritative
  path, bound their retention, and retry cleanup on later safe
  execution paths.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use sync I/O where
  responsiveness is expected.
- The agent MUST NOT introduce implementations whose correctness
  depends on timing luck, partial staging state, non-deterministic
  ordering, or loosely bounded waits when a deterministic design is
  available.
- Prefer push, event, or signal synchronization; use polling only
  when no authoritative event path exists; document why and bound
  cadence/retries.
- When the agent finds flaky, timing-sensitive, or non-deterministic
  behavior, it MUST treat it as a defect to reduce or remove, not as
  an acceptable quirk to document away.
- For async, queue, retry, and timeout-driven flows, the agent MUST
  prefer explicit state transitions, authoritative events,
  idempotent reconciliation, and diagnostics that make stalled
  states directly inspectable.
- The agent MUST NOT dismiss an unexplained intermittent failure as
  "just flaky" before identifying whether the instability comes from
  the test, the implementation, or their interaction.

## API surfaces

- Prefer native SDKs and stable APIs; isolate unavoidable unstable
  APIs and externalize large strings/templates.
- The agent MUST NOT commit build artifacts; keep artifact dirs
  and `.gitignore` aligned.

## Linters, formatters, and static analysis

- Every repo MUST have one formatter and one linter/analyzer per
  primary language, pinned in manifests or lockfiles.
- The agent MUST NOT disable lint rules globally. Suppressions
  MUST be narrow, justified inline, and time-bounded.
- Every new repository MUST configure formatter automation before
  being reported complete.
- When working in an existing repository, the agent MUST preserve
  or add formatter automation when the repository lacks it and the
  task changes formatter-managed files.
- Repositories MUST run formatter automation across the editor,
  pre-commit, and CI layers; CI formatter checks MUST NOT write,
  commit, push, or otherwise mutate repository contents. Layer
  procedure: `code-quality-setup`.

## CI enforcement

- CI MUST run formatting/lint checks on every pull request and
  treat warnings as errors.

## GitHub Actions runtime currency

- GitHub Actions JavaScript actions MUST run on GitHub's current GA
  Node major; during a migration window the agent MUST set the
  documented workflow-scope opt-in variable and remove it once that
  major becomes the runner default. Migration procedure:
  `code-quality-setup`.
- The agent MUST treat runtime deprecation annotations as defects to
  fix in the same change set, and MUST NOT pin workflows, action
  metadata, or setup actions to deprecated runtime majors unless the
  user explicitly requests it and documents the risk.

## Accessibility checks

- Web UI projects MUST enforce visual accessibility checks.

## Environment portability

- The agent MUST NOT introduce machine-specific environments;
  use relative paths and explicit configuration.
- Lifecycle hooks MUST succeed on a clean machine; regenerate
  lockfiles with manifest changes.
- Agent-owned temp files MUST live under the OS temp dir unless
  explicitly approved otherwise.

## Tool integration

- Design tools/services for agent compatibility via standard
  interfaces. CLI: `cli-design`.

## Post-change deployment verification

- After code changes, determine whether deployment beyond
  commit/push is needed. Procedures: `post-deploy`.
- For globally linked packages and running services, rebuild,
  restart where applicable, verify the live instance, and tear down
  temp resources before concluding.
