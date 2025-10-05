# Contributing

Thanks for your interest in contributing! We welcome custom instructions, prompts, and chat modes for GitHub Copilot.

## Quick Start

### Instructions

Add `.instructions.md` files in `instructions/` directory:

- Use lowercase filenames with hyphens (e.g., `python-testing.instructions.md`)
- Include front matter with `applyTo` property
- Provide specific guidance for GitHub Copilot

### Prompts

Add `.prompt.md` files in `prompts/` directory:

- Use descriptive names with `.prompt.md` extension
- Include front matter with description
- Structure with clear goals and instructions

### Chat Modes

Add `.chatmode.md` files in `chatmodes/` directory:

- Follow existing patterns
- Include front matter with description

## Contributing Process

1. Fork the repository
2. Create a new branch
3. Add your file(s) following the guidelines above
4. Run `node scripts/regenerate-readme.js` to update README
5. Submit a pull request

## Guidelines

- Be specific and actionable
- Test with GitHub Copilot
- Use consistent formatting
- Keep each file focused on one topic

## License

Contributions are licensed under MIT License.
