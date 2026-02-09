#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { ADDITIONAL_DESCRIPTIONS } = require('./additional-descriptions');

const FILES_TO_PROCESS = ['README.md', 'README.pl.md'];

// Configuration for the repository
const REPO_CONFIG = {
  owner: 'jaktestowac',
  repo: 'awesome-copilot-for-testers',
  baseUrl: 'https://raw.githubusercontent.com/jaktestowac/awesome-copilot-for-testers/main',
};

// Section configurations
const SECTIONS_CONFIG = {
  instructions: {
    title: 'Custom Instructions',
    directory: 'instructions',
    fileExtension: '.md',
    installType: 'instructions',
    regex:
      /(<!-- START_CUSTOM_INSTRUCTIONS -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_INSTRUCTIONS -->)/,
    defaultDescription: (title) => {
      const topic = title.split(' ').pop().replace(/s$/, '');
      return `${topic} specific coding standards and best practices`;
    },
  },
  prompts: {
    title: 'Custom Prompt Templates',
    directory: 'prompts',
    fileExtension: '.prompt.md',
    installType: 'prompt',
    regex:
      /(<!-- START_CUSTOM_PROMPT_TEMPLATES -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_PROMPT_TEMPLATES -->)/,
    defaultDescription: () => '',
  },
  chatmodes: {
    title: 'Custom Chat Modes',
    directory: 'chatmodes',
    fileExtension: '.chatmode.md',
    installType: 'mode',
    regex:
      /(<!-- START_CUSTOM_CHAT_MODES -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_CHAT_MODES -->)/,
    defaultDescription: () => '',
  },
  agents: {
    title: 'Custom Agents',
    directory: 'custom-agents',
    fileExtension: '.agent.md',
    installType: 'agent',
    regex: /(<!-- START_CUSTOM_AGENTS -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_AGENTS -->)/,
    defaultDescription: () => '',
  },
  agentOrchestration: {
    title: 'Agent Orchestration',
    directory: 'agent-orchestration',
    fileExtension: '.agent.md',
    installType: 'agent',
    regex:
      /(<!-- START_CUSTOM_AGENT_ORCHESTRATION -->\s*\n+)([\s\S]*?)(\s*<!-- END_CUSTOM_AGENT_ORCHESTRATION -->)/,
    defaultDescription: (title) => `Agent orchestration pack for ${title}`,
  },
  sets: {
    title: 'Custom Sets',
    directory: 'sets',
    // fileExtension not used for sets since each set is a folder containing other files
    fileExtension: '',
    installType: 'set',
    regex: /(<!-- START_CUSTOM_SETS -->\s*\n+)([\s\S]*?)(\s*<!-- END_CUSTOM_SETS -->)/,
    defaultDescription: (title) => `A set of resources for ${title}`,
  },
  skills: {
    title: 'Agent Skills',
    directory: 'skills',
    fileExtension: 'SKILL.md',
    // installType: "skill", // No direct install type for skills in VS Code
    regex: /(<!-- START_CUSTOM_SKILLS -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_SKILLS -->)/,
    // skills live in subfolders (one skill per folder), so enable recursive scanning
    recursive: true,
    defaultDescription: () => '',
  },
};

// Badge configuration
const BADGE_CONFIG = {
  vscode: {
    image:
      'https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white',
    baseUrl: 'https://vscode.dev/redirect?url=',
  },
  vscodeInsiders: {
    image:
      'https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white',
    baseUrl: 'https://insiders.vscode.dev/redirect?url=',
  },
};

// Utility functions
function safeFileOperation(operation, filePath, defaultValue = null) {
  try {
    return operation();
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return defaultValue;
  }
}

function logConsole(message) {
  if (typeof message === 'object') {
    console.log(JSON.stringify(message, null, 2));
  } else {
    console.log(message);
  }
}

