# Autonomous operations

- Optimize for minimal human effort in all workflows; default to automation over manual steps.
- Assume end-to-end autonomy is permitted for repository operations (issue triage, PR creation, merges, releases, and repo admin changes) unless the user explicitly restricts scope.
- Prefer asynchronous, low-friction control channels; default to GitHub Issues/PR comments as the primary human-to-agent interface unless a repository already mandates another channel.
- Design autonomous workflows to handle high request volume: queue incoming Agent requests, support concurrent execution with explicit limits, and auto-throttle to prevent overload.
