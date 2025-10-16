---
description: "Playwright test generation instructions with best practices and patterns."
applyTo: "**"
title: Playwright TypeScript Test Generation Instructions
---

## Test Writing Guidelines

### Code Quality Standards

- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility.
- **Test Steps**: Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions.
- **Error Handling**: Use `try-catch` blocks only when necessary. Playwright's built-in error handling is usually sufficient.

### Test Structure

- **Imports**: Start with `import { test, expect } from '@playwright/test';`.
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Hooks**: Use `beforeEach` for setup actions common to all tests in a `describe` block (e.g., navigating to a page).
- **Titles**: Follow a clear naming convention, such as `Feature - Specific action or scenario`.

### File Organization

- **Location**: Store all test files in the `tests/` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `login.spec.ts`, `search.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.

### Assertion Best Practices

- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.

## Example Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Movie Search Feature", () => {
  test.beforeAll(async () => {
    // This block runs once before all tests in this describe block
    // You can set up global state or perform one-time actions here
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto("/"); // Adjust the URL as needed but root should be taken from baseUrl in playwright.config.ts
  });

  test("Search for a movie by title", async ({ page }) => {
    // Arrange: Set up the initial state
    const searchInput = page.getByRole("textbox", { name: "Search" });
    const searchButton = page.getByRole("button", { name: "Search" });

    // Act: Perform the search action
    await searchInput.fill("Inception");
    await searchButton.click();

    // Assert: Verify the search results
    const results = page.getByRole("list", { name: "Search Results" });
    await expect(results).toBeVisible();
    await expect(results).toHaveText(/Inception/);
  });
});
```

## 🎭 Testing Patterns & Best Practices

Understanding and applying proven testing patterns helps create maintainable, readable, and reliable test automation.

Incorporate these industry-standard patterns:

### 🏗️ Arrange-Act-Assert (AAA) Pattern

The fundamental pattern for structuring test cases:

- **Arrange**: Set up test data, configure initial state, and prepare test environment
- **Act**: Execute the action or behavior being tested
- **Assert**: Verify the expected outcome and validate results

```typescript
test("User can search for products", async ({ page }) => {
  // Arrange: Set up the initial state
  const searchInput = page.getByRole("textbox", { name: "Search" });
  const searchButton = page.getByRole("button", { name: "Search" });

  // Act: Perform the search action
  await searchInput.fill("laptop");
  await searchButton.click();

  // Assert: Verify the search results
  await expect(page.getByText("Search Results")).toBeVisible();
  await expect(page.getByRole("list")).toContainText("laptop");
});
```

_Use Page Object Model (POM) to encapsulate page interactions and reduce duplication._

### 🎯 Page Object Model (POM)

Encapsulate page interactions and locators in reusable classes.
Aggregate related actions and assertions to improve test readability and maintainability.
Try not to create methods for single actions.

```typescript
import { Locator, Page } from "@playwright/test";

class SearchPage {
  searchInput: Locator;
  searchButton: Locator;

  constructor(private page: Page) {
    this.searchInput = page.getByRole("textbox", { name: "Search" });
    this.searchButton = page.getByRole("button", { name: "Search" });
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}
```

### DTO (Data Transfer Object) Pattern

Use DTOs to encapsulate data structures for test inputs and outputs. This helps maintain a clear contract for test data and reduces duplication.

```typescript
interface UserModel {
  name: string;
  email: string;
  role: string;
}

class RegistrationPage {
  async createUser(user: UserModel): Promise<void> {
    // Logic to create user
  }
}
```

### 🧱 Builder Pattern for Test Data

Create flexible test data with the builder pattern. Use this pattern with DTOs to construct complex objects step-by-step, allowing for easy customization and readability.

```typescript
class UserBuilder {
  private user: UserModel = { name: "", email: "", role: "user" };

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }
  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }
  withRole(role: string): UserBuilder {
    this.user.role = role;
    return this;
  }

  build(): UserModel {
    return { ...this.user };
  }
}

// Usage
const testUser = new UserBuilder()
  .withName("John Doe")
  .withEmail("john@example.com")
  .withRole("admin")
  .build();
```

### 🧱 Factory Pattern for Test Data

Create reusable test data factories to generate consistent test data:

```typescript
class UserFactory {
  static createUser(overrides?: Partial<UserModel> = {}) {
    const randomId = Date.now();

    const user: UserModel = {
      name: `Default User ${randomId}`,
      email: `default-${randomId}@example.com`,
      role: `user`,
    };

    return { ...user, ...overrides };
  }
}

// Usage
const testUser = UserFactory.createUser({
  name: "John Doe",
  email: "john@example.com",
  role: "admin",
});
```

### 🏃‍♂️ Test Steps Pattern

Use `test.step()` for better reporting and debugging:

```typescript
test("Complete user registration flow", async ({ page }) => {
  await test.step("Navigate to registration page", async () => {
    await page.goto("/register");
  });

  await test.step("Fill registration form", async () => {
    await page.getByLabel("Name").fill("John Doe");
    await page.getByLabel("Email").fill("john@example.com");
  });

  await test.step("Submit and verify success", async () => {
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("Registration successful")).toBeVisible();
  });
});
```

_Use Page Object Model (POM) to encapsulate page interactions and reduce duplication._

### 🎪 Fixture Pattern for Setup/Teardown

Use Playwright fixtures for consistent test setup:

```typescript
import { test as base } from "@playwright/test";

export const test = base.extend<{ loggedInUser: Page }>({
  loggedInUser: async ({ page }, use) => {
    // Setup: Login user
    await page.goto("/login");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();

    await use(page);

    // Teardown: Logout (if needed)
    await page.getByRole("button", { name: "Logout" }).click();
  },
});
```

### 🎪 Fixture Pattern for Page Object initialization

Use fixtures to initialize page objects for tests:

```typescript
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { RegistrationPage } from "../pages/registration.page";

export const test = base.extend<{
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
});
```

Usage in tests:

```typescript
test("User can register", async ({ registrationPage }) => {
  await registrationPage.registerUser({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  });

  // Verify registration success
  await expect(registrationPage.successMessage).toBeVisible();
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:

- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Each test has a clear purpose and has an assertion that verifies the expected outcome
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented
- [ ] No unnecessary `try-catch` blocks are present
- [ ] Tests are isolated and do not depend on external state
- [ ] No hard-coded waits or timeouts are used
- [ ] Patterns like AAA, POM, and Builder are applied where appropriate
```
