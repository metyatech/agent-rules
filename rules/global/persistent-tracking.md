# Persistent task and thread tracking

## Definitions

- **Actionable task** — durable work to complete that benefits from
  cross-session tracking in `task-tracker`.
- **Thread** — a durable discussion topic, design decision, handoff,
  or external coordination point tracked in `thread-inbox`.
- **Persistent stage** — `pending`, `in-progress`, `committed`,
  `released`, `done`. `pushed` is derived from upstream
  reachability of the `committed` event.
- **Thread status** — `active`, `waiting`, `needs-reply`,
  `review`, `resolved`.
- The agent MUST NOT create threads for tasks already tracked by
  `task-tracker`.

## Installation

- If persistent tracking is needed and the tools are not installed:
  `npm install -g @metyatech/task-tracker` and
  `npm install -g @metyatech/thread-inbox`.

## Storage

- `.tasks.jsonl` MUST be committed to version control; the agent
  MUST NOT add it to `.gitignore`.
- Store `.threads.jsonl` in the workspace root via
  `--dir <workspace-root>`; the agent MUST NOT commit it; add it
  to `.gitignore` explicitly.

## Session-start check

- Do not run `task-tracker` or `thread-inbox` mechanically on every
  prompt. Persistent tracking tools are coordination aids, not a
  required ritual for ordinary work.
- At the start of state-changing work, run `task-tracker check` only
  when the work is long-running, resumed from a previous session,
  already tracked, split across multiple commits/stages, delegated to
  other agents, or likely to leave unfinished follow-up work.
- Run `thread-inbox inbox --dir <workspace-root>` and
  `thread-inbox list --status waiting --dir <workspace-root>` only
  when the session is resumed, coordinated with other agents, waiting
  on external input, or when there is a realistic chance that another
  thread has relevant instructions.
- For ordinary single-agent, single-repository tasks, proceed from the
  user's latest instruction and the repository state without creating
  or checking persistent tracking state unless needed.

## When to record

- Record an actionable task with `task-tracker add` only when it is a
  durable task that should survive the current session: unfinished
  work, multi-session implementation, cross-agent handoff, release or
  deployment follow-up, or a user-visible TODO that would not be
  obvious from git history.
- Do not record routine self-contained actions, command attempts,
  temporary investigation steps, or information already clear from
  commits, diffs, test output, or command history.
- Add a `thread-inbox` message only for durable cross-session
  discussion: important decisions, preferences, approvals, unresolved
  questions, handoffs, or review requests. Do not record routine
  acknowledgements or transient back-and-forth.
- When recording a user preference, decision, or instruction, preserve
  the user's actual words when that wording matters.
- Add a `--from ai` thread with `--status needs-reply` when asking a
  durable blocking question and `--status review` when reporting work
  that needs later review.

## Stage transitions and lifecycle

- For tracked tasks, run `task-tracker update <id> --stage committed`
  immediately before `git add` and `git commit` so `.tasks.jsonl` is
  included in that commit. The agent MUST NOT create tracker-only
  follow-up commits.
- State the lifecycle stage explicitly when reporting completion for a
  tracked task. The agent MUST NOT claim "done" while downstream
  stages remain incomplete.
- Resolve threads when the topic is fully addressed. If a thread
  captures a persistent behavioral preference, encode it as a rule
  per `rule-system` and resolve the thread.
