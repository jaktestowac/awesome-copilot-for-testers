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
    - [Custom Chat Modes](#custom-chat-modes)
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
- **Chat Modes**: Create specialized chat modes for different roles or tasks, each with its own set of tools and instructions.
- **Prompt Templates**: Predefined templates for common tasks or questions, allowing for quick and consistent responses.

> [!TIP]
> More You can learn about these features in the [official documentation](https://code.visualstudio.com/docs/copilot/overview) and:
>
> - [VS Code Copilot Customization Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization) - Official Microsoft documentation
> - [Custom Instructions](https://code.visualstudio.com/docs/copilot/copilot-customization) - Tailor Copilot's behavior
> - [Custom Chat Modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes) - Advanced chat configuration

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
| [Playwright Typescript](instructions/playwright-typescript.instructions.md) | Playwright test generation instructions with best practices and patterns. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fplaywright-typescript.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fplaywright-typescript.instructions.md) |



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
| [A11Y Webpage Audit (Single URL)](prompts/a11y-webpage-audit.prompt.md) | Analyze one webpage for accessibility with WCAG 2.1/2.2 mapping and actionable fixes. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fa11y-webpage-audit.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fa11y-webpage-audit.prompt.md) |
| [Fix Tests](prompts/fix-tests.prompt.md) | Fix failing tests | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ffix-tests.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ffix-tests.prompt.md) |
| [Website Exploration for Testing](prompts/playwright-explore-website.prompt.md) | Website exploration using Playwright MCP | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-explore-website.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-explore-website.prompt.md) |
| [Playwright MCP: Guided Test Generation](prompts/playwright-generate-test.prompt.md) | Generate a Playwright test based on a scenario using Playwright MCP | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-generate-test.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Fplaywright-generate-test.prompt.md) |
| [Test Generator](prompts/test-generator.prompt.md) | Generate tests based on test plan for a website | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-generator.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-generator.prompt.md) |
| [Generate a Basic Test Plan](prompts/test-plan-basic.prompt.md) | Generate a basic Test Plan | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-plan-basic.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-plan-basic.prompt.md) |
| [Generate a comprehensive Test Plan](prompts/test-planner.prompt.md) | Collects environment details and produces a prioritized test plan with web and API scenarios using the `Test Planner Chat Mode`. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-planner.prompt.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-prompt%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fprompts%2Ftest-planner.prompt.md) |



<!-- END_CUSTOM_PROMPT_TEMPLATES -->

### Custom Chat Modes

> [!TIP]
> Usage:
>
> - create new chat modes:
>   - using the command `Chat: Configure Chat Modes...` or
>   - from set mode menu `Agent -> Configure Modes`,
> - then switch your chat mode in the Chat input from set mode menu `Agent -> Configure Modes`

<!-- START_CUSTOM_CHAT_MODES -->
| Title | Description | Install |
| ----- | ----------- | ------- |
| [Accessibility Expert mode](chatmodes/accesibility.chatmode.md) | A specialized chat mode focused on ensuring all code adheres to WCAG 2.1 accessibility standards. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Faccesibility.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Faccesibility.chatmode.md) |
| [Playwright Automation Engineer (TypeScript) mode](chatmodes/playwright-expert.chatmode.md) | Provide expert guidance, code, and troubleshooting help for end-to-end and component-level test automation using Playwright with TypeScript. Prioritize maintainability, speed, reliability, and business value of the test suite. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert.chatmode.md) |
| [Test Automation Architect](chatmodes/test-automation-expert.chatmode.md) | Ultra-senior, autonomous Test-Automation-Architect agent. Designs, implements & scales UI/API/mobile/performance/security test suites. Optimises reliability, maintainability, speed & business value. Drives actionable quality-engineering practices across the whole SDLC | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-automation-expert.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-automation-expert.chatmode.md) |
| [Test plan from expert Senior Quality Assurance Engineer](chatmodes/test-planner.chatmode.md) | This chat mode is designed to assist in creating comprehensive test plans tailored for web applications. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-planner.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-planner.chatmode.md) |


<!-- END_CUSTOM_CHAT_MODES -->

## 📚 Additional Resources

- [VS Code Copilot Customization Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization) - Official Microsoft documentation
- [GitHub Copilot Chat Documentation](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) - Complete chat feature guide
- [Custom Chat Modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes) - Advanced chat configuration
- [VS Code Settings](https://code.visualstudio.com/docs/getstarted/settings) - General VS Code configuration guide

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
