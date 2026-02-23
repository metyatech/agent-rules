# Model inventory and routing

Update this table when models change. **Last reviewed: 2026-02-22.**

## Tier definitions

- **Free** — Trivial lookups, simple Q&A, straightforward single-file edits. Copilot only.
- **Light** — Mechanical transforms, formatting, simple implementations, quick clarifications.
- **Standard** — General implementation, code review, multi-file changes, most development work.
- **Heavy** — Architecture decisions, safety-critical code, complex multi-step reasoning.
- **Large Context** — Tasks requiring >200k token input.

Classify each task into a tier, then pick an agent with available quota and select the ★ preferred model for that tier. Fall back to other models in the same tier when the preferred model's agent has no quota.

## Claude

| Tier | Model | Effort | Notes |
|------|-------|--------|-------|
| Light | claude-haiku-4-5-20251001 | — | Effort not supported; SWE-bench 73% |
| Standard | claude-sonnet-4-6 | medium | ★ Default; SWE-bench 80% |
| Heavy | claude-opus-4-6 | high | SWE-bench 81%; `max` effort for hardest tasks |

Effort levels: `low` / `medium` / `high` (Opus also supports `max`).

## Codex

| Tier | Model | Effort | Notes |
|------|-------|--------|-------|
| Light | gpt-5.1-codex-mini | medium | `medium`/`high` only |
| Standard | gpt-5.3-codex | medium | ★ Latest flagship; SWE-bench Pro 57% |
| Standard | gpt-5.2-codex | medium | Previous gen; SWE-bench Pro 56% |
| Standard | gpt-5.2 | medium | General-purpose; best non-codex reasoning; SWE-bench 80% |
| Heavy | gpt-5.3-codex | xhigh | ★ Best codex at max effort |
| Heavy | gpt-5.1-codex-max | xhigh | Extended reasoning; context compaction |
| Heavy | gpt-5.2-codex | xhigh | Alternative |
| Heavy | gpt-5.2 | xhigh | General reasoning fallback |

Effort levels: `low` / `medium` / `high` / `xhigh` (gpt-5.1-codex-mini: `medium` / `high` only).

## Gemini

| Tier | Model | Effort | Notes |
|------|-------|--------|-------|
| Light | gemini-3-flash-preview | — | SWE-bench 78%; strong despite Light tier |
| Standard | gemini-3-pro-preview | — | ★ 1M token context; SWE-bench 76% |
| Large Context | gemini-3-pro-preview | — | >200k token tasks; 1M context |

Effort not supported. When `gemini-3-1-pro-preview` becomes available in Gemini CLI, promote it to Standard (SWE-bench 81%).

## Copilot

Copilot charges different quota per model. Prefer lower-multiplier models when task complexity allows. Effort is not configurable (ignored).

| Tier | Model | Quota | Notes |
|------|-------|-------|-------|
| Free | gpt-5-mini | 0x | ★ SWE-bench ~70%; simple tasks |
| Free | gpt-4.1 | 0x | 1M context; SWE-bench 55% |
| Light | claude-haiku-4-5 | 0.33x | ★ SWE-bench 73% |
| Light | gpt-5.1-codex-mini | 0.33x | Mechanical transforms |
| Standard | claude-sonnet-4-6 | 1x | ★ Default; SWE-bench 80% |
| Standard | gpt-5.3-codex | 1x | Latest codex flagship |
| Standard | gpt-5.2 | 1x | Best general reasoning; SWE-bench 80% |
| Standard | gpt-5.2-codex | 1x | Agentic coding |
| Standard | gpt-5.1-codex-max | 1x | Extended reasoning; compaction |
| Standard | claude-sonnet-4-5 | 1x | SWE-bench 77%; prefer 4.6 |
| Standard | gpt-5.1-codex | 1x | SWE-bench 77% |
| Standard | gpt-5.1 | 1x | General purpose; SWE-bench ~76% |
| Standard | gemini-3-pro | 1x | 1M context; SWE-bench 76% |
| Standard | claude-sonnet-4 | 1x | Legacy; SWE-bench 73%; last choice |
| Heavy | claude-opus-4-6 | 3x | ★ SWE-bench 81% |
| Heavy | claude-opus-4-5 | 3x | SWE-bench 81%; prefer 4.6 |
| — | claude-opus-4-6 fast | 30x | Avoid; excessive quota cost |

## Routing principles

- All agents (claude, codex, gemini, copilot) operate on independent flat-rate subscriptions with periodic quota limits. Route by model quality, quota conservation, and quota distribution.
- All agents can execute code, modify files, and perform multi-step tasks. Route by model quality and quota, not by execution capability.
- Spread work across agents to maximize total throughput.
- For large-context tasks (>200k tokens), prefer Gemini (1M token context).
- For trivial tasks, prefer Copilot free-tier models (0x quota) before consuming other agents' quota.
- When multiple agents can handle a task equally well, prefer the one with the most remaining quota.
- Before selecting or spawning any sub-agent, run `ai-quota` to check availability — mandatory.

## Quota fallback logic

If the primary agent has no remaining quota:

1. Query quota for all agents.
2. Select any agent with available quota that has a model at the required tier.
3. For Copilot fallback, prefer lower-multiplier models to conserve quota.
4. If the fallback model is significantly less capable, note the degradation in the dispatch report.
5. If no agent has quota, queue the task and report the block immediately; do not drop silently.

## Routing decision sequence

1. Classify the task tier (Free / Light / Standard / Heavy / Large Context).
2. For Free tier: dispatch to Copilot with a 0x model. Skip quota check.
3. For other tiers: check quota for all agents via `ai-quota`.
4. Pick the agent with available quota at the required tier; prefer the agent with the most remaining quota when multiple qualify.
5. Set `agent_type`, `model`, and `effort` from the tables above (omit `effort` when column shows —).
6. If primary choice has no quota: apply fallback logic.
7. Include the chosen agent, model, tier, and effort in the dispatch report.
