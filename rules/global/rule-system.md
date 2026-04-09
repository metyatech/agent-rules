# Rule system and maintenance

This module defines the compliance vocabulary used throughout AGENTS.md and
governs how rules are composed, authored, edited, and propagated.

## Compliance vocabulary

The keywords MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD
NOT, RECOMMENDED, MAY, and OPTIONAL in this AGENTS.md and in every
included rule module carry the meanings defined in RFC 2119 and RFC 8174:

- **MUST**, **REQUIRED**, **SHALL** — absolute requirement.
- **MUST NOT**, **SHALL NOT** — absolute prohibition.
- **SHOULD**, **RECOMMENDED** — strong recommendation. The agent MAY
  deviate only when it can state the specific reason and the alternatives
  weighed.
- **SHOULD NOT** — strong recommendation against. The same deviation rule
  applies.
- **MAY**, **OPTIONAL** — permitted but not required behavior.

When a rule omits a compliance keyword, the agent MUST treat the rule as
MUST.

## Composition

- The agent MUST NOT edit `AGENTS.md` directly. AGENTS.md is the composed
  output of rule modules and a per-repository ruleset.
- Before starting work in a repository that contains `agent-ruleset.json`,
  the agent MUST run `compose-agentsmd` from the repository root and MUST
  re-read the resulting AGENTS.md before acting.
- AGENTS.md MUST be self-contained at the repository root.
- Pre-commit hooks MUST run, in this order: the repository's full
  verification suite, `compose-agentsmd --compose`, then
  `git add AGENTS.md`.
- Pre-commit hooks MUST NOT fail the commit on AGENTS.md drift.
- CI MUST NOT add AGENTS.md freshness checks.
- The agent MUST treat AGENTS.md diffs produced by `compose-agentsmd` as
  intentional updates and MUST stage them with the surrounding change set,
  unless the user explicitly excludes them.
- A new repository MUST include `agent-ruleset.json`, MUST compose
  AGENTS.md, and MUST satisfy the required global repository standards
  before the agent reports the repository as complete.
- The agent SHOULD omit AGENTS.md diffs from normal completion reports
  unless the user requests them.

## Authoring rules

- Rules MUST be MECE. Each obligation MUST appear in exactly one module.
  The agent MUST cross-reference rather than duplicate across modules.
- Each rule MUST be atomic. One bullet expresses exactly one testable
  obligation. The agent MUST NOT combine multiple obligations with "and".
- Each rule MUST use the imperative mood with an explicit compliance
  keyword from the vocabulary above.
- Each rule MUST be testable. A reader MUST be able to write a yes/no
  check for whether the rule was followed without consulting outside
  context.
- Rules MUST NOT contain hedges such as "ideally", "where appropriate",
  "reasonable", "prudent", or "perhaps". Replace hedges with explicit
  conditions.
- A rule belongs in `rules/global/` when it applies to any workspace; in
  `rules/domains/<domain>/` only when it applies exclusively to that
  opt-in domain; in `agent-rules-local/` only when no other repository
  will ever need it.
- When updating a rule, the agent MUST encode the underlying general
  principle rather than the incident-specific surface example. The agent
  MUST trace each proposed update back to the reasoning error or false
  equivalence that permitted the original mistake.
- When a problem is fundamentally a rules problem, the agent MUST fix it
  in rules with the shortest sufficient change.
- Persistent user instructions about future agent behavior MUST be encoded
  in the appropriate rule module in the same change set, unless the user
  explicitly scopes the instruction to the current task.
- The agent MUST treat rule and skill gaps, redundancy, misplacement, and
  recurring review feedback as systemic, and MUST fix the underlying
  issue and any similar instances in the same change set.
- The agent MUST update the relevant ruleset for any missing domain rule
  before proceeding with work that depends on the rule.
- In delegated mode, the agent MUST NOT modify rules directly. The
  delegated agent MUST report rule-gap suggestions to the delegator.
- Session memory resets between sessions. Persistent behavioral knowledge
  MUST live in rules; rules are the source of truth.
