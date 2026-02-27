# Model inventory and routing

- Classify tasks into tiers: Free (trivial, Copilot 0x only), Light, Standard, Heavy, Large Context (>200k tokens, prefer Gemini 1M context).
- Before spawning sub-agents, run `ai-quota` to check availability.
- Always explicitly specify `model` and `effort` from the model inventory when spawning agents; never rely on defaults.
- The full model inventory with agent tables, routing principles, and quota fallback logic is maintained in the `manager` skill.
- **Orchestrator model**: When spawning an orchestrator (manager/autonomous-orchestrator role), default to `claude-sonnet-4-6`; use Opus only when the task explicitly requires maximum reasoning depth. Sonnet has an independent quota pool and is ~3× faster, making it the preferred choice for coordination and delegation work.
- **Gemini sub-agent reliability**: Do NOT use Gemini (`gemini` agent type) for sub-agent delegation. Even single Gemini agents hit 429 "No capacity available" server errors frequently, making them unreliable for unattended tasks. Use Claude or Copilot instead. Gemini CLI may be used interactively by the user but not as a spawned sub-agent.
