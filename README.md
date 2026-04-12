# 🤖 Awesome GitHub Copilot for Testers

This repository is a collection of resources (prompts, instructions, and chat modes) for using GitHub Copilot to enhance test automation and quality engineering workflows.

It is designed to help testers, developers, and quality engineers leverage AI to improve their testing practices, automate repetitive tasks, and enhance the overall quality of software products.

> [!TIP]
> 💡 Choose your language:
>
> - 🇬🇧 [English](./README.md)
> - 🇵🇱 [Polski](./README.pl.md)

> [!TIP]
> This project is heavily inspired by [Awesome GitHub Copilot](https://github.com/github/awesome-copilot) - a curated list of resources for using GitHub Copilot effectively.
> We have adapted the structure and content to focus specifically on testing and quality engineering, providing tailored resources for this domain.

Table of Contents

- [🎯 GitHub Copilot Customization Features](#-github-copilot-customization-features)
  - [📋 Resources](#-resources)
    - [Custom Instructions](#custom-instructions)
    - [Custom Prompt Templates](#custom-prompt-templates)
    - [Custom Chat Modes (Deprecated)](#custom-chat-modes-deprecated)
    - [Custom Agents](#custom-agents)
    - [Agent Orchestration](#agent-orchestration)
    - [Custom Sets](#custom-sets)
    - [Agent Skills](#agent-skills)
    - [Hooks](#hooks)
  - [📚 Additional Resources](#-additional-resources)
  - [🌱 Contributing](#-contributing)
  - [📞 Contact & Support](#-contact--support)
- [📚 Learning Resources](#-learning-resources)
  - [🇵🇱 Polish Resources](#-polish-resources)
  - [🇬🇧 English Resources](#-english-resources)

> [!IMPORTANT]
> Check out our free YouTube video to learn more about GitHub Copilot Chat Modes:
>
> [![GitHub Copilot - Chat Modes](./assets/github-copilot-chat-modes.jpg)](https://www.youtube.com/watch?v=hHrOJlk6ET8&list=PLfKhn9AcZ-cCqD34AG5YRejujaBqCBgl4)

## 🎯 GitHub Copilot Customization Features

GitHub Copilot provides three main ways to customize AI responses and tailor assistance to your specific workflows, team guidelines, and project requirements:

- **Custom Instructions**: Define how Copilot should behave, what to prioritize, and how to communicate.
- **Chat Modes**: Create specialized chat modes for different roles or tasks, each with its own set of tools and instructions. With version [1.106](https://code.visualstudio.com/updates/v1_106) of VS Code, Chat Modes were renamed to **Custom Agents**.
- **Custom Agents**: Advanced chat modes that can utilize multiple instructions and tools to perform complex tasks.
- **Prompt Templates**: Predefined templates for common tasks or questions, allowing for quick and consistent responses.

> [!TIP]
> More You can learn about these features in the [official documentation](https://code.visualstudio.com/docs/copilot/overview) and:
>
> - [VS Code Copilot Customization Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization) - Official Microsoft documentation
> - [Custom Instructions](https://code.visualstudio.com/docs/copilot/copilot-customization) - Tailor Copilot's behavior
> - [Custom Chat Modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes) - Advanced chat configuration
> - [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) - Customize Copilot's behavior
> - [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) - Using prompt templates
> - [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) - Advanced agent configuration
> - [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) - Extend agent capabilities with skills
> - [Hooks](https://code.visualstudio.com/docs/copilot/customization/hooks) - Customize agent behavior with hooks
> - [Using agents in Visual Studio Code](https://code.visualstudio.com/docs/copilot/agents/overview) - Overview of agents and orchestration
> - [Subagents in Visual Studio Code](https://code.visualstudio.com/docs/copilot/agents/subagents) - Using subagents for specialized tasks

> [!TIP]
> Do you want to learn more about effective use of AI and GitHub Copilot for Testers?
>
> Check our [AI_Testers](https://aitesters.pl) Program - a comprehensive Program for mastering AI in test automation!
>
> <div align="center"><a href="https://aitesters.pl"><img src="./assets/aitesters-header-photo.jpg" alt="AI Testers Logo" height="300"/></a></div>

## 📋 Resources

### Custom Instructions

> [!TIP]
> Usage:
>
> - copy these instructions to your `.github/copilot-instructions.md` file or
> - create task-specific `.github/.instructions.md` files in your workspace's `.github/instructions` folder
> - use `Chat: Attach Instructions` command from the command palette to apply them in the current chat

<!-- START_CUSTOM_INSTRUCTIONS -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [🤖 Copilot Instructions – Best Practices Guide](instructions/README.md) | Guide specific coding standards and best practices | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2FREADME.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2FREADME.md) |
| [API test rules (Playwright + TypeScript)](instructions/api-playwright-tests.instructions.md) | This file describes the API test rules for Playwright + TypeScript tests. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fapi-playwright-tests.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fapi-playwright-tests.instructions.md) |
| [Playwright E2E rules](instructions/e2e-playwright.instructions.md) | This file describes the Playwright E2E test rules for Playwright + TypeScript tests. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fe2e-playwright.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fe2e-playwright.instructions.md) |
| [Page Objects / App Actions rules (Playwright + TS)](instructions/page-objects.instructions.md) | This file describes the Page Object / App Action rules for Playwright + TypeScript tests. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fpage-objects.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fpage-objects.instructions.md) |
| [Playwright TypeScript Test Generation Instructions](instructions/playwright-typescript.instructions.md) | Playwright test generation instructions with best practices and patterns. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fplaywright-typescript.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fplaywright-typescript.instructions.md) |
| [TypeScript style rules](instructions/typescript-style.instructions.md) | This file describes the TypeScript code style for the project. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Ftypescript-style.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Ftypescript-style.instructions.md) |

<!-- END_CUSTOM_INSTRUCTIONS -->

### Custom Prompt Templates

> [!TIP]
> Usage:
>
> - copy these prompts to your `.github/copilot-prompts/` folder
> - use `/prompt-name` in VS Code chat,
> - run `Chat: Run Prompt` command from the command palette

<!-- START_CUSTOM_PROMPT_TEMPLATES -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Accessibility audit — deep dive](prompts/a11y-audit-deep-dive.prompt.md) | Run a deeper accessibility audit for a page, sampled set of pages, or user flow with WCAG 2.2 mapping, manual verification guidance, and technical or stakeholder-ready output. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fa11y-audit-deep-dive.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fa11y-audit-deep-dive.prompt.md) |
| [A11Y Webpage Audit (Single URL)](prompts/a11y-webpage-audit.prompt.md) | Analyze one webpage for accessibility with WCAG 2.1/2.2 mapping and actionable fixes. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fa11y-webpage-audit.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fa11y-webpage-audit.prompt.md) |
| [API Test Plan & Test Generator](prompts/api-test-plan-and-tests.prompt.md) | Create a risk-based API test plan and generate example automated tests from API definitions (OpenAPI/Postman/custom docs). | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fapi-test-plan-and-tests.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fapi-test-plan-and-tests.prompt.md) |
| [Create a bug report](prompts/bug-report.prompt.md) | Turn rough tester notes, screenshots, logs, or observed behavior into a professional bug report with severity, reproducibility, and evidence guidance. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fbug-report.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fbug-report.prompt.md) |
| [Create Skill](prompts/create-skill.prompt.md) | Create a new skill (SKILL.md) for VS Code Copilot. Analyzes existing skills for patterns, guides through design decisions, creates the skill file with supporting resources, and validates against best practices. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fcreate-skill.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fcreate-skill.prompt.md) |
| [Analyze and explain code](prompts/explain-code.prompt.md) | Analysis of the code you provide, select, or open | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fexplain-code.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fexplain-code.prompt.md) |
| [Fix failing tests](prompts/fix-tests.prompt.md) | Fix failing tests in the codebase | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ffix-tests.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ffix-tests.prompt.md) |
| [Generate test data](prompts/generate-test-data.prompt.md) | Design realistic and edge-covering test data packs from requirements, constraints, or existing test plans for manual and automated testing. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fgenerate-test-data.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fgenerate-test-data.prompt.md) |
| [Generate manual test cases](prompts/manual-test-cases.prompt.md) | Turn a feature description, acceptance criteria, exploratory notes, or a test plan into detailed manual test cases with risk tags, expected results, and automation hints. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fmanual-test-cases.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fmanual-test-cases.prompt.md) |
| [Performance & Reliability Test Planner](prompts/performance-reliability-plan.prompt.md) | Design a performance and reliability test strategy and propose concrete load/soak tests for critical user flows. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fperformance-reliability-plan.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fperformance-reliability-plan.prompt.md) |
| [Explore a website and gather network requests using Playwright MCP](prompts/playwright-explore-website-requests.prompt.md) | Website exploration and network request gathering using Playwright MCP | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-explore-website-requests.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-explore-website-requests.prompt.md) |
| [Explore a website and propose test cases](prompts/playwright-explore-website.prompt.md) | Website exploration using Playwright MCP | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-explore-website.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-explore-website.prompt.md) |
| [Generate tests based on a scenario using Playwright MCP](prompts/playwright-generate-test.prompt.md) | Generate a Playwright test based on a scenario using Playwright MCP | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-generate-test.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-generate-test.prompt.md) |
| [QA Strategy — Edge Cases, Security & Attack Scenarios](prompts/qa-strategy.prompt.md) | For any feature, user story, or API spec: instantly generate a structured scenario matrix covering edge cases, boundary values, OWASP Top 10 security attacks, and adversarial sequences. Use the qa-strategist agent mode for best results. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fqa-strategy.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fqa-strategy.prompt.md) |
| [Analyze regression scope](prompts/regression-scope.prompt.md) | Turn a diff, PR summary, changed files, or hotfix description into a prioritized regression scope with a minimal confidence suite and retest guidance. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fregression-scope.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fregression-scope.prompt.md) |
| [Tech Debt Audit — Test Automation Code Review](prompts/tech-debt-audit.prompt.md) | Ruthlessly audit automated test code for anti-patterns: fragile selectors, hardcoded waits, missing assertions, test interdependencies, credential leaks, and more. Produces a severity-ranked debt report with line-level citations and concrete fixes. Use the tech-debt-auditor agent mode for best results. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftech-debt-audit.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftech-debt-audit.prompt.md) |
| [Generate tests based on test plan](prompts/test-generator.prompt.md) | Generate tests based on test plan for a website | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-generator.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-generator.prompt.md) |
| [Generate a Basic Test Plan](prompts/test-plan-basic.prompt.md) | Generate a basic Test Plan | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-plan-basic.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-plan-basic.prompt.md) |
| [Generate a comprehensive Test Plan](prompts/test-planner.prompt.md) | Collects environment details and produces a prioritized test plan with web and API scenarios using the `Test Planner Chat Mode`. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-planner.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-planner.prompt.md) |
| [Verify acceptance criteria](prompts/verify-acceptance-criteria.prompt.md) | Compare implementation evidence against acceptance criteria and show what is met, partial, missing, or still untestable. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fverify-acceptance-criteria.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fverify-acceptance-criteria.prompt.md) |

