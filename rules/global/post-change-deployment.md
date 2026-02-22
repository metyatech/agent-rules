# Post-change deployment

After modifying code in a repository, check whether the changes require
deployment steps beyond commit/push before concluding.

## Globally linked packages

- If the repository is globally installed via `npm link` (identifiable by
  `npm ls -g --depth=0` showing `->` pointing to a local path), run the
  repo's build command after code changes so the global binary reflects
  the update.
- Verify the rebuilt output is functional (e.g., run the CLI's `--version`
  or a smoke command).

## Locally running services and scheduled tasks

- If the repository powers a locally running service, daemon, or scheduled
  task, rebuild and restart the affected component after code changes.
- Verify the restart with deterministic evidence (new PID, port check,
  service status query, or log entry showing updated behavior).
- Do not claim completion until the running instance reflects the changes.
