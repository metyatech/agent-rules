# Rule system and maintenance

## Compliance vocabulary

The keywords MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD,
SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this AGENTS.md and
every included rule module carry the meanings of RFC 2119 and RFC
8174:

- **MUST**, **REQUIRED**, **SHALL** — absolute requirement.
- **MUST NOT**, **SHALL NOT** — absolute prohibition.
- **SHOULD**, **RECOMMENDED** — strong recommendation; deviate only
  with a stated reason and weighed alternatives.
- **SHOULD NOT** — strong recommendation against; same deviation
  rule.
- **MAY**, **OPTIONAL** — permitted but not required.

When a rule omits a keyword, treat the rule as MUST.

## Composition

- The agent MUST NOT edit `AGENTS.md` directly. AGENTS.md is the
  composed output of rule modules and a per-repository ruleset.
- Before starting work in a repository that contains
  `agent-ruleset.json`, run `compose-agentsmd` from the repository
  root and re-read the resulting AGENTS.md.
- AGENTS.md MUST be self-contained at the repository root.
- Pre-commit hooks MUST run, in order: the repository's full
  verification suite, `compose-agentsmd --compose`, then
  `git add AGENTS.md`. Hooks MUST NOT fail the commit on AGENTS.md
  drift, and CI MUST NOT add freshness checks.
- Stage AGENTS.md diffs produced by `compose-agentsmd` with the
  surrounding change set unless the user explicitly excludes them.
- A new repository MUST include `agent-ruleset.json`, MUST compose
  AGENTS.md, and MUST satisfy the required global standards before
  reporting the repository as complete.
- Omit AGENTS.md diffs from normal completion reports unless the
  user requests them.

## Authoring rules

- Rules MUST be MECE: each obligation appears in exactly one
  module. Cross-reference rather than duplicate.
- Each rule MUST be atomic: one bullet, one testable obligation.
  Do not combine obligations with "and".
- Each rule MUST use the imperative mood with an explicit
  compliance keyword (or implied MUST).
- Each rule MUST be testable as a yes/no check without outside
  context.
- Rules MUST NOT contain hedges such as "ideally", "where
  appropriate", "reasonable", or "perhaps". Replace hedges with
  explicit conditions.
- Placement: `rules/global/` for any-workspace rules;
  `rules/domains/<domain>/` only for opt-in domains;
  `agent-rules-local/` only when no other repository will need it.
- When updating a rule, encode the underlying general principle,
  not the incident-specific surface example. Trace each update back
  to the reasoning error that permitted the original mistake.
- When a problem is fundamentally a rules problem, fix it in rules
  with the shortest sufficient change.
- Persistent user instructions about future agent behavior MUST be
  encoded in the appropriate rule module in the same change set
  unless the user explicitly scopes the instruction to the current
  task.
- Treat rule and skill gaps, redundancy, misplacement, and recurring
  review feedback as systemic; fix the underlying issue and similar
  instances in the same change set.
- Update the relevant ruleset for any missing domain rule before
  proceeding with work that depends on it.
- In delegated mode, the agent MUST NOT modify rules directly;
  report rule-gap suggestions to the delegator.
- Session memory resets between sessions. Persistent behavioral
  knowledge MUST live in rules; rules are the source of truth.
