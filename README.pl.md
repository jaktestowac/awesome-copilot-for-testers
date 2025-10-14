# 🤖 Awesome GitHub Copilot for Testers

To repozytorium jest kolekcją zasobów (promptów, instrukcji i trybów czatu) do wykorzystania z GitHub Copilotem, specjalnie dostosowanych do potrzeb testerów i automatyzacji testów.

Zasoby te pomogą Ci dostosować Copilota do Twoich specyficznych potrzeb, wytycznych zespołu i wymagań projektu.

> [!TIP]
> 💡 Wybierz swój język:
>
> - 🇬🇧 [English](./README.md)
> - 🇵🇱 [Polski](./README.pl.md)

> [!TIP]
> Ten projekt jest mocno inspirowany [Awesome GitHub Copilot](https://github.com/github/awesome-copilot) - starannie dobraną listą zasobów do efektywnego wykorzystania GitHub Copilota.
> Dostosowaliśmy strukturę i zawartość, aby skupić się konkretnie na testowaniu i inżynierii jakości, dostarczając dostosowane zasoby dla tej dziedziny.

Spis Treści

- [🎯 Funkcje Dostosowywania GitHub Copilota](#-funkcje-dostosowywania-github-copilota)
  - [📋 Zasoby](#-zasoby)
    - [Niestandardowe Instrukcje](#niestandardowe-instrukcje)
    - [Szablony Promptów](#szablony-promptów)
    - [Niestandardowe Tryby Czatu](#niestandardowe-tryby-czatu)
  - [📚 Dodatkowe Zasoby](#-dodatkowe-zasoby)
  - [🌱 Twórz z nami](#-twórz-z-nami)
  - [📞 Kontakt i Wsparcie](#-kontakt-i-wsparcie)
- [📚 Zasoby Edukacyjne](#-zasoby-edukacyjne)
  - [🇵🇱 Polskie Zasoby](#-polskie-zasoby)
  - [🇬🇧 Angielskie Zasoby](#-angielskie-zasoby)


> [!IMPORTANT]
> Sprawdź nasze darmowe nagranie na YouTube, aby dowiedzieć się więcej o GitHub Copilot Chat Modes:
>
> [![GitHub Copilot - Chat Modes](./assets/github-copilot-chat-modes.jpg)](https://www.youtube.com/watch?v=hHrOJlk6ET8&list=PLfKhn9AcZ-cCqD34AG5YRejujaBqCBgl4)


## 🎯 Funkcje Dostosowywania GitHub Copilota

GitHub Copilot zapewnia trzy główne sposoby dostosowywania odpowiedzi AI:

- **Custom Instructions**: Zdefiniuj, jak Copilot ma się zachowywać, co priorytetować i jak komunikować.
- **Chat Modes**: Twórz specjalistyczne tryby czatu dla różnych ról lub zadań, każdy z własnym zestawem narzędzi i instrukcji.
- **Prompt Templates**: Wstępnie zdefiniowane szablony dla typowych zadań lub pytań, umożliwiające szybkie i spójne odpowiedzi.

> [!TIP]
> Więcej możesz dowiedzieć się o tych funkcjach w [oficjalnej dokumentacji](https://code.visualstudio.com/docs/copilot/overview) oraz:
>
> - [Dokumentacja Dostosowywania Copilota w VS Code](https://code.visualstudio.com/docs/copilot/copilot-customization) - Oficjalna dokumentacja Microsoft
> - [Niestandardowe Instrukcje](https://code.visualstudio.com/docs/copilot/copilot-customization) - Dostosuj zachowanie Copilota
> - [Niestandardowe Tryby Czatu](https://code.visualstudio.com/docs/copilot/chat/chat-modes) - Zaawansowana konfiguracja czatu

> [!TIP]
> Chcesz dowiedzieć się więcej o efektywnym wykorzystaniu AI i GitHub Copilota dla Testerów?
>
> Sprawdź nasz program [AI_Testers](https://aitesters.pl) - kompleksowy program opanowania AI w automatyzacji testów!
>
> <div align="center"><a href="https://aitesters.pl"><img src="./assets/aitesters-header-photo.jpg" alt="Logo AI Testers" height="300"/></a></div>

## 📋 Zasoby

### Niestandardowe Instrukcje

> [!TIP]
> Użycie:
>
> - skopiuj te instrukcje do swojego pliku `.github/copilot-instructions.md` lub
> - utwórz specyficzne dla zadań pliki `.github/.instructions.md` w folderze `.github/instructions` swojego workspace
> - użyj komendy `Chat: Attach Instructions` z palety komend, aby zastosować je w bieżącym czacie

<!-- START_CUSTOM_INSTRUCTIONS -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Playwright Typescript](instructions/playwright-typescript.instructions.md) | Playwright test generation instructions with best practices and patterns. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fplaywright-typescript.instructions.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-instructions%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Finstructions%2Fplaywright-typescript.instructions.md) |

<!-- END_CUSTOM_INSTRUCTIONS -->

### Szablony Promptów

> [!TIP]
> Użycie:
>
> - skopiuj te prompty do swojego folderu `.github/copilot-prompts/`
> - użyj `/prompt-name` w czacie VS Code,
> - uruchom komendę `Chat: Run Prompt` z palety komend

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

### Niestandardowe Tryby Czatu

> [!TIP]
> Użycie:
>
> - utwórz nowe tryby czatu:
>   - używając komendy `Chat: Configure Chat Modes...` lub
>   - z menu ustawień trybu `Agent -> Configure Modes`,
> - następnie przełącz swój tryb czatu w wejściu Chat z menu ustawień trybu `Agent -> Configure Modes`

<!-- START_CUSTOM_CHAT_MODES -->

| Title | Description | Install |
| ----- | ----------- | ------- |
| [Accessibility Expert mode](chatmodes/accesibility.chatmode.md) | A specialized chat mode focused on ensuring all code adheres to WCAG 2.1 accessibility standards. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Faccesibility.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Faccesibility.chatmode.md) |
| [Playwright Automation Engineer (TypeScript) mode](chatmodes/playwright-expert.chatmode.md) | Provide expert guidance, code, and troubleshooting help for end-to-end and component-level test automation using Playwright with TypeScript. Prioritize maintainability, speed, reliability, and business value of the test suite. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Fplaywright-expert.chatmode.md) |
| [Test Automation Architect](chatmodes/test-automation-expert.chatmode.md) | Ultra-senior, autonomous Test-Automation-Architect agent. Designs, implements & scales UI/API/mobile/performance/security test suites. Optimises reliability, maintainability, speed & business value. Drives actionable quality-engineering practices across the whole SDLC | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-automation-expert.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-automation-expert.chatmode.md) |
| [Test plan from expert Senior Quality Assurance Engineer](chatmodes/test-planner.chatmode.md) | This chat mode is designed to assist in creating comprehensive test plans tailored for web applications. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-planner.chatmode.md) [![Install in VS Code](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Achat-mode%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fjaktestowac%2Fawesome-copilot-for-testers%2Fmain%2Fchatmodes%2Ftest-planner.chatmode.md) |

<!-- END_CUSTOM_CHAT_MODES -->

## 📚 Dodatkowe Zasoby

- [Dokumentacja Dostosowywania Copilota w VS Code](https://code.visualstudio.com/docs/copilot/copilot-customization) - Oficjalna dokumentacja Microsoft
- [Dokumentacja GitHub Copilot Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) - Kompletny przewodnik po funkcjach czatu
- [Niestandardowe Tryby Czatu](https://code.visualstudio.com/docs/copilot/chat/chat-modes) - Zaawansowana konfiguracja czatu
- [Ustawienia VS Code](https://code.visualstudio.com/docs/getstarted/settings) - Ogólny przewodnik konfiguracji VS Code

## 🌱 Twórz z nami

Jesteś zainteresowany współtworzeniem tego projektu?

Zapraszamy! Niezależnie od tego, czy dodajesz nowe instrukcje, prompty czy tryby czatu, Twój wkład jest mega cenny!

Po prostu postępuj zgodnie z [Wytycznymi](CONTRIBUTING.md), aby zacząć!

## 📞 Kontakt i Wsparcie

Skontaktuj się z nami:

- 🌐 **Strona internetowa**: [jaktestowac.pl](https://jaktestowac.pl)
- 💼 **LinkedIn**: [jaktestowac.pl](https://www.linkedin.com/company/jaktestowac/)
- 💬 **Discord**: [Polska Społeczność Playwright](https://discord.gg/mUAqQ7FUaZ)
- 📧 **Wsparcie**: Sprawdź naszą stronę internetową, aby uzyskać dane kontaktowe

---

# 📚 Zasoby Edukacyjne

Zebraliśmy kolekcję zasobów, aby pomóc Ci nauczyć się i opanować Playwright, zarówno w języku polskim, jak i angielskim. Niezależnie od tego, czy jesteś początkującym, czy zaawansowanym użytkownikiem, te zasoby pomogą Ci poprawić umiejętności i wiedzę.

## 🇵🇱 Polskie Zasoby

- **💡 DARMOWE** [materiały o Playwright](https://jaktestowac.pl/darmowy-playwright/) - Kompleksowe i Darmowe materiały edukacyjne w języku polskim (kursy, webinary, posty, darmowe wtyczki)
- [JavaScript i TypeScript dla Testerów](https://jaktestowac.pl/js-ts/) - Kompleksowy kurs (13h+) na temat JavaScript i TypeScript dla testerów, z praktycznymi przykładami i ćwiczeniami
- [Profesjonalna Automatyzacja Testów z Playwright](https://jaktestowac.pl/playwright/) - Kompleksowy kurs (100h+) na temat Playwright, automatyzacji testów, CI/CD i architektury testów
- [Automatyzacja Testów Back-end](https://jaktestowac.pl/api/) - Kompleksowy kurs (45h+) na temat Automatyzacji Testów Back-end z Postman, Mocha, Chai i Supertest
- [Podstawy Playwright](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cD2TCB__K7NP5XARaCzZYn7) - Seria na YouTube (po polsku)
- [Elementy Playwright](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cAcpd-XN4pKeo-l4YK35FDA) - Zaawansowane koncepcje (po polsku)
- [Playwright MCP](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cCqD34AG5YRejujaBqCBgl4) - Kurs MCP (po polsku)
- [Społeczność Discord](https://discord.gg/mUAqQ7FUaZ) - Pierwsza polska społeczność Playwright!
- [Playwright Info](https://playwright.info/) - pierwszy i jedyny polski blog o Playwright

### AI_Testers

<div align="center">
<a href="https://aitesters.pl">
<img src="./assets/aitesters-header-photo.jpg" alt="Logo AI Testers" height="300"/>
</a>
</div>

Zyskaj przewagę, łącząc wiedzę o AI z najpopularniejszymi narzędziami na rynku IT.  
Pokażemy Ci, jak przyspieszyć z AI i zbudować profesjonalny framework automatyzacji testów. 😉

- [AI_Testers](https://aitesters.pl) - Główna strona o programie AI_Testers
- [AI_Testers LinkedIn](https://www.linkedin.com/company/aitesters) - Śledź nas na LinkedIn

## 🇬🇧 Angielskie Zasoby

- [Rozszerzenia VS Code](https://marketplace.visualstudio.com/publishers/jaktestowac-pl) - Nasze darmowe wtyczki Playwright
- [Dokumentacja Playwright](https://playwright.dev/docs/intro) - Oficjalna dokumentacja
- [GitHub Playwright](https://github.com/microsoft/playwright) - Kod źródłowy i zgłoszenia

_PS. Aby uzyskać więcej zasobów i aktualizacji, śledź nas na naszej [stronie internetowej](https://jaktestowac.pl) i [GitHub](https://github.com/jaktestowac)._

---

**Szczęśliwego testowania i automatyzacji!** 🚀

**Zespół jaktestowac.pl** ❤️💚

_Budowane z ❤️💚 dla społeczności Playwright i automatyzacji testów_
