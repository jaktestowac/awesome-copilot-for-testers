#!/usr/bin/env node

// Builds the plugins/ tree from .github/plugin/marketplace.json plus the skills/
// source of truth. Two phases:
//
//   1. Scaffold — every marketplace entry with a local "source": "plugins/<dir>"
//      gets a plugin directory, a .github/plugin/plugin.json, and a README.md.
//      Generated fields are overwritten on every run, so the marketplace entry is
//      always what the plugin ships:
//        plugin.json  name, description, version, author, repository, license
//                     ("keywords" and "skills" are curated by hand and preserved)
//        README.md    the frontmatter description; the body is left alone, since it
//                     holds hand-written prose. --force-readme rewrites it wholesale
//                     from the template.
//   2. Materialize — copy each skill declared in a plugin.json from skills/ into
//      the plugin, prune copies no longer declared. Copies that already match their
//      source are left untouched, so the output lists only what changed.
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
const { createLogger } = require('./lib/log');

const repoRoot = path.join(__dirname, '..');
const pluginsDir = path.join(repoRoot, 'plugins');
const marketplacePath = path.join(repoRoot, '.github/plugin/marketplace.json');
const log = createLogger('materialize-plugins');
const errors = [];
const warnings = [];

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

// The marketplace entry owns the identity fields; "keywords" and "skills" are curated
// in the plugin manifest and survive a rewrite.
function buildPluginJson(entry, skillNames, pkg, existing) {
  const curatedKeywords = Array.isArray(existing?.keywords) && existing.keywords.length
    ? existing.keywords
    : // Starting point derived from the plugin name — curate these by hand.
      entry.name.split('-');

  return {
    name: entry.name,
    description: entry.description,
    version: entry.version || '1.0.0',
    author: { name: typeof pkg.author === 'string' ? pkg.author : pkg.author?.name || '' },
    repository: pkg.repository?.url || pkg.repository || '',
    license: pkg.license || 'MIT',
    keywords: curatedKeywords,
    skills: skillNames.map((name) => `./skills/${name}/`),
  };
}

// Swap the frontmatter description, leaving the hand-written body as it is.
function withReadmeDescription(text, description) {
  const quoted = `'${String(description || '').replace(/'/g, "''")}'`;
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!frontmatter) return `---\ndescription: ${quoted}\n---\n\n${text}`;

  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = frontmatter[1].split(/\r?\n/);
  const index = lines.findIndex((line) => /^description\s*:/.test(line));
  const rebuilt = index === -1 ? [`description: ${quoted}`, ...lines] : lines.slice();
  if (index !== -1) {
    // Drop any wrapped continuation of the old value before writing the new one.
    let end = index + 1;
    while (end < rebuilt.length && /^\s+\S/.test(rebuilt[end])) end++;
    rebuilt.splice(index, end - index, `description: ${quoted}`);
  }
  return text.replace(frontmatter[0], `---${eol}${rebuilt.join(eol)}${eol}---`);
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

function listFilesRecursively(basePath) {
  const out = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(path.relative(basePath, full).split(path.sep).join('/'));
    }
  }
  if (fs.existsSync(basePath)) walk(basePath);
  return out.sort();
}

// A copy that already matches its source is left alone, so the output reports what
// actually changed instead of restating every plugin on every run.
function dirsMatch(a, b) {
  const filesA = listFilesRecursively(a);
  const filesB = listFilesRecursively(b);
  if (filesA.length !== filesB.length) return false;
  if (filesA.some((file, i) => file !== filesB[i])) return false;
  return filesA.every((file) =>
    fs.readFileSync(path.join(a, file)).equals(fs.readFileSync(path.join(b, file))),
  );
}

