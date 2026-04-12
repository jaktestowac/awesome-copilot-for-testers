---
name: creating-hooks
description: "Creates GitHub Copilot hooks for VS Code using `hooks.json`, supporting scripts, and companion docs. Use when automating deterministic checks, pre/post tool policies, or reusable hook packs that need safe defaults, observability, and clear installation guidance."
argument-hint: "Hook goal, lifecycle event, allowed or denied behaviors, and platform needs"
user-invocable: true
---

# Creating Copilot Hooks

Use this skill when the right answer is not more advice, but deterministic behavior at a specific lifecycle point.
It helps design hooks that are safe, documented, and understandable instead of mysterious little shell goblins.

## When to Use

Use this skill when the user asks for things like:

- "create a Copilot hook for this policy"
- "block dangerous commands before they run"
- "log or validate tool usage automatically"
- "add a reusable hook pack with docs and scripts"
- "turn this manual guardrail into a hook"

Typical scenarios:

- pre-tool checks for risky shell commands
- post-tool validation or formatting triggers
- audit or observability hooks for shared environments
- installing a documented hook bundle for reuse across workspaces

## Outcome Standard

A strong hook contribution usually includes:

- the right lifecycle event and the smallest useful behavior
- explicit safety defaults and clear denial or warning messages
- a documented `hooks.json` configuration
- cross-platform script guidance when Windows and Bash users both matter
- a README or pack that explains purpose, setup, and limitations

## Hook Design Rules

- **Start with observe or warn** - block only when the policy is stable and the failure message is clear.
- **Keep hooks fast** - long-running hooks become friction generators instead of safeguards.
- **Be explicit on denial** - if a hook blocks work, explain exactly why and what to do instead.
- **Separate policy from docs** - the script enforces behavior; the README explains it.
- **Prefer deterministic checks** - hooks should not depend on fuzzy interpretation when avoidable.

## Workflow

### Phase 0: Decide whether a hook is the right primitive

Use a hook when deterministic automation is needed at a lifecycle event.
If the need is guidance only, use instructions. If the need is a reusable workflow, use a skill. If the need is a user-started task, use a prompt.

### Phase 1: Choose the lifecycle event

Clarify or infer:

- what event should trigger the hook
- whether the behavior is observe, warn, mutate, or deny
- how quickly the hook must complete
- whether it needs cross-platform script support

### Phase 2: Design the safety model

Before scripting:

- define the exact condition being checked
- decide what the hook should output on allow, warn, or deny
- write the denial or warning message in user language, not policy jargon
- make sure the hook fails safely when inputs are missing or malformed

### Phase 3: Create the hook pack

Use the resources below as the default starting point:

- `./resources/hook-template-pack.md`
- `./resources/hook-example-pack.md`

A complete pack should usually include:

- `hooks.json`
- one or more supporting scripts
- a README with purpose, setup, and behavior notes

### Phase 4: Validate the operational fit

Check the result against `./resources/hook-quality-checklist.md`.

Pay special attention to:

- whether the hook is fast enough for the event it runs on
- whether the messages are actionable
- whether Windows and non-Windows paths are addressed when required
- whether the hook blocks only what it truly means to block

## Common Failure Modes

- using a hook when a normal instruction would have been enough
- blocking large classes of commands without a helpful reason
- writing scripts that are too slow for frequent lifecycle events
- shipping `hooks.json` without installation or behavior documentation
- creating platform-specific hooks with no fallback or adaptation guidance

## Resource Map

- `./resources/hook-template-pack.md` - template pack with README, config, and script scaffolds
- `./resources/hook-example-pack.md` - worked example of a safe, documented policy hook
- `./resources/hook-quality-checklist.md` - final review checklist before shipping

## Definition of Done

A task using this skill is complete when:

- the hook behavior matches a clear lifecycle need
- the configuration, scripts, and documentation agree with each other
- failure, allow, and deny messages are understandable
- the pack is install-ready or clearly adapted for the target environment
- the final result passes the quality checklist without obvious operational risk
