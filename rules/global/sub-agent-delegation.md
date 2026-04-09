# Sub-agent delegation and dispatch

## Definitions

- **Delegator** — the agent or human that spawns another agent.
- **Delegated agent** — the agent spawned by a delegator.
  Operates in delegated mode (defined in `posture-and-delivery`).
- **Restricted operation** — an operation a delegated agent
  MUST NOT perform without an explicit per-call delegation:
  modifying rules or rulesets, merging or closing pull requests,
  creating or deleting repositories, releasing or deploying,
  force-pushing, or rewriting published history.
- **Tier** — task difficulty/cost classification: Free, Light,
  Standard, Heavy, Large Context.
- **Effort** — model reasoning intensity (`low`, `medium`,
  `high`, `xhigh`, `max`); not every model supports every level.

## Tier classification

- **Free** — trivial lookups; Copilot 0x models only.
- **Light** — mechanical transforms, formatting, simple edits.
- **Standard** — general implementation, code review,
  multi-file changes.
- **Heavy** — architecture, safety-critical code, complex
  multi-step reasoning.
- **Large Context** — > 200k input tokens; prefer 1M-context.

## Spawning a delegated agent

- The delegating prompt MUST state delegated mode and the
  approval state, include acceptance criteria, verification
  requirements, and task context. The delegator MUST NOT assume
  the delegated agent has access to the calling conversation.
- The delegating prompt MUST NOT recite rules the delegated
  agent will already read from AGENTS.md.
- Two or more agents MAY write in the same repository only
  when each uses an isolated checkout, worktree, or branch AND
  one integration owner serializes merge or rebase back into
  the canonical branch. Otherwise, run them sequentially.

## Delegated-agent obligations

- Respond in English; report verification evidence concisely.
- The delegated agent MUST NOT modify rules directly; report
  rule-gap suggestions in the result for delegator review.
- Inherit the delegator's repository scope; MUST NOT expand it.
  If unable to operate within scope, fail explicitly back.
- If the delegated agent reports a read-only or no-write
  constraint, run a minimal reversible OS-temp probe and
  report the exact failure verbatim.
- A delegated agent MUST NOT perform a restricted operation
  without an explicit per-call delegation.

## Dispatch tooling

- Sub-agents MUST be launched via `agents-mcp` (the metyatech
  MCP server). The agent MUST NOT use platform built-in
  subagent spawners.
- Before spawning, run `ai-quota` to verify quota across all
  candidate agents. If `ai-quota` is unavailable or fails,
  report and MUST NOT spawn.
- When spawning a sub-agent, explicitly specify both `model`
  and `effort` from the model inventory in the
  `sub-agent-dispatch` skill. The agent MUST NOT rely on
  default model selection.
- When spawning an implementation sub-agent, set
  `mode: 'edit'`. Default `mode: 'plan'` is read-only.
- After spawning, return to the user immediately and use
  background or non-blocking monitoring; the agent MUST NOT
  block waiting for completion.
- Decision framework, model inventory tables, routing logic,
  prompt templates, quota fallback logic, and platform-specific
  procedures live in the `sub-agent-dispatch` skill.

## Orchestrator model selection

- When spawning the manager orchestrator role, default to
  `claude-sonnet-4-6` with `medium` effort.
- Escalate to `claude-opus-4-6` with `medium` effort when
  strict rule compliance is required. Research
  (arXiv:2505.11423) shows higher effort degrades
  instruction-following on multi-constraint rule sets.
- Use `high`, `xhigh`, or `max` effort only for complex
  reasoning tasks. The agent MUST NOT use elevated effort to
  improve rule compliance.

## Verification of sub-agent results

- The agent MUST NOT trust a completion claim without evidence.
  Every implementation sub-agent MUST return: restated AC, AC
  → evidence mapping (`PASS`/`FAIL`/`NOT RUN`), files changed,
  assumptions and uncertainties, risks and rollback notes.
- After implementation, run repo-standard verify commands for
  objective evidence.
- If verification fails, cannot run, or the task is Heavy tier
  or release/production, spawn a separate reviewer sub-agent
  (never the same instance) and require explicit `PASS`/`FAIL`.
  The reviewer MUST receive the original AC and spec.
- The agent MUST NOT adopt a result as done unless reviewer
  status is `PASS`. EXCEPTION: Standard tier with passing
  verify AND clear AC evidence MAY skip the reviewer.

## Cost, execution, and lifecycle

- Use the minimum reasoning effort that reliably produces
  correct output. Prefer newer-generation models at lower
  effort over older models at maximum effort. The agent MUST
  NOT use Heavy-tier models for Light or Standard tier tasks.
- The agent MUST NOT rapidly switch or respawn sub-agents for
  the same task while one is actively running without errors.
- After a team completes, shut down all team agents and clean
  up resources. If a sub-agent fails, the agent MUST NOT
  silently swallow the failure: retry, adjust, or escalate.
- If a delegated task fails repeatedly because of quota limits
  (HTTP 429), update the task's stage in `task-tracker` so the
  work resumes from the last successful stage.
