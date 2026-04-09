# Thread inbox

Detailed status semantics and lifecycle procedures live in the
`manager` skill.

## Definitions

- **Thread** — a single discussion topic or design decision tracked
  by `thread-inbox`. Distinct from an actionable task (which lives
  in `task-tracker`).
- **Workspace root** — the top-level directory under which the
  current work and `.threads.jsonl` live; passed via `--dir` to
  every `thread-inbox` invocation.

## Installation

- If `thread-inbox` is not installed, install it via
  `npm install -g @metyatech/thread-inbox` before proceeding.

## Storage and version control

- Store `.threads.jsonl` in the workspace root by passing
  `--dir <workspace-root>` to every `thread-inbox` invocation.
- The agent MUST NOT commit `.threads.jsonl` to version control.
  Add `.threads.jsonl` to the repository `.gitignore` explicitly.

## Session-start check

- At the start of every session, run
  `thread-inbox inbox --dir <workspace-root>` and
  `thread-inbox list --status waiting --dir <workspace-root>` to
  find threads needing attention. Report findings before starting
  new work.

## When to use threads

- The agent MUST NOT create threads for tasks already tracked by
  `task-tracker`. Threads are for context and decisions, not for
  work items.
- A thread MUST capture discussion topics, design decisions, and
  multi-session context the agent should remember across sessions.

## CLI invocation

- Create: `thread-inbox new "<title>" --dir <workspace-root>`.
  Create the thread before adding messages to it.
- Add a message:
  `thread-inbox add <id> --from user|ai "<message>" --dir <workspace-root>`.
- Inspect: `thread-inbox inbox --dir <workspace-root>`,
  `thread-inbox list --status <status> --dir <workspace-root>`.

## Promoting threads to rules

- If a thread captures a persistent behavioral preference, encode
  the preference as a rule per `rule-system` and resolve the
  thread.
