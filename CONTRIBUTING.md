# Contributing

Thanks for your interest in contributing! This repository collects GitHub Copilot customization resources for testers: instructions, prompts, custom agents, agent skills, hooks, plugins, orchestration packs, and sets.

## Asset types

### Custom instructions (`instructions/`)

Add `*.instructions.md` files:

- Lowercase filenames with hyphens (e.g., `api-playwright-tests.instructions.md`)
- Frontmatter: `description` (intent of the rules) and `applyTo` (glob, scoped as narrowly as the content allows — avoid `'**'` for domain-specific rules)
- Rules must be specific and testable; don't duplicate rules that already live in a sibling file

### Prompts (`prompts/`)

Add `*.prompt.md` files:

- Verb-first filenames where possible; `name` in sentence case
- Frontmatter: `name`, `description`, `agent`, `tools`
- Route to a custom agent via `agent: <name>` — never tell the user in prose to switch modes
- Declare user inputs with `${input:variableName}`; use `${selection}` / `${file}` for editor context
- Avoid `model:` pins unless the model choice materially matters
- Prompts that write artifacts should save them under `.qa/`

### Custom agents (`agents/`)

Add `*.agent.md` files:

- Frontmatter: `name` (kebab-case), `title`, `description` (with a "use when" clue), `tools`
- Use the canonical grouped tools vocabulary: `'vscode'`, `'execute'`, `'read'`, `'edit'`, `'search'`, `'web'`, `'agent'`, `'todo'`, plus `'playwright/*'` for Playwright MCP
- Give the agent a clear role, scope boundary ("what this agent does NOT do"), and output expectations
- Avoid model pins unless the choice materially matters; if pinned, use the plain picker name (no `(copilot)` suffix)

### Chat modes (`chatmodes/`) — deprecated

Chat modes were renamed to custom agents in VS Code 1.106. **No new chat modes are accepted.** Existing files are deprecation stubs pointing at their agent replacements.

### Agent skills (`skills/`)

Add a folder per skill containing `SKILL.md`:

- Folder and frontmatter `name` must match; prefer gerund form (e.g., `analyzing-regression-scope`)
- `description` in third person stating what the skill does **and** when to use it, with concrete triggers ("Use when…")
- Keep `SKILL.md` under 500 lines; push detailed templates/examples into a `resources/` folder (one level deep)
- Include Resource Map, Related Skills, and Definition of Done sections (see existing skills for the house style)

### Hooks (`hooks/`)

Add a folder per hook containing `hooks.json`, scripts, and a README:

- `hooks.json` must define a cross-platform default `"command"` (bash) plus an optional `"windows"` override
- The README needs frontmatter with a `description` (used by the README generator) and installation steps

### Plugins (`plugins/`)

Each plugin folder contains `.github/plugin/plugin.json` and vendored copies of skills.

- **`skills/` at the repo root is the source of truth** — plugin skill copies must be byte-identical; CI enforces this via `scripts/check-plugin-sync.js`
- After changing a root skill that a plugin vendors, copy the skill folder into the plugin
- Register new plugins in `.github/plugin/marketplace.json` — `npm run plugin:generate -- <name>` writes the entry for a root skill or an existing plugin folder, `npm run plugin:generate` alone backfills any plugin folder that is missing one, and `npm run plugin:generate:all` adds an entry for every skill under `skills/` that has no plugin yet; CI enforces this via `scripts/generate-plugins.js --check`
- Then run `npm run plugin:materialize` to scaffold the plugin folder and copy the skills into it
- Edits flow one way — `skills/` → `marketplace.json` → `plugins/` → `README.md` — and each step overwrites what is downstream: materialize rewrites `plugin.json` (except the curated `keywords` and `skills`) and the plugin README's frontmatter description from the marketplace entry, so change those in `marketplace.json`, not in the plugin folder

### Agent orchestration packs (`agent-orchestration/`)

Each pack is a folder of cooperating `*.agent.md` files plus a README:

- Every `handoffs[].agent` and `agents[]` entry must exactly match another agent's `name:` in the same pack — CI enforces this via `scripts/lint-orchestration.js`
- Agents that run tests need `'execute'`; agents that write files need `'edit'`
- Use unique agent names across packs (e.g., suffix with the pack name) to avoid collisions when users install multiple packs
- Write artifacts to `.ai-outputs/`

### Sets (`sets/`)

Themed bundles of resources. Each set folder needs a README explaining what the set is and listing its contents.

## Contributing process

1. Fork the repository and create a new branch
2. Add your file(s) following the guidelines above
3. Run the checks locally:
   - `npm run generate` — regenerate the README tables
   - `npm run check` — verify the README is in sync
   - `npm run lint` — frontmatter, orchestration, and plugin-sync validation
4. Submit a pull request — CI runs the same checks plus codespell

## Guidelines

- Be specific and actionable
- Test with GitHub Copilot before submitting
- Use consistent formatting
- Keep each file focused on one topic

## License

Contributions are licensed under MIT License.