<!-- END_CUSTOM_PROMPT_TEMPLATES -->

### Custom Chat Modes (Deprecated)

> [!TIP]
> Usage (in VS Code prior to version 1.106):
>
> - create new chat modes:
>   - using the command `Chat: Configure Chat Modes...` or
>   - from set mode menu `Agent -> Configure Modes`,
> - then switch your chat mode in the Chat input from set mode menu `Agent -> Configure Modes`

> [!WARNING]
> With version [1.106](https://code.visualstudio.com/updates/v1_106) of VS Code, Chat Modes were renamed to **Custom Agents**.
> They contain `.agent.md` suffix and should be stored in the `.github/agents/`

<!-- START_CUSTOM_CHAT_MODES -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Accessibility Expert mode](chatmodes/accesibility.chatmode.md) | A specialized chat mode focused on ensuring all code adheres to WCAG 2.1 accessibility standards. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Faccesibility.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Faccesibility.chatmode.md) |
| [Playwright Automation Engineer (TypeScript) mode (detailed)](chatmodes/playwright-expert-detailed.chatmode.md) | Provide expert guidance, code, and troubleshooting help for end-to-end and component-level test automation using Playwright with TypeScript. Prioritize maintainability, speed, reliability, and business value of the test suite. Very detailed operating manual. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert-detailed.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert-detailed.chatmode.md) |
| [Playwright Automation Engineer (TypeScript) mode](chatmodes/playwright-expert.chatmode.md) | Provide expert guidance, code, and troubleshooting help for end-to-end and component-level test automation using Playwright with TypeScript. Prioritize maintainability, speed, reliability, and business value of the test suite. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert.chatmode.md) |
| [QA Strategist — Edge Cases, Security & Attacks](chatmodes/qa-strategist.chatmode.md) | Kills happy-path thinking. For every feature, spec, or user story the agent immediately surfaces edge cases, boundary values, security attacks (OWASP Top 10), and adversarial scenarios before a single line of test code is written. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fqa-strategist.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fqa-strategist.chatmode.md) |
| [Tech Debt Auditor — Test Automation Code Reviewer](chatmodes/tech-debt-auditor.chatmode.md) | A ruthless, opinionated code reviewer for automated test suites. Hunts down anti-patterns, tech debt, and bad practices — from fragile selectors and hardcoded waits to test interdependencies, weak assertions, and credential leaks. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftech-debt-auditor.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftech-debt-auditor.chatmode.md) |
| [Test Automation Architect](chatmodes/test-automation-expert.chatmode.md) | Help engineers craft robust, fast, and maintainable automated tests that deliver actionable feedback and integrate seamlessly into modern SDLC pipelines. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-automation-expert.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-automation-expert.chatmode.md) |
| [Test plan from expert Senior Quality Assurance Engineer](chatmodes/test-planner.chatmode.md) | This chat mode is designed to assist in creating comprehensive test plans tailored for web applications. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-planner.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-planner.chatmode.md) |

