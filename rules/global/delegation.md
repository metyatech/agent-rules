# Multi-agent delegation

## Definitions

- **Delegator** — the agent or human that spawns another agent.
- **Delegated agent** — the agent spawned by a delegator. Operates
  in delegated mode (defined in `autonomous-posture`).
- **Restricted operation** — an operation a delegated agent MUST
  NOT perform without an explicit per-call delegation: modifying
  rules or rulesets, merging or closing pull requests, creating or
  deleting repositories, releasing or deploying, force-pushing, or
  rewriting published history.

## Spawning a delegated agent

- The delegating prompt MUST state delegated mode and the approval
  state.
- The delegating prompt MUST include acceptance criteria,
  verification requirements, and task context. The delegator MUST
  NOT assume the delegated agent has access to the calling
  conversation.
- The delegating prompt MUST NOT recite rules the delegated agent
  will already read from AGENTS.md.
- Dispatch invariants (agents-mcp usage, ai-quota check, mode
  selection, decision framework, verification gates, cost and
  execution discipline) live in the `sub-agent-dispatch` rule.
  Detailed model inventory tables, routing logic, prompt
  templates, and platform-specific procedures live in the
  `sub-agent-dispatch` skill.

## Delegated-agent obligations

- The delegated agent MUST respond in English and report
  verification evidence concisely.
- The delegated agent MUST NOT modify rules directly; report
  rule-gap suggestions in the result for delegator review.
- The delegated agent inherits the delegator's repository scope and
  MUST NOT expand it. If the delegated agent cannot operate within
  scope, fail explicitly back to the delegator.
- If the delegated agent reports a read-only or no-write
  constraint, run a minimal reversible OS-temp probe and report the
  exact failure verbatim.
- A delegated agent MUST NOT perform a restricted operation without
  an explicit per-call delegation.

## Concurrency

- Two or more agents MAY write in the same repository only when
  each uses an isolated checkout, worktree, or branch AND when one
  integration owner serializes merge or rebase back into the
  canonical branch.
- If isolation or ordered integration is not guaranteed, run the
  agents sequentially.

## Quota-stuck delegated tasks

- If a delegated task fails repeatedly because of quota limits
  (HTTP 429), update the task's stage in `task-tracker` so the work
  resumes from the last successful stage in the next execution
  cycle.
