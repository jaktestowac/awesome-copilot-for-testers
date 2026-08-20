# Plugin Packaging Checklist

## Before creating the plugin

- [ ] The root skill exists in `skills/<name>/` and passes `creating-skills`' own quality checklist
- [ ] The skill has been used at least once for real, not only written
- [ ] The skill is stable enough that every edit will not become a plugin release
- [ ] The bundle is one skill, or a group a user reaches for together
- [ ] Grouping by topic was considered and rejected
- [ ] For a multi-skill bundle: the skills' descriptions do not compete for the same triggers

## Manifests

- [ ] Marketplace entry added to `.github/plugin/marketplace.json`
- [ ] `name` matches the directory under `source`
- [ ] `source` is `plugins/<name>`
- [ ] Marketplace `description` says what it does, what is inside, and when to install it
- [ ] `plugin.json` carries `author`, `repository`, `license`
- [ ] `keywords` are searchable: activity, named techniques, tools, discipline, and the terms a searcher uses before they know the jargon
- [ ] `skills` paths are relative to the plugin root and resolve to real skills at the repository root
- [ ] `version` **matches** between `plugin.json` and the marketplace entry

The version mismatch is the commonest manifest defect and the lint does not catch it. Check it by eye.

## README

- [ ] Frontmatter `description` present
- [ ] Opening paragraph names the problem, not the feature
- [ ] Every bundled skill listed
- [ ] **Every resource listed with a phrase saying what is in it**, not the filename restated
- [ ] Installation commands copied verbatim from an existing plugin README
- [ ] Related plugins named, with when to reach for those instead
- [ ] Source-of-truth note present, verbatim

## Generated content

- [ ] `npm run plugin:materialize` has been run since the last skill edit
- [ ] **No file under `plugins/*/skills/` was hand-edited**
- [ ] The plugin's skill copy contains the whole skill, including `resources/`
- [ ] No stale skill copy for a skill no longer declared (materialize prunes these)

## Commands

```bash
npm run plugin:materialize
npm run generate
npm run check
npm run lint
```

All four pass before the pull request.

## After merging

- [ ] Install it from the marketplace as a user would
- [ ] Confirm the skill triggers on the phrases its description promises
- [ ] Confirm the bundled resources are reachable from the installed skill

An installed-plugin check catches path problems that no repository-level lint sees.

---

## Troubleshooting

### `declares './skills/<name>/' but plugins/<plugin>/skills/<name>/SKILL.md is missing`

The manifest names a skill that was never materialized.

```bash
ls skills/<name>/SKILL.md          # does the root skill exist?
npm run plugin:materialize
```

If the root skill does not exist, the `skills` path in `plugin.json` is wrong, or the skill was renamed without updating the manifest.

### File contents do not match

A plugin copy has drifted from its source. Two causes:

1. Someone edited the plugin copy directly. **The edit is lost** on re-materialize. Recover it from the diff, apply it to the root skill, then re-materialize.
2. A root skill changed without a re-materialize. Just run it.

```bash
# See what drifted before overwriting
git diff plugins/<plugin>/skills/<name>/

# Then, once the change is safe in the root skill
npm run plugin:materialize
```

### File lists do not match

A file was added to or removed from the root skill without a re-materialize, or a file was added directly to the plugin copy. Re-materialize; extra files in the copy are pruned.

### README out of sync after `npm run check`

```bash
npm run generate
```

Run `generate` after `plugin:materialize`, not before. The README tables are built from the current state of both trees.

### Skill does not trigger after installing

Not a packaging problem. The description is the trigger surface; see `creating-skills`. Check whether another installed skill's description competes for the same phrases.

---

## The recurring habit

For anyone changing a skill that a plugin vendors:

> Edit `skills/<name>/`. Then `npm run plugin:materialize && npm run generate`.

Worth adding to the pull request template. The lint catches the omission, but catching it in CI costs a round trip that a one-line habit avoids.