<!-- END_CUSTOM_CHAT_MODES -->

### Custom Agents

> [!TIP]
> Usage:
>
> - create new agents:
>   - using the command `Chat: Configure Custom Agents...` or
>   - from set mode menu `Agent -> Configure Custom Agents`,
> - then switch your agent in the Chat input from set mode menu `Agent -> <Custom Agent Name>`

<!-- START_CUSTOM_AGENTS -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Accessibility Expert mode](agents/accesibility.agent.md) | A specialized Agent focused on ensuring all code adheres to WCAG 2.1 accessibility standards. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Faccesibility.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Faccesibility.agent.md) |
| [API Test Automation (from OpenAPI spec)](agents/api-test-automation.agent.md) | description: Generate REST API tests from an OpenAPI spec (language/framework provided by the user). | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fapi-test-automation.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fapi-test-automation.agent.md) |
| [Agent mission](agents/openapi-test-automation-expert.agent.md) | Generates and maintains automated tests from an OpenAPI schema and supports testers as a test automation expert (best practices, patterns, project tooling). | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fopenapi-test-automation-expert.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fopenapi-test-automation-expert.agent.md) |
| [Playwright Automation Engineer (TypeScript) mode (detailed)](agents/playwright-expert-detailed.agent.md) | Provide expert guidance, code, and troubleshooting help for end-to-end and component-level test automation using Playwright with TypeScript. Prioritize maintainability, speed, reliability, and business value of the test suite. Very detailed operating manual. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fplaywright-expert-detailed.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fplaywright-expert-detailed.agent.md) |
| [Playwright Automation Engineer (TypeScript) mode](agents/playwright-expert.agent.md) | Provide expert guidance, code, and troubleshooting help for end-to-end and component-level test automation using Playwright with TypeScript. Prioritize maintainability, speed, reliability, and business value of the test suite. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fplaywright-expert.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fplaywright-expert.agent.md) |
| [QA Strategist — Edge Cases, Security & Attacks](agents/qa-strategist.agent.md) | Kills happy-path thinking. For every feature, spec, or user story the agent immediately surfaces edge cases, boundary values, security attacks (OWASP Top 10), and adversarial scenarios before a single line of test code is written. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fqa-strategist.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fqa-strategist.agent.md) |
| [🦆 Rubber Duck 2.0](agents/rubber-duck-2.0.agent.md) | Interactive debugging partner for QA and testers that uses Socratic questioning to help identify root causes without giving ready-made fixes. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Frubber-duck-2.0.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Frubber-duck-2.0.agent.md) |
| [Tech Debt Auditor](agents/tech-debt-auditor.agent.md) | Audits the repo for technical debt, quantifies impact/risk, and produces a prioritized remediation plan with small, safe PR-sized recommendations. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Ftech-debt-auditor.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Ftech-debt-auditor.agent.md) |
| [Test Automation Architect](agents/test-automation-expert.agent.md) | Help engineers craft robust, fast, and maintainable automated tests that deliver actionable feedback and integrate seamlessly into modern SDLC pipelines. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Ftest-automation-expert.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Ftest-automation-expert.agent.md) |
| [Test plan from expert Senior Quality Assurance Engineer](agents/test-planner.agent.md) | This chat mode is designed to assist in creating comprehensive test plans tailored for web applications. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Ftest-planner.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Ftest-planner.agent.md) |
| [Ui Test Automation](agents/ui-test-automation.agent.md) | This custom agent creates and maintains Playwright tests for UI automation. Used in courses from **[AI_Testers](https://aitesters.pl/)** (courses about test automation for UI and REST API with AI). | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fui-test-automation.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagents%2Fui-test-automation.agent.md) |

<!-- END_CUSTOM_AGENTS -->

### Agent Orchestration

> [!TIP]
> Usage:
> Just pick an agent set and install the agents you want to orchestrate together, then switch to main agent from the set and start chatting. The agents will automatically trigger each other based on the defined orchestration flow.
>
> Docs:
>
> - https://code.visualstudio.com/docs/copilot/agents/subagents
> - https://code.visualstudio.com/updates/v1_109#_control-how-custom-agents-are-invoked

<!-- START_CUSTOM_AGENT_ORCHESTRATION -->

#### **[Minimal Agent Orchestration Example](agent-orchestration/minimal-example/README.md)**

Contains 4 agents.

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Analyst](agent-orchestration/minimal-example/Analyst-subagent.agent.md) | Analyst: pattern analysis, risk assessment, and insight generation | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FAnalyst-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FAnalyst-subagent.agent.md) |
| [Explorer](agent-orchestration/minimal-example/Explorer-subagent.agent.md) | Explorer: fast read-only codebase mapping and pattern discovery | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FExplorer-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FExplorer-subagent.agent.md) |
| [Orchestrator](agent-orchestration/minimal-example/Orchestrator.agent.md) | Orchestrator: multi-agent conductor with explicit stop gates | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FOrchestrator.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FOrchestrator.agent.md) |
| [Planner](agent-orchestration/minimal-example/Planner-subagent.agent.md) | Planner: research-driven phased plan with test strategy and risks | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FPlanner-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fminimal-example%2FPlanner-subagent.agent.md) |

