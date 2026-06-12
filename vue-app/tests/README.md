# Tests

Acceptance/unit tests for the Family Quiz app, run on
[Vitest](https://vitest.dev/) + [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro/)
in **jsdom**. No browser and no dev server are required.

See [../../TESTING.md](../../TESTING.md) for the methodology (spec-first Gherkin as
contract, hand-written editable tests, selector conventions).

## Running

Use the unified runner — exit 0 means green; on failure it prints
`FAILURES: test-results/<suite>.failures.txt`, a processed report to read
(don't parse raw terminal output):

```bash
# One suite
yarn test tests/quiz-card-reload.spec.js

# All suites in parallel (quick regression check)
yarn test

# Watch mode while developing
yarn test:unit:watch
```

(`yarn vitest-run-suite` is an alias of `yarn test`; `yarn test:unit` runs
plain vitest output for humans.)

## Layout

```
tests/
  setup.js                 # jest-dom matchers + cleanup
  support/                 # page-object layer — ALL selectors live here
    presenter-page.js
    landing-page.js
    customization-page.js
  *.spec.js                # editable acceptance tests, one per spec scenario set
```

Specs in `../../specs/*.spec.md` are the contracts. Each implemented scenario maps
to a readable `it()` block:

- `presenter.spec.js` — photo/question navigation, answer reveal, navigation blocking
- `landing-page.spec.js` — quiz library cards, metadata, navigation
- `quick-start-quiz.spec.js` — Spustit / „Nastavení kvízu" (menu karty) from a card
- `resume-quiz.spec.js` — Esc leaves a running quiz to the library, „Pokračovat" resumes it
- `customization.spec.js` — timer, questions-per-photo, live summary, Start / Skip
- `library-disk-backup.spec.js` — backup beside photo folders mirrors saves, restores lost browser state

## Conventions

- **Selectors target accessible role + name** (`getByRole('button', { name: 'Start Quiz' })`).
  Where role isn't enough, add a `data-testid` to the component and use
  `getByTestId(...)`. Never CSS classes (`.btn`) or text regex.
- **All selectors live in `support/` page objects**, not scattered across tests.
  When the UI moves, you tune one place.
- Component behaviour (toggles, conditional rendering, summaries) → these jsdom
  tests. Only a few genuinely end-to-end concerns (route navigation across real
  views, responsive viewports, touch) would warrant a browser e2e tool later.

## Writing a new test

1. Pick one scenario from a `specs/*.spec.md` contract.
2. Add/extend a page object in `support/` exposing what the user sees and does.
3. Add an `it()` that reads like the user's flow. Tune selectors on the real
   rendered UI, then move on — test by test, not all at once.