// Content extraction functions
function extractFrontmatterField(content, fieldName) {
  // Normalize potential UTF-8 BOM and grab the frontmatter block first for simpler parsing
  let text = content;
  if (text && text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }
  const lines = text.split('\n');
  let inFrontmatter = false;
  const fmLines = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (trimmed === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        // end of frontmatter
        break;
      }
    }
    if (inFrontmatter) {
      fmLines.push(rawLine);
    }
  }

  if (fmLines.length === 0) return null;

  // Case-insensitive match for the field with optional indentation
  const fieldLineRegex = new RegExp(`^\\s*${fieldName}\\s*:\\s*(.*)$`, 'i');

  for (let i = 0; i < fmLines.length; i++) {
    const line = fmLines[i];
    const match = line.match(fieldLineRegex);
    if (!match) continue;

    let valuePart = match[1] !== undefined ? String(match[1]).trim() : '';

    // Handle block scalars: | or > (including |-, >- etc.)
    if (
      valuePart === '|' ||
      valuePart === '>' ||
      valuePart === '|-' ||
      valuePart === '>-' ||
      valuePart === '|+' ||
      valuePart === '>+'
    ) {
      // Determine base indentation from the next line; default to 2 spaces
      const nextLine = fmLines[i + 1] || '';
      const indentMatch = nextLine.match(/^(\s+)/);
      const baseIndent = indentMatch ? indentMatch[1].length : 2;

      const block = [];
      for (let j = i + 1; j < fmLines.length; j++) {
        const l = fmLines[j];
        if (l.trim() === '') {
          block.push('');
          continue;
        }
        const leadingSpaces = (l.match(/^(\s*)/) || ['', ''][1]).length;
        if (leadingSpaces < baseIndent) break;
        block.push(l.slice(baseIndent));
      }
      return block.join(' ').trim();
    }

    // Single line value handling
    if (valuePart === '') return '';

    // If quoted, extract inside quotes and unescape when needed
    const firstChar = valuePart[0];
    if (firstChar === '"' || firstChar === "'") {
      // Capture until the matching quote; allow trailing inline comments
      const quoteRegex =
        firstChar === '"' ? /^"([\s\S]*?)"(?:\s+#.*)?$/ : /^'([\s\S]*?)'(?:\s+#.*)?$/;
      const m = valuePart.match(quoteRegex);
      if (m) {
        let v = m[1];
        if (firstChar === "'") {
          // YAML single-quote escaping: '' -> '
          v = v.replace(/''/g, "'");
        }
        return v.trim();
      }
      // Fallback: strip the surrounding quotes if present
      return valuePart.replace(/^['"]|['"]$/g, '').trim();
    }

    // Unquoted: strip inline comments (only when preceded by space to avoid URLs)
    const hashIdx = valuePart.indexOf(' #');
    if (hashIdx !== -1) {
      valuePart = valuePart.slice(0, hashIdx).trim();
    }
    return valuePart.trim();
  }

  return null;
}

function extractTitle(filePath) {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      // Step 1: Look for title in frontmatter for all file types
      let frontmatterTitle = extractFrontmatterField(content, 'title');
      if (typeof frontmatterTitle === 'string' && frontmatterTitle.trim() !== '') {
        return frontmatterTitle.trim();
      }
      // Fallback: directly parse the frontmatter block for a title
      const textNoBom = content && content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
      const fmMatch = textNoBom.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---/);
      if (fmMatch) {
        const fmBlock = fmMatch[1];
        const titleLine = fmBlock.match(/^\s*title\s*:\s*(.*)$/im);
        if (titleLine && typeof titleLine[1] === 'string') {
          let v = titleLine[1].trim();
          // Handle quoted values
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          v = v.replace(/''/g, "'");
          const hashIdx = v.indexOf(' #');
          if (hashIdx !== -1) v = v.slice(0, hashIdx).trim();
          if (v) return v;
        }
      }

      // Step 2: For specific file types, look for heading after frontmatter
      const isSpecialFile = ['.prompt.md', '.chatmode.md', '.agent.md', '.instructions.md'].some(
        (ext) => filePath.includes(ext),
      );

      if (isSpecialFile) {
        let inFrontmatter = false;
        let frontmatterEnded = false;
        const GENERIC_H1 = new Set(['Role', 'Task', 'Methodology', 'Output format', 'Critical']);

        for (const line of lines) {
          if (line.trim() === '---') {
            if (!inFrontmatter) {
              inFrontmatter = true;
            } else if (inFrontmatter && !frontmatterEnded) {
              frontmatterEnded = true;
            }
            continue;
          }

          if (frontmatterEnded && line.startsWith('# ')) {
            const candidate = line.substring(2).trim();
            if (!GENERIC_H1.has(candidate)) {
              return candidate;
            }
            // skip generic heading and continue searching for a better one
          }
        }

        // Step 3: Format filename for special files if no heading found
        let ext = '.md';
        if (filePath.includes('.prompt.md')) ext = '.prompt.md';
        else if (filePath.includes('.chatmode.md')) ext = '.chatmode.md';
        else if (filePath.includes('.agent.md')) ext = '.agent.md';
        else if (filePath.includes('.instructions.md')) ext = '.instructions.md';
        const basename = path.basename(filePath, ext);
        return formatTitleFromFilename(basename);
      }

      // Step 4: Look for the first heading
      for (const line of lines) {
        if (line.startsWith('# ')) {
          return line.substring(2).trim();
        }
      }

      // Step 5: Fallback to filename
      const basename = path.basename(filePath, path.extname(filePath));
      return formatTitleFromFilename(basename);
    },
    filePath,
    formatTitleFromFilename(path.basename(filePath, path.extname(filePath))),
  );
}

