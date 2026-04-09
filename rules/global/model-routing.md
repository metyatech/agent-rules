# Model routing

This module defines tier classification and the cross-cutting model
selection rules. The full model inventory tables and routing tables are
maintained in the `manager` skill.

## Definitions

- **Tier** — the difficulty and cost classification of a task. Defined
  tiers: Free, Light, Standard, Heavy, Large Context.
- **Effort** — the model's reasoning intensity setting. Levels include
  `low`, `medium`, `high`, `xhigh`, and `max`. Not every model
  supports every level.

## Tier classification

- **Free** — trivial single-step lookups; reserved for Copilot 0x
  models.
- **Light** — mechanical transforms, formatting, simple single-file
  edits.
- **Standard** — general implementation, code review, multi-file
  changes.
- **Heavy** — architecture decisions, safety-critical code, complex
  multi-step reasoning.
- **Large Context** — tasks requiring more than 200k input tokens;
  prefer 1M-context models.

## Mandatory pre-spawn checks

- Before spawning any sub-agent, the agent MUST run `ai-quota` to
  verify quota availability across all candidate agents. If `ai-quota`
  is unavailable or fails, the agent MUST report the limitation and
  MUST NOT spawn any sub-agent.
- When spawning a sub-agent, the agent MUST explicitly specify both
  `model` and `effort` from the model inventory in the `manager`
  skill. The agent MUST NOT rely on default model selection.

## Orchestrator model selection

- When spawning an orchestrator role (manager or
  autonomous-orchestrator), the agent MUST default to
  `claude-sonnet-4-6` with `medium` effort.
- The agent MUST escalate to `claude-opus-4-6` with `medium` effort
  when strict rule compliance is required. Research (arXiv:2505.11423)
  shows that higher effort degrades instruction-following on
  multi-constraint rule sets.
- The agent MAY use `high`, `xhigh`, or `max` effort only for complex
  reasoning tasks. The agent MUST NOT use elevated effort to improve
  rule compliance.

## Gemini sub-agent reliability

- The agent MUST NOT spawn `gemini` sub-agents for unattended work.
  Gemini sub-agents fail with HTTP 429 "No capacity available" errors
  too frequently to be reliable.
- The agent MAY use Gemini CLI interactively when invoked directly by
  the user.
