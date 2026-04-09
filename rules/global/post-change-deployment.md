# Post-change deployment verification

This module governs verification that runs after a code change to
ensure the running system reflects the change. Detailed deployment
detection and verification procedures are defined in the
`post-deploy` skill.

## Definitions

- **Globally linked package** — an npm package whose global install
  path is a symlink (`->`) to the local working tree, as shown by
  `npm ls -g`.
- **Running service** — any service, daemon, or scheduled task whose
  runtime instance the user depends on.
- **Agent-owned temporary resource** — any service, daemon, browser
  session, temporary clone, patch file, or other resource that the
  agent's tests, helper flows, or verification setups create.

## Required post-change checks

- After modifying code, the agent MUST determine whether deployment
  steps beyond commit and push are needed before concluding.
- If the affected repository powers a globally linked package, the
  agent MUST rebuild the package and MUST verify the global binary
  is functional before reporting completion.
- If the affected repository powers a running service, daemon, or
  scheduled task, the agent MUST rebuild, restart, and verify the
  running instance with deterministic evidence. The agent MUST NOT
  claim completion until the running instance reflects the changes.

## Cleanup of agent-owned temporary resources

- The agent MUST verify teardown of every agent-owned temporary
  resource before concluding.
- The agent MUST remove agent-owned temporary resources after they
  serve their purpose.
- If cleanup fails, the agent MUST fix the harness or the cleanup
  path. The agent MUST NOT leave residue.