#### **[VS Code Copilot Agents Pack (Architect + Test Architect)](agent-orchestration/plan-explore-review-commit/README.md)**

Contains 10 agents.

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Architect Subagent](agent-orchestration/plan-explore-review-commit/Architect-subagent.agent.md) | Architect: ADR-ready trade-offs, NFR impacts, threat models, and test implications | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FArchitect-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FArchitect-subagent.agent.md) |
| [Code Review Subagent](agent-orchestration/plan-explore-review-commit/Code-Review-subagent.agent.md) | Code review: correctness, risks, security, tests, and regressions (no fixes) | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FCode-Review-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FCode-Review-subagent.agent.md) |
| [Docs Writer Subagent](agent-orchestration/plan-explore-review-commit/Docs-Writer-subagent.agent.md) | Docs: README updates, usage examples, API docs, and release notes – copy-paste ready | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FDocs-Writer-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FDocs-Writer-subagent.agent.md) |
| [Explorer Subagent](agent-orchestration/plan-explore-review-commit/Explorer-subagent.agent.md) | Explorer: fast read-only map of files, usages, patterns, and entry points | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FExplorer-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FExplorer-subagent.agent.md) |
| [Implementer Subagent](agent-orchestration/plan-explore-review-commit/Implementer-subagent.agent.md) | Implementer: TDD-first phase delivery with minimal diffs and quality gates | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FImplementer-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FImplementer-subagent.agent.md) |
| [Orchestrator Agent](agent-orchestration/plan-explore-review-commit/Orchestrator.agent.md) | Orchestrator: multi-agent lifecycle with explicit stop gates | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FOrchestrator.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FOrchestrator.agent.md) |
| [Planner Agent](agent-orchestration/plan-explore-review-commit/Planner.agent.md) | Planner: research-driven phased plan with tests and NFRs | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FPlanner.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FPlanner.agent.md) |
| [QA Strategy Subagent](agent-orchestration/plan-explore-review-commit/QA-Strategy-subagent.agent.md) | QA strategy: test pyramid, coverage goals, quality gates, and flakiness mitigation | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FQA-Strategy-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FQA-Strategy-subagent.agent.md) |
| [Researcher Subagent](agent-orchestration/plan-explore-review-commit/Researcher-subagent.agent.md) | Researcher: extract conventions, key files, patterns, and examples at scale | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FResearcher-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FResearcher-subagent.agent.md) |
| [Security Auditor Subagent](agent-orchestration/plan-explore-review-commit/Security-Auditor-subagent.agent.md) | Security audit: threat model, risk scan, OWASP mapping, and concrete mitigations | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FSecurity-Auditor-subagent.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fplan-explore-review-commit%2FSecurity-Auditor-subagent.agent.md) |

