# Sub-agent dispatch

This module defines the invariants the agent MUST follow whenever
dispatching sub-agents. Detailed dispatch procedures, model
inventory tables, and routing reference data live in the
`sub-agent-dispatch` skill. Spawning prompt requirements and
delegated-agent obligations live in the `delegation` rule.

## Dispatch tooling

- Sub-agents MUST be launched via `agents-mcp` (the metyatech MCP
  server). The agent MUST NOT use platform built-in subagent
  spawners, which run agents at the orchestrator's own model tier
  and bypass cost-optimized routing.
- Before spawning any sub-agent, the agent MUST run `ai-quota` to
  verify quota across all candidate agents. If `ai-quota` is
  unavailable or fails, the agent MUST report the limitation and
  MUST NOT spawn any sub-agent.
- When spawning an implementation sub-agent, the agent MUST set
  `mode: 'edit'`. The default `mode: 'plan'` is read-only and
  wastes the agent call.
- After spawning, the agent MUST return to the user immediately.
  The agent MUST NOT block the conversation waiting for sub-agent
  completion. The agent MUST use background or non-blocking
  monitoring instead.

## Decision framework

When deciding how to handle each work item, the agent MUST
classify it into one of the following categories:

1. **Trivial** (rare) — single lookup, one-line answer → do it
   yourself.
2. **Independent medium-to-large** — self-contained work →
   launch a single background sub-agent with a self-contained
   prompt.
3. **Multi-agent coordinated** — multiple sub-agents must
   collaborate → create a team and define task boundaries and
   dependencies.
4. **Dependent tasks** — task B needs task A's output → run A
   first, then B with A's results.
5. **Conflicting tasks** — same files or repository at risk of
   collision → run sequentially.

## Verification of sub-agent results

- The agent MUST NOT trust a sub-agent's completion claim without
  evidence.
- The agent MUST require every implementation sub-agent to return
  this deliverable format:
  1. Restated acceptance criteria.
  2. AC → evidence mapping with exact commands or manual steps
     and outcomes (`PASS` / `FAIL` / `NOT RUN`).
  3. Files changed list (exact paths).
  4. Assumptions and uncertainties.
  5. Risks and rollback notes.
- After implementation, the agent MUST first run repo-standard
  verification commands (`npm run verify` or equivalent) to
  obtain objective evidence.
- If verification fails, cannot run, or the task is Heavy tier
  or a release/production change, the agent MUST spawn a
  separate reviewer sub-agent (never the same agent instance)
  and MUST require an explicit `PASS` or `FAIL` result with
  reasons.
- The reviewer MUST receive the original AC and spec alongside
  the implementation output, not just the code.
- The agent MUST NOT adopt a result, summarize as done, or
  request lifecycle completion steps unless the reviewer status
  is `PASS` (or the task is Standard tier with passing
  verification AND clear AC evidence, in which case a reviewer
  is OPTIONAL).

## Cost discipline

- The agent MUST minimize total dispatch cost (model pricing +
  reasoning tokens + context + retries).
- The agent MUST use the minimum reasoning effort level
  (`low` / `medium` / `high` / `xhigh`) that reliably produces
  correct output.
- The agent MUST prefer newer-generation models at lower
  reasoning effort over older models at maximum effort when both
  can succeed.
- The agent MUST NOT use Heavy-tier models for Light or Standard
  tier tasks.

## Execution discipline

- The agent MUST NOT rapidly switch or respawn sub-agents for
  the same task while one is actively running without errors.
- Status checks SHOULD be non-blocking. The agent MUST NOT use
  status checks as justification for premature agent
  replacement.

## Lifecycle and cleanup

- After a team completes its work, the agent MUST shut down all
  team agents gracefully and MUST clean up team resources.
- If a sub-agent fails, the agent MUST NOT silently swallow the
  failure. The agent MUST retry, adjust approach, or escalate to
  the user.
