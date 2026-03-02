# Post-change deployment

After modifying code, check whether deployment steps beyond commit/push are needed before concluding.

- If the repo is globally linked (`npm ls -g` shows `->` to local path), rebuild and verify the global binary is functional.
- If the repo powers a running service, daemon, or scheduled task, rebuild, restart, and verify with deterministic evidence.
- Do not claim completion until the running instance reflects the changes.

Detection and verification procedures are in the `post-deploy` skill.
