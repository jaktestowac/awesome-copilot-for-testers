---
agent: agent
description: "Create a new skill (SKILL.md) for VS Code Copilot. Analyzes existing skills for patterns, guides through design decisions, creates the skill file with supporting resources, and validates against best practices."
---

Create a new skill for VS Code Copilot. This prompt guides the creation of reusable, domain-specific knowledge for test automation, end-to-end testing, and quality assurance workflows. The user's message following this prompt may contain specific skill requirements or a description of the desired skill.

If the user did not provide specific requirements, ask clarifying questions to determine the skill's purpose, target domain, workflows, and supporting resources. Use the following guidelines to design and create the skill:

## Workflow

1. **Research existing skills**: Analyze skills in the `skills/` directory for patterns and conventions:
   - Naming conventions and folder structure
   - Frontmatter fields and description format
   - Body structure (progressive disclosure: principles, workflows, templates, references)
   - How skills reference supporting files (scripts/, references/, assets/)
   - Testing domain specificity — how existing skills approach test strategies

2. **Clarify requirements**: Determine the skill's design parameters with the user:
   - Core purpose and target domain (e.g., test automation strategy, Playwright patterns, CI/CD testing)
   - What triggers activation — when should agents load this skill?
   - Primary workflows and step-by-step processes the skill teaches
   - Supporting resources needed (templates, code examples, reference documentation)
   - If the user's message already contains requirements, confirm understanding before proceeding

3. **Design the skill**: Make design decisions based on research findings and user input:
   - **Skill name** in gerund form (e.g., `testing-playwright-patterns`, `implementing-e2e-workflows`, not `e2e-testing-guide`)
   - **Folder structure** and file organization (SKILL.md, supporting templates/references/examples)
   - **Progressive disclosure tiers**: discovery (~100 tokens), activation (< 500 lines), resources (as needed)
   - **Domain focus** — how this skill fits within the testing ecosystem and relates to other skills
   - **Max body size** — keep SKILL.md under 500 lines; move detailed content to separate files in references/ or scripts/

4. **Create the skill files**: Build the skill directory and SKILL.md following established conventions:
   - Create folder: `skills/<skill-name>/`
   - Create `SKILL.md` with YAML frontmatter (name, description, user-invokable)
   - Create supporting directories as needed: `references/`, `scripts/`, `assets/`
   - Structure SKILL.md body: principles, workflows, templates, reference sections
   - Apply progressive disclosure — link to supporting files rather than embedding everything
   - Reference supporting files with descriptive names and relative paths

5. **Populate supporting resources**: Create supporting files if the skill is complex:
   - **references/** — detailed documentation, decision matrices, rule sets, checklists
   - **scripts/** — executable code, CLI tools, test templates
   - **assets/** — configuration files, sample data, downloadable resources
   - Keep file references shallow (one level deep from SKILL.md)

6. **Review and validate**: Review the created skill against best practices:
   - Verify gerund naming convention is followed (e.g., `creating-agents`, `testing-patterns`)
   - Confirm SKILL.md frontmatter has all required fields: `name`, `description`, `user-invokable`
   - Check folder name matches the `name` field in frontmatter
   - Verify structural consistency with existing skills in the workspace
   - Ensure supporting files are referenced and organized appropriately
   - Validate that the skill is domain-coherent and not mixing unrelated workflows
   - Confirm the skill adds value without duplicating existing skills

## Guidelines

- **Naming conventions**: Use gerund form (verb + -ing): `testing-playwright-e2e`, `implementing-component-tests`, `analyzing-test-coverage`
- **Skill names vs. topics**: A skill name describes an activity ("creating agents"), not a topic ("agents")
- **Max name length**: 64 characters, aim for under 20 (will be used as `/slash-commands`)
- **File names**: Use descriptive kebab-case names: `assertion-patterns.md`, `ci-integration.md`, not `doc1.md`
- **Supporting files**: Move detailed reference material out of SKILL.md to keep it under 500 lines
- **YAML frontmatter**: Required fields are `name`, `description`, `user-invokable` (set to `false` for agent-loaded skills)
- **Description field**: Concise, action-oriented. Should explain what workflows the skill enables, not just the topic.

If the user attaches files, provides skill descriptions, or references existing patterns, use them as input for skill design.

When in doubt about design decisions (naming, structure, scope), ask the user for clarification rather than guessing. Ask one clarifying question at a time for better conversational flow.
