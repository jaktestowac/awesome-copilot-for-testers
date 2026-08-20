---
name: creating-plugins
description: 'Packages repository skills as installable Copilot plugins: marketplace registration, `plugin.json` manifests, generated skill copies, and the sync check CI enforces. Use when bundling one or more skills for installation, when adding a plugin to the marketplace, or when `npm run lint` reports that a plugin copy has drifted from its source skill.'
argument-hint: 'Which skills to bundle, the plugin name and description, and whether the plugin already exists'
user-invocable: true
---

# Creating Plugins

Use this skill when a skill or a small group of skills should be installable as a unit rather than copied by hand.

The rule that governs everything here: **`skills/` at the repository root is the source of truth, and everything under `plugins/*/skills/` is generated output that happens to be committed.** The generator is `npm run plugin:materialize`; the guard is `scripts/check-plugin-sync.js`, which CI runs as part of `npm run lint`. Editing a plugin copy directly produces a drift error and loses the edit on the next materialize.

## When to Use

- a skill is mature enough to install rather than copy
- several related skills should ship together
- a new plugin needs registering in the marketplace
- `npm run lint` reports a plugin copy that does not match its source skill
- a plugin's description or keywords need updating

## Operating Principles

- **The root skill is the source of truth.** Every change starts in `skills/<name>/` and flows outward.
- **Plugin skill copies are generated.** Never hand-edited, always regenerated.
- **A plugin is self-contained.** The plugin format resolves skill paths relative to the plugin root, so a plugin cannot reference `skills/` at the repository root. That is why the copies exist.
- **The marketplace entry comes first.** The scaffolder builds the plugin directory from it, and rewrites the generated fields from it on every run — edits flow downstream, never back up.
- **A bundle is justified by use together.** Two skills in one plugin because a user reaching for one reaches for the other, not because they share a topic.
- **The description is the install decision.** It is what a user reads in a marketplace listing, and it is the only thing they read.

## Workflow

### Phase 0: Decide the bundle

A plugin ships one skill, or a small group used together.

| Shape | Justified when |
| --- | --- |
| One skill | It stands alone, and nothing else is needed to use it |
| A skill plus its quick variant | The pair covers routine and deep use of the same capability, like `writing-unit-tests` |
| Several cooperating skills | A user reaching for one reliably reaches for the others in the same session |

Not justified: grouping by topic. "All the testing skills" is a directory listing, not a plugin. The user installs it, gets fifteen descriptions competing for the same triggers, and picks worse than they would have with three.

Before bundling, confirm the skills are distinct enough to coexist. Two skills whose descriptions overlap will collide harder inside one plugin than they do in a repository, because the user installed both deliberately.

### Phase 1: Register in the marketplace

```bash
npm run plugin:generate -- planning-exploratory-testing
```

`scripts/generate-plugins.js` writes the entry into `.github/plugin/marketplace.json`, taking the
description from `plugins/<name>/.github/plugin/plugin.json` if the plugin folder already exists,
otherwise from the frontmatter of `skills/<name>/SKILL.md`. Entry order is preserved and new
entries are appended, so the file stays readable in diffs.

| Command | Does |
| --- | --- |
| `npm run plugin:generate -- <name>` | add the entry for one plugin or root skill |
| `npm run plugin:generate -- <name> --description='...'` | add it with a written description instead of the skill's |
| `npm run plugin:generate` | backfill entries for every plugin folder missing one |
| `npm run plugin:generate:all` | register **every** root skill, refreshing existing entries from their `SKILL.md` |
| `npm run plugin:generate -- --dry-run` | print what would change, write nothing |
| `npm run plugin:generate -- --no-overwrite` | report drift instead of rewriting an entry |
| `npm run plugin:generate -- --verbose` | list every item instead of a count |
| `node scripts/generate-plugins.js --check` | fail if a plugin folder has no entry (CI, part of `npm run lint`) |

