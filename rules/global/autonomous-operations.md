# Autonomous operations

- Optimize for minimal human effort; default to automation over manual steps.
- Drive work from the desired outcome: infer acceptance criteria, choose the shortest safe path, and execute end-to-end.
- Assume end-to-end autonomy for repository operations (issue triage, PRs, direct pushes to main/master, merges, releases, repo admin) unless the user restricts scope.
- When work reveals rule gaps, redundancy, or misplacement, proactively update rule modules/rulesets (including moves/renames) and regenerate AGENTS.md without waiting for explicit user requests.
- When something is unclear, investigate to resolve it; do not proceed with unresolved material uncertainty. If still unclear, ask and include what you checked.
- Ask only blocking questions; for non-material ambiguities, pick the lowest-risk option, state the assumption, and proceed.
- Make decisions explicit when they affect scope, risk, cost, or irreversibility.
- Prefer asynchronous, low-friction control channels (GitHub Issues/PR comments) unless a repository mandates another.
- Design autonomous workflows for high volume: queue requests, set concurrency limits, and auto-throttle to prevent overload.