function extractDescription(filePath) {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, 'utf8');
      let desc = extractFrontmatterField(content, 'description');
      if (typeof desc === 'string') {
        const trimmed = desc.trim();
        if (trimmed && trimmed.toLowerCase() !== 'null') return trimmed;
      }

      // Fallback: directly parse frontmatter block for description
      const textNoBom = content && content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
      const fmMatch = textNoBom.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---/);
      if (fmMatch) {
        const fmBlock = fmMatch[1];
        const lines = fmBlock.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const m = line.match(/^\s*description\s*:\s*(.*)$/i);
          if (!m) continue;
          let value = (m[1] || '').trim();
          // Handle block scalar for description
          if (value === '|' || value === '>' || value === '|-' || value === '>-') {
            // Determine base indent from next line
            const next = lines[i + 1] || '';
            const indentMatch = next.match(/^(\s+)/);
            const baseIndent = indentMatch ? indentMatch[1].length : 2;
            const block = [];
            for (let j = i + 1; j < lines.length; j++) {
              const l = lines[j];
              if (l.trim() === '') {
                block.push('');
                continue;
              }
              const leadingSpaces = (l.match(/^(\s*)/) || ['', ''][1]).length;
              if (leadingSpaces < baseIndent) break;
              block.push(l.slice(baseIndent));
            }
            const out = block.join(' ').trim();
            if (out) return out;
          }
          // Quoted single/ double
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }
          value = value.replace(/''/g, "'");
          const hashIdx = value.indexOf(' #');
          if (hashIdx !== -1) value = value.slice(0, hashIdx).trim();
          if (value && value.toLowerCase() !== 'null') return value;
        }
      }

      return null;
    },
    filePath,
    null,
  );
}

function extractName(filePath) {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, 'utf8');
      let name = extractFrontmatterField(content, 'name');
      if (typeof name === 'string') {
        const trimmed = name.trim();
        if (trimmed && trimmed.toLowerCase() !== 'null') return trimmed;
      }

      // Fallback: directly parse frontmatter block for name
      const textNoBom = content && content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
      const fmMatch = textNoBom.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---/);
      if (fmMatch) {
        const fmBlock = fmMatch[1];
        const lines = fmBlock.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const m = line.match(/^\s*name\s*:\s*(.*)$/i);
          if (!m) continue;
          let value = (m[1] || '').trim();
          // Handle block scalar for name
          if (value === '|' || value === '>' || value === '|-' || value === '>-') {
            const next = lines[i + 1] || '';
            const indentMatch = next.match(/^(\s+)/);
            const baseIndent = indentMatch ? indentMatch[1].length : 2;
            const block = [];
            for (let j = i + 1; j < lines.length; j++) {
              const l = lines[j];
              if (l.trim() === '') {
                block.push('');
                continue;
              }
              const leadingSpaces = (l.match(/^(\s*)/) || ['', ''][1]).length;
              if (leadingSpaces < baseIndent) break;
              block.push(l.slice(baseIndent));
            }
            const out = block.join(' ').trim();
            if (out) return out;
          }
          // Quoted single/double
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }
          value = value.replace(/''/g, "'");
          const hashIdx = value.indexOf(' #');
          if (hashIdx !== -1) value = value.slice(0, hashIdx).trim();
          if (value && value.toLowerCase() !== 'null') return value;
        }
      }

      return null;
    },
    filePath,
    null,
  );
}