#### **[Ui Api Automation](agent-orchestration/ui-api-automation/)**

Contains 8 agents.

| Title | Description | Install |
| ----- | ----------- | ------- |
| [OpenAPI Explorer](agent-orchestration/ui-api-automation/be-openapi-explorer.agent.md) | Analyze OpenAPI/Swagger spec and produce an API inventory + test matrix. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fbe-openapi-explorer.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fbe-openapi-explorer.agent.md) |
| [BE Test Implementer](agent-orchestration/ui-api-automation/be-test-implementer.agent.md) | Implement backend/API tests from the OpenAPI-driven matrix. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fbe-test-implementer.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fbe-test-implementer.agent.md) |
| [FE Explorer (Playwright MCP)](agent-orchestration/ui-api-automation/fe-playwright-mcp-explorer.agent.md) | Explore the frontend via Playwright MCP, map flows, suggest robust locator strategy and test targets. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ffe-playwright-mcp-explorer.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ffe-playwright-mcp-explorer.agent.md) |
| [FE Test Implementer](agent-orchestration/ui-api-automation/fe-test-implementer.agent.md) | Implement Playwright frontend tests following the provided plan and repo conventions. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ffe-test-implementer.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ffe-test-implementer.agent.md) |
| [QA Orchestrator](agent-orchestration/ui-api-automation/qa-orchestrator.agent.md) | Orchestrate subagents to design, implement, review and verify FE/BE tests (OpenAPI + Playwright MCP). | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fqa-orchestrator.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fqa-orchestrator.agent.md) |
| [Solution Reviewer](agent-orchestration/ui-api-automation/solution-reviewer.agent.md) | Review FE/BE tests for correctness, maintainability, flakiness, and alignment with the plan. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fsolution-reviewer.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Fsolution-reviewer.agent.md) |
| [Test Planner](agent-orchestration/ui-api-automation/test-planner.agent.md) | Combine OpenAPI + FE exploration into a prioritized test plan with architecture and tasks. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ftest-planner.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ftest-planner.agent.md) |
| [Test Runner & Verifier](agent-orchestration/ui-api-automation/test-runner-verifier.agent.md) | Run test suites, diagnose failures, and verify the final solution end-to-end. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ftest-runner-verifier.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation%2Ftest-runner-verifier.agent.md) |

#### **[Ui Api Automation Minimal](agent-orchestration/ui-api-automation-minimal/)**

Contains 5 agents. Used in courses from **[AI_Testers](https://aitesters.pl/)** (courses about test automation for UI and REST API with AI).

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Test Coder Agent](agent-orchestration/ui-api-automation-minimal/coder.agent.md) | A minimal agent that implements tests based on a provided test plan. It focuses on following best practices for test implementation. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fcoder.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fcoder.agent.md) |
| [Explorer Agent](agent-orchestration/ui-api-automation-minimal/explorer.agent.md) | A minimal agent that explores the application and gathers information for test planning. It focuses on following best practices for exploration and data collection. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fexplorer.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fexplorer.agent.md) |
| [Test Planner](agent-orchestration/ui-api-automation-minimal/planner.agent.md) | Combine exploration into a prioritized test plan with architecture and tasks. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fplanner.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fplanner.agent.md) |
| [QA Orchestrator](agent-orchestration/ui-api-automation-minimal/qa-orchestrator.agent.md) | Orchestrate subagents to design, implement, review and verify FE/BE tests (OpenAPI + Playwright MCP). | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fqa-orchestrator.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Fqa-orchestrator.agent.md) |
| [Test Framework Starter Agent](agent-orchestration/ui-api-automation-minimal/test-framework-starter.agent.md) | A minimal agent that sets up a test framework. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Ftest-framework-starter.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fagent-orchestration%2Fui-api-automation-minimal%2Ftest-framework-starter.agent.md) |

<!-- END_CUSTOM_AGENT_ORCHESTRATION -->

#### **🎯 Quick Start: Using Orchestrator with Subagents**

Once you've installed the agents, here are some example prompts to get started:

