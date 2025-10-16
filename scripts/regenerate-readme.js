#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const FILES_TO_PROCESS = ["README.md", "README.pl.md"];

// Configuration for the repository
const REPO_CONFIG = {
  owner: "jaktestowac",
  repo: "awesome-copilot-for-testers",
  baseUrl:
    "https://raw.githubusercontent.com/jaktestowac/awesome-copilot-for-testers/main",
};

// Section configurations
const SECTIONS_CONFIG = {
  instructions: {
    title: "Custom Instructions",
    directory: "instructions",
    fileExtension: ".md",
    installType: "instructions",
    regex:
      /(<!-- START_CUSTOM_INSTRUCTIONS -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_INSTRUCTIONS -->)/,
    defaultDescription: (title) => {
      const topic = title.split(" ").pop().replace(/s$/, "");
      return `${topic} specific coding standards and best practices`;
    },
  },
  prompts: {
    title: "Custom Prompt Templates",
    directory: "prompts",
    fileExtension: ".prompt.md",
    installType: "prompt",
    regex:
      /(<!-- START_CUSTOM_PROMPT_TEMPLATES -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_PROMPT_TEMPLATES -->)/,
    defaultDescription: () => "",
  },
  chatmodes: {
    title: "Custom Chat Modes",
    directory: "chatmodes",
    fileExtension: ".chatmode.md",
    installType: "mode",
    regex:
      /(<!-- START_CUSTOM_CHAT_MODES -->\s*\n+)(\| [\s\S]*?)(\s*<!-- END_CUSTOM_CHAT_MODES -->)/,
    defaultDescription: () => "",
  },
};

