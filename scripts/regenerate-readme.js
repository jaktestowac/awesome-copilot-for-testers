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
  const lines = content.split("\n");
  let inFrontmatter = false;
  let isMultilineField = false;
  let multilineContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === "---") {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      }
      break;
    }

    if (inFrontmatter) {
      // Check for multi-line field with pipe syntax (|)
      const multilineMatch = line.match(
        new RegExp(`^${fieldName}:\\s*\\|(\\s*)$`)
      );
      if (multilineMatch) {
        isMultilineField = true;
        continue;
      }

      // If we're collecting a multi-line field
      if (isMultilineField) {
        // If the line has no indentation or has another frontmatter key, stop collecting
        if (!line.startsWith("  ") || line.match(/^[a-zA-Z0-9_-]+:/)) {
          return multilineContent.join(" ").trim();
        }
        multilineContent.push(line.substring(2));
      } else {
        // Look for single-line field in frontmatter
        const fieldMatch = line.match(
          new RegExp(`^${fieldName}:\\s*['"]?(.+?)['"]?\\s*$`)
        );
        if (fieldMatch) {
          let fieldValue = fieldMatch[1];

          // Check if the field is wrapped in single quotes and handle escaped quotes
          const singleQuoteMatch = line.match(
            new RegExp(`^${fieldName}:\\s*'(.+?)'\\s*$`)
          );
          if (singleQuoteMatch) {
            fieldValue = singleQuoteMatch[1].replace(/''/g, "'");
          }

          return fieldValue;
        }
      }
    }
  }

  // If we've collected multi-line content but the frontmatter ended
  if (multilineContent.length > 0) {
    return multilineContent.join(" ").trim();
  }

  return null;
}

function extractTitle(filePath) {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      // Step 1: Look for title in frontmatter for all file types
      const frontmatterTitle = extractFrontmatterField(content, "title");
      if (frontmatterTitle) {
        return frontmatterTitle;
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
            return line.substring(2).trim();
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
