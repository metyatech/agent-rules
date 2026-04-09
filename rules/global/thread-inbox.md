# Thread inbox

## Definitions

- **Thread** — a single discussion topic or design decision tracked
  by `thread-inbox`. Distinct from an actionable task (which lives
  in `task-tracker`).
- **Workspace root** — the top-level directory under which the
  current work and `.threads.jsonl` live; passed via `--dir` to
  every `thread-inbox` invocation.
- **Thread status** — explicit (set by commands, not auto-computed):
  - `active` — open, no specific action pending.
  - `waiting` — user sent a message; AI should respond. Auto-set
    when adding `--from user` messages.
  - `needs-reply` — AI needs user input or decision. Set via
    `--status needs-reply`.
  - `review` — AI reporting completion; user should review. Set
    via `--status review`.
  - `resolved` — closed.

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
- Thread titles SHOULD be concise topic descriptions.

## When to add messages

- The agent MUST add a `--from user` message for any substantive
  user interaction: decisions, preferences, directions, questions,
  status checks, feedback, and approvals. The agent MUST err on
  the side of recording rather than omitting. Status auto-sets to
  `waiting`.
- The agent MUST add a `--from ai` message for informational
  updates (progress, notes). Status does not change by default.
- The agent MUST add a `--from ai --status needs-reply` message
  when asking the user a question or requesting a decision.
- The agent MUST add a `--from ai --status review` message when
  reporting task completion or results that need user review.
- The agent MUST record the user's actual words verbatim, not a
  third-person summary. Threads MUST read as a conversation
  transcript, not meeting minutes.

## CLI invocation

- Create: `thread-inbox new "<title>" --dir <workspace-root>`.
  Create the thread before adding messages to it.
- Add a message:
  `thread-inbox add <id> --from user|ai "<message>" --dir <workspace-root>`.
- Inspect: `thread-inbox inbox --dir <workspace-root>`,
  `thread-inbox list --status <status> --dir <workspace-root>`.

## Lifecycle

- The agent MUST resolve threads when the topic is fully
  addressed or the decision is implemented and recorded in rules.
- The agent MAY reopen threads if the topic resurfaces.
- The agent MUST periodically purge resolved threads to keep the
  inbox clean.

## Promoting threads to rules

- If a thread captures a persistent behavioral preference, encode
  the preference as a rule per `rule-system` and resolve the
  thread.

## Relationship to other tools

- `task-tracker`: tracks actionable work items with lifecycle
  stages. Use for "what to do."
- `thread-inbox`: tracks discussion context and decisions. Use
  for "what was discussed/decided."
- AGENTS.md rules: persistent invariants and constraints. Use
  for "how to behave."
