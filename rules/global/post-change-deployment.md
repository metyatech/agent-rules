# Post-change deployment verification

Detailed deployment detection and verification procedures live in
the `post-deploy` skill.

## Definitions

- **Globally linked package** — an npm package whose global install
  path is a symlink (`->`) to the local working tree, as shown by
  `npm ls -g`.
- **Running service** — any service, daemon, or scheduled task
  whose runtime instance the user depends on.
- **Agent-owned temporary resource** — any service, daemon,
  browser session, temporary clone, patch file, or other resource
  that the agent's tests, helper flows, or verification setups
  create.

## Required post-change checks

- After modifying code, determine whether deployment steps beyond
  commit and push are needed before concluding.
- If the affected repository powers a globally linked package,
  rebuild the package and verify the global binary is functional
  before reporting completion.
- If the affected repository powers a running service, daemon, or
  scheduled task, rebuild, restart, and verify the running
  instance with deterministic evidence. The agent MUST NOT claim
  completion until the running instance reflects the changes.

## Cleanup of agent-owned temporary resources

- Verify teardown of every agent-owned temporary resource before
  concluding and remove them after they serve their purpose.
- If cleanup fails, fix the harness or the cleanup path. The
  agent MUST NOT leave residue.
