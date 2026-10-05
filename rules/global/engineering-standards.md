# Engineering and design standards

## Tooling and dependencies

- Prefer official, maintained, latest-stable free-tier tools; document
  paid/proprietary tradeoffs and verify existing solutions before
  building custom logic.
- Whenever an applicable Jev tool can materially reduce model reading,
  reasoning, or browser work, MUST use it; do not skip it because the main
  model could do the work itself.
- For semantic code exploration across multiple plausible files/candidates,
  use `jev_rank`; when choosing from an existing candidate list, use
  `jev_pick`.
- Do not pass Jev server root-external paths as `jev_rank` path candidates.
  If candidate contents are already available or a path is outside that root,
  rank or pick with the candidate id/text form supported by the live schema.
- Use `jev_next_step` before guessing after ambiguous/failing results,
  repeated attempts, or uncertainty about the next action.
- Before declaring non-trivial implementation complete, use exactly one
  primary completion review: `jev_gate` when concrete completion claims and
  supporting evidence exist; otherwise `jev_review`. Do not routinely call
  both on the same unchanged patch.
- When a multi-file completion patch may exceed the current whole-diff context
  limit, use `jev_gate`'s `files` per-file mode when supported by the live
  schema; follow its limits and do not intentionally send a known-over-limit
  whole `diff`.
- For supported multi-step action-oriented browser work, use `jev_navigate`
  first.
- If an applicable Jev tool is unloaded, discover it from the tool catalog.
- Fall back to normal model/browser work only when Jev is unsupported, fails,
  or returns insufficient confidence.
- Skip Jev only when it adds no material value, such as deterministic one-step
  work or a cheaper direct deterministic tool path.
- Avoid repeated Jev calls on an unchanged diff/result; rerun only after a
  material change or new evidence.

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

- Designs MUST be compositional with clean dependency direction,
  shallow control flow, intention-revealing names, and centralized
  change points.
- Keep code, docs, tests, and config DRY; fix root causes and
  remove obsolete code in the same change set.
- Failure paths MUST tear down resources, leave no partial state,
  verify cleanup, and preserve last-known-good state until replacement
  state is validated.
- Updates, syncs, migrations, self-updates, and generated-runtime
  replacement MUST validate off-path replacement state and switch via
  a narrow final cutover.
- Multi-step state transitions MUST persist durable state for
  deterministic resume/reconcile; failed staged artifacts MUST stay
  outside the authoritative path with bounded retention and cleanup
  retry.

## API surfaces

- Prefer native SDKs and stable APIs; isolate unavoidable unstable
  APIs and externalize large strings/templates.
- The agent MUST NOT commit build artifacts; keep artifact dirs and
  `.gitignore` aligned.

## Repository hygiene

- The agent MUST NOT add or commit verification evidence whose sole purpose is
  to prove task completion, review, build, or verification, including
  `review-verification`, `build-evidence`, review screenshots, one-off logs,
  verification-result JSON, and review reports; tests and CI MUST NOT require it.
- Verification-only files MUST remain under the OS temp directory or another
  untracked temporary area. This does not prohibit source code, ordinary
  automated tests, configuration, reproducibility fixtures, or product/
  distribution artifacts that form part of the repository contract.

## Linters, formatters, and static analysis

- Every repo MUST have one pinned formatter and one pinned
  linter/analyzer per primary language.
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
- CI MUST run non-mutating format, lint, typecheck, and test checks
  using repository-standard commands.

## CI enforcement

- CI MUST run formatting/lint checks on every pull request and treat
  warnings as errors.
- GitHub Actions jobs triggered by `push` or `pull_request` MUST set
  `timeout-minutes: 10`.
- If 10 minutes is insufficient, optimize the CI first. Extending the
  timeout requires user approval and MUST NOT exceed 15 minutes.
- Checks that need more than 15 minutes MUST NOT run from `push` or
  `pull_request`; move them to a manual trigger such as `workflow_dispatch`.

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

- The agent MUST NOT introduce machine-specific environments; use
  relative paths and explicit config.
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
  where applicable, verify live state, and tear down temp resources.
