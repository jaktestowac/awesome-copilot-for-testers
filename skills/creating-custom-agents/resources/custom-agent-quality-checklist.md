# Custom Agent Quality Checklist

Use this checklist before finalizing a GitHub Copilot custom agent.

## Role clarity

- [ ] The agent has a clearly bounded mission.
- [ ] The description makes it obvious when the agent should be used.
- [ ] The file defines identity and responsibilities, not a huge procedural manual.

## Tools and model

- [ ] The selected tools are minimal and intentional.
- [ ] Any powerful tool access is justified by the role.
- [ ] The model choice is deliberate when a model is specified.

## Separation of concerns

- [ ] Detailed reusable workflows are delegated to skills when appropriate.
- [ ] One-off entrypoints are delegated to prompt files when appropriate.
- [ ] Repository-wide coding rules are not duplicated from instruction files.

## Behavior quality

- [ ] The default workflow is short, useful, and realistic.
- [ ] Constraints or anti-patterns are explicit.
- [ ] Output expectations are concrete enough to shape responses.

## Final handoff

- [ ] The file is install-ready and internally consistent.
- [ ] The agent is distinct from nearby agents.
- [ ] A template or example exists when the artifact is meant for reuse.

## Smells that should trigger a rewrite

- "does everything" scope
- giant tool arrays added as a shortcut
- copied skill content inside the agent body
- no explanation of when the agent should be chosen
