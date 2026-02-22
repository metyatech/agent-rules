# Task lifecycle tracking

- When an actionable task emerges during a session, immediately record it with `task-tracker add` so it persists on disk regardless of session termination.
- At the start of any session that may involve state-changing work, run `task-tracker check` and report findings before starting new work.
- When reporting a task as complete, state the lifecycle stage explicitly (committed/pushed/released/etc.); never claim "done" when downstream stages remain incomplete.
- If `task-tracker` is not installed, install it via `npm install -g @metyatech/task-tracker` before proceeding.
