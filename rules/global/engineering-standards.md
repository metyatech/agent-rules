# Engineering and design standards

## Tooling and dependencies

- Prefer maintained upstream tools; verify existing solutions before custom
  logic. Use deterministic checks and exact path/symbol/string search. To
  semantically narrow 12+ source candidates, use `jev_rank` with paths/globs,
  then `jev_pick` by relevance within the supplied list.
- Use `jev_decide` only for plan-changing choices among 2–6 plausible options,
  with evidence and user priorities; retain `ask_user`, `investigate`, `none`.
  Use `jev_verify` for specific claims against direct evidence; `jev_navigate`
  for supported multi-step browser work.
- Never use Jev for generation, multi-hop reasoning, deep patch correctness
  review, deterministic test/build/Git/version/hash/CI facts, or repeated
  decisions on unchanged evidence. Completion reviews/generic next-step
  judgments are optional; on low confidence, invalid/escape results, or
  service failure, use a stronger reasoner or ask a person.

## Unreal Blueprint graph capture

- Use `ue-graph-capture` first for all Blueprint graph images supported by
  its installed version. Never reimplement supported capture via direct
  GraphPrinter automation, editor UI automation, Win32 window capture, custom
  WebSocket bridges, or similar; use fallbacks only for unsupported surfaces
  (e.g. Timeline/Widget Designer in `0.1.0`).

## System design

- Use clear dependency direction, shallow control flow, intention-revealing
  names, centralized change points, and DRY code/docs/tests/config. Fix root
  causes and remove obsolete code in the change.
- Unify equivalent concepts across targets; isolate target-specific differences
  in inputs/config and share the common logic.
- Manage and distribute interdependent tool files as one reusable bundle rather
  than enumerating individual files.
- Failure paths MUST tear down resources, verify cleanup, leave no partial state,
  and preserve last-known-good state until replacement validates. Validate
  updates, syncs, migrations, self-updates, and generated-runtime replacements
  off-path before narrow final cutover.
- Persist durable state for deterministic multi-step resume/reconcile; keep
  failed staged artifacts off the authoritative path with bounded retention and
  cleanup retry.

## API surfaces

- Prefer native SDKs/stable APIs; isolate unavoidable unstable ones; externalize
  large strings/templates.
- Never commit build artifacts; align artifact dirs with `.gitignore`.

## Feature, restriction, and diagnostic design

- Justify adding, changing, or retaining features, including allowlists,
  suppression, replacement, and access/display/processing restrictions: show
  concrete need/failure modes, weigh benefits against implementation/maintenance/
  test/operational costs, and consider removal. Remove obsolete restrictions;
  preserve behavior/input-shape/authorization/state-transition validation.
  For user decisions, explain each feature's behavior, purpose, and removal
  impact.
- Preserve structured diagnostic IDs verbatim, including unknown non-empty
  IDs; never genericize unregistered IDs. Escape line-safely and reversibly
  (actual newlines vs literal backslashes); validate known/unknown/missing IDs
  and control characters. Never mandate unconditional disclosure of exception
  messages or sensitive tokens.
- Retain original investigation-relevant local diagnostics without needless
  omission/summarization/masking; honor data protection. Bound recurring logs
  by age/total size with automated rotation/cleanup.

## Automated test isolation and user-data protection

- Tests/fixtures/mocks MUST NOT mutate real user data/config, credentials/tokens,
  browser profiles, or auth/session files. Home/app-data defaults remain real
  until redirected to test-owned paths.
- Inject a unique test-owned temp root for stateful paths (missing-file defaults,
  fallbacks, login/retry callbacks); validate resolved targets within it BEFORE
  any test write. Mocked reads cannot prevent production-default writes by
  callbacks. Prefer injected paths/isolated subprocesses over shared home/config
  changes in concurrent tests; isolate targets before destructive tests.
- Test regressions for original fallback writes; verify unchanged user state
  without exposing secrets or sensitive file contents.

## Repository hygiene

- Never commit task/review/build/verification-only evidence (`review-verification`,
  `build-evidence`, review screenshots, one-off logs, verification-result JSON,
  review reports) or require it in tests/CI. Keep verification-only files in
  OS temp or untracked temp areas. Source, tests, config, reproducibility
  fixtures, and product/distribution artifacts may remain in the repo contract.

## Linters, formatters, and static analysis

- Pin a formatter and linter/analyzer per repo's primary language. Never disable
  lint rules globally; keep suppressions narrow, justified inline, time-bounded.
  Configure formatter automation before completing new repos; preserve/add it
  when changing formatter-managed files in existing repos.
- Editor/save and pre-commit hooks MAY mutate files; CI MUST NOT mutate the
  repo. See `code-quality-setup`.
- Keep formatting/auto-fixing pre-commit hooks lightweight, staged-file-only:
  no full suite/typecheck, production build, integration tests, or other long
  gates.
- CI MUST run non-mutating format/lint/typecheck/test via repo-standard commands.

## CI enforcement

- Check format/lint on every PR; warnings fail. GitHub Actions
  `push`/`pull_request` jobs require `timeout-minutes: 10`; optimize before
  extending (user approval required, max 15 minutes). Run checks over 15 minutes
  only manually (e.g. `workflow_dispatch`).
- Stay within account-wide included GitHub Actions usage unless the user
  explicitly approves paid usage. For CI creation/changes/audits, estimate
  monthly cost from total billable job time, frequency, and runner rates;
  minimize usage without weakening gates. See `code-quality-setup`.

## GitHub Actions runtime currency

- GitHub Actions JavaScript actions MUST use GitHub's current GA Node major;
  migration windows MUST use documented opt-in and remove it when obsolete.
  Procedure: `code-quality-setup`.
- Fix runtime deprecation annotations in the same change. Do not pin workflows,
  action metadata, or setup actions to deprecated runtime majors unless the user
  explicitly requests it and documents the risk.

## Visual verification

- Visually verify UI, layout, generated document, image, screenshot, slide,
  PDF, and other rendered-output changes before concluding.
- Web UI projects MUST enforce visual accessibility checks.

## Environment portability

- Never introduce machine-specific environments; use relative paths/config.
  Lifecycle hooks must succeed on clean machines; regenerate lockfiles on
  manifest changes. Keep agent-owned temp files under OS temp unless explicitly
  approved.

## Tool integration

- Design tools/services for agent compatibility through standard interfaces
  (`cli-design` for CLI).

## Post-change deployment verification

- After code changes, determine whether deployment beyond commit/push is needed
  (`post-deploy`). For globally linked packages/running services, rebuild,
  restart where applicable, verify live state, and tear down temp resources.
