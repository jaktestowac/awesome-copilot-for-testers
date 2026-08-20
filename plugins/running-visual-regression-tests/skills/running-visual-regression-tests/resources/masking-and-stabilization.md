# Masking and Stabilization

Do all of this before touching a threshold. A tolerance applied to an unstable page hides regressions along with the noise.

## The gate

Run the same visual test three times on the same commit, with no code change between runs.

```bash
npx playwright test --grep @visual --repeat-each=3
```

Zero diffs across all three runs is the entry condition for the rest of the setup. Anything else means a source of nondeterminism is still live, and the sections below are the list of usual suspects.

## Fonts

A webfont that arrives after the screenshot produces a one-off diff on a random run.

```ts
await page.goto('/checkout');
await page.evaluate(() => document.fonts.ready);
```

Better, remove the race entirely: self-host the fonts and preload them, so no network round trip decides the rendering.

Fonts also differ between a developer machine and a Linux container. Any font not shipped with the app renders differently in each. This is what makes containerized baselines non-negotiable; see `baseline-policy.md`.

## Animation and transitions

Global CSS injection, applied once via a fixture:

```ts
// test/fixtures/visual.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          scroll-behavior: auto !important;
          caret-color: transparent !important;
        }
      `,
    });
    await use(page);
  },
});
```

Playwright's own option covers CSS animations at screenshot time:

```ts
await expect(page).toHaveScreenshot({ animations: 'disabled' });
```

Use both. The option freezes animations for the shot; the injected CSS also stops layout from settling mid-shot.

JavaScript-driven animation (canvas loops, `requestAnimationFrame` carousels) needs a test hook in the application. A `data-test-static` attribute the app reads to skip its own animation is legitimate and much cheaper than fighting it from the outside.

## Time

Relative timestamps ("3 minutes ago") change between the baseline and the comparison.

```ts
await page.clock.setFixedTime(new Date('2025-03-11T10:00:00Z'));
await page.goto('/orders');
```

Full recipes in `mocking-network-and-time`, `resources/clock-and-timezone.md`.

## Data

Fixed seed, fixed order, fixed length.

- seed the database or stub the API with a fixture, never let the page read whatever stage happens to hold
- ensure a stable sort key; two records with the same `createdAt` swap positions between runs
- fix collection length; a list that renders 9 items one run and 10 the next is a real diff every time
- avatars, thumbnails, and user-uploaded images: stub them to a fixed asset

```ts
await page.route('**/avatars/**', (route) =>
  route.fulfill({ path: 'test/fixtures/avatar.png', contentType: 'image/png' }),
);
```

## Scrollbars, caret, and focus

- caret: `caret: 'hide'` in the screenshot options, plus `caret-color: transparent` in the injected CSS
- scrollbars render differently across platforms; either hide them in the test CSS or ensure the snapshot region does not include them
- focus rings appear or not depending on how the page was reached; blur explicitly before the shot if focus is not the subject

```ts
await page.locator('body').evaluate((el) => (el as HTMLElement).focus());
await page.keyboard.press('Escape');
```

## Lazy loading and viewport-dependent rendering

`fullPage: true` screenshots trigger scrolling, which triggers lazy loading, which races the shot.

```ts
// Force everything to load before a full-page shot
await page.evaluate(async () => {
  await new Promise<void>((resolve) => {
    let total = 0;
    const step = 200;
    const timer = setInterval(() => {
      window.scrollBy(0, step);
      total += step;
      if (total >= document.body.scrollHeight) {
        clearInterval(timer);
        window.scrollTo(0, 0);
        resolve();
      }
    }, 50);
  });
});
```

Sticky headers and position-fixed elements repeat down a full-page shot in some engines. Prefer region snapshots on pages that have them.

## Masking

Mask what is genuinely dynamic and cannot be pinned.

```ts
await expect(page).toHaveScreenshot('order-summary.png', {
  mask: [
    page.getByTestId('order-id'),        // server-generated
    page.getByTestId('generated-at'),    // pinned clock would be better
    page.locator('iframe[title="Live chat"]'),
  ],
  maskColor: '#FF00FF',
});
```

Rules:

- **prefer pinning over masking.** A masked timestamp is uncovered; a pinned one is covered. Mask only what you cannot control.
- **mask by role or test id**, never by a CSS class that will be renamed
- **record every mask** in the register below, with what it stops covering
- **a growing mask list is a signal**, not a solution. Three masks on one snapshot usually means the wrong surface was chosen.

### Mask register

Keep this next to the visual tests.

| Snapshot | Masked region | Why it cannot be pinned | What this stops covering | Added |
| --- | --- | --- | --- | --- |
| `order-summary.png` | `order-id` | Server-generated, no injection point | Order id formatting and truncation | 2026-08-20 |
| `dashboard.png` | Live chat iframe | Third-party widget | Widget position and page reflow around it | 2026-08-20 |

## Cross-platform differences that masking will not fix

| Difference | Effect | Fix |
| --- | --- | --- |
| Font rendering and hinting | Text anti-aliasing differs everywhere | Container baselines |
| Device pixel ratio | Everything shifts | `deviceScaleFactor` set explicitly |
| GPU vs software rendering | Gradients, shadows, transforms | Same container, `--disable-gpu` consistently |
| Emoji glyphs | Different picture per OS | Container baselines, or avoid emoji in fixtures |
| Scrollbar width | Layout shifts by 15px | Hide scrollbars in test CSS |
| Sub-pixel text positioning | 1px diffs on many pixels | `threshold` around 0.2, not a raised pixel ratio |

None of these are solved by raising `maxDiffPixelRatio`. They are solved by comparing like with like.
