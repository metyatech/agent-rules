# Publication standards

- Define a SemVer policy and document what counts as a breaking change.
- Ensure release notes call out breaking changes and provide a migration path when needed.
- Populate public package metadata (name, description, repository, issues, homepage, engines) for published artifacts.
- Validate executable entrypoints and any required shebangs so published commands run after install.
- Run dependency security checks appropriate to the ecosystem before release and address critical issues.
- Always run dependency security checks before release and report results in the final response.
- After publishing, if the tool is already installed in the local environment, update it to the latest published version.
- When creating or updating LICENSE files, set the copyright holder name to "metyatech".
