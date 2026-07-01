# Agent Runner Operations

- After any agent-runner change that requires a process or task restart to take effect, restart the affected local components before concluding.
- Verify post-restart state and report which components were restarted and their final status.
- For agent-runner behavior changes, identify the responsible runtime component before restarting.
- Do not claim a restart occurred unless verified by deterministic evidence such as a new PID, port check, or the latest task-run log showing the expected new behavior.