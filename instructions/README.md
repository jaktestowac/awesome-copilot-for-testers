# 🤖 Copilot Instructions – Best Practices Guide

This directory uses **GitHub Copilot custom instructions** to improve AI-generated code quality, consistency, and architectural alignment.

This document explains how instructions are structured and how to maintain them properly.

---

# 📌 Philosophy

Copilot instructions should be:

- ✅ Clear and opinionated
- ✅ Modular and scoped
- ✅ Non-contradictory
- ✅ Focused on quality and standards
- ❌ Not overly long or redundant
- ❌ Not duplicated across files

We follow a **"Base + Modules" architecture**.

---

# 👷‍♂️ Instruction Architecture

We use two levels of instructions:

## 1️⃣ Global Instructions (Repository-Wide)

**File:**

```
.github/copilot-instructions.md
```

Purpose:

- Define global coding standards
- Define architecture rules
- Define quality expectations
- Provide shared terminology
- Explain project philosophy

This file should remain:

- Short (1–2 screens max)
- High-level
- Stable

It acts as the **AI contract for the whole repository**.

---

## 2️⃣ Scoped / Modular Instructions

**Directory:**

```
.github/instructions/
```

Purpose:

- Provide domain-specific guidance
- Apply rules to specific paths or file types
- Keep concerns separated

Each file should focus on a single responsibility.

Example structure:

```
.github/
│
├── copilot-instructions.md
│
└── instructions/
    ├── testing.instructions.md
    ├── api.instructions.md
    ├── frontend.instructions.md
    ├── ci.instructions.md
    └── security.instructions.md
```

---

# 🧠 How Scoped Instructions Work

Scoped instruction files may include YAML frontmatter to limit where they apply (using `applyTo` patterns).

Example:

```md
---
applyTo: '**/*.spec.ts'
---

# Testing Guidelines

- Use Playwright test fixtures
- Avoid hardcoded waits
- Prefer role-based selectors
```

Another example:

```md
---
applyTo: 'apps/web/**'
---

# Frontend Guidelines

- Use functional components
- Follow accessibility standards
- Prefer semantic HTML
```

This ensures instructions:

- Apply only where relevant (files matching the pattern in `applyTo`)
- Do not conflict with other modules
- Stay maintainable in large repos

---

# 📐 Recommended Directory Structure (ASCII)

```
repo-root/
│
├── .github/
│   │
│   ├── copilot-instructions.md      # Global AI contract
│   │
│   └── instructions/                # Scoped instruction modules
│       ├── testing.instructions.md
│       ├── api.instructions.md
│       ├── frontend.instructions.md
│       ├── ci.instructions.md
│       └── security.instructions.md
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── shared/
│   └── utils/
│
└── README.md
```

---

# 🛠 Best Practices

## ✅ 1. Keep the Global File Clean

Do not put:

- Detailed test strategy
- API examples
- Framework-specific implementation details

Keep it conceptual and architectural.

---

## ✅ 2. One Responsibility per Module

Each `.instructions.md` file should:

- Cover one domain
- Avoid referencing unrelated concerns
- Avoid duplicating content from other files

Good:

```
testing.instructions.md → testing only
api.instructions.md → API only
```

Bad:

```
frontend.instructions.md → frontend + API + CI + security mixed
```

---

## ✅ 3. Avoid Contradictions

Do not define conflicting rules across files.

Example of what to avoid:

- `frontend.instructions.md`: "Always use Axios"
- `api.instructions.md`: "Never use Axios"

---

## ✅ 4. Include Execution Commands

If using Copilot coding agents, include:

- How to run tests
- How to build
- How to lint
- How to start the project

Example:

```md
## Commands

- Install: npm install
- Test: npm run test
- Lint: npm run lint
- Build: npm run build
```

Agents can use this information directly.

---

## ✅ 5. Optimize for Signal, Not Volume

Long instruction files reduce effectiveness.

Instead of:

❌ 800 lines of explanation

Prefer:

✅ Clear bullet points
✅ Explicit rules
✅ Examples
✅ Constraints

---

## ❗ What NOT to Do

- Do not create dozens of tiny instruction files.
- Do not duplicate README content.
- Do not include irrelevant business descriptions.
- Do not rely on cross-file "imports" (there is no guaranteed include system).

---

# 🧩 Example Strategy for Growing Projects

Small project:

```
copilot-instructions.md only
```

Medium project:

```
copilot-instructions.md
+ testing.instructions.md
+ api.instructions.md
```

Large monorepo:

```
copilot-instructions.md
+ domain-specific instructions
+ path-scoped applyTo rules
+ CI and security modules
```

---

# 🎯 Goal

The purpose of these instructions is to ensure:

- Consistent code generation
- Stable architecture
- Reduced hallucinations
- High-quality automated testing
- Better AI-assisted development

Copilot should behave like a **senior engineer aligned with this repository**, not a generic code generator.

---

# 🚀 Final Recommendation

If unsure:

Start simple.

1. Create a strong global `copilot-instructions.md`.
2. Add scoped modules only when real complexity appears.
3. Refactor instructions as the project grows.

Clarity beats complexity.
