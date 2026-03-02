# Planning and approval gate

- **Always OK** (no approval needed): read-only inspection, spawning read-only agents, temp files under OS temp, dependency install, formatters/linters/typecheck/tests/builds (including auto-fix), deterministic codegen/build steps.
- **Always ask** (approval required): file/rule/config edits, dependency/tool changes, git beyond status/diff/log, external side effects (deploy/publish/API writes/account changes).
- **Uncertain impact**: request approval.
- **Default flow**: clarify goal + plan → restate as AC → confirm with requester → wait for explicit "yes" → execute. Re-request only if plan/scope changes.
- **Delegated mode**: delegation itself is plan approval; fail back on scope expansion.
- Do not treat the original task request as plan approval.
- If state-changing work starts without required "yes", stop immediately, report the gate miss, and restart from the approval gate.
- No bypass exceptions: "skip planning/just do it" means move quickly through the gate, not around it.
- **Blanket approval**: broad directives (e.g., "fix everything") cover all in-scope follow-up; re-request only for out-of-scope expansion.

Reviewer proxy approval procedures are in the `autonomous-orchestrator` skill.
