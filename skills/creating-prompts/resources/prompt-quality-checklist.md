# Prompt Quality Checklist

Use this checklist before finalizing a GitHub Copilot prompt file.

## Prompt contract

- [ ] The prompt has one clear job.
- [ ] The target agent is intentional and appropriate.
- [ ] Required inputs are explicit.
- [ ] The expected output or completion state is clear.

## Frontmatter quality

- [ ] `description` is discoverable and specific.
- [ ] `name` improves usability when a display label is helpful.
- [ ] `argument-hint` helps the user provide better inputs.
- [ ] `tools` are overridden only when there is a real need.

## Separation of concerns

- [ ] The prompt does not redefine the agent's personality or role.
- [ ] Repository-wide rules are not duplicated from instructions.
- [ ] Reusable procedures that belong in a skill are referenced rather than copied.

## Usability

- [ ] The workflow is short, actionable, and coherent.
- [ ] The prompt would still be useful to someone seeing it for the first time.
- [ ] A template or example exists when the prompt is intended for reuse.

## Smells that should trigger a rewrite

- a prompt that reads like a full system prompt
- inputs so vague that weak output is inevitable
- multiple unrelated outcomes bundled into one slash command
- tool overrides added "just in case"
