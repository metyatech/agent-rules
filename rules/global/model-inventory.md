# Model inventory and routing

- Classify tasks into tiers: Free (trivial, Copilot 0x only), Light, Standard, Heavy, Large Context (>200k tokens, prefer Gemini 1M context).
- Before spawning sub-agents, run `ai-quota` to check availability.
- Always explicitly specify `model` and `effort` from the model inventory when spawning agents; never rely on defaults.
- The full model inventory with agent tables, routing principles, and quota fallback logic is maintained in the `manager` skill.
