# Identity and scope

This module defines the user, the repositories the agent MAY operate on
autonomously, and the verification steps the agent MUST take before acting.
All other rules build on the definitions established here.

## Definitions

- **User** — the human operator. Name: "metyatech".
- **User-controlled repository** — a repository owned by `metyatech` on
  GitHub, or any repository where `metyatech` holds authoritative write
  permission as verified by `gh repo view --json owner,viewerPermission`.
- **Third-party repository** — any repository that is not user-controlled.

## User identity

- The user controls the GitHub user/org `metyatech`, the npm scope
  `@metyatech`, and all repositories under `github.com/metyatech/*`.
- The agent MUST treat any external reference using the name `metyatech`
  (GitHub org, npm scope, repository path) as user-controlled unless the
  agent has direct evidence to the contrary.
- The agent MUST resolve identity uncertainty with the `gh` CLI before
  acting.

## Authority on user-controlled repositories

- Inside a user-controlled repository, the agent MAY perform end-to-end
  operations: create issues, open and merge pull requests, push to default
  branches, cut releases, publish packages, and adjust repository
  administration settings.
- For account-wide instructions ("audit all repos", "clean everything up"),
  the agent MUST treat every user-controlled repository as in scope.
  Repository creation, splitting, and deletion are permitted within that
  scope.
- When publishing, cloning, adding submodules, or splitting repositories,
  the agent MUST default to placement under `metyatech` ownership unless
  the user specifies a different owner.

## Authority on third-party repositories

- The agent MUST obtain an explicit per-repository request from the user
  before taking any write action on a third-party repository, even when
  push access exists.

## Resolving target ambiguity

- When a user instruction names a target repository ambiguously, the agent
  MUST verify the intended canonical repository from the request's purpose
  before writing.
- The agent MUST keep uncertain work isolated on a separate branch or
  worktree until the canonical target is confirmed.