function formatTitleFromFilename(basename) {
  return basename.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

// Map files/dirs to a key used by ADDITIONAL_DESCRIPTIONS
function getKeyFromFile(file, sectionConfig) {
  // Normalize separators into forward slashes
  const normalized = String(file).split(path.sep).join('/');
  // For recursive sections (skills, nested sets/packs) use top-level folder name
  if (sectionConfig && sectionConfig.recursive) {
    const parts = normalized.split('/');
    return parts[0];
  }

  // If a known file extension is provided, strip it
  const ext =
    sectionConfig && sectionConfig.fileExtension ? sectionConfig.fileExtension : path.extname(file);
  if (ext && normalized.endsWith(ext)) {
    return normalized.slice(0, -ext.length);
  }

  // Fallback: strip last extension
  return path.basename(normalized, path.extname(normalized));
}

function attachAdditionalDescription(key, currentDescription) {
  if (!ADDITIONAL_DESCRIPTIONS) return currentDescription;
  const extra = ADDITIONAL_DESCRIPTIONS[key];
  if (!extra) return currentDescription;
  return currentDescription ? `${currentDescription} ${extra}` : extra;
}

// Badge generation
function makeBadges(link, type) {
  const vscodeUrl = `${BADGE_CONFIG.vscode.baseUrl}${encodeURIComponent(
    `vscode:chat-${type}/install?url=${REPO_CONFIG.baseUrl}/${link}`,
  )}`;

  const vscodeInsidersUrl = `${BADGE_CONFIG.vscodeInsiders.baseUrl}${encodeURIComponent(
    `vscode-insiders:chat-${type}/install?url=${REPO_CONFIG.baseUrl}/${link}`,
  )}`;

  return `[![Install in VS Code](${BADGE_CONFIG.vscode.image})](${vscodeUrl}) [![Install in VS Code](${BADGE_CONFIG.vscodeInsiders.image})](${vscodeInsidersUrl})`;
}

// Collect files for a section. Supports optional recursive scanning for nested directories.
function collectFiles(sectionDir, fileExtension, recursive = false) {
  if (!recursive) {
    return fs
      .readdirSync(sectionDir)
      .filter((file) => file.endsWith(fileExtension))
      .sort();
  }

  const results = [];

  function walk(currentDir, relPath) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(currentDir, e.name);
      const rel = relPath ? path.join(relPath, e.name) : e.name;
      if (e.isDirectory()) {
        walk(full, rel);
      } else if (e.isFile()) {
        // Match by exact filename (e.g., 'SKILL.md') or by extension
        if (
          e.name === fileExtension ||
          (fileExtension.startsWith('.') && e.name.endsWith(fileExtension))
        ) {
          results.push(rel);
        }
      }
    }
  }

  walk(sectionDir, '');
  return results.sort();
}