// Badge configuration
const BADGE_CONFIG = {
  vscode: {
    image:
      "https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white",
    baseUrl: "https://vscode.dev/redirect?url=",
  },
  vscodeInsiders: {
    image:
      "https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white",
    baseUrl: "https://insiders.vscode.dev/redirect?url=",
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
  if (typeof message === "object") {
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
  const lines = text.split("\n");
  let inFrontmatter = false;
  const fmLines = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (trimmed === "---") {
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
  const fieldLineRegex = new RegExp(`^\\s*${fieldName}\\s*:\\s*(.*)$`, "i");

  for (let i = 0; i < fmLines.length; i++) {
    const line = fmLines[i];
    const match = line.match(fieldLineRegex);
    if (!match) continue;

    let valuePart = match[1] !== undefined ? String(match[1]).trim() : "";

    // Handle block scalars: | or > (including |-, >- etc.)
    if (
      valuePart === "|" ||
      valuePart === ">" ||
      valuePart === "|-" ||
      valuePart === ">-" ||
      valuePart === "|+" ||
      valuePart === ">+"
    ) {
      // Determine base indentation from the next line; default to 2 spaces
      const nextLine = fmLines[i + 1] || "";
      const indentMatch = nextLine.match(/^(\s+)/);
      const baseIndent = indentMatch ? indentMatch[1].length : 2;

      const block = [];
      for (let j = i + 1; j < fmLines.length; j++) {
        const l = fmLines[j];
        if (l.trim() === "") {
          block.push("");
          continue;
        }
        const leadingSpaces = (l.match(/^(\s*)/) || ["", ""][1]).length;
        if (leadingSpaces < baseIndent) break;
        block.push(l.slice(baseIndent));
      }
      return block.join(" ").trim();
    }

    // Single line value handling
    if (valuePart === "") return "";

    // If quoted, extract inside quotes and unescape when needed
    const firstChar = valuePart[0];
    if (firstChar === '"' || firstChar === "'") {
      // Capture until the matching quote; allow trailing inline comments
      const quoteRegex =
        firstChar === '"'
          ? /^"([\s\S]*?)"(?:\s+#.*)?$/
          : /^'([\s\S]*?)'(?:\s+#.*)?$/;
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
      return valuePart.replace(/^['"]|['"]$/g, "").trim();
    }

    // Unquoted: strip inline comments (only when preceded by space to avoid URLs)
    const hashIdx = valuePart.indexOf(" #");
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
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      // Step 1: Look for title in frontmatter for all file types
      let frontmatterTitle = extractFrontmatterField(content, "title");
      if (
        typeof frontmatterTitle === "string" &&
        frontmatterTitle.trim() !== ""
      ) {
        return frontmatterTitle.trim();
      }
      // Fallback: directly parse the frontmatter block for a title
      const textNoBom =
        content && content.charCodeAt(0) === 0xfeff
          ? content.slice(1)
          : content;
      const fmMatch = textNoBom.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---/);
      if (fmMatch) {
        const fmBlock = fmMatch[1];
        const titleLine = fmBlock.match(/^\s*title\s*:\s*(.*)$/im);
        if (titleLine && typeof titleLine[1] === "string") {
          let v = titleLine[1].trim();
          // Handle quoted values
          if (
            (v.startsWith('"') && v.endsWith('"')) ||
            (v.startsWith("'") && v.endsWith("'"))
          ) {
            v = v.slice(1, -1);
          }
          v = v.replace(/''/g, "'");
          const hashIdx = v.indexOf(" #");
          if (hashIdx !== -1) v = v.slice(0, hashIdx).trim();
          if (v) return v;
        }
      }

      // Step 2: For specific file types, look for heading after frontmatter
      const isSpecialFile = [
        ".prompt.md",
        ".chatmode.md",
        ".instructions.md",
      ].some((ext) => filePath.includes(ext));

      if (isSpecialFile) {
        let inFrontmatter = false;
        let frontmatterEnded = false;
        const GENERIC_H1 = new Set([
          "Role",
          "Task",
          "Methodology",
          "Output format",
          "Critical",
        ]);

        for (const line of lines) {
          if (line.trim() === "---") {
            if (!inFrontmatter) {
              inFrontmatter = true;
            } else if (inFrontmatter && !frontmatterEnded) {
              frontmatterEnded = true;
            }
            continue;
          }

          if (frontmatterEnded && line.startsWith("# ")) {
            const candidate = line.substring(2).trim();
            if (!GENERIC_H1.has(candidate)) {
              return candidate;
            }
            // skip generic heading and continue searching for a better one
          }
        }

        // Step 3: Format filename for special files if no heading found
        const basename = path.basename(
          filePath,
          filePath.includes(".prompt.md")
            ? ".prompt.md"
            : filePath.includes(".chatmode.md")
            ? ".chatmode.md"
            : ".instructions.md"
        );
        return formatTitleFromFilename(basename);
      }

      // Step 4: Look for the first heading
      for (const line of lines) {
        if (line.startsWith("# ")) {
          return line.substring(2).trim();
        }
      }

      // Step 5: Fallback to filename
      const basename = path.basename(filePath, path.extname(filePath));
      return formatTitleFromFilename(basename);
    },
    filePath,
    formatTitleFromFilename(path.basename(filePath, path.extname(filePath)))
  );
}

function extractDescription(filePath) {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      return extractFrontmatterField(content, "description");
    },
    filePath,
    null
  );
}

function formatTitleFromFilename(basename) {
  return basename
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Badge generation
function makeBadges(link, type) {
  const vscodeUrl = `${BADGE_CONFIG.vscode.baseUrl}${encodeURIComponent(
    `vscode:chat-${type}/install?url=${REPO_CONFIG.baseUrl}/${link}`
  )}`;

  const vscodeInsidersUrl = `${
    BADGE_CONFIG.vscodeInsiders.baseUrl
  }${encodeURIComponent(
    `vscode-insiders:chat-${type}/install?url=${REPO_CONFIG.baseUrl}/${link}`
  )}`;

  return `[![Install in VS Code](${BADGE_CONFIG.vscode.image})](${vscodeUrl}) [![Install in VS Code](${BADGE_CONFIG.vscodeInsiders.image})](${vscodeInsidersUrl})`;
}

// Generic section generation
function generateSection(sectionConfig) {
  const sectionDir = path.join(__dirname, "..", sectionConfig.directory);

  // Check if directory exists
  if (!fs.existsSync(sectionDir)) {
    logConsole(`${sectionConfig.title} directory does not exist`);
    return "";
  }

  // Get all files matching the extension
  const files = fs
    .readdirSync(sectionDir)
    .filter((file) => file.endsWith(sectionConfig.fileExtension))
    .sort();

  logConsole(`> Found ${files.length} ${sectionConfig.directory} files`);

  // If no files, return empty table
  if (files.length === 0) {
    return `| Title | Description | Install |\n| ----- | ----------- | ------- |\n| No ${sectionConfig.directory} available | | |`;
  }

  // Create table header
  let content =
    "| Title | Description | Install |\n| ----- | ----------- | ------- |\n";

  // Generate table rows for each file
  for (const file of files) {
    const filePath = path.join(sectionDir, file);
    const title = extractTitle(filePath);
    const link = encodeURI(`${sectionConfig.directory}/${file}`);
    const customDescription = extractDescription(filePath);
    const badges = makeBadges(link, sectionConfig.installType);

    let description = "";
    if (customDescription && customDescription !== "null") {
      description = customDescription;
    } else {
      description = sectionConfig.defaultDescription(title);
    }

    content += `| [${title}](${link}) | ${description} | ${badges} |\n`;
  }

  // Remove trailing newline to prevent extra newlines in the file
  return content.trimEnd();
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
        }
      );
      logConsole(`✅ Updated ${sectionConfig.title} section`);
      return updatedContent;
    } else {
      logConsole(`⚠️ ${sectionConfig.title} section not found in README`);
      return readmeContent;
    }
  } catch (error) {
    console.error(
      `❌ Error updating ${sectionConfig.title} section: ${error.message}`
    );
    logConsole(`⚠️ Skipping ${sectionConfig.title} section due to error`);
    return readmeContent;
  }
}

