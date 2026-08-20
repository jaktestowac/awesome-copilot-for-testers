#!/usr/bin/env node

// Adds plugin definitions to .github/plugin/marketplace.json.
//
// The marketplace manifest is the entry point of the plugin pipeline:
//   generate-plugins.js  -> writes the marketplace entry
//   materialize-plugins.js -> scaffolds plugins/<name>/ from that entry and copies skills/
//   regenerate-readme.js -> renders the README plugin table
//
// Three ways to use it:
//
//   node scripts/generate-plugins.js
//     Reconcile mode. Every plugins/<dir>/.github/plugin/plugin.json without a
//     marketplace entry gets one, derived from the manifest. Use this when a plugin
//     directory was created by hand and the marketplace was never updated.
//
//   node scripts/generate-plugins.js <name> [<name>...]
//     Named mode. Adds an entry for each name, resolved in this order:
//       1. plugins/<name>/.github/plugin/plugin.json  — description and version from the manifest
//       2. skills/<name>/SKILL.md                     — description from the frontmatter
//     This is the normal path for packaging an existing root skill as a plugin.
//
//   node scripts/generate-plugins.js --all-skills
//     Bulk mode. Every skill under skills/ that is not packaged yet gets an entry,
//     with the description taken from its SKILL.md frontmatter. Skipped:
//       - skills already vendored by a plugin (declared in some plugin.json)
//       - '<name>-quick' when skills/<name>/ exists — the repository convention is to
//         bundle a quick variant with its parent plugin, not ship it separately
//     Bulk mode is deliberately opt-in, and deliberately outside --check: a root skill
//     with no plugin is a normal state, not an error, so CI must not demand one.
//
// Options:
//   --all-skills         add an entry for every unpackaged skill under skills/
//   --check              write nothing; exit 1 if the manifest is out of date (for CI)
//   --dry-run            print what would be written, write nothing
//   --sync               pull description/version from plugin.json into existing entries
//                        (without it, a mismatch is reported as an error)
//   --description=<text> description for the entries being added (named mode, single name)
//   --version=<semver>   version for the entries being added (default 1.0.0)
//   --help
//
// Existing entries keep their order and their fields; new entries are appended, so a
// hand-curated marketplace description is never silently rewritten.

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const marketplacePath = path.join(repoRoot, '.github/plugin/marketplace.json');
const pluginsDir = path.join(repoRoot, 'plugins');
const skillsDir = path.join(repoRoot, 'skills');

const DEFAULT_VERSION = '1.0.0';
const errors = [];
const warnings = [];

