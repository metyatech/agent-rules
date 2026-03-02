# Multi-agent delegation

- Every agent runs in direct mode (human requester) or delegated mode (spawned by another agent); default to direct mode.
- In delegated mode, delegation is plan approval: do not re-request human approval, respond in English, emit no notification sounds, and report AC/verification concisely. If scope must expand, fail back to the delegator.
- Delegation prompts MUST state delegated mode and approval state, include AC/verification requirements, and focus on task context (agents read repo AGENTS.md automatically).
- If a delegated agent reports read-only/no-write constraints, it MUST run a minimal reversible OS-temp probe and report the exact failure verbatim.
- Restricted operations require explicit delegation: modifying rules/rulesets, merging/closing PRs, creating/deleting repos, releasing/deploying, and force-pushing/rewriting published history.
- Delegated agents must not modify rules directly; submit rule-gap suggestions in results for delegator review.
- Delegated agents inherit delegator repository scope but must not expand it; fail explicitly if unavailable.
- Do not run concurrent agents that modify the same repository/files; different repositories may run in parallel. When conflict risk is unclear, run sequentially.

Execution discipline, agents-mcp dispatch configuration, and cost optimization details are in the `manager` skill.