**Example 1: Analyze a Feature for Tech Debt (Minimal Example)**

```
@Orchestrator Analyze this codebase for technical debt and maintainability issues.
```

The Orchestrator will:

1. Clarify your scope and constraints
2. Invoke **Explorer** and **Analyst** in parallel to research the codebase
3. Present findings and recommendations for your approval

**Example 2: Plan an Implementation (Full Example)**

```
@Orchestrator Plan implementing: Add real-time notifications to our API.
Constraints: Must be backward compatible, no database schema changes.
```

The Orchestrator will:

1. Invoke **Planner** to create a phased implementation strategy
2. **Planner** will invoke **Explorer** to map the codebase and **Architect** for trade-offs
3. Present a complete plan with test strategy and risk mitigation

**Example 3: Security Assessment**

```
@Orchestrator Assess the security posture of our authentication system.
```

The Orchestrator will:

1. Invoke **Explorer** to find all auth-related files
2. Invoke **Security-Auditor** to analyze patterns and identify vulnerabilities
3. Synthesize findings into actionable recommendations

> [!TIP]
> For more detailed workflows and best practices, see the [Minimal Agent Orchestration Example README](agent-orchestration/minimal-example/README.md)

### Custom Sets

Custom sets are combinations of custom instructions, prompt templates, and chat modes (or custom agents) designed for specific use cases.

> [!TIP]
> Set elements work together to provide a tailored experience for specific testing scenarios. But you can also use them separately as needed.

> [!WARNING]
> Concept of Sets is not natively supported in VS Code Copilot.

<!-- START_CUSTOM_SETS -->

#### **[Beyond Codegen 2.0 Strategy](sets/Beyond%20Codegen%202.0%20Strategy/)**

Contains 1 prompt, 1 agent

| Title | Type | Description | Install |
| ----- | ---- | ----------- | ------- |
| [Edge Case Scenario Generator (BDD)](sets/Beyond%20Codegen%202.0%20Strategy/prompts/prompt-analyst.prompt.md) | Prompt | Generates a complete, risk-based set of BDD test scenarios, focusing on edge cases, state validation, and boundary conditions. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fsets%2FBeyond%2520Codegen%25202.0%2520Strategy%2Fprompts%2Fprompt-analyst.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fsets%2FBeyond%2520Codegen%25202.0%2520Strategy%2Fprompts%2Fprompt-analyst.prompt.md) |
| [AI Test Architect: Beyond Codegen 2.0 Strategy](sets/Beyond%20Codegen%202.0%20Strategy/custom-agents/ai-architect.agent.md) | Agent | Designs and oversees the implementation of the strategic, two-stage Beyond Codegen 2.0 test generation architecture. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fsets%2FBeyond%2520Codegen%25202.0%2520Strategy%2Fcustom-agents%2Fai-architect.agent.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fsets%2FBeyond%2520Codegen%25202.0%2520Strategy%2Fcustom-agents%2Fai-architect.agent.md) |

<!-- END_CUSTOM_SETS -->

### Agent Skills

Agent Skills are folders of instructions, scripts, and resources that GitHub Copilot can load when relevant to perform specialized tasks. Agent Skills is an open standard that works across multiple AI agents, including GitHub Copilot in VS Code, GitHub Copilot CLI, and GitHub Copilot coding agent.