// Generic section generation
function generateSection(sectionConfig) {
  const sectionDir = path.join(__dirname, '..', sectionConfig.directory);

  // Check if directory exists
  if (!fs.existsSync(sectionDir)) {
    logConsole(`${sectionConfig.title} directory does not exist`);
    return '';
  }

  // If this is the special 'sets' directory, use a dedicated generator
  if (sectionConfig.directory === 'sets') {
    return generateSetsSection(sectionConfig);
  }

  // If this is the agent orchestration directory, use a dedicated generator
  if (sectionConfig.directory === 'agent-orchestration') {
    return generateAgentOrchestrationSection(sectionConfig);
  }

  // Get all files matching the extension (supports recursive scan for nested skills)
  const files = collectFiles(sectionDir, sectionConfig.fileExtension, !!sectionConfig.recursive);

  logConsole(`> Found ${files.length} ${sectionConfig.directory} files`);

  // If no files, return empty table
  if (files.length === 0) {
    return `| Title | Description | Install |\n| ----- | ----------- | ------- |\n| No ${sectionConfig.directory} available | | |`;
  }

  // Create table header
  let content = '| Title | Description | Install |\n| ----- | ----------- | ------- |\n';

  // Generate table rows for each file
  for (const file of files) {
    const filePath = path.join(sectionDir, file);
    // For skills, use the 'name' field as title; otherwise use extractTitle
    let title =
      sectionConfig.directory === 'skills'
        ? extractName(filePath) || extractTitle(filePath)
        : extractTitle(filePath);
    // Normalize path separators to forward slashes for URLs (Windows uses backslashes)
    const relativePathForLink = `${sectionConfig.directory}/${file}`.split(path.sep).join('/');
    const link = encodeURI(relativePathForLink);
    const customDescription = extractDescription(filePath);
    const badges = sectionConfig.installType
      ? makeBadges(link, sectionConfig.installType)
      : 'not supported';

    let description = '';
    if (customDescription && customDescription !== 'null') {
      description = customDescription;
    } else {
      description = sectionConfig.defaultDescription(title);
    }

    // Attach additional description when available for this file/key
    const extraKey = getKeyFromFile(file, sectionConfig);
    description = attachAdditionalDescription(extraKey, description);

    const safeDesc = escapeTableCell(description);

    content += `| [${title}](${link}) | ${safeDesc} | ${badges} |\n`;
  }

  // Remove trailing newline to prevent extra newlines in the file
  return content.trimEnd();
}

