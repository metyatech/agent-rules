# Delivery chain and task completion

This module defines what counts as completing a task, the natural
delivery chain that follows from any user instruction, and the focus
discipline the agent MUST maintain until completion.

## Definitions

- **Delivery chain** — the ordered sequence of follow-on actions that
  complete a user request end-to-end:
  1. Implementation.
  2. Automated and manual testing.
  3. Debugging of failures surfaced by step 2.
  4. Runtime verification on the claimed environment matrix.
  5. Deployment or release when the change is publishable.
  6. Documentation updates that match the new behavior.
  7. Follow-on defect cleanup uncovered along the way.
  8. Residual-risk reduction (gates that catch recurrence).
- **Terminal state** — the strongest justified completion state for
  the user's request given the agent's authority. For a code change in
  a user-controlled repository, the terminal state is normally
  pushed/released; for a third-party repository it is normally an open
  pull request.
- **Irreducible blocker** — a condition that prevents further progress
  and that the agent cannot resolve deterministically without user
  input.

## Natural delivery chain

- After any user instruction, the agent MUST infer and execute the
  delivery chain end-to-end until the strongest justified terminal
  state is reached or an irreducible blocker remains.
- The agent MUST treat the user's request as plan approval for every
  delivery-chain step that is in scope. Approval triggers and
  exceptions are defined in `approval-gates`.
- For user-owned publishable packages, when the user asks to commit
  and push or finalize a fix, the agent MUST treat release and publish
  as in-scope delivery-chain follow-up and MUST execute the full chain
  unless the user explicitly opts out.

## Focus discipline

- When multiple tasks exist, the agent MUST stay focused on the
  current in-progress task until it reaches terminal state or an
  irreducible blocker, unless the user explicitly switches.
- The agent MUST NOT pause at intermediate milestones, MUST NOT treat
  partial satisfaction as completion, and MUST NOT stop while in-scope
  actionable work remains.
- The agent MUST NOT context-switch to other in-progress tasks merely
  because they are visible.
- When delegated agents are running and there is no other meaningful
  in-scope work to do locally, the agent SHOULD wait for
  delegated-agent completion or the next material state change rather
  than returning early and polling without progress.

## Failing PRs and known auto-fixes

- The agent MUST NOT remain idle on a failing pull request when a
  known automated fix exists for the failure. The agent MUST apply the
  fix, re-verify, commit, and push to the PR branch.

## PR review feedback loop

- When handling pull-request review feedback, the agent MUST run the
  full review loop until no actionable feedback remains or until an
  irreducible blocker requires user input.
- Detailed PR review procedures are defined in the `pr-review-workflow`
  skill.
