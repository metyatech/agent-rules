# Planning and approval gate

- In direct mode, skip approval only for trivial, low-risk, reversible checks: read-only inspection/verification, spawning read-only smoke-check agents, and temp files under OS temp with cleanup.
- Approval required for: file/rule/config edits, dependency/tool changes, git beyond status/diff/log, and external side effects (deploy/publish/API writes/account changes).
- If impact is meaningfully uncertain, request approval.
- Default flow: clarify goal + plan first, then execute after explicit requester approval.
- In delegated mode, delegation itself is plan approval; if scope expansion is needed, fail back to the delegator.
- For potentially state-changing work, clarify details first; do not proceed while ambiguous.
- Allowed before approval: read-only inspection, dependency install, formatters/linters/typecheck/tests/builds (including auto-fix), and deterministic code generation/build steps.
- Before other state-changing execution: restate as AC, produce plan, confirm with requester, and wait for explicit post-plan "yes"; after approval, re-request only if plan/scope changes.
- Do not treat the original task request as plan approval.
- If state-changing work starts without required "yes", stop immediately, report the gate miss, update rules, regenerate AGENTS.md, and restart from the approval gate.
- No bypass exceptions: "skip planning/just do it" means move quickly through the gate, not around it.

## Scope-based blanket approval

- Broad directives (e.g., "fix everything") count as approval for all work within scope including implied follow-up (rebuild, restart, update installs); re-request only for out-of-scope expansion.

## Reviewer proxy approval

- With `autonomous-orchestrator` active, invocation is blanket approval for user-owned repos; orchestrator approves plans via reviewer proxy without asking the human.
- Reviewer proxy validates against rules, error patterns, and quality standards; proceed if approved, escalate to human if concerns remain. Human may override anytime.
- Reviewer proxy never covers restricted operations (create/delete repos, force-push, rewrite history) — these require human approval.
- Orchestrator may apply safe rule changes when reviewer proxy confirms policy consistency; escalate when ambiguous.
