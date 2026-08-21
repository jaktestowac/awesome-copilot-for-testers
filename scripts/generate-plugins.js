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
//       1. plugins/<name>/.github/plugin/plugin.json  - description and version from the manifest
//       2. skills/<name>/SKILL.md                     - description from the frontmatter
//     This is the normal path for packaging an existing root skill as a plugin.
//
//   node scripts/generate-plugins.js --all-skills
//     Bulk mode. Every skill under skills/ that is not packaged yet gets an entry,
//     with the description taken from its SKILL.md frontmatter. Skipped:
//       - skills already vendored by a plugin (declared in some plugin.json)
//       - '<name>-quick' when skills/<name>/ exists - the repository convention is to
//         bundle a quick variant with its parent plugin, not ship it separately
//     Bulk mode is deliberately opt-in, and deliberately outside --check: a root skill
//     with no plugin is a normal state, not an error, so CI must not demand one.
//
// Options:
//   --all-skills         add an entry for every unpackaged skill under skills/
//   --check              write nothing; exit 1 if the manifest is out of date (for CI)
//   --dry-run            print what would be written, write nothing
//   --no-overwrite       report drift instead of rewriting an existing entry
//   --description=<text> description for the entries being added (named mode, single name)
//   --version=<semver>   version for the entries being added (default 1.0.0)
//   --help
//
// An entry whose description or version no longer matches its source is rewritten from
// that source: the plugin manifest in reconcile mode, the skill frontmatter in bulk mode.
// Entry order is preserved and new entries are appended, so the file stays readable in
// diffs. Pass --no-overwrite to make drift an error instead - that is what --check does.

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./lib/log');

const repoRoot = path.join(__dirname, '..');
const marketplacePath = path.join(repoRoot, '.github/plugin/marketplace.json');
const pluginsDir = path.join(repoRoot, 'plugins');
const skillsDir = path.join(repoRoot, 'skills');