**Which file wins.** The pipeline flows one way, and each step overwrites what is downstream of it:

```
skills/<name>/SKILL.md  →  marketplace.json  →  plugins/<name>/  →  README.md
   (frontmatter)            (the registry)      (plugin.json,        (the tables)
                                                 README description)
```

`plugin:generate:all` therefore rewrites an existing entry's description from the skill's
frontmatter — a marketplace description edited by hand does not survive it. Write the listing
description in the skill's frontmatter, or use `--description=` per plugin, or pass
`--no-overwrite` to keep what is there and have the drift reported instead. A `version` somebody
bumped is never reset by a refresh; only `--version=` changes it.

`plugin:generate:all` packages the repository in bulk. It skips a skill another plugin already
ships, and it skips `<name>-quick` when `skills/<name>/` exists, printing the `plugin.json` line
that bundles the quick variant with its parent instead. Pair it with `--dry-run` first, and read
Phase 0 before accepting the result: one plugin per skill is a defensible default, but a pair used
together belongs in one plugin. `--check` never demands a plugin for a root skill — an unpackaged
skill is a normal state — so bulk mode stays opt-in and CI stays quiet about it.

A description derived from the skill frontmatter is a starting point, not the finished entry — the
generator says so when it uses one. Rewrite it as a marketplace listing, then continue.

The resulting entry, hand-written or generated:

```jsonc
{
  "name": "planning-exploratory-testing",
  "source": "plugins/planning-exploratory-testing",
  "description": "Runs session-based exploratory testing: charters, timeboxed sessions, coverage heuristics, evidence-carrying notes, and debriefs that route every finding somewhere. Bundles the charter format with worked examples per context, the SFDIPOT and tour heuristics, a session note template with a coverage summary, and the PROOF debrief. Use when a feature needs testing before requirements settle, or when scripted cases keep passing while users hit problems.",
  "version": "1.0.0"
}
```

The `name` matches the plugin directory under `source`. The `description` is what a user reads before installing, so it says what is inside and when to reach for it, in more detail than the skill's own description needs to.

### Phase 2: Scaffold and materialize

```bash
npm run plugin:materialize
```

This does two things, per `scripts/materialize-plugins.js`:

1. **Scaffold** - creates the plugin directory, a `.github/plugin/plugin.json`, and a `README.md` for every marketplace entry with a local `source`, then **rewrites the generated fields on every run** so the plugin always matches its marketplace entry:

   | File | Overwritten | Preserved |
   | --- | --- | --- |
   | `plugin.json` | `name`, `description`, `version`, `author`, `repository`, `license` | `keywords` and `skills` — curated by hand, and not derivable from the entry |
   | `README.md` | the frontmatter `description` | the whole body, which is hand-written prose |

   `--force-readme` rewrites plugin READMEs wholesale from the template, discarding that prose. Use it to reset a README the scaffolder generated, not one somebody wrote.

2. **Materialize** - copies each skill declared in each `plugin.json` from `skills/` into the plugin, and prunes copies no longer declared. A copy that already matches its source is left alone, so the output names only what changed.

The generated tree:

```
plugins/<plugin-name>/
  .github/plugin/plugin.json
  README.md
  skills/<skill-name>/
    SKILL.md
    resources/...
```

### Phase 3: Complete the manifest

The scaffolder writes a `plugin.json`; fill in what it cannot know.

```jsonc
{
  "name": "planning-exploratory-testing",
  "description": "...",
  "version": "1.0.0",
  "author": { "name": "jaktestowac.pl" },
  "repository": "https://github.com/jaktestowac/awesome-copilot-for-testers.git",
  "license": "MIT",
  "keywords": [
    "exploratory testing", "session-based testing", "charters",
    "test heuristics", "SFDIPOT", "tours", "manual testing", "QA"
  ],
  "skills": ["./skills/planning-exploratory-testing/"]
}
```

