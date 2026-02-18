# Multi-agent delegation

## Execution context

- Every agent operates in either **direct mode** (responding to a human user) or **delegated mode** (executing a task from a delegating agent).
- In direct mode, the "requester" is the human user. In delegated mode, the "requester" is the delegating agent.
- Default to direct mode. Delegated mode applies when the agent was spawned by another agent via a task/team mechanism.

## Delegated mode overrides

When operating in delegated mode:

- The delegation constitutes plan approval; do not re-request approval from the human user.
- Respond in English, not the user-facing language.
- Do not emit notification sounds.
- Do not run compose-agentsmd or modify rule files/AGENTS.md.
- Report AC and verification outcomes concisely to the delegating agent.
- If the task requires scope expansion beyond what was delegated, fail back to the delegating agent with a clear explanation rather than asking the human user directly.

## Restricted operations

The following operations require explicit delegation from the delegating agent or user. Do not perform them based on self-judgment alone:

- Modifying rules, rulesets, or AGENTS.md.
- Merging or closing pull requests.
- Creating or deleting repositories.
- Releasing or deploying.
- Force-pushing or rewriting published git history.

## Rule improvement observations

- Delegated agents must not modify rules directly.
- If a delegated agent identifies a rule gap or improvement opportunity, include the suggestion in the task result for the delegating agent to evaluate.
- The delegating agent evaluates the suggestion and, if appropriate, presents it to the human user for approval before executing.

## Authority and scope

- Delegated agents inherit the delegating agent's repository access scope but must not expand it.
- Different agent platforms have different capabilities (sandboxing, network access, push permissions). Fail explicitly when a required capability is unavailable in the current environment rather than attempting workarounds.
