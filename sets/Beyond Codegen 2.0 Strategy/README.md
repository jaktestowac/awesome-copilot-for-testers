# Beyond Codegen 2.0 Strategy — Resource Set

A themed bundle of resources implementing the **Beyond Codegen 2.0** approach to AI-assisted test generation: instead of asking the model to emit test code in one shot, a strategic architect agent first designs risk-based test scenarios, and only then drives code generation from that validated design.

## Contents

| Resource | Type | Purpose |
| -------- | ---- | ------- |
| [custom-agents/ai-architect.agent.md](custom-agents/ai-architect.agent.md) | Custom agent | The AI Test Architect that designs and oversees the two-stage (design → generate) test generation strategy |
| [prompts/edge-case-scenario-generator.prompt.md](prompts/edge-case-scenario-generator.prompt.md) | Prompt | Generates a complete, risk-based set of BDD test scenarios focused on edge cases, state validation, and boundary conditions (runs under the `ai-architect` agent) |

## How to use

1. Install `ai-architect.agent.md` into your VS Code user prompts directory or the repo's `.github/agents/` folder.
2. Install the prompt into `.github/prompts/`.
3. Run `/edge-case-scenario-generator` with your feature or user story — the prompt routes to the `ai-architect` agent and produces a BDD scenario set you can feed into test generation.