- `skills` paths are **relative to the plugin root** and resolve to `skills/<name>/` at the repository root during materialize
- `keywords` are how a user finds the plugin; include the terms they would search, including the ones the skill's own description does not need
- `keywords` and `skills` are the two fields a re-materialize leaves alone — edit them here
- `description` and `version` come from the marketplace entry and are rewritten on every materialize; change them there, not here

### Phase 4: Write the plugin README

The body is yours to write and survives every re-materialize; the frontmatter `description` is
taken from the marketplace entry, so change it there. Then:

- what problem the plugin solves, in one paragraph
- **what is inside**: each skill, plus its bundled resources listed individually. This is the part a user reads to judge depth.
- installation commands
- related plugins, and when to reach for those instead
- the source-of-truth note

The resource list matters more than it looks. It is the difference between "a skill about exploratory testing" and "the charter format, the SFDIPOT heuristics, the note template, and the PROOF debrief", and it is what tells a user whether the plugin is worth installing.

Use `./resources/plugin-readme.template.md`.

### Phase 5: Verify

```bash
npm run plugin:materialize   # regenerate the copies
npm run generate             # regenerate the repository README tables
npm run check                # verify the README is in sync
npm run lint                 # frontmatter, orchestration, plugin sync
```

`check-plugin-sync.js` performs two checks:

1. every skill declared in a `plugin.json` has a materialized copy with a `SKILL.md`
2. for each plugin skill copy whose source exists at the repository root, **the file lists and file contents match exactly**

A drift error means a plugin copy was edited directly, or a root skill changed without a re-materialize. Both are fixed by editing the root skill and running `npm run plugin:materialize`.

### Phase 6: Keep it in sync

The recurring rule for anyone changing a skill that a plugin vendors:

> Edit `skills/<name>/`. Then run `npm run plugin:materialize && npm run generate`.

Add it to the pull request habit. The lint catches it, but catching it in CI costs a round trip that a one-line habit avoids.

## Common Failure Modes

- editing a file under `plugins/*/skills/`, which fails the sync check and is lost on the next materialize
- changing a root skill and pushing without re-materializing
- a `plugin.json` declaring a skill that does not exist at the repository root
- bundling by topic, so one plugin ships a dozen competing descriptions
- a marketplace description that describes the topic and never says when to install it
- a README listing the skill but not its resources, so the depth is invisible
- editing `description` or `version` in `plugin.json`, which the next materialize overwrites from the marketplace entry
- rewording a marketplace description by hand and then running `plugin:generate:all`, which takes the skill's frontmatter back
- a plugin created for a skill still being iterated on, so every skill edit becomes a plugin release

## Resource Map

- `./resources/plugin-manifest.template.md` - `plugin.json` and marketplace entry, annotated field by field, with a worked example
- `./resources/plugin-readme.template.md` - README structure, the resource-listing pattern, and a worked example
- `./resources/plugin-packaging-checklist.md` - pre-ship checks and the drift-error troubleshooting table

## Related Skills

- `creating-skills` - for the skill that the plugin ships; the skill has to be good before packaging matters
- `creating-orchestration-packs` - when the thing being packaged is a pack of agents rather than skills
- `creating-custom-agents` - when the capability belongs in an agent
- `documenting-test-suites` - for the same instinct applied to a test suite: say what is inside and how to start

## Definition of Done

This skill is complete when:

- the bundle is one skill, or a group a user reaches for together, and grouping by topic was rejected
- the marketplace entry exists with a name, source, description, and version
- the description says what is inside and when to install it
- `plugin.json` carries author, repository, license, searchable keywords, and correct relative skill paths
- the README lists every bundled skill **and its resources**, plus installation and the source-of-truth note
- no file under `plugins/*/skills/` was hand-edited
- `npm run plugin:materialize`, `npm run generate`, `npm run check`, and `npm run lint` all pass
- versions match between `plugin.json` and the marketplace entry
