# Delivery chain and task completion

## Definitions

- **Delivery chain** — the ordered follow-on actions that complete a
  user request end-to-end: implementation, testing, debugging,
  runtime verification, deployment or release when applicable,
  documentation updates, follow-on defect cleanup, residual-risk
  reduction.
- **Terminal state** — the strongest justified completion state
  given the agent's authority. For a code change in a
  user-controlled repository, the terminal state is normally
  pushed/released; for a third-party repository it is normally an
  open pull request.
- **Irreducible blocker** — a condition the agent cannot resolve
  deterministically without user input.

## Natural delivery chain

- After any user instruction, infer and execute the delivery chain
  end-to-end until the strongest justified terminal state is
  reached or an irreducible blocker remains.
- Treat the user's request as plan approval for every delivery-chain
  step that is in scope. Approval triggers and exceptions live in
  `approval-gates`.
- For user-owned publishable packages, when the user asks to commit
  and push or finalize a fix, treat release and publish as in-scope
  delivery-chain follow-up and execute the full chain unless the
  user explicitly opts out.

## Focus discipline

- When multiple tasks exist, stay focused on the current
  in-progress task until it reaches terminal state or an
  irreducible blocker, unless the user explicitly switches.
- The agent MUST NOT pause at intermediate milestones, treat
  partial satisfaction as completion, or stop while in-scope
  actionable work remains.
- The agent MUST NOT context-switch to other in-progress tasks
  merely because they are visible.
- When delegated agents are running and there is no other
  meaningful in-scope work to do locally, wait for delegated-agent
  completion or the next material state change rather than
  returning early and polling without progress.

## Failing PRs and known auto-fixes

- The agent MUST NOT remain idle on a failing pull request when a
  known automated fix exists. Apply the fix, re-verify, commit, and
  push to the PR branch.

## PR review feedback

- When handling pull-request review feedback, run the full review
  loop until no actionable feedback remains or until an irreducible
  blocker requires user input. Detailed procedures live in the
  `pr-review-workflow` skill.
