# Quality and verification

GUI verification: `gui-standards`. Procedural detail: `quality-workflow`.

## Verification gates

- Before changes, define binary acceptance criteria and an independent test
  oracle. Choose checks by affected contracts, risk, and defect-detection ability,
  not change size. Cover relevant normal, boundary, and failure cases; expand to
  integration, E2E, or repo-wide checks when shared components, dependencies,
  runtime, broad workflows, or uncertainty warrant it.

- Run checks required by repo instructions, CI, branch protection, or release
  policy. An all-in-one verifier is not mandatory solely because it exists; use
  the smallest sufficient existing commands and report broader checks not run. CI
  MUST enforce required verification. Do not weaken tests, assertions, or
  mandatory gates.
- Code/runtime changes need automated tests; bug fixes MUST add a regression
  test failing before and passing after.
- For security audit failures, use the documented automated fix; if it succeeds,
  rerun verification before commit/push.
- Reproduce failures minimally; after dependency/environment changes, reproduce
  on the prior state (prior SHA / pre-bump seed) before attribution. Validate
  inputs/configuration, fail fast, and never swallow errors.

## Negative-test fixtures

- Tests rejecting invalid input MUST use test-owned fixtures stating the invalid
  condition; MUST NOT depend on mutable production data/live content staying
  invalid after correction. Tests of current production-data/live-content validity
  MUST remain separate.

## GitHub Actions billing blocks

- Mark a job `未実行（課金制限）` only with an annotation explicitly stating
  failed account payments or a spending limit, `runner_id=0`, and zero steps.
  Ignore it as a release/commit/push blocker only after repo-standard local
  gates and applicable tests/format/lint/build pass; record CI unrun/unverified.
- Judge jobs independently. Missing/empty annotations, API/tool errors,
  timeouts, assigned runners, executed steps, unclear causes, test failures, or
  failed/unrun local gates block.
  Never skip checks or weaken tests/assertions.
- Do not change billing settings/workflows/branch protection/runner config or
  rerun just to retry billing. If branch protection requires the check, do
  not bypass it; stop and report. Keep all other release, deploy, publish,
  permission/authentication gates.

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

- For user-facing multi-client, multi-environment, or persisted-state systems,
  verify each claimed environment/path and leave unverified paths unclaimed.
  Verify authentication, billing, authorization, persistence, and other
  high-consequence journeys end-to-end in live/production-like conditions,
  including interruption, retry, reload, invalid-input, and stale-state cases.
- After runtime dependency updates, verify the intended revision actually
  loaded/executed in every claimed environment; manifests, lockfiles, and
  package-manager versions alone are insufficient. Rebuild dependent artifacts as
  needed and run a focused runtime check.

## Bug handling

- Separate confirmed facts, probable causes, and unverified hypotheses; retries
  or temporary non-reproduction alone do not prove a fix.

- For each bug, strengthen the earliest deterministic gate to prevent broader
  patterns; report instance-only fixes. Do not claim bug-free behavior; state
  verified scope and residual risk.
- For parser, converter, scorer, or generator fixes where outputs were
  persisted, determine whether existing outputs were affected; compare
  source/generated artifacts as risk warrants, identify unverified portions, and
  decide on repair or regeneration.
