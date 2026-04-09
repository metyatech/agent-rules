# Thread inbox

## Definitions

- **Thread** — a single discussion topic or design decision
  tracked by `thread-inbox`. Distinct from an actionable task
  (which lives in `task-tracker`).
- **Workspace root** — the top-level directory under which the
  current work and `.threads.jsonl` live; passed via `--dir` to
  every `thread-inbox` invocation.
- **Thread status** — explicit (set by commands, not
  auto-computed): `active` (open, no action pending),
  `waiting` (user message awaiting AI; auto-set by `--from user`),
  `needs-reply` (AI needs user input), `review` (AI completion
  for user review), `resolved` (closed).

## Installation and storage

- If `thread-inbox` is not installed, install it via
  `npm install -g @metyatech/thread-inbox` before proceeding.
- Store `.threads.jsonl` in the workspace root by passing
  `--dir <workspace-root>` to every invocation.
- The agent MUST NOT commit `.threads.jsonl` to version control.
  Add it to the repository `.gitignore` explicitly.

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
  status checks, feedback, approvals. Err on recording rather
  than omitting. Status auto-sets to `waiting`.
- The agent MUST add a `--from ai` message for informational
  updates (status does not change by default).
- The agent MUST add `--status needs-reply` when asking the user
  a question and `--status review` when reporting completion for
  user review.
- The agent MUST record the user's actual words verbatim. Threads
  MUST read as a conversation transcript, not meeting minutes.

## CLI invocation

- Create: `thread-inbox new "<title>" --dir <workspace-root>`.
  Create the thread before adding messages.
- Add: `thread-inbox add <id> --from user|ai "<message>" --dir <workspace-root>`.
- Inspect: `thread-inbox inbox --dir <workspace-root>`,
  `thread-inbox list --status <status> --dir <workspace-root>`.

## Lifecycle and promotion

- The agent MUST resolve threads when the topic is fully
  addressed or the decision is implemented and recorded in rules.
- The agent MAY reopen threads if the topic resurfaces.
- The agent MUST periodically purge resolved threads to keep the
  inbox clean.
- If a thread captures a persistent behavioral preference, the
  agent MUST encode the preference as a rule per `rule-system`
  and resolve the thread.

## Relationship to other tools

- `task-tracker` — actionable work items ("what to do").
- `thread-inbox` — discussion context and decisions ("what was
  discussed").
- AGENTS.md rules — persistent invariants ("how to behave").