function escapeTableCell(text) {
  if (!text && text !== '') return '';
  return String(text).replace(/\|/g, '&#124;').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

// Generate a table for custom sets (each set is a directory under sets)
function generateSetsSection(sectionConfig) {
  const setsDir = path.join(__dirname, '..', sectionConfig.directory);

  if (!fs.existsSync(setsDir)) {
    logConsole(`${sectionConfig.title} directory does not exist`);
    return '';
  }

  // Find all subdirectories inside sets
  const setNames = fs
    .readdirSync(setsDir)
    .filter((name) => fs.statSync(path.join(setsDir, name)).isDirectory())
    .sort();

  logConsole(`> Found ${setNames.length} ${sectionConfig.directory} sets`);

  if (setNames.length === 0) {
    return `| Title | Description | Install |\n| ----- | ----------- | ------- |\n| No ${sectionConfig.directory} available | | |`;
  }

  let content = '';

  for (const setName of setNames) {
    const setPath = path.join(setsDir, setName);
    const setReadmePath = path.join(setPath, 'README.md');
    // Title and link: prefer README if exists, else use folder link
    let title = formatTitleFromFilename(setName);
    let link = encodeURI(`${sectionConfig.directory}/${setName}/`);
    if (fs.existsSync(setReadmePath)) {
      const t = extractTitle(setReadmePath);
      if (t) title = t;
      link = encodeURI(`${sectionConfig.directory}/${setName}/README.md`);
    }

    // Description: prefer README frontmatter/description
    let description = null;
    if (fs.existsSync(setReadmePath)) {
      description = extractDescription(setReadmePath);
    }
    if (!description) {
      // If no README description, try to derive a brief summary by counting items
      const counts = {
        prompts: listFilesRecursively(setPath, (f) => f.endsWith('.prompt.md')).length,
        agents: listFilesRecursively(setPath, (f) => f.endsWith('.agent.md')).length,
        modes: listFilesRecursively(setPath, (f) => f.endsWith('.chatmode.md')).length,
        instructions: listFilesRecursively(setPath, (f) => f.endsWith('.instructions.md')).length,
      };
      const parts = [];
      for (const [k, v] of Object.entries(counts)) {
        if (v > 0) {
          const singular = k === 'modes' ? 'Chat Mode' : k.slice(0, -1).replace(/s$/, '');
          parts.push(`${v} ${singular}${v > 1 ? 's' : ''}`);
        }
      }
      if (parts.length) description = `Contains ${parts.join(', ')}`;
      else description = sectionConfig.defaultDescription(title);
    }

    // Attach additional description when available for this set
    description = attachAdditionalDescription(setName, description);

    // Build a per-set header and a table of resources
    content += `#### **[${title}](${link})**\n\n`;
    content += description ? `${description}\n\n` : '';

    // Now build the resources table for this set
    content += '| Title | Type | Description | Install |\n';
    content += '| ----- | ---- | ----------- | ------- |\n';

    // Gather all files recursively and add a row for each resource
    const resources = [];
    // Prompts
    const promptFiles = listFilesRecursively(setPath, (f) => f.endsWith('.prompt.md'));
    for (const rel of promptFiles) {
      resources.push({ path: rel, type: 'Prompt', installType: 'prompt' });
    }
    // Agents
    const agentFiles = listFilesRecursively(setPath, (f) => f.endsWith('.agent.md'));
    for (const rel of agentFiles) {
      resources.push({ path: rel, type: 'Agent', installType: 'agent' });
    }
    // Modes
    const modeFiles = listFilesRecursively(setPath, (f) => f.endsWith('.chatmode.md'));
    for (const rel of modeFiles) {
      resources.push({ path: rel, type: 'Chat Mode', installType: 'mode' });
    }
    // Instructions
    const instFiles = listFilesRecursively(setPath, (f) => f.endsWith('.instructions.md'));
    for (const rel of instFiles) {
      resources.push({
        path: rel,
        type: 'Instructions',
        installType: 'instructions',
      });
    }

    if (resources.length === 0) {
      content += `| No resources found | | | |\n\n`;
    } else {
      for (const res of resources) {
        const full = path.join(setPath, res.path);
        const titleRes = escapeTableCell(extractTitle(full) || path.basename(res.path));
        const descRes = escapeTableCell(extractDescription(full) || '');
        const linkRes = encodeURI(`${sectionConfig.directory}/${setName}/${res.path}`);
        const badge = res.installType ? makeBadges(linkRes, res.installType) : 'not supported';
        content += `| [${titleRes}](${linkRes}) | ${res.type} | ${descRes} | ${badge} |\n`;
      }
      content += '\n'; // spacing after table
    }
  }

  return content.trimEnd();
}

// Generate a section for agent orchestration packs (each pack is a subdirectory)
function generateAgentOrchestrationSection(sectionConfig) {
  const packsDir = path.join(__dirname, '..', sectionConfig.directory);

  if (!fs.existsSync(packsDir)) {
    logConsole(`${sectionConfig.title} directory does not exist`);
    return '';
  }

  const packNames = fs
    .readdirSync(packsDir)
    .filter((name) => fs.statSync(path.join(packsDir, name)).isDirectory())
    .sort();

  logConsole(`> Found ${packNames.length} ${sectionConfig.directory} packs`);

  if (packNames.length === 0) {
    return `| Title | Description | Install |\n| ----- | ----------- | ------- |\n| No ${sectionConfig.directory} available | | |`;
  }

  let content = '';

  for (const packName of packNames) {
    const packPath = path.join(packsDir, packName);
    const packReadmePath = path.join(packPath, 'README.md');

    // skip subdirectories that don't contain any .agent.md files or contin "-temp" in the name (used for temp testing folders)
    const hasAgentFiles = listFilesRecursively(packPath, (f) => f.endsWith('.agent.md')).length > 0;
    if (!hasAgentFiles || packName.includes('-temp')) {
      logConsole(`Skipping ${packName} as it has no agent files or is marked as temp`);
      continue;
    }

    let title = formatTitleFromFilename(packName);
    let link = encodeURI(`${sectionConfig.directory}/${packName}/`);
    if (fs.existsSync(packReadmePath)) {
      const t = extractTitle(packReadmePath);
      if (t) title = t;
      link = encodeURI(`${sectionConfig.directory}/${packName}/README.md`);
    }

    let description = null;
    if (fs.existsSync(packReadmePath)) {
      description = extractDescription(packReadmePath);
    }

    const agentFiles = listFilesRecursively(packPath, (f) => f.endsWith('.agent.md')).sort();
    if (!description) {
      if (agentFiles.length) {
        description = `Contains ${agentFiles.length} agent${agentFiles.length > 1 ? 's' : ''}`;
      } else {
        description = sectionConfig.defaultDescription(title);
      }
    }

    // Attach additional description when available for this pack
    description = attachAdditionalDescription(packName, description);

    content += `#### **[${title}](${link})**\n\n`;
    content += description ? `${description}\n\n` : '';

    content += '| Title | Description | Install |\n';
    content += '| ----- | ----------- | ------- |\n';

    if (agentFiles.length === 0) {
      content += `| No agents found | | |\n\n`;
      continue;
    }

    for (const rel of agentFiles) {
      const full = path.join(packPath, rel);
      const titleRes = escapeTableCell(extractTitle(full) || path.basename(rel));
      const agentName = extractName(full) || path.basename(rel, '.agent.md');
      const descRes = escapeTableCell(extractDescription(full) || '');
      const linkRes = encodeURI(`${sectionConfig.directory}/${packName}/${rel}`);
      const badge = makeBadges(linkRes, sectionConfig.installType);
      content += `| [${agentName}](${linkRes}) | ${descRes} | ${badge} |\n`;
    }

    content += '\n';
  }

  return content.trimEnd();
}

// Returns list of files with a given extension inside a subfolder under a set directory
function listFilesInSet(setPath, subdir, ext) {
  const p = path.join(setPath, subdir);
  try {
    if (!fs.existsSync(p)) return [];
    return fs
      .readdirSync(p)
      .filter((f) => f.endsWith(ext))
      .sort();
  } catch (e) {
    return [];
  }
}

// Recursively walk set directory and return files that match the given filter function
function listFilesRecursively(basePath, filterFn) {
  const out = [];
  function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const it of items) {
      const full = path.join(dir, it);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (stat.isFile() && filterFn(full)) {
        out.push(full);
      }
    }
  }
  try {
    if (!fs.existsSync(basePath)) return [];
    walk(basePath);
  } catch (e) {
    return [];
  }
  // Convert to relative path from basePath
  return out.map((full) => path.relative(basePath, full).split(path.sep).join('/'));
}

