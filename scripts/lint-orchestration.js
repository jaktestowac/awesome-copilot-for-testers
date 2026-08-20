#!/usr/bin/env node

// Validates agent orchestration packs:
// - every handoffs[].agent and agents[] entry must match a `name:` defined in the same pack (hard error)
// - heuristic tool checks (warnings): agents told to run tests/commands should have an
//   'execute' tool; agents told to write files/documents should have an 'edit' tool.
//   Scanned per line, skipping negations ("you CANNOT run commands"), descriptions
//   ("how to run tests"), and template blocks whose contents the agent emits rather
//   than follows — see instructionLines().

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./lib/log');

const repoRoot = path.join(__dirname, '..');
const log = createLogger('lint-orchestration');
const errors = [];
const warnings = [];

function rel(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function listAgentFiles(dir) {
  const out = [];
  function walk(d) {
    for (const it of fs.readdirSync(d)) {
      const full = path.join(d, it);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (it.endsWith('.agent.md')) out.push(full);
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

function stripQuotes(v) {
  v = v.trim();
  if (
    (v.startsWith("'") && v.endsWith("'") && v.length > 1) ||
    (v.startsWith('"') && v.endsWith('"') && v.length > 1)
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function parseAgent(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const m = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? m[1] : '';
  const body = m ? content.slice(m[0].length) : content;

  const nameMatch = fm.match(/^name\s*:\s*(.+)$/m);
  const name = nameMatch ? stripQuotes(nameMatch[1]) : null;

  // handoff targets: lines like `agent: X` nested under handoffs
  const handoffTargets = [];
  const handoffsBlock = fm.match(/^handoffs\s*:\s*\r?\n([\s\S]*?)(?=^\S|\s*$(?![\s\S]))/m);
  if (handoffsBlock) {
    for (const lm of handoffsBlock[1].matchAll(/^\s+agent\s*:\s*(.+)$/gm)) {
      handoffTargets.push(stripQuotes(lm[1]));
    }
  }

  // agents: list entries
  const agentRefs = [];
  const agentsBlock = fm.match(/^agents\s*:\s*\r?\n((?:\s+-\s*.+\r?\n?)*)/m);
  if (agentsBlock) {
    for (const lm of agentsBlock[1].matchAll(/^\s+-\s*(.+)$/gm)) {
      agentRefs.push(stripQuotes(lm[1]));
    }
  }

  const toolsMatch = fm.match(/^tools\s*:\s*(\[[\s\S]*?\])/m) || fm.match(/^tools\s*:\s*\r?\n([\s\S]*?\])/m);
  const tools = toolsMatch ? toolsMatch[1] : '';

  return { name, handoffTargets, agentRefs, tools, body };
}

const RUNS_COMMANDS = /\brun (the )?(relevant )?(tests?|test suites?|test commands?|commands?)\b/;
const WRITES_FILES = /\b(write|create|save)\b[^.\n]{0,60}\b(file|document|report|plan|summary|\.md)\b/;

// A line that forbids something is not an instruction to do it: "you CANNOT run
// commands" must not read as "run commands".
const NEGATED = /\b(cannot|can ?not|can't|do not|don't|never|no need to)\b/;

// "How to run tests" is a section the agent documents, not a command it runs.
const DESCRIPTIVE = /\bhow to (run|execute)\b/;

// Blocks the agent *emits* rather than *follows*. Packs mark them with tag names
// like <output_format>, <plan_style_guide>, <documentation_template>: content
// inside is a template for a downstream agent or a report, so the imperatives in
// there describe someone else's work.
const TEMPLATE_BLOCK = /^<(\/?)(\w*(?:_style_guide|_template|_format|_contract))>\s*$/;

// Body lines that actually instruct this agent, lowercased for matching.
function instructionLines(body) {
  const out = [];
  let openTemplates = 0;
  for (const raw of body.split(/\r?\n/)) {
    const tag = raw.trim().match(TEMPLATE_BLOCK);
    if (tag) {
      if (tag[1]) openTemplates = Math.max(0, openTemplates - 1);
      else openTemplates += 1;
      continue;
    }
    if (openTemplates > 0) continue;
    const line = raw.toLowerCase();
    if (NEGATED.test(line) || DESCRIPTIVE.test(line)) continue;
    out.push(line);
  }
  return out;
}

// Packs: each direct subdirectory of agent-orchestration, plus sets/*/custom-agents
const packDirs = [];
const orchRoot = path.join(repoRoot, 'agent-orchestration');
if (fs.existsSync(orchRoot)) {
  for (const name of fs.readdirSync(orchRoot)) {
    const full = path.join(orchRoot, name);
    if (fs.statSync(full).isDirectory()) packDirs.push(full);
  }
}
const setsRoot = path.join(repoRoot, 'sets');
if (fs.existsSync(setsRoot)) {
  for (const name of fs.readdirSync(setsRoot)) {
    const full = path.join(setsRoot, name);
    if (fs.statSync(full).isDirectory()) packDirs.push(full);
  }
}

let checkedAgents = 0;

for (const packDir of packDirs) {
  const files = listAgentFiles(packDir);
  if (files.length === 0) continue;

  const parsed = files.map((f) => ({ file: f, ...parseAgent(f) }));
  const names = new Set(parsed.map((p) => p.name).filter(Boolean));
  checkedAgents += parsed.length;

  for (const p of parsed) {
    if (!p.name) {
      errors.push(`${rel(p.file)}: missing frontmatter 'name'`);
      continue;
    }

    for (const target of p.handoffTargets) {
      if (!names.has(target)) {
        errors.push(
          `${rel(p.file)}: handoff target '${target}' does not match any agent name in this pack (${[...names].join(', ')})`,
        );
      }
    }
    for (const ref of p.agentRefs) {
      if (!names.has(ref)) {
        errors.push(
          `${rel(p.file)}: agents[] entry '${ref}' does not match any agent name in this pack`,
        );
      }
    }

    // Heuristic tool checks (warnings only)
    const hasExecute = /execute/.test(p.tools);
    const hasEdit = /'edit|"edit|\bedit\b/.test(p.tools);
    const lines = instructionLines(p.body);

    if (lines.some((l) => RUNS_COMMANDS.test(l)) && !hasExecute) {
      warnings.push(`${rel(p.file)}: body says to run tests/commands but tools lack 'execute'`);
    }
    if (lines.some((l) => WRITES_FILES.test(l)) && !hasEdit) {
      warnings.push(`${rel(p.file)}: body says to write/create files but tools lack 'edit'`);
    }
  }
}

log.finish({ errors, warnings, ok: `(${checkedAgents} agents checked)` });
