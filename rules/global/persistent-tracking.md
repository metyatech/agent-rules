# Persistent task and thread tracking

## Definitions

- **Actionable task** — work to complete, tracked in `task-tracker`.
- **Thread** — a discussion topic or design decision, tracked in
  `thread-inbox`.
- **Persistent stage** — `pending`, `in-progress`, `committed`,
  `released`, `done`. `pushed` is derived from upstream
  reachability of the `committed` event.
- **Thread status** — `active`, `waiting`, `needs-reply`,
  `review`, `resolved`.
- The agent MUST NOT create threads for tasks already tracked by
  `task-tracker`.

## Installation

- If not installed: `npm install -g @metyatech/task-tracker` and
  `npm install -g @metyatech/thread-inbox`.

## Storage

- `.tasks.jsonl` MUST be committed to version control; the agent
  MUST NOT add it to `.gitignore`.
- Store `.threads.jsonl` in the workspace root via
  `--dir <workspace-root>`; the agent MUST NOT commit it; add it
  to `.gitignore` explicitly.

## Session-start check

- At the start of any session with state-changing work, run
  `task-tracker check`.
- At the start of every session, run `thread-inbox inbox` and
  `thread-inbox list --status waiting` (both with
  `--dir <workspace-root>`). Report findings before starting new
  work.

## When to record

- Record actionable tasks immediately with `task-tracker add`.
  It is the authoritative cross-session tracker; session-scoped
  task tools MUST NOT replace it.
- In `mwt` repos, run `task-tracker add` and updates from the
  owning task worktree. The agent MUST NOT write tracked task
  state from the seed checkout except for read-only inspection or
  after delivery.
- Add a `--from user` thread message for any substantive user
  interaction (decisions, preferences, directions, questions,
  feedback, approvals); status auto-sets to `waiting`. Err on
  recording rather than omitting. Record the user's actual words
  verbatim.
- Add a `--from ai` thread with `--status needs-reply` when
  asking a question and `--status review` when reporting
  completion for review.

## Stage transitions and lifecycle

- Run `task-tracker update <id> --stage committed` immediately
  before `git add` and `git commit` so `.tasks.jsonl` is included
  in that commit. The agent MUST NOT create tracker-only
  follow-up commits.
- State the lifecycle stage explicitly when reporting completion.
  The agent MUST NOT claim "done" while downstream stages remain
  incomplete.
- Resolve threads when the topic is fully addressed. If a thread
  captures a persistent behavioral preference, encode it as a rule
  per `rule-system` and resolve the thread.
