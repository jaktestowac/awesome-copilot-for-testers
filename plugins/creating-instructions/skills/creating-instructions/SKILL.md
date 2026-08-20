---
name: creating-instructions
description: "Creates GitHub Copilot instruction files for VS Code, including repository guidance and scoped `.instructions.md` rules. Use when encoding project conventions, choosing `applyTo` patterns, or shipping install-ready instruction examples with rationale and guardrails."
argument-hint: "Repository context, target scope, sample files, and rules to encode"
user-invocable: true
---

# Creating Copilot Instructions

Use this skill when the goal is to package stable rules for GitHub Copilot instead of writing one-off guidance in chat.
It helps turn repository conventions into clean instruction files that are easy to install, reason about, and maintain.

## When to Use

Use this skill when the user asks for things like:

- "create a repo-wide Copilot instruction file"
- "write a `.instructions.md` file for these tests"
- "choose the right `applyTo` pattern"
- "turn our coding rules into installable instructions"
- "fix an instruction file that is too broad or too vague"

Typical scenarios:

- first-time setup of `copilot-instructions.md`
- adding targeted guidance for a folder, language, or test type
- splitting an overgrown instruction file into smaller units
- preparing public examples for a team repository or a shared collection

## What Good Looks Like

A strong instruction contribution usually includes:

- the right instruction type for the job: repo-wide or scoped
- a narrow, predictable scope
- short declarative rules with a reason when the rule is not obvious
- examples only where they materially improve compliance
- no workflow logic, no agent personality, and no prompt-specific scripting

## Instruction Design Rules

- **Rules over essays** - prefer short, stable guidance that survives multiple tasks.
- **Scope first** - the `applyTo` pattern is part of the design, not an afterthought.
- **Reason when needed** - if a rule is surprising, explain the consequence in the same bullet.
- **Examples beat abstraction** - include a preferred and avoided example for tricky patterns.
- **Context is expensive** - avoid loading broad instructions that repeat what tools already enforce.

## Workflow

### Phase 0: Frame the request

Clarify or infer:

- whether the user needs repo-wide guidance or scoped instructions
- who will install the file: one user, a team, or a public collection
- which files or folders must be affected
- what conventions are stable enough to encode as rules

### Phase 1: Study the source material

Before drafting:

- inspect existing instructions, README notes, and representative source files
- separate lint or formatter-enforced behavior from guidance that still needs human judgment
- collect only durable conventions; avoid temporary migration notes unless explicitly requested

### Phase 2: Choose the file shape

Use this decision rule:

- create `copilot-instructions.md` when the rules apply to nearly every task in the repository
- create `*.instructions.md` when the rules apply to a clear file pattern, directory, or workflow boundary
- split files when one audience would otherwise inherit unrelated rules

### Phase 3: Draft the instruction file

For scoped instruction files:

- choose a descriptive filename in kebab case
- write frontmatter with `description`, `applyTo`, `title`, and `name` when helpful
- keep each rule compact and testable
- add examples only for non-obvious conventions

For repo-wide instruction files:

- describe architecture, stack, folder responsibilities, commands, and non-obvious conventions
- organize by headings so Copilot can find the right rule quickly
- keep it opinionated enough to be useful but not so exhaustive that it becomes background noise

### Phase 4: Create the artifact bundle

Always prepare:

- the main instruction file
- a short installation note or target path
- at least one reference template or example when the instruction is meant to be reused
- a brief summary of why the scope and file type were chosen

Use these supporting resources:

- `./resources/copilot-instructions.template.md`
- `./resources/custom-instructions.template.instructions.md`
- `./resources/copilot-instructions.example.md`
- `./resources/custom-instructions.example.instructions.md`

### Phase 5: Validate before handoff

Check the final result against `./resources/instructions-quality-checklist.md`.

Pay extra attention to:

- `applyTo` being narrow enough to avoid accidental always-on context
- rules being declarative, not step-by-step workflows
- examples matching the claimed rule
- no duplication of agent behavior, prompt workflow, or skill instructions

## Common Failure Modes

- using `applyTo: '**'` for advice that only matters in one part of the repo
- turning the file into a tutorial instead of a rule set
- copying linter or formatter defaults instead of encoding missing conventions
- mixing multiple unrelated audiences into one instruction file
- writing rules without enough context for Copilot to understand why they matter

## Resource Map

- `./resources/copilot-instructions.template.md` - repo-wide starting point for a project constitution
- `./resources/custom-instructions.template.instructions.md` - scoped instruction template with frontmatter
- `./resources/copilot-instructions.example.md` - worked repo-level example for a test automation repository
- `./resources/custom-instructions.example.instructions.md` - worked scoped example with concrete rules
- `./resources/instructions-quality-checklist.md` - final review checklist before shipping

## Definition of Done

A task using this skill is complete when:

- the chosen instruction type matches the actual scope
- the file is install-ready and placed in the right target location
- the rules are concise, durable, and non-duplicative
- supporting template or example material exists when the artifact is meant for reuse
- the final result passes the quality checklist without obvious ambiguity
