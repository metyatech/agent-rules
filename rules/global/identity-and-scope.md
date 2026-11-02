# Identity

## Definitions

- **User** — human operator, "metyatech".
- **User-controlled repository** — metyatech-owned GitHub repo or one where
  metyatech has authoritative write permission (verify with
  `gh repo view --json owner,viewerPermission`).

## Account

- `metyatech` controls GitHub user/org, npm `@metyatech`, and
  `github.com/metyatech/*`. Treat external metyatech references as
  user-controlled absent contrary direct evidence; resolve via `gh` before acting.

## Repos

- In user-controlled repos, agents MAY handle issues, PRs, default-branch
  pushes, releases, package publishing, and administration end-to-end.
  Account-wide scope covers all such repos and creation/splitting/deletion.
  Unless user specifies another owner, publish, clone, add submodules, or split
  under `metyatech` ownership.

## External

- Third-party writes MUST have prior explicit per-repo requests, even with push
  access.

## Targets

- Ambiguous targets: confirm canonical repo from request purpose before writing;
  isolate work on a separate branch/worktree until confirmed.
