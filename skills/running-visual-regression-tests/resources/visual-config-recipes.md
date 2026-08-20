# Visual Config Recipes

Playwright examples. The principles transfer to other runners; the spellings do not.

## Project config

Keep visual tests in their own project so they can be run, sharded, and skipped independently.

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  projects: [
    {
      name: 'visual-desktop',
      testMatch: /.*\.visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        timezoneId: 'Europe/Warsaw',
        locale: 'en-US',
        reducedMotion: 'reduce',
      },
    },
    {
      name: 'visual-mobile',
      testMatch: /.*\.visual\.spec\.ts/,
      use: { ...devices['iPhone 13'], reducedMotion: 'reduce' },
    },
  ],
});
```

`reducedMotion: 'reduce'` makes the browser honour `prefers-reduced-motion`, which well-built applications already respect. Cheaper than fighting animation from outside.

## What the two knobs mean

| Option | Meaning | Sensible range |
| --- | --- | --- |
| `threshold` | Per-pixel colour distance tolerated before a pixel counts as different (0 to 1) | 0.1 to 0.3, absorbs anti-aliasing |
| `maxDiffPixels` | Absolute count of differing pixels tolerated | Use for small fixed-size regions |
| `maxDiffPixelRatio` | Fraction of the image allowed to differ | 0.001 to 0.01; above that a missing button passes |

`threshold` absorbs rendering noise. `maxDiffPixelRatio` absorbs *area*, which is what hides regressions. Raise `threshold` first, `maxDiffPixelRatio` reluctantly, and only with a comment.

```ts
await expect(card).toHaveScreenshot('promo-card.png', {
  // Gradient banding differs between GPU and software rendering on the CI runner.
  // Raised 2026-08-20, revisit when the runner image changes.
  threshold: 0.3,
});
```

## Region snapshots, the default

```ts
test('order summary layout @visual', async ({ page }) => {
  await page.goto('/orders/seed-order-1');
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByTestId('order-summary')).toHaveScreenshot('order-summary.png');
});
```

A failure here names one component. The full-page equivalent names the page and leaves the reader to find the component.

## Full-page snapshots, the short list

```ts
test('checkout page layout @visual @fullpage', async ({ page }) => {
  await page.goto('/checkout');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('checkout-full.png', {
    fullPage: true,
    mask: [page.getByTestId('order-id')],
  });
});
```

Tag them so they can be excluded when the noise is not worth it that day.

## Component snapshots from stories

If a Storybook or component harness exists, snapshot there instead of through the application. Faster, no routing, no auth, no data seeding.

```ts
const stories = ['button--primary', 'button--disabled', 'button--loading'];

for (const story of stories) {
  test(`${story} @visual`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story}.png`);
  });
}
```

## Soft assertions for multi-state pages

When one page has several states worth checking, a hard failure on the first hides the rest.

```ts
test('form states @visual', async ({ page }) => {
  await page.goto('/signup');

  await expect.soft(page.getByTestId('form')).toHaveScreenshot('signup-empty.png');

  await page.getByLabel('Email').fill('not-an-email');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect.soft(page.getByTestId('form')).toHaveScreenshot('signup-invalid.png');
});
```

## CI: artifacts on failure

Without this, a CI failure gives you a percentage and no picture.

```yaml
# .github/workflows/visual.yml
      - name: Run visual tests
        run: npx playwright test --project=visual-desktop --project=visual-mobile

      - name: Upload diffs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs-${{ github.run_attempt }}
          path: |
            test-results/**/*-actual.png
            test-results/**/*-expected.png
            test-results/**/*-diff.png
            playwright-report/
          retention-days: 14
```

Run the whole job in the same container as baseline generation:

```yaml
    container:
      image: mcr.microsoft.com/playwright:v1.56.0-noble
```

## Regenerating baselines from CI

Preferable to regenerating locally, because it uses the comparison environment by construction. A manually dispatched workflow that opens a pull request:

```yaml
on:
  workflow_dispatch:
    inputs:
      grep:
        description: 'Test filter, e.g. @visual or a single title'
        required: true

jobs:
  update:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.56.0-noble
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test --grep "${{ inputs.grep }}" --update-snapshots
      - uses: peter-evans/create-pull-request@v6
        with:
          title: 'chore(visual): refresh baselines for ${{ inputs.grep }}'
          body: 'Regenerated in CI. Review each image before merging.'
          branch: visual-baselines/${{ github.run_id }}
```

The required filter input is deliberate. It makes a whole-suite refresh an explicit choice rather than the default.

## Naming

```
tests/visual/__screenshots__/
  order-summary.visual.spec.ts/
    visual-desktop/order-summary.png
    visual-mobile/order-summary.png
```

Playwright derives this layout from the spec file and project name. Keep the snapshot argument descriptive (`order-summary.png`, not `screenshot-1.png`) so a failing artifact name says what broke.
