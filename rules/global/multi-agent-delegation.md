# Multi-agent delegation

- Every agent runs in direct mode (human requester) or delegated mode (spawned
  by another agent); default to direct mode.
- In delegated mode, delegation is plan approval: do not re-request human
  approval, respond in English, emit no notification sounds, and report
  AC/verification concisely. If scope must expand, fail back to the delegator.
- Delegation prompts MUST state delegated mode and approval state, include
  AC/verification requirements, and focus on task context (agents read repo
  AGENTS.md automatically).
- If a delegated agent reports read-only/no-write constraints, it MUST run a
  minimal reversible OS-temp probe and report the exact failure verbatim.
- Restricted operations require explicit delegation: modifying rules/rulesets,
  merging/closing PRs, creating/deleting repos, releasing/deploying, and
  force-pushing/rewriting published history.
- Delegated agents must not modify rules directly; submit rule-gap suggestions
  in results for delegator review.
- Delegated agents inherit delegator repository scope but must not expand it;
  fail explicitly if unavailable.
- Concurrent write agents may work in the same repository only when each uses
  an isolated checkout/worktree/branch and one integration owner serializes
  merge/rebase back into the canonical branch. If isolation or ordered
  integration is not guaranteed, run sequentially.
- Do not stop delegated agents merely because they are slow, retrying, or
  producing weak intermediate output while still making progress.
- Stop a delegated agent only for a concrete reason: repo/file conflict risk,
  clear divergence from the approved direction, user-owned data risk, or a
  better-scoped replacement.
- If a delegated agent creates clearly agent-owned temp, plan, or memory files
  outside the target repo, assess and clean them up automatically; escalate only
  when ownership or value is genuinely ambiguous.
- When delegated agents are running and there is no other meaningful in-scope
  work to do locally, prefer waiting for their completion or next material state
  change rather than repeatedly returning early and polling without progress.

Execution discipline, agents-mcp dispatch configuration, and cost optimization
details are in the `manager` skill.
