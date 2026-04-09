# Persistent task and thread tracking

## Definitions

- **Actionable task** — a discrete piece of work to complete
  (`task-tracker`, "what to do").
- **Thread** — a single discussion topic or design decision
  (`thread-inbox`, "what was discussed").
- **Persistent stage** — on-disk task stages: `pending`,
  `in-progress`, `committed`, `released`, `done`. `pushed` is
  derived from upstream reachability of the `committed` event.
- **Thread status** — `active`, `waiting` (auto-set by
  `--from user`), `needs-reply`, `review`, `resolved`.
- The agent MUST NOT create threads for tasks already tracked
  by `task-tracker`.

## Installation

- If not installed, install via
  `npm install -g @metyatech/task-tracker` and
  `npm install -g @metyatech/thread-inbox`.

## Storage

- `.tasks.jsonl` MUST be committed to version control. The
  agent MUST NOT add it to `.gitignore`.
- Store `.threads.jsonl` in the workspace root by passing
  `--dir <workspace-root>` to every `thread-inbox` invocation.
  The agent MUST NOT commit `.threads.jsonl`; add it to
  `.gitignore` explicitly.

## Session-start check

- At the start of any session that may involve state-changing
  work, run `task-tracker check`.
- At the start of every session, run
  `thread-inbox inbox --dir <workspace-root>` and
  `thread-inbox list --status waiting --dir <workspace-root>`.
  Report findings before starting new work.

## When to record

- When an actionable task emerges, immediately record it with
  `task-tracker add`. Treat `task-tracker` as the authoritative
  cross-session tracker; session-scoped task tools MUST NOT
  replace it.
- A thread MUST capture discussion topics, design decisions,
  and multi-session context to remember across sessions.
- Add a `--from user` thread message for any substantive user
  interaction (decisions, preferences, directions, questions,
  feedback, approvals); status auto-sets to `waiting`. Err on
  recording rather than omitting.
- Add a `--from ai` thread message for informational updates.
  Use `--status needs-reply` when asking the user a question
  and `--status review` when reporting completion for review.
- Record the user's actual words verbatim. Threads MUST read
  as a conversation transcript, not meeting minutes.

## Stage transitions and lifecycle

- When a task reaches `committed`, run
  `task-tracker update <id> --stage committed` immediately
  before `git add` and `git commit` so `.tasks.jsonl` is
  included in that closing commit. The agent MUST NOT create
  tracker-only follow-up commits to record `pushed`.
- When reporting a task as complete, state the lifecycle stage
  explicitly. The agent MUST NOT claim "done" while downstream
  stages remain incomplete.
- Resolve threads when the topic is fully addressed or the
  decision is implemented and recorded in rules. Periodically
  purge resolved threads.
- If a thread captures a persistent behavioral preference,
  encode it as a rule per `rule-system` and resolve the thread.
