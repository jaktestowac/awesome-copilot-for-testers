#!/usr/bin/env node

// Builds the plugins/ tree from .github/plugin/marketplace.json plus the skills/
// source of truth. Two phases:
//
//   1. Scaffold — every marketplace entry with a local "source": "plugins/<dir>"
//      gets a plugin directory, a .github/plugin/plugin.json, and a README.md.
//      Existing files are never overwritten, so hand edits are safe.
//   2. Materialize — copy each skill declared in a plugin.json from skills/ into
//      the plugin, prune copies no longer declared.
//
// Plugins must ship self-contained content: the plugin format resolves skill paths
// relative to the plugin root, so a plugin cannot point up at skills/. The copies
// under plugins/<plugin>/skills/ are therefore generated output that happens to be
// committed — never hand-edit them, run this script instead.
//
// Each plugin's .github/plugin/plugin.json declares what it ships:
//   "skills": ["./skills/tech-debt-analysis/"]
// which resolves to skills/tech-debt-analysis/ at the repo root.
//
// Adding a plugin: add the entry to marketplace.json, make sure the root skill
// exists in skills/, then run `npm run plugin:materialize && npm run generate`.
//
// Run `npm run plugin:materialize` after changing anything under skills/, then
// `npm run lint` (check-plugin-sync.js) to verify the copies match.

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const pluginsDir = path.join(repoRoot, 'plugins');
const marketplacePath = path.join(repoRoot, '.github/plugin/marketplace.json');
const errors = [];

