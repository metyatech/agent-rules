# Engineering and design standards

## Tooling and dependencies

- Prefer maintained upstream tools and verify existing solutions before
  building custom logic.
- Prefer deterministic checks and ordinary search for exact paths, symbols,
  or strings. Use `jev_rank` with paths or globs when at least 12 discovered
  source candidates need semantic narrowing; use `jev_pick` to select by
  relevance from a supplied candidate list.
- Use `jev_decide` only for a bounded choice among 2–6 plausible options when
  evidence and user priorities are available and the outcome changes the plan.
  Keep its `ask_user`, `investigate`, and `none` outcomes.
- Use `jev_verify` for specific claims against direct evidence, and
  `jev_navigate` for supported multi-step browser work. Do not use Jev for
  generation, multi-hop reasoning, or deep patch correctness review.
- Do not send deterministic facts such as test, build, Git, version, hash, or
  CI results to Jev for judgment. Do not repeat a decision with unchanged
  evidence to seek endorsement.
- Do not make Jev completion review or generic next-step judgments mandatory.
  On low confidence, invalid results, escape outcomes, or service failure,
  continue with a stronger reasoner or ask a person as appropriate.

## Unreal Blueprint graph capture

- When an Unreal Engine Blueprint graph must be captured as an image, use
  `ue-graph-capture` as the default and first-choice tool for every graph type
  supported by the installed version.
- Do not reimplement supported Blueprint graph capture through direct
  GraphPrinter automation, editor UI automation, Win32 window capture, custom
  WebSocket bridges, or similar mechanisms.
- Fallback capture mechanisms are allowed only for surfaces unsupported by the
  installed `ue-graph-capture` version, such as Timeline or Widget Designer in
  `0.1.0`.

## System design

- Designs MUST compose cleanly: clear dependency direction, shallow control
  flow, intention-revealing names, centralized change points.
- Keep code, docs, tests, and config DRY; fix root causes and
  remove obsolete code in the same change set.
- Failure paths MUST tear down resources, leave no partial state,
  verify cleanup, and preserve last-known-good state until replacement
  state validates.
- Updates, syncs, migrations, self-updates, and generated-runtime replacements
  MUST validate replacement state off-path before a narrow final cutover.
- Multi-step state transitions MUST persist durable state for deterministic
  resume/reconcile; failed staged artifacts MUST stay off the authoritative
  path with bounded retention and cleanup retry.

## API surfaces

- Prefer native SDKs and stable APIs; isolate unavoidable unstable ones;
  externalize large strings/templates.
- The agent MUST NOT commit build artifacts; align artifact dirs with
  `.gitignore`.

## Automated test isolation and user-data protection

- Tests/fixtures/mocks MUST NOT mutate real user data/config, credentials/tokens,
  browser profiles, or auth/session files. Per-user home/app-data defaults are
  real until redirected to a test-owned path.
- Before any test write, inject a unique test-owned temp root for stateful paths
  (missing-file defaults, fallback paths, login/retry callbacks). Validate resolved
  targets inside it BEFORE writing; mocked reads don't stop callbacks writing
  to production defaults.
- For concurrent tests, prefer injected paths/isolated subprocesses over shared
  home/config changes; isolate targets before destructive tests.
- Add regression coverage for original fallback writes; verify user state
  unchanged without exposing secrets or sensitive file contents.

## Repository hygiene

- The agent MUST NOT add/commit evidence solely for task completion/review/
  build/verification (`review-verification`, `build-evidence`, review screenshots,
  one-off logs, verification-result JSON, review reports); tests/CI MUST NOT
  require it.
- Verification-only files MUST stay in OS temp or untracked temp areas. This
  allows source code, ordinary tests, config, reproducibility fixtures, and
  product/distribution artifacts in the repo contract.

## Linters, formatters, and static analysis

- Every repo MUST pin a formatter and linter/analyzer per primary language.
- The agent MUST NOT disable lint rules globally; suppressions MUST be
  narrow, justified inline, and time-bounded.
- New repos MUST configure formatter automation before completion;
  existing repos MUST preserve/add it when changing formatter-managed
  files.
- Repository quality automation MUST separate responsibilities:
  editor/save hooks and pre-commit hooks MAY mutate working files;
  CI checks MUST NOT mutate repository contents. Procedure:
  `code-quality-setup`.
- Pre-commit hooks MUST stay lightweight and operate only on staged
  files when formatting or auto-fixing. They MUST NOT run the full test
  suite, full typecheck, production build, integration tests, or other
  long-running verification gates.
- CI MUST run non-mutating format/lint/typecheck/test checks via
  repository-standard commands.

## CI enforcement

- CI MUST check format/lint per PR; warnings fail CI.
- GitHub Actions `push`/`pull_request` jobs MUST set `timeout-minutes: 10`.
- If 10 minutes is insufficient, optimize CI first; timeout extensions require
  user approval and MUST NOT exceed 15 minutes.
- Checks over 15 minutes MUST NOT run on `push`/`pull_request`; use manual
  triggers such as `workflow_dispatch`.

## GitHub Actions runtime currency

- GitHub Actions JavaScript actions MUST run on GitHub's current GA
  Node major; migration windows MUST use the documented opt-in and
  remove it once obsolete. Procedure: `code-quality-setup`.
- Treat runtime deprecation annotations as defects to fix in the same
  change set. Do not pin workflows, action metadata, or setup actions
  to deprecated runtime majors unless the user explicitly requests it
  and documents the risk.

## Visual verification

- When a change affects UI, layout, generated documents, images,
  screenshots, slides, PDFs, or other rendered output, the agent MUST
  visually verify the result before concluding.
- Web UI projects MUST enforce visual accessibility checks.

## Environment portability

- The agent MUST NOT introduce machine-specific environments; use relative
  paths and explicit config.
- Lifecycle hooks MUST succeed on clean machines; regenerate lockfiles with
  manifest changes.
- Agent-owned temp files MUST stay under OS temp unless explicitly approved.

## Tool integration

- Design tools/services for agent compatibility via standard
  interfaces. CLI: `cli-design`.

## Post-change deployment verification

- After code changes, determine whether deployment beyond commit/push
  is needed. Procedures: `post-deploy`.
- For globally linked packages and running services, rebuild, restart
  where applicable, verify live state, and tear down temp resources.
