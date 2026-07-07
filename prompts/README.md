# 💬 Prompt Files for Testers

This directory contains reusable prompt files (`*.prompt.md`) for GitHub Copilot, focused on testing and quality engineering workflows.

## What prompt files are

Prompt files are on-demand, reusable prompts you run with `/prompt-name` in Copilot Chat. Frontmatter declares `name`, `description`, the `agent` to run under, and the `tools` the prompt may use. User inputs are declared inline with `${input:variableName}`; the editor context is available via `${selection}` and `${file}`.

## How to use

- Copy the prompts you want into your workspace's `.github/prompts/` folder, or install via the badges in the repository README.
- Run a prompt from Copilot Chat with `/` followed by its file name (e.g. `/test-planner`).

Docs: [VS Code prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

## Prompts in this directory

### Test planning & strategy

- [test-planner.prompt.md](test-planner.prompt.md) — comprehensive, interactive test plan (web + API) with exploration
- [test-plan-basic.prompt.md](test-plan-basic.prompt.md) — quick single-pass test plan from light exploration
- [api-test-plan-and-tests.prompt.md](api-test-plan-and-tests.prompt.md) — risk-based API test plan plus example tests from OpenAPI/Postman
- [qa-strategy.prompt.md](qa-strategy.prompt.md) — adversarial scenario matrix: edge cases, OWASP security, attack sequences
- [performance-reliability-plan.prompt.md](performance-reliability-plan.prompt.md) — performance and reliability test strategy with load/soak proposals
- [regression-scope.prompt.md](regression-scope.prompt.md) — prioritized regression scope from a diff or PR

### Test generation

- [playwright-generate-test.prompt.md](playwright-generate-test.prompt.md) — Playwright test from a scenario, executed live via Playwright MCP first
- [test-generator.prompt.md](test-generator.prompt.md) — automated tests from a written test plan file
- [playwright-explore-website.prompt.md](playwright-explore-website.prompt.md) — explore a site and propose test cases
- [playwright-explore-website-requests.prompt.md](playwright-explore-website-requests.prompt.md) — explore a site while capturing network traffic
- [manual-test-cases.prompt.md](manual-test-cases.prompt.md) — detailed manual test cases with risk tags
- [generate-test-data.prompt.md](generate-test-data.prompt.md) — realistic, edge-covering test data packs

### Audits & verification

- [a11y-webpage-audit.prompt.md](a11y-webpage-audit.prompt.md) — quick single-URL accessibility audit (WCAG 2.1/2.2)
- [a11y-audit-deep-dive.prompt.md](a11y-audit-deep-dive.prompt.md) — deep accessibility audit for pages and flows with stakeholder output
- [tech-debt-audit.prompt.md](tech-debt-audit.prompt.md) — severity-ranked tech debt report for test automation code
- [verify-acceptance-criteria.prompt.md](verify-acceptance-criteria.prompt.md) — check implementation evidence against acceptance criteria

### Utilities

- [bug-report.prompt.md](bug-report.prompt.md) — turn rough notes into a developer-ready bug report
- [explain-code.prompt.md](explain-code.prompt.md) — analyze and explain selected or open code
- [fix-tests.prompt.md](fix-tests.prompt.md) — fix failing tests without weakening assertions
- [create-skill.prompt.md](create-skill.prompt.md) — scaffold a new agent skill following this repo's conventions

## Conventions

- `name` in sentence case; file names verb-first where possible.
- Tools use the grouped vocabulary: `'vscode'`, `'execute'`, `'read'`, `'edit'`, `'search'`, `'web'`, `'todo'`, plus `'playwright/*'` for Playwright MCP.
- Route to a custom agent via the `agent:` field instead of telling the user to switch modes.
- Avoid `model:` pins unless the model choice materially matters.
- Prompts that write artifacts save them under `.qa/`.
