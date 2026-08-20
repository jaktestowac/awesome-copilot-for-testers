# Plugin Manifests

Two files, both hand-maintained. Everything else in the plugin tree is generated.

## Marketplace entry

`.github/plugin/marketplace.json`, in the `plugins` array.

```jsonc
{
  "name": "planning-exploratory-testing",
  "source": "plugins/planning-exploratory-testing",
  "description": "Runs session-based exploratory testing: charters, timeboxed sessions, coverage heuristics, evidence-carrying notes, and debriefs that route every finding somewhere. Bundles the charter format with worked examples per context, SFDIPOT and CRUSSPIC coverage heuristics, twelve named tours, a session note template with a coverage summary, and the PROOF debrief. Use when a feature needs testing before requirements settle, when scripted regression passes while users hit problems, or when a release needs a risk sweep with limited time.",
  "version": "1.0.0"
}
```

| Field | Rule |
| --- | --- |
| `name` | Matches the plugin directory name under `source`. Kebab-case. Usually the skill name when the plugin ships one skill. |
| `source` | `plugins/<name>`. The scaffolder creates the directory from this. |
| `description` | What a user reads before installing. Longer than the skill's own description: say what is inside and when to reach for it. |
| `version` | Semver. Bump with the plugin's `plugin.json` in the same commit. |

### Writing the description

It answers two questions, in this order:

1. **What does it do**, concretely enough to distinguish it from a neighbour
2. **What is inside**, so the depth is visible
3. **When do I reach for it**, with real triggers

Compare:

> Helps with exploratory testing.

against the example above. The first tells a user nothing they could not guess from the name, and it competes with every other testing plugin in the listing.

The pattern used across this repository's marketplace: capability sentence, then a "Bundles ..." sentence naming the resources, then a "Use when ..." sentence with triggers.

## Plugin manifest

`plugins/<name>/.github/plugin/plugin.json`.

```jsonc
{
  "name": "planning-exploratory-testing",
  "description": "Runs session-based exploratory testing: charters, timeboxed sessions, coverage heuristics, evidence-carrying notes, and debriefs that route every finding somewhere. Bundles charter templates, SFDIPOT and tour heuristics, a session note template, and the PROOF debrief.",
  "version": "1.0.0",
  "author": {
    "name": "jaktestowac.pl"
  },
  "repository": "https://github.com/jaktestowac/awesome-copilot-for-testers.git",
  "license": "MIT",
  "keywords": [
    "exploratory testing",
    "session-based testing",
    "test charters",
    "SFDIPOT",
    "test heuristics",
    "tours",
    "manual testing",
    "test coverage",
    "QA"
  ],
  "skills": [
    "./skills/planning-exploratory-testing/"
  ]
}
```

| Field | Rule |
| --- | --- |
| `name` | Matches the marketplace entry and the directory |
| `description` | May be shorter than the marketplace one; keep the "what is inside" part |
| `version` | Matches the marketplace entry |
| `author` | `{ "name": "jaktestowac.pl" }` for this repository |
| `repository` | The repository URL |
| `license` | `MIT` |
| `keywords` | Search terms, including ones the skill's description does not need |
| `skills` | Paths **relative to the plugin root**, resolving to `skills/<name>/` at the repository root during materialize |

### Keywords

These are how a user finds the plugin, and they can carry vocabulary a skill description should not spend tokens on:

- the activity: `exploratory testing`, `session-based testing`
- named techniques: `SFDIPOT`, `tours`, `PROOF`
- the tools: `playwright`, `vitest`, `k6`
- the discipline: `QA`, `test automation`
- what a searcher might type when they do not know the term: `manual testing`, `test charters`

Eight to fifteen is a reasonable range. Two is not searchable; thirty is noise.

## Bundling several skills

```jsonc
{
  "name": "writing-unit-tests",
  "description": "Writes and reviews focused, deterministic unit tests that verify behavior through public interfaces instead of implementation details. Bundles the full workflow together with a compact quick version for routine everyday testing.",
  "skills": [
    "./skills/writing-unit-tests/",
    "./skills/writing-unit-tests-quick/"
  ]
}
```

The pattern that justifies a bundle: a full skill plus its quick variant, where a user reaching for one wants the other available. The marketplace description says both are inside, so the install decision is informed.

Before bundling skills that are not a full/quick pair, check that their descriptions do not compete. Two skills with overlapping triggers collide harder inside one plugin than across a repository, because the user installed both on purpose and expects the right one to fire.

## Adding a plugin, end to end

```bash
# 1. The root skill must exist and be good first
ls skills/planning-exploratory-testing/SKILL.md

# 2. Add the entry to .github/plugin/marketplace.json

# 3. Scaffold and materialize
npm run plugin:materialize

# 4. Fill in the generated plugin.json: author, repository, license, keywords

# 5. Write the README, listing every skill and its resources

# 6. Re-materialize and regenerate
npm run plugin:materialize
npm run generate

# 7. Verify
npm run check
npm run lint
```

Step 1 is not a formality. A plugin created for a skill still being iterated on turns every skill edit into a plugin release, and the version numbers stop meaning anything.

## Versioning

| Change | Bump |
| --- | --- |
| Typo, wording, formatting | none |
| New resource file, expanded guidance | patch |
| Workflow phases changed, description triggers changed | minor |
| A skill added to or removed from the bundle | major |
| The skill renamed | major, and update the marketplace `name` |

Bump `plugin.json` and the marketplace entry **in the same commit**. A mismatch between the two is the most common manifest defect and the lint does not catch it.
