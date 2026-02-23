# Thread inbox

- `thread-inbox` is the persistent cross-session conversation context tracker. Use it to preserve discussion topics, decisions, and context that span sessions.
- If `thread-inbox` is not installed, install it via `npm install -g @metyatech/thread-inbox` before proceeding.
- Store `.threads.jsonl` in the workspace root directory (use `--dir <workspace-root>`). Do not commit it to version control; it is local conversation context, not project state.

## Status model

Thread status is explicit (set by commands, not auto-computed):

- `active` — open, no specific action pending.
- `waiting` — user sent a message; AI should respond. Auto-set when adding `--from user` messages.
- `needs-reply` — AI needs user input or decision. Set via `--status needs-reply`.
- `review` — AI reporting completion; user should review. Set via `--status review`.
- `resolved` — closed.

## Session start

- Run `thread-inbox inbox --dir <workspace-root>` to find threads needing user action (`needs-reply` and `review`).
- Run `thread-inbox list --status waiting --dir <workspace-root>` to find threads needing agent attention.
- Report findings before starting new work.

## When to create threads

- Create a thread when a new discussion topic, design decision, or multi-session initiative emerges.
- Do not create threads for tasks already tracked by `task-tracker`; threads are for context and decisions, not work items.
- Thread titles should be concise topic descriptions (e.g., "CI strategy for skill repos", "thread-inbox design approach").

## When to add messages

- Add a `--from user` message for any substantive user interaction: decisions, preferences, directions, questions, status checks, feedback, and approvals. Thread-inbox is the only cross-session persistence mechanism for conversation context; err on the side of recording rather than omitting. Status auto-sets to `waiting`.
- Add a `--from ai` message for informational updates (progress, notes). Status does not change by default.
- Add a `--from ai --status needs-reply` message when asking the user a question or requesting a decision.
- Add a `--from ai --status review` message when reporting task completion or results that need user review.
- Keep messages concise — capture the decision or context, not the full conversation.

## Thread lifecycle

- Resolve threads when the topic is fully addressed or the decision is implemented and recorded in rules.
- Reopen threads if the topic resurfaces.
- Periodically purge resolved threads to keep the inbox clean.

## Relationship to other tools

- `task-tracker`: Tracks actionable work items with lifecycle stages. Use for "what to do."
- `thread-inbox`: Tracks discussion context and decisions. Use for "what was discussed/decided."
- AGENTS.md rules: Persistent invariants and constraints. Use for "how to behave."
- If a thread captures a persistent behavioral preference, encode it as a rule and resolve the thread.
