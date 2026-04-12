# Instructions Quality Checklist

Use this checklist before finalizing a GitHub Copilot instruction contribution.

## Scope and placement

- [ ] The file type matches the actual scope (`copilot-instructions.md` vs `*.instructions.md`).
- [ ] The target location is clear.
- [ ] The filename is descriptive and uses kebab case.
- [ ] The `applyTo` pattern is specific enough to avoid irrelevant always-on context.

## Rule quality

- [ ] Rules are declarative, not step-by-step workflows.
- [ ] Non-obvious rules explain the consequence or rationale.
- [ ] The file captures repository-specific guidance, not generic programming advice.
- [ ] Rules do not simply restate lint or formatter defaults.

## Examples and supporting material

- [ ] Preferred and avoided examples are included only where they improve compliance.
- [ ] Example code actually demonstrates the rule it claims to support.
- [ ] Companion templates or examples exist when the instruction is intended for reuse.

## Separation of concerns

- [ ] No agent personality or role definition is embedded.
- [ ] No prompt workflow or task script is embedded.
- [ ] No skill-style procedural handbook content is embedded.

## Final handoff

- [ ] Installation path or usage note is included.
- [ ] The file can be understood quickly by someone new to the repository.
- [ ] There is no conflicting or duplicate instruction elsewhere in the same scope.

## Smells that should trigger a rewrite

- `applyTo: '**'` without a strong reason
- paragraphs longer than the rules they are meant to support
- examples copied from docs but unrelated to the repository's patterns
- a file that tries to govern multiple unrelated audiences at once
