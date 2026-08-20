# Selenium, WebdriverIO, and Protractor to Playwright

The mechanical mapping is straightforward. The gain comes from deleting the waiting infrastructure, which is usually a third of the suite's code.

## Selection

| Selenium (JS) | Playwright |
| --- | --- |
| `driver.findElement(By.css('.btn'))` | `page.locator('.btn')`, but prefer `page.getByRole(...)` |
| `driver.findElement(By.id('email'))` | `page.getByLabel('Email')` |
| `driver.findElement(By.xpath("//button[text()='Save']"))` | `page.getByRole('button', { name: 'Save' })` |
| `driver.findElements(By.css('.row'))` | `page.locator('.row')`, a locator that resolves to many |
| `element.findElement(By.css('.price'))` | `row.locator('.price')` |

XPath is the clearest signal of a test worth rewriting rather than porting. An XPath chain encodes the DOM structure, which is precisely what the test should not depend on.

## Actions

| Selenium | Playwright |
| --- | --- |
| `element.click()` | `locator.click()` |
| `element.sendKeys('text')` | `locator.fill('text')` |
| `element.clear()` | `locator.clear()`, or just `fill` |
| `new Select(el).selectByVisibleText('X')` | `locator.selectOption({ label: 'X' })` |
| `new Actions(driver).moveToElement(el).perform()` | `locator.hover()` |
| `new Actions(driver).dragAndDrop(a, b).perform()` | `a.dragTo(b)` |
| `driver.get(url)` | `page.goto(url)` |
| `driver.navigate().back()` | `page.goBack()` |
| `driver.switchTo().frame(el)` | `page.frameLocator('#frame').getByRole(...)` |
| `driver.switchTo().alert().accept()` | `page.on('dialog', d => d.accept())`, registered before the trigger |
| `driver.switchTo().window(handles[1])` | `context.waitForEvent('page')` |
| `driver.executeScript(...)` | `page.evaluate(...)` |
| `element.getScreenshotAs(...)` | `locator.screenshot()` |

## Waiting: delete it

This is the migration's main prize.

| Selenium | Playwright |
| --- | --- |
| `Thread.sleep(2000)` / `driver.sleep(2000)` | Delete |
| `new WebDriverWait(driver, 10).until(ExpectedConditions.visibilityOf(el))` | `await expect(locator).toBeVisible()` |
| `until(ExpectedConditions.elementToBeClickable(el))` | `await locator.click()`, which waits for actionability |
| `until(ExpectedConditions.textToBePresentInElement(el, 'x'))` | `await expect(locator).toHaveText('x')` |
| `until(ExpectedConditions.stalenessOf(el))` | `await expect(locator).toHaveCount(0)` |
| `driver.manage().timeouts().implicitlyWait(...)` | Config `expect.timeout` |
| A custom `waitForPageLoad()` helper | Delete. Actions and assertions wait |
| A retry loop around a flaky click | Delete. If it still needs one, that is a product defect worth reporting |

An explicit wait ported into Playwright is a wait on top of a wait: slower and no more reliable. Remove them all and let the assertion timeout do the work.

## WebdriverIO

| WebdriverIO | Playwright |
| --- | --- |
| `$('.btn')` | `page.locator('.btn')` |
| `$$('.row')` | `page.locator('.row')` |
| `el.waitForDisplayed()` | `await expect(locator).toBeVisible()` |
| `el.waitForClickable()` | Not needed |
| `browser.pause(1000)` | Delete |
| `browser.url('/path')` | `page.goto('/path')` |
| `expect(el).toHaveText('x')` | `await expect(locator).toHaveText('x')` |
| `browser.setWindowSize(w, h)` | `page.setViewportSize({ width, height })` |
| `wdio.conf.js` capabilities | `projects` with `devices[...]` |
| WDIO services (chromedriver, selenium-standalone) | Nothing. Playwright manages its own browsers |

WebdriverIO's assertion syntax is close enough that the diff is mostly adding `await`. Enable `@typescript-eslint/no-floating-promises` before you start; a missing `await` in WDIO's sync-ish style is easy to leave behind and reports a false pass.

## Protractor

Protractor is end-of-life, so the migration is usually forced rather than chosen.

| Protractor | Playwright |
| --- | --- |
| `element(by.model('user.email'))` | `page.getByLabel('Email')` |
| `element(by.binding('user.name'))` | `page.getByText(...)` or a test id |
| `element.all(by.repeater('item in items'))` | `page.getByRole('listitem')` |
| `browser.waitForAngular()` | Delete. Web-first assertions cover it |
| `browser.ignoreSynchronization = true` | Not applicable |
| `browser.get(url)` | `page.goto(url)` |

Angular-specific locators (`by.model`, `by.binding`, `by.repeater`) have no equivalent and should not get one. They couple the test to the framework's internals. Replace them with role, label, or test id.

## Page objects

Selenium page objects usually mix three things: element lookups, waits, and actions. In Playwright the waits disappear.

```java
// Selenium: a wait per element
public class LoginPage {
  private WebDriver driver;
  private WebDriverWait wait;

  public void login(String email, String password) {
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")))
        .sendKeys(email);
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("password")))
        .sendKeys(password);
    wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")))
        .click();
  }
}
```

```ts
// Playwright: locators are lazy, actions wait
export class LoginPage {
  constructor(private readonly page: Page) {}

  private readonly email = () => this.page.getByLabel('Email');
  private readonly password = () => this.page.getByLabel('Password');
  private readonly submit = () => this.page.getByRole('button', { name: 'Sign in' });

  async login(email: string, password: string) {
    await this.email().fill(email);
    await this.password().fill(password);
    await this.submit().click();
  }
}
```

Better still, ask whether the page object should be a fixture. The migration is the right moment to decide, and for setup-shaped things the answer is usually a fixture.

## Grid to projects

| Selenium Grid | Playwright |
| --- | --- |
| Hub and node infrastructure | None. Browsers ship with the library |
| Capabilities per browser | `projects` entries |
| Remote WebDriver URL | Not needed; use `--shard` for parallelism |
| Parallel via TestNG or JUnit config | `workers`, parallel by default |

Removing the Grid is frequently the largest operational win in the migration. Say so in the plan; it justifies the effort to whoever is funding it.

## Traps

- **Everything is awaited.** Selenium's synchronous JS bindings hid the async nature; Playwright does not. Turn on the floating-promises lint rule first.
- **Playwright parallelizes files by default.** A Selenium suite built around one shared driver and serial execution will surface its shared-state assumptions immediately. That is a real defect in the old suite, not a Playwright problem.
- **No implicit wait exists.** Code that relied on a global implicit wait needs explicit assertions, which is an improvement, not extra work.
- **Alerts must be handled before they are triggered.** Register `page.on('dialog', ...)` before the click, not after.
- **`isDisplayed()` maps to `toBeVisible()`, not to `toHaveCount(1)`.** Present and visible are different, and Selenium suites blur them.
