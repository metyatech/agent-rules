# Thread inbox

This module governs the use of `thread-inbox` to preserve
cross-session conversation context, decisions, and discussion
topics. Detailed status semantics and lifecycle procedures are
defined in the `manager` skill.

## Definitions

- **Thread** — a single discussion topic or design decision tracked
  by `thread-inbox`. Distinct from an actionable task (which lives
  in `task-tracker`).
- **Workspace root** — the top-level directory under which the
  current work and `.threads.jsonl` live. Passed via `--dir` to
  every `thread-inbox` invocation.

## Installation

- If `thread-inbox` is not installed, the agent MUST install it via
  `npm install -g @metyatech/thread-inbox` before proceeding.

## Storage and version control

- The agent MUST store `.threads.jsonl` in the workspace root by
  passing `--dir <workspace-root>` to every `thread-inbox`
  invocation.
- The agent MUST NOT commit `.threads.jsonl` to version control.
  The agent MUST add `.threads.jsonl` to the repository
  `.gitignore` explicitly so it stays untracked by default.

## Session-start check

- At the start of every session, the agent MUST run
  `thread-inbox inbox --dir <workspace-root>` and
  `thread-inbox list --status waiting --dir <workspace-root>` to
  find threads needing attention. The agent MUST report findings
  before starting new work.

## When to use threads

- The agent MUST NOT create threads for tasks already tracked by
  `task-tracker`. Threads are for context and decisions, not for
  work items.
- A thread MUST capture discussion topics, design decisions, and
  multi-session context the agent should remember across sessions.

## CLI invocation

- Create: `thread-inbox new "<title>" --dir <workspace-root>`. The
  agent MUST create the thread before adding messages to it.
- Add a message:
  `thread-inbox add <id> --from user|ai "<message>" --dir <workspace-root>`.
- Inspect: `thread-inbox inbox --dir <workspace-root>`,
  `thread-inbox list --status <status> --dir <workspace-root>`.

## Promoting threads to rules

- If a thread captures a persistent behavioral preference, the
  agent MUST encode the preference as a rule per `rule-system` and
  MUST resolve the thread.
