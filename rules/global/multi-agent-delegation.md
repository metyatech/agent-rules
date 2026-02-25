# Multi-agent delegation

- Every agent runs in direct mode (human requester) or delegated mode (spawned by another agent, where the delegator is the requester); default to direct mode.
- In delegated mode, delegation is plan approval: do not re-request human approval, respond in English, emit no notification sounds, and report AC/verification concisely to the delegator. If scope must expand, fail back to the delegator with a clear explanation.
- Delegation prompts MUST state delegated mode and approval state, include AC/verification requirements, and focus on task context (agents read repo AGENTS.md automatically).
- If a delegated agent reports read-only/no-write constraints, it MUST run a minimal reversible OS-temp probe (create/write/read/delete) and report the exact failure verbatim.
- Restricted operations require explicit delegation: modifying rules/rulesets, merging/closing PRs, creating/deleting repos, releasing/deploying, and force-pushing/rewriting published history.
- Delegated agents must not modify rules directly; submit rule-gap suggestions in results for delegator review and human approval.
- Delegated agents inherit delegator repository scope but must not expand it; if required capability is unavailable, fail explicitly.

## Cost optimization (model selection)

- Always specify `model` and `effort` when spawning agents; never rely on defaults.
- Minimize total cost (model pricing, reasoning tokens, context, retries).
- Detailed optimization guidance is in the `manager` skill.

## Parallel execution safety

- Do not run concurrent agents that modify the same repository/files; different repositories may run in parallel.
- When conflict risk is unclear, run sequentially.

## Execution patience and switching discipline

- Do not rapidly switch or respawn sub-agents for the same task while one is actively running without errors.
- For a given delegated task, wait for a terminal state (`completed` / `failed` / `stopped`) before rerouting to another agent, unless there is objective stall evidence.
- Stall handling must be explicit: record the reason (for example no progress signals for a sustained interval or repeated tool failures), then stop and reroute once.
- Status checks should prioritize non-blocking monitoring and user responsiveness, but must not be used as justification for premature agent replacement.
