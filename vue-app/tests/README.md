# E2E Tests

End-to-end tests for the Family Quiz application using [Taiko](https://taiko.dev/).

## Prerequisites

- Dev server must be running on http://localhost:5173
- Taiko will automatically download Chromium on first run

## Running Tests

### Headless Mode (CI/CD)

```bash
# Make sure dev server is running
yarn dev

# In another terminal, run tests
yarn test:e2e
```

### Headed Mode (Visual Debugging)

```bash
# Run tests with visible browser
HEADLESS=false yarn test:e2e:headed
```

Or on Windows:

```bash
set HEADLESS=false
yarn test:e2e:headed
```

## Test Coverage

The E2E tests cover the complete UX flow:

1. ✅ Loading presenter view
2. ✅ Initial fullscreen photo display
3. ✅ Toggling questions with spacebar
4. ✅ Navigating between questions with arrow keys
5. ✅ Revealing correct answers
6. ✅ Hiding questions
7. ✅ Navigating between photos
8. ✅ Navigation blocking when questions are visible
9. ✅ ESC key to hide questions
10. ✅ Complete user flow simulation

## Screenshots

Test screenshots are saved to `tests/screenshots/`:

- `presenter-initial.png` - Initial state
- `presenter-questions.png` - Questions visible
- `presenter-answer.png` - Answer revealed
- `error.png` - Screenshot on test failure

## Test Environment

Set custom base URL:

```bash
BASE_URL=http://localhost:3000 yarn test:e2e
```

## CI/CD Integration

For GitHub Actions or other CI systems:

```yaml
- name: Install dependencies
  run: yarn install

- name: Start dev server
  run: yarn dev &

- name: Wait for server
  run: sleep 5

- name: Run E2E tests
  run: yarn test:e2e
```

## Writing New Tests

Tests use Taiko's simple API:

```javascript
const { openBrowser, goto, press, text, screenshot } = require('taiko');

(async () => {
  await openBrowser();
  await goto('http://localhost:5173/#/presenter');
  await press('Space');
  assert(await text('Your text').exists());
  await closeBrowser();
})();
```

See [Taiko documentation](https://docs.taiko.dev/) for more details.