> [!TIP]
> Usage:
>
> - copy these skills to your `.github/skills/` or `.claude/skills/` folder
>
> The correct folder structure is:
> 
> ```
> .github/
> └── skills/
>     └── <my-skill>/
>         ├── SKILL.md
>         └── resources/
>             └── example.txt
> ```
>
> where `<my-skill>` is the name of your skill. You have to name it according to the task it performs, e.g. `api-playwright-test-developer` or `prd-generator`. The `SKILL.md` file contains the main instructions and logic for the skill, while the `resources/` folder can contain any additional files needed for the skill's operation (e.g. templates, examples, reference materials).
>
> Agents will automatically detect and load these skills if the agent finds them relevant to the current chat context (**based on the skill's name and description**).

> [!WARNING]
> [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) are currently in preview and may require enabling experimental features in VS Code settings.

<!-- START_CUSTOM_SKILLS -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [analyzing-regression-scope](skills/analyzing-regression-scope/SKILL.md) | Analyzes diffs, changed files, hotfixes, and release candidates to identify where regression risk spreads and what must be retested first. Use when scoping retest after a change, reviewing QA impact for a pull request, or building a minimal confidence suite for release validation. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/analyzing-regression-scope). | manual |
| [api-playwright-test-developer](skills/api-playwright-test-developer/SKILL.md) | Writes and reviews API automation tests with Playwright. Use when creating backend API tests, contract checks, data-driven assertions, or API+UI hybrid workflows in Playwright Test. Focus on robust, maintainable test design with clear setup/teardown, single responsibility per test, and best practices for assertions and data management. | manual |
| [auditing-accessibility](skills/auditing-accessibility/SKILL.md) | Performs webpage and user-flow accessibility audits with WCAG 2.2 guidance, manual verification checklists, prioritized remediation output, and stakeholder-ready summaries. Use when auditing accessibility on a URL, triaging suspected a11y issues, or producing technical findings with practical next steps. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/auditing-accessibility). | manual |
| [code-review-advanced](skills/code-review-advanced/SKILL.md) | Performs evidence-driven code review for pull requests, legacy modules, and quality-critical changes. Use when reviewing code, test automation changes, architectural refactors, or hot paths that need analysis of correctness, maintainability, security, performance, test quality, and operability risks. Provides structured feedback with severity-ranked findings, actionable recommendations, and clear rationale. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/code-review-advanced). | manual |
| [code-review](skills/code-review/SKILL.md) | Assists users with code review, providing feedback on code quality, best practices, and potential improvements. Use always when user asks for code review or when there are code changes to review, providing feedback on code quality, structure, readability, maintainability, and adherence to coding standards. This skill provides information on best practices for code review, including how to identify issues, suggest improvements, and communicate feedback effectively. | manual |
| [creating-custom-agents](skills/creating-custom-agents/SKILL.md) | Creates GitHub Copilot custom agents (`.agent.md`) for VS Code. Use when defining a specialized agent role, selecting a minimal toolset, referencing supporting skills, or shipping install-ready agent examples with clear boundaries and collaboration rules. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/creating-custom-agents). | manual |
| [creating-hooks](skills/creating-hooks/SKILL.md) | Creates GitHub Copilot hooks for VS Code using `hooks.json`, supporting scripts, and companion docs. Use when automating deterministic checks, pre/post tool policies, or reusable hook packs that need safe defaults, observability, and clear installation guidance. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/creating-hooks). | manual |
| [creating-instructions](skills/creating-instructions/SKILL.md) | Creates GitHub Copilot instruction files for VS Code, including repository guidance and scoped `.instructions.md` rules. Use when encoding project conventions, choosing `applyTo` patterns, or shipping install-ready instruction examples with rationale and guardrails. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/creating-instructions). | manual |
| [creating-prompts](skills/creating-prompts/SKILL.md) | Creates GitHub Copilot prompt files (`.prompt.md`) for VS Code. Use when building reusable workflow starters that route work to the right agent, collect the right inputs, and ship with install-ready templates, examples, and validation guidance. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/creating-prompts). | manual |
| [creating-skills](skills/creating-skills/SKILL.md) | Creates GitHub Copilot skills with reusable workflows, companion resources, and validation gates. Use when packaging repeatable expertise into a `SKILL.md` folder, deciding what belongs in the skill body versus resources, or producing install-ready skill examples for a team or collection. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/creating-skills). | manual |
| [designing-functional-tests](skills/designing-functional-tests/SKILL.md) | Designs risk-based functional test plans, manual test cases, regression slices, and automation handoff packs from requirements, URLs, or exploratory notes. Use when preparing manual QA coverage before automation, turning feature descriptions into scenario catalogs, or converting exploratory findings into structured test assets. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/designing-functional-tests). | manual |
| [designing-test-data](skills/designing-test-data/SKILL.md) | Designs realistic, boundary-heavy, and role-aware test data packs for manual and automated testing. Use when a feature needs deliberate inputs and fixtures before execution, when edge-case values keep being improvised, or when automation needs stable example data with setup notes. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/designing-test-data). | manual |
| [prd-generator](skills/prd-generator/SKILL.md) | Generate production-ready Product Requirements Documents (PRDs) for software systems and AI-powered features. The skill ensures clear problem framing, measurable outcomes, scoped functionality, testable requirements, technical feasibility, risk awareness, and stakeholder alignment. | manual |
| [reporting-bugs](skills/reporting-bugs/SKILL.md) | Transforms rough tester notes, screenshots, console output, or observed behavior into reproducible defect reports with severity, evidence, and follow-up guidance. Use when logging bugs, triaging intermittent issues, or rewriting vague defect notes into developer-ready reports. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/reporting-bugs). | manual |
| [requirements-test-coverage-mapper](skills/requirements-test-coverage-mapper/SKILL.md) | Map requirements (PRD/user stories/AC) to comprehensive test coverage using a traceability matrix (RTM). Outputs coverage gaps, risks, test levels, prioritization, automation candidates, and change-impact notes. Designed for QA/Test Architect workflows. | manual |
| [static-code-analysis-typescript](skills/static-code-analysis-typescript/SKILL.md) | Use for create, review, or modernize static code analysis for node.js and typescript repositories. Use when you or the user needs to set up or audit eslint flat config, typescript-eslint, tsconfig, prettier, import sorting, husky, lint-staged, package.json quality scripts, and github actions quality gates. | manual |
| [tech-debt-analysis](skills/tech-debt-analysis/SKILL.md) | Analyzes technical debt in codebases, test suites, architecture, dependencies, and delivery workflows using observable signals. Use when auditing repository health, explaining slow delivery or flaky tests, prioritizing refactoring, or building an evidence-based remediation roadmap with risk, effort, and ROI. Use when user asks for technical debt analysis, repository audit, or refactor planning. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/tech-debt-analysis). | manual |
| [verifying-acceptance-criteria](skills/verifying-acceptance-criteria/SKILL.md) | Compares implementation evidence against acceptance criteria and shows what is met, partial, missing, or untestable. Use when checking feature readiness, preparing QA sign-off, or turning criteria into a concrete verification matrix without inventing missing behavior. 💡 Includes additional bundled resources in `resources` that should also be copied/used. See [skill folder](./skills/verifying-acceptance-criteria). | manual |

