---
name: acceptance-tests
description: >-
  Run and write acceptance/UI tests for the Vue app fast and token-cheaply.
  Use whenever the task involves running the test suite, reading test results,
  or writing a new acceptance test for a Vue component. Covers the Vitest +
  @testing-library/vue + jsdom (headless) stack, the JSON-reporter run command,
  and the compact results-summary runner. Triggers: "run the tests", "acceptance
  test", "vitest", "headless UI test", "test failing", "write a test for".
---

# Acceptance tests (Vue, headless)

These tests are **hand-written and editable**, one use-case at a time. Do NOT
generate test files from Gherkin specs and do NOT mark tests `DO NOT EDIT`. The
Gherkin spec is a human-readable contract only — see `MEMENTO-TESTOVANI.md`.

## Stack — use these libraries

- **vitest** — test runner (shares Vite config with the app, fast start).
- **@testing-library/vue** — render components, query by role/text/testid.
- **@testing-library/user-event** — realistic user interaction (`click`, `type`).
- **jsdom** — headless DOM in Node; no real browser, no pixels. Default env.
- (Only for true end-to-end) **@playwright/test** — real browser, used for the
  few navigation/responsive/touch scenarios jsdom cannot cover.

Install (in `vue-app/`):

```bash
npm i -D vitest @testing-library/vue @testing-library/user-event jsdom
```

`vue-app/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,        // describe/it/expect without imports
    css: false,           // jsdom doesn't lay out CSS anyway
    include: ['tests/**/*.spec.ts', 'src/**/*.spec.ts'],
  },
})
```

## Running tests — ALWAYS via the runner script

Do not run raw `vitest` and parse its human-readable stdout — that burns tokens.
Use the bundled runner, which writes a JSON report and prints a tiny summary:

```bash
# whole suite
node scripts/run-tests.mjs

# single file (preferred while iterating — fast, focused)
node scripts/run-tests.mjs tests/timer-settings.spec.ts

# filter by test name
node scripts/run-tests.mjs -t "default is No timer"

# re-summarize the last run without re-running
node scripts/run-tests.mjs --parse-only
```

Output is deterministic and minimal, e.g.:

```
TESTS: 11/12 passed, 1 failed
FAILURES:
- [tests/timer-settings.spec.ts] Timer settings > default is No timer
    expected 'No timer' to be selected but got '60s' (at tests/timer-settings.spec.ts:14)
```

Read **that** summary (or `.vitest-results.json` directly) — never the raw run.
The script exits non-zero on failure, so it composes in CI and `&&` chains.

## Writing a new test (one UC + one test)

1. Pick one Gherkin scenario as the contract.
2. `render()` the component, drive it with `userEvent`, assert on what the user
   sees.
3. Query by **role** first, then `data-testid`. Never CSS classes or text regex.
4. Add `data-testid` to the component if no accessible role fits.

```ts
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import TimerSettings from '@/components/TimerSettings.vue'

it('default duration is "No timer"', () => {
  render(TimerSettings)
  expect(screen.getByTestId('timer-duration')).toHaveValue('No timer')
})

it('enabling the timer reveals the duration selector', async () => {
  render(TimerSettings)
  await userEvent.click(screen.getByRole('checkbox', { name: /timer/i }))
  expect(screen.getByTestId('timer-duration')).toBeVisible()
})
```

## jsdom vs. real browser

- jsdom (here): component behaviour, defaults, toggles, conditional render,
  selections, summaries. ~80% of scenarios.
- Playwright (separate): route navigation, responsive viewports, touch,
  "view loads immediately". Keep this set small.

If a test needs real layout/geometry (`getBoundingClientRect`, scrolling,
multi-page nav), it does NOT belong in jsdom — move it to the Playwright suite.
