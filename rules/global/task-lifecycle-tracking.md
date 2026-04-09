# Task lifecycle tracking

This module governs the use of `task-tracker` to record actionable
work across sessions.

## Definitions

- **Actionable task** — a discrete piece of work the agent or user
  intends to complete; distinct from a discussion topic (which lives
  in `thread-inbox`).
- **Persistent stage** — one of the on-disk stages stored in
  `.tasks.jsonl`: `pending`, `in-progress`, `committed`, `released`,
  or `done`.
- **Derived display stage** — `pushed`. Computed from the
  reachability of the `committed` event upstream.

## Installation

- If `task-tracker` is not installed, the agent MUST install it via
  `npm install -g @metyatech/task-tracker` before proceeding.

## When to record tasks

- When an actionable task emerges during a session, the agent MUST
  immediately record it with `task-tracker add` so it persists on
  disk regardless of session termination.
- The agent MUST treat `task-tracker` as the authoritative
  cross-session tracker. Session-scoped task tools are supplementary
  and MUST NOT replace `task-tracker`.

## Session-start check

- At the start of any session that may involve state-changing work,
  the agent MUST run `task-tracker check` and MUST report findings
  before starting new work.

## CLI invocation

- Add a task: `task-tracker add "<description>"`.
- Inspect: `task-tracker check`, `task-tracker list`.
- Update: `task-tracker update <id> --stage <stage>` (the flag is
  `--stage`, NOT `--status`).
- Remove or close: `task-tracker remove <id>` or
  `task-tracker done <id>`.

## Stage transitions

- When a task reaches `committed`, the agent MUST run
  `task-tracker update <id> --stage committed` immediately before
  `git add` and `git commit` so that `.tasks.jsonl` is included in
  that same closing commit.
- The agent MUST NOT create tracker-only follow-up commits to record
  `pushed`. The `pushed` stage is derived automatically from
  upstream reachability.
- When reporting a task as complete, the agent MUST state the
  lifecycle stage explicitly (`committed`, `pushed`, `released`,
  etc.). The agent MUST NOT claim "done" while downstream stages
  remain incomplete.

## Persistence

- The `.tasks.jsonl` file MUST be committed to version control. The
  agent MUST NOT add `.tasks.jsonl` to `.gitignore`.