function rel(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function usage() {
  console.log(
    [
      'Usage:',
      '  node scripts/generate-plugins.js                       reconcile marketplace.json with plugins/',
      '  node scripts/generate-plugins.js <name> [<name>...]    add entries for plugins or root skills',
      '  node scripts/generate-plugins.js --all-skills          add entries for every unpackaged skill',
      '',
      'Options:',
      '  --all-skills          add an entry for every skill under skills/ that has no plugin yet',
      '  --check               write nothing; exit 1 if entries are missing or drifted',
      '  --dry-run             print the entries that would be added, write nothing',
      '  --sync                update existing entries from plugins/<name>/.github/plugin/plugin.json',
      '  --description=<text>  description for the added entry (single name only)',
      '  --version=<semver>    version for the added entries (default 1.0.0)',
      '  --help                show this message',
    ].join('\n'),
  );
}

function parseArgs(argv) {
  const opts = {
    names: [],
    allSkills: false,
    check: false,
    dryRun: false,
    sync: false,
    description: null,
    version: null,
    help: false,
  };
  for (const arg of argv) {
    if (arg === '--all-skills') opts.allSkills = true;
    else if (arg === '--check') opts.check = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--sync') opts.sync = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg.startsWith('--description=')) opts.description = arg.slice('--description='.length);
    else if (arg.startsWith('--version=')) opts.version = arg.slice('--version='.length);
    else if (arg.startsWith('-')) errors.push(`unknown option '${arg}' — run with --help`);
    else opts.names.push(arg.replace(/^(?:plugins|skills)\//, '').replace(/\/$/, ''));
  }
  return opts;
}

function readJson(filePath) {
  try {
    return { data: JSON.parse(fs.readFileSync(filePath, 'utf8')) };
  } catch (err) {
    return { error: `${rel(filePath)}: ${err.message}` };
  }
}

// Pull the frontmatter `description` out of a SKILL.md. Handles the shapes this repo
// uses: single- or double-quoted (possibly wrapped over several lines) and bare values.
function extractSkillDescription(skillMdPath) {
  const raw = fs.readFileSync(skillMdPath, 'utf8').replace(/^﻿/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return null;

  const lines = match[1].split(/\r?\n/);
  const start = lines.findIndex((line) => /^description\s*:/.test(line));
  if (start === -1) return null;

  let value = lines[start].replace(/^description\s*:\s*/, '').trim();
  const quote = value.startsWith("'") ? "'" : value.startsWith('"') ? '"' : null;

  if (!quote) {
    // Bare scalar, or a folded/literal block: take the indented continuation lines.
    if (value === '>' || value === '|' || value === '>-' || value === '|-') {
      const block = [];
      for (const line of lines.slice(start + 1)) {
        if (!/^\s+\S/.test(line)) break;
        block.push(line.trim());
      }
      return block.join(' ').trim() || null;
    }
    return value || null;
  }

  // Quoted value: keep appending lines until the closing quote shows up.
  let body = value.slice(1);
  let closed = false;
  const closeAt = (text) => {
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== quote) continue;
      if (quote === "'" && text[i + 1] === "'") {
        i++; // escaped '' inside a single-quoted scalar
        continue;
      }
      if (quote === '"' && text[i - 1] === '\\') continue;
      return i;
    }
    return -1;
  };

  let end = closeAt(body);
  if (end !== -1) {
    body = body.slice(0, end);
    closed = true;
  }
  for (const line of lines.slice(start + 1)) {
    if (closed) break;
    const trimmed = line.trim();
    end = closeAt(trimmed);
    body += ' ' + (end === -1 ? trimmed : trimmed.slice(0, end));
    if (end !== -1) closed = true;
  }

  const unescaped = quote === "'" ? body.replace(/''/g, "'") : body.replace(/\\"/g, '"');
  return unescaped.trim() || null;
}

// Build the marketplace entry for one plugin name, preferring an existing plugin.json
// over the root skill it wraps.
function resolveEntry(name, opts) {
  const manifestPath = path.join(pluginsDir, name, '.github/plugin/plugin.json');
  const skillMdPath = path.join(skillsDir, name, 'SKILL.md');

  if (fs.existsSync(manifestPath)) {
    const { data: manifest, error } = readJson(manifestPath);
    if (error) return { error: `${name}: invalid plugin manifest — ${error}` };
    if (manifest.name && manifest.name !== name) {
      return {
        error:
          `${name}: ${rel(manifestPath)} declares "name": "${manifest.name}" — ` +
          'the manifest name must match its directory',
      };
    }
    const description = opts.description || manifest.description;
    if (!description) {
      return { error: `${name}: ${rel(manifestPath)} has no "description" — add one or pass --description` };
    }
    return {
      entry: {
        name,
        source: `plugins/${name}`,
        description,
        version: opts.version || manifest.version || DEFAULT_VERSION,
      },
      origin: rel(manifestPath),
      from: 'manifest',
    };
  }

  if (fs.existsSync(skillMdPath)) {
    const description = opts.description || extractSkillDescription(skillMdPath);
    if (!description) {
      return { error: `${name}: no description in skills/${name}/SKILL.md frontmatter — pass --description` };
    }
    return {
      entry: {
        name,
        source: `plugins/${name}`,
        description,
        version: opts.version || DEFAULT_VERSION,
      },
      origin: `skills/${name}/SKILL.md`,
      from: 'skill',
      derivedFromSkill: !opts.description,
    };
  }

  return {
    error:
      `${name}: no plugins/${name}/.github/plugin/plugin.json and no skills/${name}/SKILL.md — ` +
      'create the root skill first, or check the name',
  };
}

function localPluginNames() {
  if (!fs.existsSync(pluginsDir)) return [];
  return fs
    .readdirSync(pluginsDir)
    .filter((name) => {
      const dir = path.join(pluginsDir, name);
      return (
        fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, '.github/plugin/plugin.json'))
      );
    })
    .sort();
}

function rootSkillNames() {
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir)
    .filter((name) => {
      const dir = path.join(skillsDir, name);
      return fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, 'SKILL.md'));
    })
    .sort();
}