// Generate install badges for all known resource types inside a set
function generateSetBadges(setRelativePath, setFullPath) {
  const groups = [];

  // Find files recursively and group by type
  const allPrompts = listFilesRecursively(setFullPath, (f) => f.endsWith('.prompt.md'));
  const allAgents = listFilesRecursively(setFullPath, (f) => f.endsWith('.agent.md'));
  const allModes = listFilesRecursively(setFullPath, (f) => f.endsWith('.chatmode.md'));
  const allInstructions = listFilesRecursively(setFullPath, (f) => f.endsWith('.instructions.md'));

  if (allPrompts.length) {
    const badges = allPrompts
      .map((rel) => makeBadges(encodeURI(`${setRelativePath}/${rel}`), 'prompt'))
      .join(' ');
    groups.push(`Prompts: ${badges}`);
  }

  if (allAgents.length) {
    const badges = allAgents
      .map((rel) => makeBadges(encodeURI(`${setRelativePath}/${rel}`), 'agent'))
      .join(' ');
    groups.push(`Agents: ${badges}`);
  }

  if (allModes.length) {
    const badges = allModes
      .map((rel) => makeBadges(encodeURI(`${setRelativePath}/${rel}`), 'mode'))
      .join(' ');
    groups.push(`Chat Modes: ${badges}`);
  }

  if (allInstructions.length) {
    const badges = allInstructions
      .map((rel) => makeBadges(encodeURI(`${setRelativePath}/${rel}`), 'instructions'))
      .join(' ');
    groups.push(`Instructions: ${badges}`);
  }

  if (!groups.length) return 'No content';
  return groups.join('<br>');
}

