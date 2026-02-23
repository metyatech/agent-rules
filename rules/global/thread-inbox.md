# Thread inbox

- `thread-inbox` is the persistent cross-session conversation context tracker. Use it to preserve discussion topics, decisions, and context that span sessions.
- If `thread-inbox` is not installed, install it via `npm install -g @metyatech/thread-inbox` before proceeding.
- Store `.threads.jsonl` in the workspace root directory (use `--dir <workspace-root>`). Do not commit it to version control; it is local conversation context, not project state.

## Session start

- At the start of any session, run `thread-inbox list --status waiting --dir <workspace-root>` to find threads needing agent attention (user sent the last message).
- Also run `thread-inbox list --dir <workspace-root>` for a full overview of active threads.
- Report findings before starting new work.

## When to create threads

- Create a thread when a new discussion topic, design decision, or multi-session initiative emerges.
- Do not create threads for tasks already tracked by `task-tracker`; threads are for context and decisions, not work items.
- Thread titles should be concise topic descriptions (e.g., "CI strategy for skill repos", "thread-inbox design approach").

## When to add messages

- Add a `--from user` message when the user provides a key decision, preference, or direction.
- Add a `--from ai` message when you provide a proposal, recommendation, or status update that the user should review next session.
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
