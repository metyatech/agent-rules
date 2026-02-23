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
- Allowed before approval:
  - Clarifying questions and read-only inspection (reading files, searching, and `git status` / `git diff` / `git log`).
  - Any unavoidable automated work triggered as a side-effect of those read-only commands.
  - Any command execution that must not adversely affect program behavior or external systems (including changes made by tooling), such as:
    - Installing/restoring dependencies using repo-standard tooling (lockfile changes are allowed).
    - Running formatters/linters/typecheck/tests/builds (including auto-fix/formatting that modifies files).
    - Running code generation/build steps that are deterministic and repo-scoped.
    - Running these from clean → dirty → clean is acceptable; publishing/deploying/migrating is not.
- Before any other state-changing execution (e.g., writing or modifying files by hand, changing runtime behavior, or running git commands beyond status/diff/log), do all of the following:
  - Restate the request as Acceptance Criteria (AC) and verification methods, following "Delivery hard gates" (keep concise by default).
  - Produce a written plan (use your planning tool when available) focused on the goal, approach, and verification checkpoints (keep concise by default; do not enumerate per-file implementation details or exact commands unless the requester asks).
  - Confirm the plan with the requester, ask for approval explicitly, and wait for a clear "yes" before executing.
  - Once the requester has approved a plan, proceed within that plan without re-requesting approval; re-request approval only when you change or expand the plan.
  - Do not treat the original task request as plan approval; approval must be an explicit response to the presented plan.
  - Include a compact approval-request block at the end of the plan proposal message so the requester can approve with a single short reply.
    - Template:
      ```text
      Approval request
      - Reply "yes" to approve this plan and proceed.
      - Reply with changes to revise before executing.
      ```
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