// Section update with error handling
function updateSection(readmeContent, sectionConfig) {
  try {
    const newTable = generateSection(sectionConfig);

    if (sectionConfig.regex.test(readmeContent)) {
      const updatedContent = readmeContent.replace(
        sectionConfig.regex,
        (match, header, oldTableContent, endComment) => {
          // Replace the old table content with the new table, keeping header and end comment
          return `${header}${newTable}${endComment}`;
        },
      );
      logConsole(`✅ Updated ${sectionConfig.title} section`);
      return updatedContent;
    } else {
      logConsole(`⚠️ ${sectionConfig.title} section not found in README`);
      return readmeContent;
    }
  } catch (error) {
    console.error(`❌ Error updating ${sectionConfig.title} section: ${error.message}`);
    logConsole(`⚠️ Skipping ${sectionConfig.title} section due to error`);
    return readmeContent;
  }
}

// Main update function
function updateReadmeSections(readmePath) {
  // Read the existing README
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  logConsole(`Read existing ${path.basename(readmePath)}`);

  // Store original content for rollback if needed
  const originalContent = readmeContent;

  // Update each section with error handling
  for (const [sectionKey, sectionConfig] of Object.entries(SECTIONS_CONFIG)) {
    try {
      readmeContent = updateSection(readmeContent, sectionConfig);
    } catch (error) {
      console.error(`❌ Critical error updating ${sectionConfig.title}: ${error.message}`);
      logConsole(`⚠️ Rolling back changes and keeping original ${sectionConfig.title} section`);
      // Continue with next section instead of failing completely
    }
  }

  return readmeContent;
}

// Main execution with enhanced error handling
function main() {
  logConsole('Regenerating README sections for directories...');

  const repoRoot = path.join(__dirname, '..');
  const readmeFiles = FILES_TO_PROCESS;

  if (readmeFiles.length === 0) {
    console.error('❌ No files specified in FILES_TO_PROCESS.');
    process.exit(1);
  }

  logConsole(`Processing README files: ${readmeFiles.join(', ')}`);

  let hasAnyChanges = false;

  for (const readmeFile of readmeFiles) {
    const readmePath = path.join(repoRoot, readmeFile);
    logConsole(`\n🔄 Processing ${readmeFile}...`);

    // Validate README exists
    if (!fs.existsSync(readmePath)) {
      console.error(`❌ ${readmeFile} does not exist. Skipping.`);
      continue;
    }

    let originalContent;
    let newReadmeContent;

    try {
      // Read original content (keep as in-memory backup)
      originalContent = fs.readFileSync(readmePath, 'utf8');
      logConsole(`📄 Original content for ${readmeFile} loaded into memory as backup`);

      // Generate new content
      newReadmeContent = updateReadmeSections(readmePath);

      // Check if there were any changes
      const hasChanges = originalContent !== newReadmeContent;

      if (hasChanges) {
        // Write new content directly (original content is kept in memory)
        fs.writeFileSync(readmePath, newReadmeContent);
        logConsole(`✅ ${readmeFile} updated successfully!`);
        logConsole(`💾 Original content preserved in memory for rollback if needed`);
        hasAnyChanges = true;
      } else {
        logConsole(`💡 ${readmeFile} is already up to date. No changes needed.`);
      }
    } catch (error) {
      console.error(`❌ Error regenerating ${readmeFile}: ${error.message}`);

      // If we have original content and something went wrong after reading it,
      // try to restore the original content from memory
      if (originalContent && fs.existsSync(readmePath)) {
        try {
          const currentContent = fs.readFileSync(readmePath, 'utf8');
          if (currentContent !== originalContent) {
            fs.writeFileSync(readmePath, originalContent);
            logConsole(`🔄 Restored original ${readmeFile} content from memory backup`);
          }
        } catch (restoreError) {
          console.error(
            `❌ Could not restore original content for ${readmeFile}: ${restoreError.message}`,
          );
        }
      }

      // Continue with next file instead of exiting
    }
  }

  if (hasAnyChanges) {
    logConsole('🎉 All README files processed. Some were updated.');
  } else {
    logConsole('🎉 All README files are up to date.');
  }
}

// Run the script
if (require.main === module) {
  main();
}