// Resolve a plugin-relative declaration to its repo-root source directory.
//   ./skills/foo/ -> <repoRoot>/skills/foo
function resolveSkillSource(relPath) {
  const skillName = relPath.replace(/^\.\/skills\//, '').replace(/\/$/, '');
  return { skillName, sourceDir: path.join(repoRoot, 'skills', skillName) };
}

const forceReadme = process.argv.includes('--force-readme');

let currentSkills = 0;
const copiedSkills = [];
const prunedCopies = [];
const scaffoldedPlugins = [];
const rewrittenManifests = [];
const rewrittenReadmes = [];

// ---------------------------------------------------------------------------
// Phase 1: scaffold plugins declared in marketplace.json
// ---------------------------------------------------------------------------

log.intro('scaffolding from marketplace.json, then copying skills/ into each plugin');

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
      const { data: existing, error: manifestError } = isNew
        ? { data: null }
        : readJson(manifestPath);

      if (manifestError) {
        errors.push(`${entry.name}: ${manifestError} — fix the JSON or delete the file to regenerate it`);
        continue;
      }

      // An existing manifest keeps whatever bundle it declares; a new one falls back to
      // the repository convention that a plugin wraps the root skill of the same name.
      let skillNames = (Array.isArray(existing?.skills) ? existing.skills : [])
        .filter((p) => typeof p === 'string')
        .map((p) => resolveSkillSource(p).skillName);

      if (!skillNames.length) {
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
        skillNames = [skillName];
      }

      // The manifest is regenerated from the marketplace entry on every run.
      const manifestText = JSON.stringify(buildPluginJson(entry, skillNames, pkg || {}, existing), null, 2) + '\n';
      if (isNew) {
        fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
        fs.writeFileSync(manifestPath, manifestText);
        scaffoldedPlugins.push(entry.name);
        log.detail(`${entry.name}: created ${rel(manifestPath)} (skills: ${skillNames.join(', ')})`);
      } else if (fs.readFileSync(manifestPath, 'utf8') !== manifestText) {
        fs.writeFileSync(manifestPath, manifestText);
        rewrittenManifests.push(entry.name);
        log.detail(`${entry.name}: rewrote ${rel(manifestPath)} from the marketplace entry`);
      }

      if (!fs.existsSync(readmePath)) {
        fs.writeFileSync(readmePath, buildPluginReadme(entry, skillNames, ownerRepo));
        log.detail(`${entry.name}: created ${rel(readmePath)}`);
      } else if (forceReadme) {
        const template = buildPluginReadme(entry, skillNames, ownerRepo);
        if (fs.readFileSync(readmePath, 'utf8') !== template) {
          fs.writeFileSync(readmePath, template);
          rewrittenReadmes.push(entry.name);
          log.detail(`${entry.name}: rewrote ${rel(readmePath)} from the template (--force-readme)`);
        }
      } else {
        // Keep the prose, take the description: it is what the marketplace listing and
        // the repository README table both show.
        const current = fs.readFileSync(readmePath, 'utf8');
        const updated = withReadmeDescription(current, entry.description);
        if (updated !== current) {
          fs.writeFileSync(readmePath, updated);
          rewrittenReadmes.push(entry.name);
          log.detail(`${entry.name}: updated the description in ${rel(readmePath)}`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Phase 2: materialize declared skills into each plugin
// ---------------------------------------------------------------------------

if (!fs.existsSync(pluginsDir)) {
  log.finish({ errors, warnings, ok: '(no plugins directory, nothing to do)' });
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

    const destDir = path.join(pluginPath, 'skills', skillName);
    if (fs.existsSync(destDir) && dirsMatch(sourceDir, destDir)) {
      currentSkills++;
      log.detail(`${pluginName}: skills/${skillName}/ already current`);
      continue;
    }

    // Replace the copy outright so deletions in the source propagate.
    fs.rmSync(destDir, { recursive: true, force: true });
    copyDirRecursive(sourceDir, destDir);
    copiedSkills.push(`${pluginName}/${skillName}`);
    log.detail(`${pluginName}: skills/${skillName}/ -> ${rel(destDir)}/`);
  }

  // Drop generated copies the manifest no longer declares.
  const pluginSkillsDir = path.join(pluginPath, 'skills');
  if (fs.existsSync(pluginSkillsDir)) {
    for (const existing of fs.readdirSync(pluginSkillsDir)) {
      const existingPath = path.join(pluginSkillsDir, existing);
      if (!fs.statSync(existingPath).isDirectory()) continue;
      if (declaredNames.includes(existing)) continue;
      fs.rmSync(existingPath, { recursive: true, force: true });
      prunedCopies.push(`${pluginName}/${existing}`);
      log.detail(`${pluginName}: pruned ${rel(existingPath)}/ (not declared in plugin.json)`);
    }
  }
}

// ---------------------------------------------------------------------------
// Report: what changed, then the verdict
// ---------------------------------------------------------------------------

if (scaffoldedPlugins.length) {
  log.added(`${scaffoldedPlugins.length} plugin(s) scaffolded`);
  log.names(scaffoldedPlugins);
  log.note('review the generated "keywords" and README — they are derived from the plugin name');
}
if (rewrittenManifests.length) {
  log.change('~', `${rewrittenManifests.length} manifest(s) rewritten`, 'from the marketplace entry');
  log.names(rewrittenManifests);
}
if (rewrittenReadmes.length) {
  const what = forceReadme ? 'rewritten from the template' : 'description updated';
  log.change('~', `${rewrittenReadmes.length} plugin README(s)`, what);
  log.names(rewrittenReadmes);
}
if (copiedSkills.length) {
  log.added(`${copiedSkills.length} skill copy/copies written`);
  log.names(copiedSkills);
}
if (prunedCopies.length) {
  log.removed(`${prunedCopies.length} stale copy/copies pruned`, 'no longer declared in plugin.json');
  log.names(prunedCopies);
}

const counts = [
  scaffoldedPlugins.length ? `${scaffoldedPlugins.length} plugin(s) scaffolded` : '',
  rewrittenManifests.length ? `${rewrittenManifests.length} manifest(s) rewritten` : '',
  rewrittenReadmes.length ? `${rewrittenReadmes.length} README(s) updated` : '',
  copiedSkills.length ? `${copiedSkills.length} copy/copies written` : '',
  currentSkills ? `${currentSkills} skill copy/copies already current` : '',
  prunedCopies.length ? `${prunedCopies.length} pruned` : '',
].filter(Boolean);

const touchedReadme =
  scaffoldedPlugins.length || rewrittenReadmes.length || rewrittenManifests.length;

log.finish({
  errors,
  warnings,
  ok: `(${counts.join(', ') || 'nothing to do'})`,
  next: touchedReadme ? ['npm run generate'] : [],
});
