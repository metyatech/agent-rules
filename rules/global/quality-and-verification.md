# Quality and verification

GUI verification: `gui-standards`. Procedural detail: `quality-workflow`.

## Verification gates

- Define binary acceptance criteria/evidence; target checks, verify changed
  contracts, then run full repository verification.
- Code/runtime changes need automated tests; bug fixes MUST add a regression
  test failing before and passing after.
- Run the repository-standard verifier before completion, adding one if absent;
  CI MUST enforce it. Commit hooks are early safeguards, not final gates.
- For security audit failures, use the documented automated fix; if it succeeds,
  rerun verification before commit/push.
- Reproduce failures minimally; after dependency/environment changes, reproduce
  on the prior state before attribution. Validate inputs/configuration, fail
  fast, and never swallow errors.

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
$repo='OWNER/REPO'; $run=RUN_ID
gh api "repos/$repo/actions/runs/$run/jobs" `
  --jq '.jobs[]|[.id,(.runner_id//0),(.steps|length)]|@tsv' |
  % {
    $id,$runner,$steps=$_.Split("`t")
    "$id runner=$runner steps=$steps annotation=$(gh api `
      "repos/$repo/check-runs/$id/annotations" --jq '.[].message')"
  }
```

## Runtime verification

- For user-facing multi-client, multi-environment, or persisted-state systems,
  verify each claimed environment/path; leave unverified paths unclaimed.
- Verify authentication, billing, authorization, persistence, and other
  high-consequence journeys end-to-end live/production-like, including interruption,
  retry, reload, invalid-input, and stale-state cases.

## Bug handling

- Separate confirmed facts, probable causes, and unverified hypotheses; retries
  or temporary non-reproduction alone do not prove a fix.

- For each bug, strengthen the earliest deterministic gate and prevent broader
  patterns; report instance-only fixes.
- Do not claim bug-free behavior; report verified scope and residual risk.
