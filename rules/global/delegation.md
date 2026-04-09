# Multi-agent delegation

This module governs how the agent spawns other agents, what authority
delegated agents inherit, and how concurrent agents coordinate.

## Definitions

- **Delegator** — the agent or human that spawns another agent.
- **Delegated agent** — the agent that has been spawned by a delegator.
  Operates in delegated mode (defined in `autonomous-posture`).
- **Restricted operation** — an operation a delegated agent MUST NOT
  perform without an explicit per-call delegation from the delegator:
  modifying rules or rulesets, merging or closing pull requests,
  creating or deleting repositories, releasing or deploying,
  force-pushing, or rewriting published history.

## Spawning a delegated agent

- The delegating prompt MUST state that the agent runs in delegated
  mode and MUST state the approval state.
- The delegating prompt MUST include acceptance criteria, verification
  requirements, and the task context. The delegator MUST NOT assume
  the delegated agent has access to the calling conversation.
- The delegating prompt MUST NOT include rule recitations that the
  delegated agent will already read from the repository's AGENTS.md.
- Detailed delegation procedures (model selection, dispatch
  configuration, cost optimization, agents-mcp usage) are defined in
  the `manager` skill.

## Delegated-agent obligations

- The delegated agent MUST respond in English and MUST report
  verification evidence concisely.
- The delegated agent MUST NOT modify rules directly. The delegated
  agent MUST report rule-gap suggestions in the result for delegator
  review.
- The delegated agent inherits the delegator's repository scope and
  MUST NOT expand it. If the delegated agent cannot operate within
  scope, it MUST fail explicitly back to the delegator.
- If the delegated agent reports a read-only or no-write constraint,
  it MUST run a minimal reversible OS-temp probe and MUST report the
  exact failure verbatim.
- A delegated agent MUST NOT perform a restricted operation without an
  explicit per-call delegation from the delegator.

## Concurrency

- Two or more agents MAY write in the same repository only when each
  uses an isolated checkout, worktree, or branch AND when one
  integration owner serializes merge or rebase back into the canonical
  branch.
- If isolation or ordered integration is not guaranteed, the delegator
  MUST run the agents sequentially.

## Lifecycle and cleanup

- The delegator MUST NOT stop a delegated agent merely because the
  agent is slow, retrying, or producing weak intermediate output while
  still making progress.
- The delegator MUST stop a delegated agent only for a concrete reason:
  conflict risk, clear divergence, user-owned data risk, or a
  better-scoped replacement.
- If a delegated agent creates clearly agent-owned temporary, plan, or
  memory files outside the target repository, the delegator MUST
  assess and clean them up automatically. The delegator MUST escalate
  only when ownership or value is genuinely ambiguous.
- If a delegated task is failing repeatedly because of quota limits
  (HTTP 429), the delegator MUST update the task's stage in
  `task-tracker` so the work can resume from the last successful
  stage in the next execution cycle.