<!-- END_CUSTOM_SKILLS -->

### Hooks

Hooks enable you to execute custom shell commands at key lifecycle points during agent sessions. Use hooks to automate workflows, enforce security policies, validate operations, and integrate with external tools. Hooks run deterministically and can control agent behavior, including blocking tool execution or injecting context into the conversation.

> [!TIP]
> Usage:
>
> - copy these hooks to your `.github/hooks/` folder or `.claude/settings.json`

> [!WARNING]
> [Hooks](https://code.visualstudio.com/docs/copilot/customization/hooks) are currently in preview and may require enabling experimental features in VS Code settings.

<!-- START_HOOKS -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Print Tool Info Hook](hooks/print-tool-info/README.md) |  | Manual setup required |

<!-- END_HOOKS -->

## 📚 Additional Resources

- [VS Code Copilot Customization Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization) - Official Microsoft documentation
- [GitHub Copilot Chat Documentation](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) - Complete chat feature guide
- [Custom Chat Modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes) - Advanced chat configuration
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) - Customize Copilot's behavior
- [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) - Using prompt templates
- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) - Advanced agent configuration
- [Agent Orchestration](https://code.visualstudio.com/docs/copilot/agents/orchestration) - Coordinating multiple agents for complex workflows
- [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) - Extend agent capabilities with custom skills
- [Hooks](https://code.visualstudio.com/docs/copilot/customization/hooks) - Automate actions based on chat events
- [VS Code Settings](https://code.visualstudio.com/docs/getstarted/settings) - General VS Code configuration guide
- [Using agents in Visual Studio Code](https://code.visualstudio.com/docs/copilot/agents/overview) - Overview of agents and orchestration
- [Subagents in Visual Studio Code](https://code.visualstudio.com/docs/copilot/agents/subagents) - Using subagents for specialized tasks

## 🌱 Contributing

Are you interested in contributing to this project?

We welcome your contributions! Whether it's adding new instructions, prompts, or chat modes, your input is valuable.

Just follow the [Contributing Guidelines](CONTRIBUTING.md) to get started!

## 📞 Contact & Support

Feel free to reach out to us:

- 🌐 **Website**: [jaktestowac.pl](https://jaktestowac.pl)
- 💼 **LinkedIn**: [jaktestowac.pl](https://www.linkedin.com/company/jaktestowac/)
- 💬 **Discord**: [Polish Playwright Community](https://discord.gg/mUAqQ7FUaZ)
- 📧 **Support**: Check our website for contact details

---

# 📚 Learning Resources

We have gathered a collection of resources to help you learn and master Playwright, both in Polish and English. Whether you're a beginner or an advanced user, these resources will help you enhance your skills and knowledge.

## 🇵🇱 Polish Resources

- **💡 FREE** [Playwright Resources](https://jaktestowac.pl/darmowy-playwright/) - Comprehensive and Free Polish learning materials
- [JavaScript and TypeScript for Testers](https://jaktestowac.pl/js-ts/) - Comprehensive (13h+) course on JavaScript and TypeScript for testers, with practical examples and exercises
- [Professional Test Automation with Playwright](https://jaktestowac.pl/playwright/) - Comprehensive (100h+) course on Playwright, test automation, CI/CD and test architecture
- [Back-end Test Automation](https://jaktestowac.pl/api/) - Comprehensive (45h+) course on Back-end Test Automation with Postman, Mocha, Chai, and Supertest
- [Playwright Basics](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cD2TCB__K7NP5XARaCzZYn7) - YouTube series (Polish)
- [Playwright Elements](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cAcpd-XN4pKeo-l4YK35FDA) - Advanced concepts (Polish)
- [Playwright MCP](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cCqD34AG5YRejujaBqCBgl4) - MCP course (Polish)
- [Discord Community](https://discord.gg/mUAqQ7FUaZ) - First Polish Playwright community!
- [Playwright Info](https://playwright.info/) - first and only Polish Playwright blog

### AI_Testers

<div align="center">
<a href="https://aitesters.pl">
<img src="./assets/aitesters-header-photo.jpg" alt="AI Testers Logo" height="300"/>
</a>
</div>

Gain an edge by combining AI knowledge with the most popular tools in the IT market.  
We'll show you how to accelerate with AI and build a professional test automation framework. 😉

- [AI_Testers](https://aitesters.pl) - Main page about AI_Testers Program
- [AI_Testers LinkedIn](https://www.linkedin.com/company/aitesters) - Follow us on LinkedIn

## 🇬🇧 English Resources

- [VS Code Extensions](https://marketplace.visualstudio.com/publishers/jaktestowac-pl) - Our free Playwright plugins
- [Playwright Documentation](https://playwright.dev/docs/intro) - Official documentation
- [Playwright GitHub](https://github.com/microsoft/playwright) - Source code and issues

_PS. For more resources and updates, follow us on our [website](https://jaktestowac.pl) and [GitHub](https://github.com/jaktestowac)._

---

**Happy testing and automation!** 🚀

**jaktestowac.pl Team** ❤️💚

_Built with ❤️💚 for the Playwright and test automation community_
