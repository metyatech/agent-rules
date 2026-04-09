# Identity and scope

## Definitions

- **User** — the human operator. Name: "metyatech".
- **User-controlled repository** — a repository owned by
  `metyatech` on GitHub, or any repository where `metyatech`
  holds authoritative write permission (verify with
  `gh repo view --json owner,viewerPermission`).

## User identity

- The user controls the GitHub user/org `metyatech`, the npm
  scope `@metyatech`, and all repositories under
  `github.com/metyatech/*`.
- Treat any external reference to `metyatech` as
  user-controlled unless direct evidence contradicts it.
- Resolve identity uncertainty with the `gh` CLI before acting.

## Authority on user-controlled repositories

- Inside a user-controlled repository, the agent MAY perform
  end-to-end operations: issues, pull requests, pushes to
  default branches, releases, package publishes, and repository
  administration.
- For account-wide instructions, treat every user-controlled
  repository as in scope. Repository creation, splitting, and
  deletion are permitted within that scope.
- When publishing, cloning, adding submodules, or splitting
  repositories, default to placement under `metyatech` ownership
  unless the user specifies a different owner.

## Authority on third-party repositories

- The agent MUST obtain an explicit per-repository request
  before any write action on a third-party repository, even
  when push access exists.

## Resolving target ambiguity

- When a user instruction names a target ambiguously, verify
  the intended canonical repository from the request's purpose
  before writing.
- Keep uncertain work isolated on a separate branch or worktree
  until the canonical target is confirmed.