function rel(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function readJson(filePath) {
  try {
    return { data: JSON.parse(fs.readFileSync(filePath, 'utf8')) };
  } catch (err) {
    return { error: `${rel(filePath)}: ${err.message}` };
  }
}

function titleCase(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// "https://github.com/jaktestowac/awesome-copilot-for-testers.git" -> "jaktestowac/awesome-copilot-for-testers"
function ownerRepoFrom(repositoryUrl) {
  const match = /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/.exec(repositoryUrl || '');
  return match ? match[1] : null;
}

function buildPluginJson(entry, skillNames, pkg) {
  return {
    name: entry.name,
    description: entry.description,
    version: entry.version || '1.0.0',
    author: { name: typeof pkg.author === 'string' ? pkg.author : pkg.author?.name || '' },
    repository: pkg.repository?.url || pkg.repository || '',
    license: pkg.license || 'MIT',
    // Starting point derived from the plugin name — curate these by hand.
    keywords: entry.name.split('-'),
    skills: skillNames.map((name) => `./skills/${name}/`),
  };
}

function buildPluginReadme(entry, skillNames, ownerRepo) {
  const title = `${titleCase(entry.name)} Plugin`;
  const inside = skillNames
    .map(
      (name) =>
        `- \`skills/${name}/\` — the agent skill, generated from the repository's \`skills/${name}/\` directory, which is the source of truth`,
    )
    .join('\n');
  const install = ownerRepo
    ? `copilot plugin marketplace add ${ownerRepo}\ncopilot plugin install ${entry.name}`
    : `copilot plugin install ${entry.name}`;
  const sources = skillNames.map((name) => `\`skills/${name}/\``).join(', ');

  return `---
description: '${String(entry.description || '').replace(/'/g, "''")}'
---

# ${title}

${entry.description || ''}

## What's inside

${inside}

## Installation

Install from this repository's plugin marketplace (defined in \`.github/plugin/marketplace.json\`):

\`\`\`
${install}
\`\`\`

## Note on source of truth

The skill content is a copy of ${sources} at the repository root. Do not edit the plugin copy
directly — update the root skill and run \`npm run plugin:materialize\`.
`;
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirRecursive(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

// Resolve a plugin-relative declaration to its repo-root source directory.
//   ./skills/foo/ -> <repoRoot>/skills/foo
function resolveSkillSource(relPath) {
  const skillName = relPath.replace(/^\.\/skills\//, '').replace(/\/$/, '');
  return { skillName, sourceDir: path.join(repoRoot, 'skills', skillName) };
}

let copiedSkills = 0;
let prunedDirs = 0;
let scaffolded = 0;

// ---------------------------------------------------------------------------
// Phase 1: scaffold plugins declared in marketplace.json
// ---------------------------------------------------------------------------

if (fs.existsSync(marketplacePath)) {
  const { data: marketplace, error } = readJson(marketplacePath);
  if (error) {
    errors.push(`invalid marketplace manifest — ${error}`);
  } else {
    const { data: pkg } = readJson(path.join(repoRoot, 'package.json'));
    const ownerRepo = ownerRepoFrom(pkg?.repository?.url || pkg?.repository);
    const entries = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];

    for (const entry of entries) {
      // Remote entries ({ source: "github", ... }) own their own content.
      if (typeof entry?.source !== 'string') continue;
      if (!entry.source.startsWith('plugins/')) continue;
      if (!entry.name) {
        errors.push(`${rel(marketplacePath)}: entry with source '${entry.source}' has no "name"`);
        continue;
      }

      const pluginPath = path.join(repoRoot, entry.source);
      const manifestPath = path.join(pluginPath, '.github/plugin/plugin.json');
      const readmePath = path.join(pluginPath, 'README.md');
      const isNew = !fs.existsSync(manifestPath);

      if (isNew) {
        // Convention in this repo: a plugin wraps the root skill of the same name.
        const candidates = [entry.name, path.basename(entry.source)];
        const skillName = candidates.find((name) =>
          fs.existsSync(path.join(repoRoot, 'skills', name, 'SKILL.md')),
        );

        if (!skillName) {
          errors.push(
            `${entry.name}: no root skill found at skills/${candidates[0]}/SKILL.md — create the skill first, ` +
              `or scaffold ${rel(manifestPath)} by hand and declare its "skills" explicitly`,
          );
          continue;
        }

        const manifest = buildPluginJson(entry, [skillName], pkg || {});
        fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
        scaffolded++;
        console.log(`+ ${entry.name}: created ${rel(manifestPath)} (skills: ${skillName})`);
        console.log(`  ↳ review the generated "keywords" — they are derived from the plugin name`);
      }

      if (!fs.existsSync(readmePath)) {
        const { data: manifest } = readJson(manifestPath);
        const skillNames = (manifest?.skills || []).map(
          (p) => resolveSkillSource(p).skillName,
        );
        fs.writeFileSync(readmePath, buildPluginReadme(entry, skillNames, ownerRepo));
        console.log(`+ ${entry.name}: created ${rel(readmePath)}`);
      }

      // Keep the marketplace entry and the plugin manifest telling the same story.
      const { data: manifest } = readJson(manifestPath);
      if (manifest) {
        for (const field of ['description', 'version']) {
          if (entry[field] !== undefined && manifest[field] !== undefined && entry[field] !== manifest[field]) {
            errors.push(
              `${entry.name}: "${field}" differs between marketplace.json and ${rel(manifestPath)} ` +
                `('${entry[field]}' vs '${manifest[field]}')`,
            );
          }
        }
        if (manifest.name !== entry.name) {
          errors.push(
            `${entry.name}: "name" differs between marketplace.json and ${rel(manifestPath)} ('${manifest.name}')`,
          );
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Phase 2: materialize declared skills into each plugin
// ---------------------------------------------------------------------------

if (!fs.existsSync(pluginsDir)) {
  console.log('materialize-plugins: no plugins directory, nothing to do.');
  process.exit(errors.length ? 1 : 0);
}

for (const pluginName of fs.readdirSync(pluginsDir).sort()) {
  const pluginPath = path.join(pluginsDir, pluginName);
  if (!fs.statSync(pluginPath).isDirectory()) continue;

  const manifestPath = path.join(pluginPath, '.github/plugin/plugin.json');
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${rel(pluginPath)}: missing .github/plugin/plugin.json`);
    continue;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    errors.push(`${rel(manifestPath)}: invalid JSON — ${err.message}`);
    continue;
  }

  const declared = manifest.skills;
  if (declared !== undefined && !Array.isArray(declared)) {
    errors.push(`${rel(manifestPath)}: "skills" must be an array`);
    continue;
  }

  const declaredNames = [];

  for (const relPath of declared || []) {
    if (typeof relPath !== 'string') {
      errors.push(`${rel(manifestPath)}: every "skills" entry must be a string`);
      continue;
    }
    // The plugin format resolves skill entries as directories relative to the
    // plugin root, so the "./skills/<name>/" shape is required.
    if (!relPath.startsWith('./skills/') || !relPath.endsWith('/')) {
      errors.push(
        `${rel(manifestPath)}: skills entry '${relPath}' must start with './skills/' and end with '/'`,
      );
      continue;
    }

    const { skillName, sourceDir } = resolveSkillSource(relPath);
    if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
      errors.push(`${rel(manifestPath)}: skills entry '${relPath}' has no source at skills/${skillName}/`);
      continue;
    }
    if (!fs.existsSync(path.join(sourceDir, 'SKILL.md'))) {
      errors.push(`skills/${skillName}/: missing SKILL.md`);
      continue;
    }

    declaredNames.push(skillName);

    // Replace the copy outright so deletions in the source propagate.
    const destDir = path.join(pluginPath, 'skills', skillName);
    fs.rmSync(destDir, { recursive: true, force: true });
    copyDirRecursive(sourceDir, destDir);
    copiedSkills++;
    console.log(`✓ ${pluginName}: skills/${skillName}/ -> ${rel(destDir)}/`);
  }

  // Drop generated copies the manifest no longer declares.
  const pluginSkillsDir = path.join(pluginPath, 'skills');
  if (fs.existsSync(pluginSkillsDir)) {
    for (const existing of fs.readdirSync(pluginSkillsDir)) {
      const existingPath = path.join(pluginSkillsDir, existing);
      if (!fs.statSync(existingPath).isDirectory()) continue;
      if (declaredNames.includes(existing)) continue;
      fs.rmSync(existingPath, { recursive: true, force: true });
      prunedDirs++;
      console.log(`- ${pluginName}: pruned ${rel(existingPath)}/ (not declared in plugin.json)`);
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error(`❌ ${e}`);
  console.error(`\nmaterialize-plugins: ${errors.length} error(s)`);
  process.exit(1);
}

const pruned = prunedDirs ? `, pruned ${prunedDirs} stale copy/copies` : '';
const created = scaffolded ? `, scaffolded ${scaffolded} new plugin(s)` : '';
console.log(`materialize-plugins: OK (${copiedSkills} skill copy/copies generated${pruned}${created})`);
if (scaffolded) {
  console.log("Next: run 'npm run generate' to add the new plugin(s) to README.md.");
}
