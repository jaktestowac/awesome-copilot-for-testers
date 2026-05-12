---
name: creating-skills
description: "Creates GitHub Copilot skills with reusable workflows, companion resources, and validation gates. Use when packaging repeatable expertise into a `SKILL.md` folder, deciding what belongs in the skill body versus resources, or producing install-ready skill examples for a team or collection."
argument-hint: "Capability to package, likely triggers, desired outputs, and reference material"
user-invocable: true
---

# Creating Copilot Skills

Use this skill when reusable know-how deserves a home of its own instead of living in prompts, chat history, or somebody's heroic memory.
It helps create skills that are discoverable, concise, and bundled with the right supporting assets.

## When to Use

Use this skill when the user asks for things like:

- "create a new Copilot skill"
- "package this workflow as a reusable skill"
- "turn our team process into a `SKILL.md`"
- "add templates and examples to a skill folder"
- "fix a skill that is too long, vague, or hard to trigger"

Typical scenarios:

- creating a brand-new skill folder
- refactoring a bloated `SKILL.md` into a leaner body plus resource files
- improving discovery quality through better naming and descriptions
- preparing a public-ready skill with templates, examples, and a validation checklist

## Outcome Standard

A strong skill contribution usually includes:

- a name that clearly describes the activity the skill supports
- a description that explains both what the skill does and when to use it
- a `SKILL.md` body that teaches a workflow, not a persona
- supporting resources that are loaded on demand instead of bloating the main file
- a clear definition of done so the agent knows when to stop

## Skill Design Rules

- **Activity, not topic** - name the skill after the task it performs, not the subject area alone.
- **Trigger-friendly descriptions** - include realistic user phrases and contexts.
- **Progressive disclosure** - keep the skill body focused; move templates, examples, and detailed checklists into `resources/`.
- **One coherent capability** - avoid turning one skill into a junk drawer of unrelated workflows.
- **Workflow first** - the main body should help the agent execute the task step by step.

## Workflow

### Phase 0: Frame the capability

Clarify or infer:

- the exact task the skill should help perform
- the signals that should trigger the skill
- the expected output or artifact bundle
- what makes the skill distinct from nearby skills in the repository

### Phase 1: Map the activation surface

Before writing:

- inspect nearby skills for naming, tone, and scope boundaries
- list the phrases a user would naturally use when asking for this capability
- identify which context belongs in the body and which belongs in resources

### Phase 2: Design the skill folder

Plan the folder contents before drafting:

- `SKILL.md` for the activation and workflow logic
- `resources/` for templates, examples, decision guides, or checklists
- optional scripts only when executable logic is genuinely useful

Default to a small bundle first. Add more files only when they remove ambiguity or repetition.

### Phase 3: Draft the `SKILL.md`

Make the main file do the high-value work:

- introduce when the skill should activate
- explain what a good outcome looks like
- provide a concrete workflow with phases or checklists
- link to supporting files instead of duplicating their content
- include a short definition of done

### Phase 4: Add the artifact bundle

Use these support files when building the folder:

- `./resources/SKILL.template.md`
- `./resources/SKILL.example.md`
- `./resources/skill-quality-checklist.md`

At minimum, include:

- one template or scaffold
- one example showing tone and scope
- one checklist or quality gate for final validation

### Phase 5: Validate for discoverability

Check the final result against `./resources/skill-quality-checklist.md`.

Pay special attention to:

- whether the name still makes sense as a slash command
- whether the description would help an agent choose the skill correctly
- whether the workflow is concrete enough to execute without guesswork
- whether supporting files are shallow, relevant, and clearly named

## Common Failure Modes

- using a noun like `playwright` or `security` as the entire skill name
- writing a description that says what the skill is about but never says when to use it
- turning the body into a long theory document instead of a working procedure
- embedding templates inline until the skill becomes noisy and fragile
- mixing multiple loosely related jobs into one skill because they feel adjacent

## Resource Map

- `./resources/SKILL.template.md` - base scaffold for the main skill file
- `./resources/SKILL.example.md` - complete example of a compact, user-invocable skill
- `./resources/skill-quality-checklist.md` - final review checklist before shipping

## Definition of Done

A task using this skill is complete when:

- the folder name, frontmatter name, and skill purpose all align
- the description is discoverable and specific
- the body teaches a repeatable workflow rather than generic advice
- templates, examples, and validation material exist where they reduce ambiguity
- the final bundle passes the checklist without obvious overlap or missing context