// Every root skill some plugin already ships, keyed by skill name -> plugin name. A skill
// vendored by a bundle (test-driven-development-quick, say) must not become its own plugin.
function vendoredSkills() {
  const owners = new Map();
  for (const pluginName of localPluginNames()) {
    const manifestPath = path.join(pluginsDir, pluginName, '.github/plugin/plugin.json');
    const { data: manifest } = readJson(manifestPath);
    for (const relPath of Array.isArray(manifest?.skills) ? manifest.skills : []) {
      if (typeof relPath !== 'string') continue;
      const skillName = relPath.replace(/^\.\/skills\//, '').replace(/\/$/, '');
      if (!owners.has(skillName)) owners.set(skillName, pluginName);
    }
  }
  return owners;
}

// Which root skills still deserve a plugin definition, and why the rest were passed over.
function unpackagedSkills(byName) {
  const skills = rootSkillNames();
  const owners = vendoredSkills();
  const skillSet = new Set(skills);
  const take = [];
  const skipped = [];

  for (const name of skills) {
    if (byName.has(name)) {
      skipped.push({ name, reason: 'already in marketplace.json' });
      continue;
    }
    const owner = owners.get(name);
    if (owner) {
      skipped.push({ name, reason: `already shipped by the ${owner} plugin` });
      continue;
    }
    // A quick variant belongs in its parent's bundle; a plugin of its own would compete
    // with the parent for the same triggers.
    const parent = /-quick$/.test(name) ? name.replace(/-quick$/, '') : null;
    if (parent && skillSet.has(parent)) {
      skipped.push({ name, reason: `quick variant — bundle it with ${parent}`, bundleWith: parent });
      continue;
    }
    take.push(name);
  }

  return { take, skipped };
}

function reportSkipped(skipped, opts) {
  if (!skipped.length) return;
  const bundle = skipped.filter((s) => s.bundleWith);
  const registered = skipped.filter((s) => !s.bundleWith).length;
  if (registered) console.log(`  ${registered} skill(s) already packaged — skipped`);
  for (const item of bundle) {
    console.log(
      `  ${item.name}: skipped as a quick variant — to ship it, add './skills/${item.name}/' to ` +
        `plugins/${item.bundleWith}/.github/plugin/plugin.json`,
    );
  }
  if (opts.check) return;
  console.log('');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    usage();
    process.exit(0);
  }
  if (opts.description && (opts.allSkills || opts.names.length !== 1)) {
    errors.push('--description applies to a single name; pass exactly one name with it');
  }
  if (opts.allSkills && opts.names.length) {
    errors.push('--all-skills covers every unpackaged skill; drop the explicit names or drop the flag');
  }
  if (!fs.existsSync(marketplacePath)) {
    errors.push(`${rel(marketplacePath)}: not found`);
  }
  if (errors.length) return finish(false);

  const originalText = fs.readFileSync(marketplacePath, 'utf8');
  const { data: marketplace, error } = readJson(marketplacePath);
  if (error) {
    errors.push(`invalid marketplace manifest — ${error}`);
    return finish(false);
  }
  if (!Array.isArray(marketplace.plugins)) marketplace.plugins = [];

  const byName = new Map(marketplace.plugins.filter((e) => e && e.name).map((e) => [e.name, e]));

  // Explicit names win; otherwise reconcile the plugins/ tree, plus every unpackaged
  // root skill when --all-skills asked for it.
  const targets = new Set(opts.names.length ? opts.names : localPluginNames());
  if (opts.allSkills) {
    const { take, skipped } = unpackagedSkills(byName);
    for (const name of take) targets.add(name);
    reportSkipped(skipped, opts);
  }

  if (!targets.size) {
    console.log(
      opts.allSkills
        ? 'generate-plugins: every root skill is already packaged or bundled, nothing to add.'
        : 'generate-plugins: no plugins found under plugins/, nothing to add.',
    );
    return finish(true);
  }

  const added = [];
  const synced = [];

  for (const name of targets) {
    const { entry, error: resolveError, origin, from, derivedFromSkill } = resolveEntry(name, opts);
    if (resolveError) {
      errors.push(resolveError);
      continue;
    }

    const existing = byName.get(name);
    if (!existing) {
      marketplace.plugins.push(entry);
      byName.set(name, entry);
      added.push({ name, origin, from, derivedFromSkill });
      continue;
    }

    // Already registered — only report or reconcile the fields both files carry.
    if (existing.source !== entry.source) {
      warnings.push(
        `${name}: marketplace "source" is '${existing.source}', not '${entry.source}' — left as is`,
      );
    }
    for (const field of ['description', 'version']) {
      if (existing[field] === entry[field]) continue;
      if (opts.sync) {
        existing[field] = entry[field];
        synced.push(`${name}.${field}`);
      } else {
        errors.push(
          `${name}: "${field}" differs between ${rel(marketplacePath)} and ${origin} — ` +
            'reconcile by hand, or run with --sync to take the plugin manifest value',
        );
      }
    }
    if (opts.names.length && !opts.sync) {
      console.log(`= ${name}: already registered in ${rel(marketplacePath)}`);
    }
  }

  // Entries pointing at a local directory that does not exist yet are fine — materialize
  // scaffolds them — but a typo looks the same, so say something. Entries this run staged
  // are expected to have no directory, so they are not worth a warning.
  const addedNames = new Set(added.map((item) => item.name));
  for (const entry of marketplace.plugins) {
    if (typeof entry?.source !== 'string' || !entry.source.startsWith('plugins/')) continue;
    if (addedNames.has(entry.name)) continue;
    if (fs.existsSync(path.join(repoRoot, entry.source))) continue;
    warnings.push(
      `${entry.name}: '${entry.source}' does not exist yet — run 'npm run plugin:materialize' to scaffold it`,
    );
  }

  const eol = originalText.includes('\r\n') ? '\r\n' : '\n';
  const nextText = JSON.stringify(marketplace, null, 2).split('\n').join(eol) + eol;
  const changed = nextText !== originalText;

  if (opts.check) {
    // A plugin folder with no marketplace entry is a real defect. A root skill with no
    // plugin is not — it is only a candidate, so --all-skills reports, never fails.
    const unregistered = added.filter((item) => item.from === 'manifest');
    const candidates = added.filter((item) => item.from === 'skill');

    for (const item of unregistered) {
      errors.push(
        `${rel(marketplacePath)}: no entry for '${item.name}' (declared in ${item.origin}) — ` +
          "run 'node scripts/generate-plugins.js' and commit the result",
      );
    }
    if (changed && !added.length) {
      errors.push(
        `${rel(marketplacePath)} is out of date — run 'node scripts/generate-plugins.js' and commit the result`,
      );
    }
    for (const item of candidates) {
      console.log(`  ${item.name}: not packaged — 'npm run plugin:generate -- ${item.name}' would add it`);
    }
    if (!errors.length) {
      // added entries were staged into marketplace.plugins above but never written.
      const local =
        marketplace.plugins.filter((e) => e?.source?.startsWith?.('plugins/')).length - added.length;
      const pending = candidates.length ? `, ${candidates.length} skill(s) unpackaged` : '';
      console.log(
        `generate-plugins: OK (${local} local plugin(s) registered in ${rel(marketplacePath)}${pending})`,
      );
    }
    return finish(!errors.length);
  }

  // Never write a partially reconciled manifest.
  if (errors.length) {
    if (changed) console.error('generate-plugins: errors found, nothing written.');
    return finish(false);
  }

  if (!changed) {
    console.log(`generate-plugins: OK (${rel(marketplacePath)} already up to date)`);
    return finish(true);
  }

  if (opts.dryRun) {
    console.log(`--dry-run: ${rel(marketplacePath)} would change:`);
    for (const item of added) console.log(`+ ${JSON.stringify(byName.get(item.name), null, 2)}`);
    for (const field of synced) console.log(`~ ${field} would be updated from the plugin manifest`);
    return finish(true);
  }

  fs.writeFileSync(marketplacePath, nextText);
  for (const item of added) {
    console.log(`+ ${item.name}: added to ${rel(marketplacePath)} (from ${item.origin})`);
    if (item.derivedFromSkill) {
      console.log(
        '  ↳ description came from the skill frontmatter — expand it to say what the plugin ' +
          'bundles and when to install it',
      );
    }
  }
  for (const field of synced) console.log(`~ ${field} updated from the plugin manifest`);
  return finish(true, true);
}

function finish(ok, wroteChanges = false) {
  for (const w of warnings) console.warn(`⚠️  ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`❌ ${e}`);
    console.error(`\ngenerate-plugins: ${errors.length} error(s)`);
    process.exit(1);
  }
  if (wroteChanges) {
    console.log("Next: run 'npm run plugin:materialize && npm run generate'.");
  }
  process.exit(ok ? 0 : 1);
}

main();
