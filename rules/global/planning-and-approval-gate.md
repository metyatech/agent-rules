# Planning and approval gate

## Approval waiver (trivial tasks)

- In direct mode, you MAY proceed without asking for explicit approval when the user request is a trivial operational check and the action is low-risk and reversible.
- Allowed under this waiver:
  - Read-only inspection and verification (including running linters/tests/builds) that does not modify repo files.
  - Spawning a sub-agent for a read-only smoke check (no repo writes; temp-only and cleaned up).
  - Creating temporary files only under the OS temp directory (and deleting them during the task).
- Not allowed under this waiver (approval is still required):
  - Any manual edit of repository files, configuration files, or rule files.
  - Installing/uninstalling dependencies or changing tool versions.
  - Git operations beyond status/diff/log (commit/push/merge/release).
  - Any external side effects (deployments, publishing, API writes, account/permission changes).
- If there is any meaningful uncertainty about impact, request approval as usual.

- Default to a two-phase workflow: clarify goal + plan first, execute after explicit requester approval.
- In delegated mode (see Multi-agent delegation), the delegation itself constitutes plan approval. Do not re-request approval from the human user. If scope expansion is needed, fail back to the delegating agent.
- If a request may require any state-changing work, you MUST first dialogue with the requester to clarify details and make the goal explicit. Do not proceed while the goal is ambiguous.
- Allowed before approval: read-only inspection, dependency install, formatters/linters/typecheck/tests/builds (including auto-fix), and deterministic code generation/build steps.
- Before any other state-changing execution: restate as AC, produce a plan, confirm with the requester, and wait for explicit "yes" before executing. Once approved, proceed without re-requesting; re-request only when changing or expanding the plan.
- Do not treat the original task request as plan approval.
- If state-changing execution starts without the required post-plan "yes", stop immediately, report the gate miss, add/update a prevention rule, regenerate AGENTS.md, and then restart from the approval gate.
- No other exceptions: even if the user requests immediate execution (e.g., "skip planning", "just do it"), treat that as a request to move quickly through this gate, not to bypass it.

## Scope-based blanket approval

- When the user gives a broad directive that clearly encompasses multiple steps (e.g., "fix everything", "do all of these"), treat it as approval for all work within that scope; do not re-request approval for individual sub-steps, batches, or obviously implied follow-up actions.
- Obviously implied follow-up includes: rebuild linked packages, restart local services, update global installs, and other post-change deployment steps covered by existing rules.
- Re-request approval only when expanding beyond the original scope or when an action carries risk not covered by the original directive.

## Reviewer proxy approval

- When the autonomous-orchestrator skill is active, the skill invocation itself constitutes blanket approval for all operations within user-owned repositories. The orchestrator MUST approve plans via reviewer proxy without asking the human user.
- The reviewer proxy evaluates plans against all rules, known error patterns, and quality standards before approving.
- If the reviewer proxy approves (all checklist items pass), proceed without human approval.
- If the reviewer proxy flags concerns, escalate to the human user.
- The human user may override or interrupt at any time; user messages always take priority.
- Reviewer proxy does NOT apply to restricted operations (creating/deleting repositories, force-pushing, rewriting published git history) — these always require human approval per Multi-agent delegation rules.
- During autonomous operation, the orchestrator applies rule modifications directly when the reviewer proxy confirms they are safe and consistent with existing policies. Escalate to the human user only if the change conflicts with existing rules or carries ambiguous risk.
