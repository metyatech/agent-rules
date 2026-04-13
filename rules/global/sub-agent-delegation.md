# Sub-agent delegation and dispatch

## Definitions

- **Delegator** — the agent or human that spawns another agent.
- **Delegated agent** — an agent spawned by a delegator;
  operates in delegated mode (`posture-and-delivery`).
- **Restricted operation** — modifying rules, merging or
  closing pull requests, creating or deleting repositories,
  releasing or deploying, force-pushing, or rewriting
  published history without explicit per-call delegation.
- **Tier** — task difficulty/cost classification: Free, Light,
  Standard, Heavy, Large Context.
- **Effort** — model reasoning intensity (`low`, `medium`,
  `high`, `xhigh`, `max`); not every model supports every level.

## Tier classification

- Tier meanings and routing live in the `sub-agent-dispatch`
  skill.

## Spawning a delegated agent

- The delegating prompt MUST state delegated mode, approval
  state, acceptance criteria, verification requirements, and
  task context. The delegator MUST NOT assume access to the
  calling conversation.
- The delegating prompt MUST NOT recite rules the delegated
  agent will already read from AGENTS.md.
- Two or more agents MAY write in the same repository only
  with isolated checkouts, worktrees, or branches and one
  integration owner. Otherwise run them sequentially.

## Delegated-agent obligations

- Respond in English; report verification evidence concisely.
- The delegated agent MUST NOT modify rules directly; report
  rule-gap suggestions in the result for delegator review.
- Inherit the delegator's repository scope; MUST NOT expand it.
  If unable to operate within scope, fail explicitly back.
- If the delegated agent reports a read-only or no-write
  constraint, run a minimal reversible OS-temp probe and report
  the exact failure verbatim.
- A delegated agent MUST NOT perform a restricted operation
  without an explicit per-call delegation.

## Dispatch tooling

- Sub-agents MUST be launched via `agents-mcp` (the metyatech
  MCP server). The agent MUST NOT use platform built-in
  subagent spawners.
- Before spawning, run `ai-quota`. If it is unavailable or
  fails, report and MUST NOT spawn.
- When spawning a sub-agent, explicitly specify both `model`
  and `effort` from the `sub-agent-dispatch` skill. The agent
  MUST NOT rely on defaults.
- When spawning an implementation sub-agent, set
  `mode: 'edit'`. Default `mode: 'plan'` is read-only.
- After spawning, return to the user immediately and use
  background or non-blocking monitoring; the agent MUST NOT
  block waiting for completion.
- Dispatch details live in the `sub-agent-dispatch` skill.

## Orchestrator model selection

- Orchestrator model defaults and escalation rules live in the
  `sub-agent-dispatch` skill. The agent MUST NOT use elevated
  effort to improve rule compliance.

## Verification of sub-agent results

- The agent MUST NOT trust a completion claim without evidence.
  Every implementation sub-agent MUST return AC, AC → evidence
  mapping (`PASS`/`FAIL`/`NOT RUN`), files changed,
  assumptions, and risks.
- After implementation, run repo-standard verify commands for
  objective evidence.
- If verification fails, cannot run, or the task is Heavy tier
  or release/production, spawn a separate reviewer sub-agent
  and require explicit `PASS`/`FAIL`. The reviewer MUST
  receive the original AC and spec.
- The agent MUST NOT adopt a result as done unless reviewer
  status is `PASS`. Standard tier with passing verify and clear
  AC evidence MAY skip the reviewer.

## Cost, execution, and lifecycle

- Use the minimum reasoning effort that reliably works. Prefer
  newer models at lower effort and MUST NOT use Heavy-tier
  models for Light or Standard work.
- The agent MUST NOT rapidly switch or respawn sub-agents for
  the same task while one is actively running without errors.
- After a team completes, shut down all team agents and clean
  up resources. If a sub-agent fails, retry, adjust, or
  escalate.
- If a delegated task fails repeatedly because of quota limits
  (HTTP 429), update the task's stage in `task-tracker` so the
  work resumes from the last successful stage.
