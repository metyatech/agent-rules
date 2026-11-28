# Engineering and design standards

## Tooling and dependencies

- Prefer maintained upstream tools; verify existing solutions before custom
  logic. Use deterministic checks and exact path/symbol/string search. Narrow
  12+ source candidates semantically with `jev_rank` (paths/globs), then
  `jev_pick` by relevance within the supplied list.
- Use `jev_decide` only for plan-changing choices among 2–6 plausible options,
  with evidence/user priorities; retain `ask_user`, `investigate`, `none`.
  Use `jev_verify` for specific claims against direct evidence, `jev_navigate`
  for supported multi-step browser work.
- Never use Jev for generation, multi-hop reasoning, deep patch correctness
  review, deterministic test/build/Git/version/hash/CI facts, or repeated
  decisions on unchanged evidence. Completion reviews/generic next-step
  judgments: optional. Low confidence, invalid/escape results, service failure:
  use a stronger reasoner or ask a person.

## Unreal Blueprint graph capture

- Use `ue-graph-capture` first for all Blueprint graph images supported by
  its installed version. Never reimplement supported capture via direct
  GraphPrinter automation, editor UI automation, Win32 window capture, custom
  WebSocket bridges, or similar; use fallbacks only for unsupported surfaces
  (e.g. Timeline/Widget Designer in `0.1.0`).

## System design

- Use clear dependency direction, shallow control flow, intention-revealing
  names, and centralized change points where they reduce real defects or change
  cost. Fix root causes and remove obsolete code in the affected scope.
- Unify equivalent concepts across targets; share logic, isolate target-specific
  differences in inputs/config.
- Manage/distribute interdependent tool files as one reusable bundle, not
  individually enumerated files.
- On failure, tear down resources, verify cleanup, leave no partial state.
  Preserve last-known-good state until replacement validates. Validate
  updates/syncs/migrations/self-updates/generated-runtime replacements off-path
  before narrow final cutover.
- Persist durable state for deterministic multi-step resume/reconcile; keep
  failed staged artifacts off authoritative paths; bound retention, retry cleanup.

## API surfaces

- Prefer native SDKs/stable APIs; isolate unavoidable unstable ones; externalize
  large strings/templates.
- Never commit build artifacts; align artifact dirs with `.gitignore`.

## Feature, restriction, and diagnostic design

- Justify feature/restriction additions, changes, retention (e.g. allowlists,
  suppression, replacement, access/display/processing limits): concrete needs,
  failure modes, benefits vs implementation/maintenance/test/operational costs;
  consider removal. For specific use cases, inspect constraints; prefer
  removing needless restrictions or generalizing existing functionality over
  special cases when sufficient. Remove obsolete restrictions; preserve specified
  behavior and input-shape/authorization/state-transition validation. For user
  decisions, explain each feature's behavior, purpose, removal impact.
- Preserve structured diagnostic IDs verbatim (including unknown non-empty IDs);
  never genericize unregistered IDs. Escape line-safely/reversibly (actual
  newlines vs literal backslashes); validate known/unknown/missing IDs and
  control characters. Never mandate unconditional disclosure of exception
  messages or sensitive tokens.
- Retain original investigation-relevant local diagnostics without needless
  omission/summarization/masking; honor data protection. Automatically
  rotate/clean recurring logs with age/total-size bounds.

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

## Quality tooling and CI

- Reuse formatters required by repo/toolchain or useful for generated-output
  consistency or diff noise; do not add one for AI style/readability or cause
  formatting-only churn.
- Add analyzers/lint only for correctness or architecture gaps missed by
  compiler/type checks, tests, or review; prefer existing relevant rules.
- Markdown lint requires human-edited documents and a real structural, rendering,
  or readability need.
- No default hooks: add only for evidenced recurring misses or risks better
  prevented before commit than by existing checks; keep them lightweight and
  staged-file scoped. CI MUST NOT mutate the repository. Use CI only for distinct
  value, not every local check or PR by default. Remove existing gates only after
  evidence-based review; never ignore or weaken required checks to pass. Used
  GitHub Actions `push`/`pull_request` jobs retain
  `timeout-minutes: 10`; optimize before a user-approved extension, capped at 15.
  Run longer checks manually. Keep within included usage unless paid spend is
  approved; estimate monthly cost from billable time, frequency, and runner rates
  for CI changes/audits. See `code-quality-setup`.

## GitHub Actions runtime currency

- GitHub Actions JavaScript actions MUST use GitHub's current GA Node major;
  migration windows require documented opt-in; remove when obsolete.
  Procedure: `code-quality-setup`.
- Fix runtime deprecation annotations in the same change. Do not pin workflows,
  action metadata, or setup actions to deprecated runtime majors unless the user
  explicitly requests it and documents the risk.

## Visual verification

- Visually verify UI, layout, generated document, image, screenshot, slide,
  PDF, and other rendered-output changes before concluding.
- Personal-only UI needs no new accessibility harness by default; scale checks
  by exposure and requirements (see `gui-standards`).

## Environment portability

- Never introduce machine-specific environments; use relative paths/config.
  Lifecycle hooks must succeed on clean machines; regenerate lockfiles on
  manifest changes. Agent-owned temp files: OS temp unless explicitly approved.

## Tool integration

- Design tools/services for agent compatibility through standard interfaces
  (`cli-design` for CLI).

## Post-change deployment verification

- Assess deployment (`post-deploy`): apply dependency changes to actual runtimes;
  rebuild globally linked packages/running services, restart as needed. Verify
  live state/affected behavior per `quality-and-verification`; clean temp resources.