const DEFAULT_VERSION = '1.0.0';
const log = createLogger('generate-plugins');
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
      '  --dry-run             print what would change, write nothing',
      '  --no-overwrite        report drift instead of rewriting an existing entry',
      '  --description=<text>  description for the added entry (single name only)',
      '  --version=<semver>    version for the added entries (default 1.0.0)',
      '  --verbose             list every item instead of a count',
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
    overwrite: true,
    description: null,
    version: null,
    help: false,
  };
  for (const arg of argv) {
    if (arg === '--all-skills') opts.allSkills = true;
    else if (arg === '--check') opts.check = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--no-overwrite') opts.overwrite = false;
    else if (arg === '--sync')
      opts.overwrite = true; // kept for the earlier spelling
    else if (arg === '--verbose' || arg === '-v')
      continue; // handled by the logger
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg.startsWith('--description='))
      opts.description = arg.slice('--description='.length);
    else if (arg.startsWith('--version=')) opts.version = arg.slice('--version='.length);
    else if (arg.startsWith('-')) errors.push(`unknown option '${arg}' - run with --help`);
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

  // Bulk mode regenerates definitions *from the skills*, so the skill wins there even
  // when a plugin manifest exists. Otherwise the manifest is the closer description.
  const skillFirst = opts.allSkills && fs.existsSync(skillMdPath);

  if (fs.existsSync(manifestPath) && !skillFirst) {
    const { data: manifest, error } = readJson(manifestPath);
    if (error) return { error: `${name}: invalid plugin manifest - ${error}` };
    if (manifest.name && manifest.name !== name) {
      return {
        error:
          `${name}: ${rel(manifestPath)} declares "name": "${manifest.name}" - ` +
          'the manifest name must match its directory',
      };
    }
    const description = opts.description || manifest.description;
    if (!description) {
      return {
        error: `${name}: ${rel(manifestPath)} has no "description" - add one or pass --description`,
      };
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
      return {
        error: `${name}: no description in skills/${name}/SKILL.md frontmatter - pass --description`,
      };
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
      `${name}: no plugins/${name}/.github/plugin/plugin.json and no skills/${name}/SKILL.md - ` +
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
        fs.statSync(dir).isDirectory() &&
        fs.existsSync(path.join(dir, '.github/plugin/plugin.json'))
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

// Which root skills get a plugin definition, and why the rest were passed over. A skill
// that already has an entry stays in the list: bulk mode refreshes it from the frontmatter
// rather than skipping it.
function bulkSkillTargets() {
  const skills = rootSkillNames();
  const owners = vendoredSkills();
  const skillSet = new Set(skills);
  const take = [];
  const skipped = [];

  for (const name of skills) {
    // Shipped inside somebody else's bundle - it must not also be a plugin of its own.
    const owner = owners.get(name);
    if (owner && owner !== name) {
      skipped.push({ name, reason: `shipped by the ${owner} plugin` });
      continue;
    }
    // A quick variant belongs in its parent's bundle; a plugin of its own would compete
    // with the parent for the same triggers.
    const parent = /-quick$/.test(name) ? name.replace(/-quick$/, '') : null;
    if (parent && skillSet.has(parent)) {
      skipped.push({
        name,
        reason: `quick variant - bundle it with ${parent}`,
        bundleWith: parent,
      });
      continue;
    }
    take.push(name);
  }

  return { take, skipped };
}

function reportSkipped(skipped) {
  if (!skipped.length) return;
  const bundle = skipped.filter((s) => s.bundleWith);
  const packaged = skipped.filter((s) => !s.bundleWith);

  // The bundled-elsewhere list is background, not an action item: count it, and only
  // spell it out when asked.
  if (packaged.length) {
    log.kept(`${packaged.length} skill(s) shipped inside another plugin`);
    if (log.verbose) log.names(packaged.map((s) => `${s.name} - ${s.reason}`));
  }
  for (const item of bundle) {
    log.kept(`${item.name}`, 'quick variant, not shipped on its own');
    log.note(
      `to ship it, add './skills/${item.name}/' to plugins/${item.bundleWith}/.github/plugin/plugin.json`,
    );
  }
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
    errors.push(
      '--all-skills covers every unpackaged skill; drop the explicit names or drop the flag',
    );
  }
  if (!fs.existsSync(marketplacePath)) {
    errors.push(`${rel(marketplacePath)}: not found`);
  }
  if (errors.length) return finish(false);

  const originalText = fs.readFileSync(marketplacePath, 'utf8');
  const { data: marketplace, error } = readJson(marketplacePath);
  if (error) {
    errors.push(`invalid marketplace manifest - ${error}`);
    return finish(false);
  }
  if (!Array.isArray(marketplace.plugins)) marketplace.plugins = [];

  const byName = new Map(marketplace.plugins.filter((e) => e && e.name).map((e) => [e.name, e]));

  log.intro(describeRun(opts));

  // Explicit names win; otherwise reconcile the plugins/ tree, plus every unpackaged
  // root skill when --all-skills asked for it.
  const targets = new Set(opts.names.length ? opts.names : localPluginNames());
  if (opts.allSkills) {
    const { take, skipped } = bulkSkillTargets();
    for (const name of take) targets.add(name);
    reportSkipped(skipped);
  }

  if (!targets.size) {
    return finish(true, {
      ok: opts.allSkills
        ? '(every root skill is already packaged or bundled)'
        : '(no plugins found under plugins/)',
    });
  }

  const added = [];
  const updated = [];

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

    // Already registered.
    if (existing.source !== entry.source) {
      warnings.push(
        `${name}: marketplace "source" is '${existing.source}', not '${entry.source}' - left as is`,
      );
    }

    // A skill's frontmatter says nothing about the plugin's version, so a refresh from
    // skills/ must not reset a version somebody bumped. --version=x still applies.
    const fields = from === 'skill' && !opts.version ? ['description'] : ['description', 'version'];
    const drifted = fields.filter((field) => existing[field] !== entry[field]);
    if (!drifted.length) {
      if (opts.names.length) log.kept(name, 'already registered, unchanged');
      continue;
    }

    // Direction matters. skills/ is upstream of the marketplace, so a skill's frontmatter
    // overwrites the entry. plugin.json is downstream - materialize rewrites it from the
    // marketplace entry - so pulling it back here would make the two scripts fight.
    if (from !== 'skill') {
      warnings.push(
        `${name}: ${origin} does not match the marketplace entry (${drifted.join(', ')}) - ` +
          "'npm run plugin:materialize' rewrites the manifest from marketplace.json",
      );
      continue;
    }

    if (!opts.overwrite) {
      errors.push(
        `${name}: the marketplace entry does not match ${origin} (${drifted.join(', ')}) - ` +
          'drop --no-overwrite to take the skill value, or reconcile by hand',
      );
      continue;
    }

    for (const field of drifted) existing[field] = entry[field];
    updated.push({ name, origin, fields: drifted });
  }

  // Entries pointing at a local directory that does not exist yet are fine - materialize
  // scaffolds them - but a typo looks the same, so say something. Entries this run staged
  // are expected to have no directory, so they are not worth a warning.
  const addedNames = new Set(added.map((item) => item.name));
  for (const entry of marketplace.plugins) {
    if (typeof entry?.source !== 'string' || !entry.source.startsWith('plugins/')) continue;
    if (addedNames.has(entry.name)) continue;
    if (fs.existsSync(path.join(repoRoot, entry.source))) continue;
    warnings.push(
      `${entry.name}: '${entry.source}' does not exist yet - run 'npm run plugin:materialize' to scaffold it`,
    );
  }

  const eol = originalText.includes('\r\n') ? '\r\n' : '\n';
  const nextText = JSON.stringify(marketplace, null, 2).split('\n').join(eol) + eol;
  const changed = nextText !== originalText;

  const registered = marketplace.plugins.filter((e) => e?.source?.startsWith?.('plugins/')).length;

  if (opts.check) {
    // A plugin folder with no marketplace entry is a real defect. A root skill with no
    // plugin is not - it is only a candidate, so --all-skills reports, never fails.
    const unregistered = added.filter((item) => item.from === 'manifest');
    const candidates = added.filter((item) => item.from === 'skill');

    for (const item of unregistered) {
      errors.push(
        `${rel(marketplacePath)}: no entry for '${item.name}' (declared in ${item.origin}) - ` +
          "run 'npm run plugin:generate' and commit the result",
      );
    }
    if (updated.length) {
      log.change('~', `${updated.length} entry/entries stale`, 'source description has moved on');
      log.names(updated.map((item) => `${item.name} (${item.fields.join(', ')})`));
    }
    if (changed && !added.length && !updated.length) {
      errors.push(
        `${rel(marketplacePath)} is out of date - run 'npm run plugin:generate' and commit the result`,
      );
    }
    if (candidates.length) {
      log.kept(
        `${candidates.length} skill(s) not packaged`,
        'run with --all-skills to register them',
      );
      log.names(candidates.map((item) => item.name));
    }

    // added entries were staged into marketplace.plugins above but never written.
    const pending = candidates.length ? `, ${candidates.length} skill(s) unpackaged` : '';
    return finish(!errors.length, {
      ok: `(${registered - added.length} plugin(s) registered${pending})`,
    });
  }

  // Never write a partially reconciled manifest.
  if (errors.length) return finish(false);

  if (!changed) {
    return finish(true, { ok: `(${registered} plugin(s) registered, nothing to add)` });
  }

  const summary = () => {
    const parts = [];
    if (added.length) parts.push(`${added.length} added`);
    if (updated.length) parts.push(`${updated.length} rewritten`);
    return `(${parts.join(', ')}, ${registered - added.length - updated.length} unchanged)`;
  };

  if (opts.dryRun) {
    reportEntries(added, updated, 'would be added');
    log.note('nothing written - drop --dry-run to apply');
    return finish(true, { ok: `${summary()} - dry run` });
  }

  fs.writeFileSync(marketplacePath, nextText);
  reportEntries(added, updated, `added to ${rel(marketplacePath)}`);
  return finish(true, {
    ok: summary(),
    next: ['npm run plugin:materialize', 'npm run generate'],
  });
}