// Main update function
function updateReadmeSections(readmePath) {
  // Read the existing README
  let readmeContent = fs.readFileSync(readmePath, "utf8");
  logConsole(`Read existing ${path.basename(readmePath)}`);

  // Store original content for rollback if needed
  const originalContent = readmeContent;

  // Update each section with error handling
  for (const [sectionKey, sectionConfig] of Object.entries(SECTIONS_CONFIG)) {
    try {
      readmeContent = updateSection(readmeContent, sectionConfig);
    } catch (error) {
      console.error(
        `❌ Critical error updating ${sectionConfig.title}: ${error.message}`
      );
      logConsole(
        `⚠️ Rolling back changes and keeping original ${sectionConfig.title} section`
      );
      // Continue with next section instead of failing completely
    }
  }

  return readmeContent;
}

// Main execution with enhanced error handling
function main() {
  logConsole("Regenerating README sections for directories...");

  const repoRoot = path.join(__dirname, "..");
  const readmeFiles = FILES_TO_PROCESS;

  if (readmeFiles.length === 0) {
    console.error("❌ No files specified in FILES_TO_PROCESS.");
    process.exit(1);
  }

  logConsole(`Processing README files: ${readmeFiles.join(", ")}`);

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
      originalContent = fs.readFileSync(readmePath, "utf8");
      logConsole(
        `📄 Original content for ${readmeFile} loaded into memory as backup`
      );

      // Generate new content
      newReadmeContent = updateReadmeSections(readmePath);

      // Check if there were any changes
      const hasChanges = originalContent !== newReadmeContent;

      if (hasChanges) {
        // Write new content directly (original content is kept in memory)
        fs.writeFileSync(readmePath, newReadmeContent);
        logConsole(`✅ ${readmeFile} updated successfully!`);
        logConsole(
          `💾 Original content preserved in memory for rollback if needed`
        );
        hasAnyChanges = true;
      } else {
        logConsole(
          `💡 ${readmeFile} is already up to date. No changes needed.`
        );
      }
    } catch (error) {
      console.error(`❌ Error regenerating ${readmeFile}: ${error.message}`);

      // If we have original content and something went wrong after reading it,
      // try to restore the original content from memory
      if (originalContent && fs.existsSync(readmePath)) {
        try {
          const currentContent = fs.readFileSync(readmePath, "utf8");
          if (currentContent !== originalContent) {
            fs.writeFileSync(readmePath, originalContent);
            logConsole(
              `🔄 Restored original ${readmeFile} content from memory backup`
            );
          }
        } catch (restoreError) {
          console.error(
            `❌ Could not restore original content for ${readmeFile}: ${restoreError.message}`
          );
        }
      }

      // Continue with next file instead of exiting
    }
  }

  if (hasAnyChanges) {
    logConsole("🎉 All README files processed. Some were updated.");
  } else {
    logConsole("🎉 All README files are up to date.");
  }
}

// Run the script
if (require.main === module) {
  main();
}
