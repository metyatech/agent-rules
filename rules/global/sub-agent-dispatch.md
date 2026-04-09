# Sub-agent dispatch

This module defines the invariants the agent MUST follow whenever
dispatching sub-agents. Detailed procedures, model inventory
tables, and routing reference data live in the
`sub-agent-dispatch` skill. Spawning prompt requirements live in
`delegation`.

## Dispatch tooling

- Sub-agents MUST be launched via `agents-mcp` (the metyatech MCP
  server). The agent MUST NOT use platform built-in subagent
  spawners; they bypass cost-optimized routing.
- Before spawning any sub-agent, the agent MUST run `ai-quota` to
  verify quota across all candidate agents. If `ai-quota` is
  unavailable or fails, report the limitation and MUST NOT spawn
  any sub-agent.
- When spawning an implementation sub-agent, the agent MUST set
  `mode: 'edit'`. Default `mode: 'plan'` is read-only and wastes
  the call.
- After spawning, the agent MUST return to the user immediately
  and MUST use background or non-blocking monitoring. The agent
  MUST NOT block the conversation waiting for completion.

## Decision framework

The agent MUST classify each work item into one of:

1. **Trivial** (rare) — single lookup → do it yourself.
2. **Independent medium-to-large** — self-contained work →
   launch one background sub-agent with a self-contained prompt.
3. **Multi-agent coordinated** — multiple sub-agents collaborate
   → create a team with explicit task boundaries and
   dependencies.
4. **Dependent tasks** — B needs A's output → run A first, then
   B with A's results.
5. **Conflicting tasks** — same files or repository → run
   sequentially.

## Verification of sub-agent results

- The agent MUST NOT trust a completion claim without evidence.
- The agent MUST require every implementation sub-agent to
  return: (1) restated AC, (2) AC → evidence mapping with exact
  commands and outcomes (`PASS` / `FAIL` / `NOT RUN`), (3) files
  changed list, (4) assumptions and uncertainties, (5) risks and
  rollback notes.
- After implementation, the agent MUST run repo-standard verify
  commands (`npm run verify` or equivalent) for objective
  evidence.
- If verification fails, cannot run, or the task is Heavy tier
  or release/production, the agent MUST spawn a separate
  reviewer sub-agent (never the same instance) and MUST require
  explicit `PASS` or `FAIL` with reasons. The reviewer MUST
  receive the original AC and spec alongside the implementation
  output.
- The agent MUST NOT adopt a result as done unless reviewer
  status is `PASS`. EXCEPTION: Standard tier with passing verify
  AND clear AC evidence MAY skip the reviewer.

## Cost and execution discipline

- The agent MUST use the minimum reasoning effort that reliably
  produces correct output. The agent MUST prefer
  newer-generation models at lower effort over older models at
  maximum effort.
- The agent MUST NOT use Heavy-tier models for Light or Standard
  tier tasks.
- The agent MUST NOT rapidly switch or respawn sub-agents for
  the same task while one is actively running without errors.
  Status checks MUST NOT justify premature replacement.

## Lifecycle and failure handling

- After a team completes, the agent MUST shut down all team
  agents and clean up resources.
- If a sub-agent fails, the agent MUST NOT silently swallow the
  failure. The agent MUST retry, adjust approach, or escalate to
  the user.
