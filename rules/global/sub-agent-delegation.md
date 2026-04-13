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

- Tier routing lives in `sub-agent-dispatch`.

## Spawning a delegated agent

- The delegating prompt MUST state delegated mode, approval
  state, acceptance criteria, verification requirements, and
  task context. The delegator MUST NOT assume access to prior
  conversation.
- The delegating prompt MUST NOT restate rules already present
  in AGENTS.md.
- Two or more agents MAY write in the same repository only
  with isolated checkouts and one integration owner.
  Otherwise run sequentially.

## Delegated-agent obligations

- Respond in English and report evidence concisely.
- The delegated agent MUST NOT modify rules directly; report
  rule gaps for delegator review.
- Inherit the delegator's repository scope and MUST NOT expand
  it. If unable to operate within scope, fail back
  explicitly.
- If the delegated agent reports a read-only or no-write
  constraint, run a minimal reversible OS-temp probe and report
  the exact failure verbatim.
- A delegated agent MUST NOT perform a restricted operation
  without an explicit per-call delegation.

## Dispatch tooling

- Sub-agents MUST be launched via `agents-mcp`. The agent MUST
  NOT use platform built-in subagent spawners.
- Before spawning, run `ai-quota`. If it is unavailable or
  fails, report and MUST NOT spawn.
- When spawning a sub-agent, explicitly specify both `model`
  and `effort` from the `sub-agent-dispatch` skill. The agent
  MUST NOT rely on defaults.
- Implementation sub-agents MUST use `mode: 'edit'`; default
  `mode: 'plan'` is read-only.
- After spawning, return to the user immediately and use
  background or non-blocking monitoring; the agent MUST NOT
  block waiting for completion.
- Dispatch details live in `sub-agent-dispatch`.

## Orchestrator model selection

- Orchestrator model defaults live in `sub-agent-dispatch`. The
  agent MUST NOT use elevated effort to improve rule
  compliance.

## Verification of sub-agent results

- The agent MUST NOT trust completion claims without evidence.
  Implementation sub-agents MUST return AC, AC → evidence,
  files changed, assumptions, and risks.
- After implementation, run repo verify.
- If verification fails, cannot run, or the task is Heavy or
  release/production, spawn a separate reviewer with the
  original AC and spec; require `PASS`/`FAIL`.
- The agent MUST NOT adopt a result as done unless reviewer
  status is `PASS`. Standard tier MAY skip reviewer with
  passing verify and clear AC evidence.

## Cost, execution, and lifecycle

- Use the minimum reasoning effort that reliably works. Prefer
  newer models at lower effort and MUST NOT use Heavy-tier
  models for Light or Standard work.
- The agent MUST NOT rapidly respawn sub-agents for the same
  task while one is still running without errors.
- After a team completes, shut down all team agents and clean
  up resources. If a sub-agent fails, retry or escalate.
- If a delegated task fails repeatedly because of quota limits,
  update the `task-tracker` stage so work resumes from the
  last successful stage.
