# Engineering and design standards

## Tooling and dependencies

- Prefer maintained upstream tools; verify existing solutions before custom
  logic. Use deterministic checks and exact path/symbol/string search. For
  semantic narrowing among 12+ source candidates, use `jev_rank` with
  paths/globs, then `jev_pick` by relevance from the supplied candidate list.
- Use `jev_decide` only for plan-changing choices among 2–6 plausible
  options, with evidence and user priorities; retain `ask_user`,
  `investigate`, and `none`. Use `jev_verify` for specific claims against
  direct evidence and `jev_navigate`
  for supported multi-step browser work.
- Do not use Jev for generation, multi-hop reasoning, deep patch correctness
  review, deterministic test/build/Git/version/hash/CI facts, or repeating
  decisions on unchanged evidence. Completion reviews and generic next-step
  judgments are optional; for low confidence, invalid/escape results, or service
  failure, use a stronger reasoner or ask a person.

## Unreal Blueprint graph capture

- Use `ue-graph-capture` first for all Blueprint graph images supported by
  its installed version. Never reimplement supported capture via direct
  GraphPrinter automation, editor UI automation, Win32 window capture, custom
  WebSocket bridges, or similar; use fallbacks only for unsupported surfaces
  (e.g. Timeline/Widget Designer in `0.1.0`).

## System design

- Designs MUST compose cleanly through clear dependency direction, shallow
  control flow,
  intention-revealing names, and centralized change points. Keep
  code/docs/tests/config DRY; fix root causes and remove obsolete code in the
  change.
- Failure paths MUST tear down resources, leave no partial state, verify
  cleanup, and preserve last-known-good state until replacement validates.
  Updates, syncs, migrations, self-updates, and generated-runtime replacements
  MUST validate replacement state off-path before narrow final cutover.
- Multi-step state transitions MUST persist durable state for deterministic
  resume/reconcile; failed staged artifacts MUST stay off the authoritative path
  with bounded retention and cleanup retry.

## API surfaces

- Prefer native SDKs/stable APIs; isolate unavoidable unstable ones; externalize
  large strings/templates.
- The agent MUST NOT commit build artifacts; align artifact dirs with
  `.gitignore`.

## Restriction and diagnostic design

- Before adding allowlists, suppression, replacement, or access/display/processing
  restrictions, demonstrate concrete need/failure modes and weigh benefits
  against implementation/maintenance/test/operational costs. Remove obsolete
  restrictions; preserve behavior/input-shape/authorization/state-transition validation.
- Store structured diagnostic IDs verbatim, including unknown non-empty ones;
  never genericize unregistered IDs. Escape display line-safely and reversibly
  (actual newlines vs literal backslash sequences); validate known/unknown/missing
  IDs and control characters. Never mandate unconditional disclosure of exception
  messages or sensitive tokens.
- Retain original investigation-relevant local diagnostic data without needless
  omission, summarization, or masking; honor data protection. Bound recurring
  logs by age/total size; automate rotation/cleanup.

## Automated test isolation and user-data protection

- Tests/fixtures/mocks MUST NOT mutate real user data/config,
  credentials/tokens, browser profiles, or auth/session files. Per-user
  home/app-data defaults are real until redirected to a test-owned path.
- Before any test write, inject a unique test-owned temp root for stateful paths
  (missing-file defaults, fallback paths, login/retry callbacks). Validate
  resolved targets inside it BEFORE writing; mocked reads don't stop callbacks
  writing to production defaults. For concurrent tests, prefer injected
  paths/isolated subprocesses over shared home/config changes; isolate targets
  before destructive tests.
- Add regression coverage for original fallback writes; verify user state
  unchanged without exposing secrets or sensitive file contents.

## Repository hygiene

- The agent MUST NOT commit task/review/build/verification-only evidence
  (`review-verification`, `build-evidence`, review screenshots, one-off logs,
  verification-result JSON, review reports); tests/CI MUST NOT require it.
- Verification-only files MUST stay in OS temp or untracked temp areas; source,
  tests, config, reproducibility fixtures, and product/distribution artifacts
  may remain in the repo contract.

## Linters, formatters, and static analysis

- Every repo MUST pin a formatter and linter/analyzer per primary language.
  Never disable lint rules globally; suppressions MUST be narrow, justified
  inline, and time-bounded. New repos MUST configure formatter automation before
  completion; existing repos MUST preserve/add it when changing formatter-managed
  files.
- Quality automation MUST separate roles: editor/save and pre-commit hooks MAY
  mutate working files; CI MUST NOT mutate the repo. Procedure:
  `code-quality-setup`.
- Formatting/auto-fixing pre-commit hooks MUST be lightweight and staged-file-
  only; they MUST NOT run the full suite, full typecheck, production build,
  integration tests, or other long-running gates.
- CI MUST run non-mutating format/lint/typecheck/test checks via repo-standard
  commands.

## CI enforcement

- CI MUST check format/lint on every PR; warnings fail. GitHub Actions
  `push`/`pull_request` jobs MUST set `timeout-minutes: 10`. If 10 minutes is
  insufficient, optimize CI first; extensions require user approval and MUST NOT
  exceed 15 minutes. Checks over 15 minutes MUST NOT run on `push`/`pull_request`;
  use manual triggers such as `workflow_dispatch`.

## GitHub Actions runtime currency

- GitHub Actions JavaScript actions MUST use GitHub's current GA Node major;
  migration windows MUST use documented opt-in and remove it when obsolete.
  Procedure: `code-quality-setup`.
- Fix runtime deprecation annotations in the same change. Do not pin workflows,
  action metadata, or setup actions to deprecated runtime majors unless the user
  explicitly requests it and documents the risk.

## Visual verification

- The agent MUST visually verify changes to UI, layout, generated documents,
  images, screenshots, slides, PDFs, or other rendered output before concluding.
- Web UI projects MUST enforce visual accessibility checks.

## Environment portability

- The agent MUST NOT introduce machine-specific environments; use relative
  paths/config. Lifecycle hooks MUST succeed on clean machines; regenerate
  lockfiles on manifest changes. Agent-owned temp files MUST stay under OS temp
  unless explicitly approved.

## Tool integration

- Design tools/services for agent compatibility through standard interfaces
  (`cli-design` for CLI).

## Post-change deployment verification

- After code changes, determine whether deployment beyond commit/push is needed
  (`post-deploy`). For globally linked packages/running services, rebuild,
  restart where applicable, verify live state, and tear down temp resources.
