# Skill Quality Checklist

Use this checklist before finalizing a GitHub Copilot skill.

## Discovery and naming

- [ ] The folder name and frontmatter `name` match exactly.
- [ ] The name describes an activity, not just a topic.
- [ ] The description explains both what the skill does and when to use it.
- [ ] The description includes realistic trigger phrases or contexts.

## Skill body

- [ ] The introduction is concise and explains the purpose clearly.
- [ ] The body teaches a repeatable workflow.
- [ ] The workflow is concrete enough to execute without inventing missing steps.
- [ ] The skill defines what a good outcome looks like.
- [ ] The skill ends with a clear definition of done or completion criteria.

## Supporting resources

- [ ] Templates, examples, or checklists exist when they reduce ambiguity.
- [ ] Resource filenames are descriptive.
- [ ] Supporting files stay one level deep from the skill root.
- [ ] The `SKILL.md` body links to supporting files instead of duplicating them.

## Separation of concerns

- [ ] The skill does not try to define an agent personality.
- [ ] The skill does not duplicate repository instructions that should always apply.
- [ ] The skill does not act like a prompt that only kicks off one narrow command.

## Final handoff

- [ ] The bundle is install-ready.
- [ ] The skill is distinct from other nearby skills.
- [ ] The skill would still make sense to someone who did not author it.

## Smells that should trigger a rewrite

- a vague name like `helpers`, `best-practices`, or `playwright`
- a description that never says when to use the skill
- a huge `SKILL.md` with buried examples and no resource files
- a workflow made of slogans instead of actions
