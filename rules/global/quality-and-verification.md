# Quality and verification

GUI verification: `gui-standards`. Procedural detail: `quality-workflow`.

## Verification gates

- Define binary acceptance criteria and an independent test oracle before changes.
  Select checks by affected contracts, risk, detection ability, not change size;
  cover relevant normal/boundary/failure cases; expand to integration/E2E/repo-wide
  for shared components, dependencies, runtime, broad workflows, or uncertainty
  as warranted.
- Run required repo/CI/branch-protection/release checks: focused during
  investigation, full after final changes. Use smallest sufficient existing
  commands; report broader checks omitted (all-in-one verifier existence alone
  doesn't mandate it). Verify silent long tests' final exit/results; silence
  proves neither outcome nor justifies restart. For workflows that are used,
  preserve their timeout, billing, and failure-propagation controls. Never weaken
  tests/assertions or skip existing mandatory gates merely to pass.
- Behavior-changing code requires risk-proportionate tests; non-behavioral edits
  do not. Bug fixes MUST add red/green regression tests when feasible; otherwise
  document alternative evidence and the unverified gap. Never weaken assertions.
- Test behavior, schemas, limits, tool contracts, generated-artifact consistency,
  not rule/docs wording/paraphrases (duplicate policy, break equivalent rewrites).
  Exact literals require concrete external machine-identifier/protocol mandates.
- Choose security controls for actual exposure (internet-accessible service,
  untrusted input/code execution, credentials/sensitive data, destructive
  operations, external users/distribution, known exploitable flaw); assess impact.
  Public visibility or dependencies alone do not trigger scanners, audits, or
  security documents.
- Reproduce minimally. For environment-dependent defects, observe affected
  runtimes read-only, encode relevant sanitized differences in test-owned
  fixtures, not assumptions. Reproduce prior state (SHA/pre-bump seed) before
  attributing dependency/environment regressions. Validate inputs/config, fail
  fast, never swallow errors.

## Negative-test fixtures

- Invalid-input tests MUST use test-owned fixtures stating the invalid condition,
  never rely on mutable production/live data remaining invalid after correction.
  Test current production/live data validity separately.

## GitHub Actions billing blocks

- Mark jobs `未実行（課金制限）` only with explicit payment-failure/spending-limit
  annotation, `runner_id=0`, zero steps. Waive commit/push/release blocking only
  if repo-standard local gates and applicable test/format/lint/build pass; record
  CI unrun/unverified. Missing/empty annotations, API/tool errors, timeouts,
  assigned runners, executed steps, unclear causes, test failures, failed/unrun
  local gates block.
- Find/run safe existing CLI/SDK/local alternatives for blocked steps; verify
  commit, artifacts, destination, live state; report unavailable steps.
- Keep all verification/release/deploy/publish/authentication/permission gates.
  Never change billing/workflow/branch-protection/runner settings or rerun just
  to retry billing. Stop/report if branch protection requires the check.

```powershell
$repo='OWNER/REPO'; $run='RUN_ID'
gh api "repos/$repo/actions/runs/$run/jobs" `
  --jq '.jobs[]|[.id,(.runner_id//0),(.steps|length)]|@tsv' | % {
  $id,$runner,$steps=$_.Split("`t")
  "$id runner=$runner steps=$steps annotation=$(gh api `
    "repos/$repo/check-runs/$id/annotations" --jq '.[].message')"
}
```

## Runtime verification

- For user-facing multi-client/environment or persisted-state systems, claim
  only verified environments/paths. Verify authentication, billing, authorization,
  persistence, other high-consequence journeys E2E in live/production-like
  conditions: interruption, retry, reload, invalid input, stale state.
- Verify live-update compatibility with surviving processes, in-memory/persisted
  state, locks, queues, sessions, and mixed versions as applicable; cold-start
  success alone is insufficient.
- After runtime dependency updates, verify intended revisions actually load/run
  per claimed environment, not just manifest/lockfile/package-manager/Git sync.
  Rebuild dependent artifacts as needed; run focused runtime checks.
- Test OS-specific script generation, process launch, and autostart changes on
  actual OS/interpreter where feasible, not just text/mocks; cover applicable
  first install, migration, update, and failure recovery.

## Bug handling

- Separate confirmed facts, probable causes, unverified hypotheses; retries or
  temporary non-reproduction alone don't prove fixes.
- For incidents following own changes, compare timing, logs, history, deployed
  revisions, before/after behavior; report evidenced causality (own change,
  pre-existing, or undetermined).
- Separate incident recovery, leftover cleanup, prevention. Check current state
  before recovery; never repeat completed user/agent actions. On user direction,
  take safe interim measures without awaiting permanent fixes.
- Strengthen each bug's earliest deterministic gate against broader patterns;
  report instance-only fixes, verified scope, residual risk; never claim bug-free.
- For parser/converter/scorer/generator fixes, assess affected persisted outputs,
  compare source/generated artifacts as warranted, identify unverified portions,
  decide repair/regeneration.
