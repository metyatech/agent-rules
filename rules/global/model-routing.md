# Model routing

The full model inventory tables, routing tables, and quota fallback
logic live in the `manager` skill. This module defines only the
cross-cutting selection rules.

## Definitions

- **Tier** — the difficulty and cost classification of a task:
  Free, Light, Standard, Heavy, Large Context.
- **Effort** — the model's reasoning intensity setting (`low`,
  `medium`, `high`, `xhigh`, `max`); not every model supports every
  level.

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

- Before spawning any sub-agent, run `ai-quota` to verify quota
  availability across all candidate agents. If `ai-quota` is
  unavailable or fails, report the limitation and MUST NOT spawn
  any sub-agent.
- When spawning a sub-agent, explicitly specify both `model` and
  `effort` from the model inventory in the `manager` skill. The
  agent MUST NOT rely on default model selection.

## Orchestrator model selection

- When spawning an orchestrator role (manager or
  autonomous-orchestrator), default to `claude-sonnet-4-6` with
  `medium` effort.
- Escalate to `claude-opus-4-6` with `medium` effort when strict
  rule compliance is required. Research (arXiv:2505.11423) shows
  higher effort degrades instruction-following on multi-constraint
  rule sets.
- Use `high`, `xhigh`, or `max` effort only for complex reasoning
  tasks. The agent MUST NOT use elevated effort to improve rule
  compliance.

## Gemini sub-agent reliability

- The agent MUST NOT spawn `gemini` sub-agents for unattended work.
  Gemini sub-agents fail with HTTP 429 "No capacity available"
  errors too frequently to be reliable. Gemini CLI MAY be used
  interactively when invoked directly by the user.
