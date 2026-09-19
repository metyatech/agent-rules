# Sub-agent delegation and dispatch

## Definitions

- **Delegator** — the spawning agent or human.
- **Delegated agent** — a spawned agent in delegated mode.
- **Restricted operation** — modifying rules, merging or
  closing pull requests, creating or deleting repositories,
  releasing or deploying, force-pushing, or rewriting
  published history without explicit per-call delegation.
- **Tier** — task difficulty/cost classification.
- **Effort** — model reasoning intensity.

## Tier classification

- Classify delegated work as one of:
  - **Light** — bounded lookup/read-only work or a trivial,
    low-blast-radius change.
  - **Standard** — normal implementation, review, or refactor
    requiring multiple steps or verification.
  - **Heavy** — cross-system or high-blast-radius work; release,
    production, or security-sensitive work; migration; or materially
    ambiguous work.

## Spawning a delegated agent

- The delegating prompt MUST state delegated mode, approval
  state, acceptance criteria, verification requirements, and
  task context. The delegator MUST NOT assume prior convo
  access.
- The delegating prompt MUST NOT restate rules already present
  in AGENTS.md.
- Two or more agents MAY write in the same repository only
  with isolated checkouts or worktrees and one integration owner.
  Otherwise run sequentially.

## Delegated-agent obligations

- Respond in English and report evidence concisely.
- The delegated agent MUST NOT modify rules directly; report
  rule gaps for delegator review.
- Inherit the delegator's repository scope and MUST NOT expand
  it. If unable to operate within scope, fail back
  explicitly.
- If the delegated agent reports a read-only/no-write
  constraint, run a minimal reversible OS-temp probe and
  report the exact failure verbatim.
- A delegated agent MUST NOT perform a restricted operation
  without an explicit per-call delegation.

## Dispatch tooling

- Use platform-native sub-agent functionality when it is available.
  Do not use or install an external dispatcher.
- Do not require a separate quota-check command before spawning.
- Specify write/edit mode only when the platform exposes and requires
  it; do not assume a particular parameter.
- Independent read-only investigations MAY run in parallel.
- If native delegation is unavailable, continue without delegation
  where possible; otherwise report the limitation.

## Model and effort selection

- Specify model and effort only when the platform exposes those
  selectors.
- For Standard and Heavy implementation or review, the agent MUST NOT
  automatically choose a model clearly weaker than the delegator's
  selected model to reduce cost.
- For Light work, lower effort MAY be selected when accuracy is not
  reduced.
- When model or effort selectors are unavailable, use platform-native
  defaults. The absence of a selector MUST NOT be treated as dispatch
  failure.

## Verification of sub-agent results

- The agent MUST NOT trust completion claims without evidence.
  Implementation sub-agents MUST return AC, evidence, files
  changed, assumptions, and risks.
- Collect and verify delegated results before the final response. The
  agent MUST NOT promise that delegated work will complete after the
  response.
- After implementation, run repo verify.
- If verification fails, cannot run, or the task is Heavy or
  release/production, spawn a separate reviewer with the AC
  and spec; require `PASS`/`FAIL`.
- The agent MUST NOT adopt a result as done unless reviewer
  status is `PASS`. Standard tier MAY skip reviewer with
  passing verify and clear AC evidence.

## Execution and lifecycle

- The agent MUST NOT rapidly respawn sub-agents for the same
  task while one is still running without errors.
- After a team completes, shut down all team agents and clean
  up resources. If a sub-agent fails, retry or escalate.
- If platform limits repeatedly block delegated work, update the
  `task-tracker` stage so work resumes from the last successful
  stage.
