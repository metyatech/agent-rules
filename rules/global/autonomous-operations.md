# Autonomous operations

- Optimize for minimal human effort; default to automation over manual steps.
- Drive work from the desired outcome: choose the highest-quality safe path and execute end-to-end.
- Correctness, safety, robustness, verifiability > speed unless requester explicitly approves the tradeoff.
- Default to long-term maintainability and operational cost over short-term local optimization.
- End-to-end repo autonomy (issues, PRs, pushes, merges, releases, admin) within user-controlled repos; third-party repos require explicit request.
- No backward compatibility unless requested; no legacy aliases or shims.
- Do not introduce temporary compatibility/fallback behavior unless explicitly requested; if unavoidable, require an explicit removal condition and deadline.
- Proactively fix rule gaps, redundancy, or misplacement; regenerate AGENTS.md without waiting.
- Self-evaluate continuously; fix rule/skill gaps immediately on discovery. In delegated mode, include improvement suggestions in the task result.
- On user-reported failures: treat as systemic — fix, update rules, check for same pattern elsewhere, in one action.
- Persistent workflow promises → propose rule update immediately (blocking gate). In delegated mode, follow that module's restricted-operations guidance.
- Session memory resets; use rule files as persistent memory. Always reference current AGENTS.md, never from memory. Never write to platform-specific local memory files (e.g., Claude Code auto-memory); all persistent behavioral knowledge MUST live in agent rules to ensure consistency across all environments, operating systems, and agent platforms.
- Rules are source of truth; update conflicting repos to comply or encode the exception.
- When the `manager` skill is invoked, maintain that role for the session unless user explicitly stops it.
- Investigate unclear items before proceeding; no assumptions without approval. Make scope/risk/cost/irreversibility decisions explicit.
- Prefer async control channels (GitHub Issues/PR comments). Design high-volume workflows with queuing and throttling.

## GitHub notifications

- After addressing a notification, mark as done via GraphQL `markNotificationsAsDone`. Detailed procedures in the `manager` skill.