// One line per entry when there are few, a counted list when there are many. The
// frontmatter-description caveat is one note with a count, not one per entry.
function reportEntries(added, updated, verb) {
  if (added.length === 1) {
    log.added(added[0].name, `${verb}, from ${added[0].origin}`);
  } else if (added.length) {
    log.added(`${added.length} entries ${verb}`);
    log.names(added.map((item) => item.name));
  }

  const derived = added.filter((item) => item.derivedFromSkill);
  if (derived.length) {
    log.note(
      `${derived.length} description(s) came from skill frontmatter - rewrite them to say what ` +
        'the plugin bundles and when to install it',
    );
  }

  if (updated.length === 1) {
    log.change(
      '~',
      updated[0].name,
      `${updated[0].fields.join(', ')} taken from ${updated[0].origin}`,
    );
  } else if (updated.length) {
    log.change('~', `${updated.length} entries rewritten from their source`);
    log.names(updated.map((item) => `${item.name} (${item.fields.join(', ')})`));
  }
}

function describeRun(opts) {
  const scope = opts.names.length
    ? opts.names.join(', ')
    : opts.allSkills
      ? 'every unpackaged skill under skills/'
      : 'plugins/';
  if (opts.check) return `checking ${rel(marketplacePath)} against ${scope}`;
  if (opts.dryRun) return `previewing entries for ${scope}`;
  return `registering ${scope}`;
}

function finish(succeeded, { ok = '', next = [] } = {}) {
  log.finish({ errors, warnings, ok: succeeded ? ok : '', next });
}

main();
