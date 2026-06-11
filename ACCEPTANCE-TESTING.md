# Acceptance Testing Infrastructure

This project uses Disciplined Agile Engineering (DAE) approach for acceptance testing, which combines behavior-driven specifications with automated testing.

## Overview

The acceptance test pipeline transforms human-readable specifications into executable tests:

```
spec.md (Gherkin) → spec.json (IR) → *.test.js (Taiko) → Test Results
```

### Key Principles

1. **Outside-In TDD**: Acceptance tests define the "what" before implementation
2. **Deep System Knowledge**: Tests directly interact with Vue internals, not generic stubs
3. **Portable Front-end**: Parser and IR are standard across all projects
4. **Project-specific Backend**: Generator and step handlers know this codebase

## Directory Structure

```
C:\dev\quiz/
├── dae_gherkin.js              # Portable: Gherkin parser (spec.md → IR)
├── acceptance/
│   ├── generator.js            # Project-specific: IR → Taiko tests
│   └── stepHandlers.js         # Project-specific: Step → System behavior
├── specs/
│   ├── 001-quiz-customization/
│   │   ├── spec.md             # Source of truth (committed)
│   │   ├── run-acceptance-tests.js  # Test runner
│   │   └── .build/             # Generated (gitignored)
│   │       ├── spec.json       # IR
│   │       └── generated/      # Taiko test files
│   └── .gitignore              # Ignore .build/ directories
└── package.json                # Scripts for running tests
```

## Pipeline Components

### 1. Parser - `dae_gherkin.js` (Portable)

Parses Gherkin-in-markdown specifications into a standardized JSON IR.

**Input**: `spec.md` with Gherkin syntax
```markdown
### Scenario 1: Access customization settings
**Given** I am on the landing page
**When** I click on a quiz pack
**Then** I should see customization options
```

**Output**: `spec.json` with fixed IR structure
```json
{
  "feature": {"name": "...", "description": "..."},
  "scenarios": [
    {
      "name": "...",
      "steps": [
        {"keyword": "Given", "text": "...", "table": null}
      ]
    }
  ]
}
```

**Usage**:
```bash
node dae_gherkin.js specs/quiz-customization.spec.md specs/001-quiz-customization/.build/spec.json
```

### 2. Generator - `acceptance/generator.js` (Project-specific)

Reads the IR and generates executable Taiko test files.

**Key Features**:
- One test file per scenario
- Imports step handlers
- Includes browser setup/teardown
- Screenshot capture on success/failure

**Usage**:
```bash
node acceptance/generator.js specs/001-quiz-customization/.build/spec.json specs/001-quiz-customization/.build/generated
```

### 3. Step Handlers - `acceptance/stepHandlers.js` (Project-specific)

Maps each Gherkin step's exact text to Taiko actions that interact with the Vue app.

**Example**:
```javascript
export const stepHandlers = {
  'I am on the landing page viewing a quiz pack': async () => {
    await goto(`${BASE_URL}/`);
    await waitForCondition(async () => await $('.quiz-card').exists());
  },

  'I click on a quiz pack card': async () => {
    await click($('.quiz-card'));
    await waitFor(300);
  },

  'I should see customization options before entering presenter mode': async () => {
    await waitForCondition(async () => {
      return await text(/customization|nastavení|settings/i).exists();
    });
  },
};
```

**Deep System Knowledge**:
- Knows Vue component selectors (`.quiz-card`)
- Understands app routes (`${BASE_URL}/#/presenter`)
- Waits for Vue reactivity (custom `waitForCondition`)
- Checks for Czech/English text (i18n aware)

### 4. Test Runner - `run-acceptance-tests.js` (Per-feature)

Orchestrates the complete pipeline for a feature.

**Steps**:
1. Parse `spec.md` → `spec.json` (IR)
2. Generate tests from IR → `.build/generated/*.test.js`
3. Execute all generated tests
4. Report results

## Running Tests

### Quick Start

```bash
# Run all acceptance tests for quiz customization
npm run test:acceptance

# Run with visible browser (for debugging)
npm run test:acceptance:headed
```

### Manual Pipeline

```bash
# 1. Generate IR from spec
npm run generate:ir

# 2. Generate Taiko tests from IR
npm run generate:tests

# 3. Run generated tests
node specs/001-quiz-customization/.build/generated/01-*.test.js
```

### Run Individual Test

```bash
# Headless
HEADLESS=true node specs/001-quiz-customization/.build/generated/01-access-customization-settings-from-landing-page.test.js

# Headed (visible browser)
HEADLESS=false node specs/001-quiz-customization/.build/generated/01-access-customization-settings-from-landing-page.test.js
```

## Writing Specifications

### Spec File Format - `spec.md`

Use standard Gherkin syntax in markdown:

```markdown
# Feature: Feature Name

## Background
User story context

## Acceptance Criteria

### Scenario 1: Scenario name
**Given** initial state
**When** action occurs
**Then** expected outcome
**And** additional expectation

### Scenario 2: Another scenario
...
```

### Step Tables

For steps with data tables:

```markdown
**Then** I should see a summary showing:
  - Timer setting
  - Questions per photo
  - Randomization settings
```

This generates a table in the IR:
```json
{
  "keyword": "Then",
  "text": "I should see a summary showing:",
  "table": {
    "headers": ["Item"],
    "rows": [["Timer setting"], ["Questions per photo"], ...]
  }
}
```

### Adding New Steps

1. **Write the step** in `spec.md`
2. **Regenerate IR**: `npm run generate:ir`
3. **Add handler** in `stepHandlers.js`:
   ```javascript
   'exact step text here': async (table) => {
     // Taiko actions that interact with your Vue app
     await goto(...);
     await click(...);
     assert(...);
   }
   ```
4. **Regenerate tests**: `npm run generate:tests`
5. **Run**: `npm run test:acceptance`

## Integration with Existing Tests

### Existing E2E Tests
- **Location**: `vue-app/tests/presenter.test.js`, `vue-app/tests/landing-page.test.js`
- **Purpose**: Test already-implemented features (presenter view, landing page)
- **Framework**: Taiko (same as acceptance tests)
- **Run with**: `cd vue-app && yarn test:e2e`

### Acceptance Tests
- **Location**: `specs/001-quiz-customization/.build/generated/*.test.js`
- **Purpose**: Test the quiz customization feature (not yet implemented)
- **Framework**: Taiko (reuses same patterns)
- **Run with**: `npm run test:acceptance`

### Shared Infrastructure
Both test suites use:
- Taiko for browser automation
- Same BASE_URL (`http://localhost:5173`)
- Same screenshot directory (`vue-app/tests/screenshots/`)
- Same browser configuration (headless/headed modes)

## Development Workflow

### 1. Define Feature (Outside-In)

Write acceptance criteria in `specs/001-quiz-customization/spec.md`:

```markdown
### Scenario 1: Configure timer
**Given** I am on the customization screen
**When** I select "60s" timer
**Then** the quiz should start with a 60-second timer
```

### 2. Generate Tests

```bash
npm run generate:pipeline  # Parse IR + Generate tests
```

### 3. Implement Step Handlers

In `acceptance/stepHandlers.js`, map steps to system behavior:

```javascript
'I am on the customization screen': async () => {
  await goto(`${BASE_URL}/`);
  await click($('.quiz-card'));
  // Wait for customization screen to load
  await waitForCondition(async () =>
    await text(/customization/i).exists()
  );
},

'I select "60s" timer': async () => {
  await click(checkBox(near(text(/timer/i))));
  const timerSelect = await $('select[name="timer"]');
  await timerSelect.select('60s');
},

'the quiz should start with a 60-second timer': async () => {
  await click(button(/start quiz/i));
  await waitForCondition(async () =>
    await text(/0:60|1:00/).exists()  // Timer display
  );
},
```

### 4. Run Tests (Red)

```bash
npm run test:acceptance
# Tests fail - feature not implemented
```

### 5. Implement Feature

Build the customization screen in Vue:
- Create `CustomizationView.vue`
- Add route: `/customize/:packId`
- Implement timer settings UI
- Store settings in Pinia
- Apply settings in presenter

### 6. Run Tests (Green)

```bash
npm run test:acceptance
# Tests pass - feature works as specified
```

## Best Practices

### Step Handler Implementation

1. **Use exact text matching**: Step text must match exactly
   ```javascript
   // Good
   'I click on a quiz pack card': async () => { ... }

   // Bad - text doesn't match spec
   'I click a quiz card': async () => { ... }
   ```

2. **Interact with system internals**: Call directly into Vue components
   ```javascript
   // Good - knows the system
   await click($('.quiz-card'));

   // Bad - generic, no system knowledge
   await click('button');
   ```

3. **Wait for Vue reactivity**: Use smart waits, not fixed delays
   ```javascript
   // Good
   await waitForCondition(async () => await text(/loaded/i).exists());

   // Avoid - brittle
   await waitFor(5000);
   ```

4. **Handle state**: Use `testState` for scenario-level state
   ```javascript
   'I configure timer to 60s': async () => {
     testState.selectedTimer = '60s';
     // ... apply setting
   },

   'timer should be active': async () => {
     if (testState.selectedTimer) {
       assert(await text(/0:60/).exists());
     }
   },
   ```

### Spec Writing

1. **Be specific**: Steps should clearly describe behavior
   ```markdown
   Good: **Then** I should see a "Start Quiz" button
   Bad:  **Then** I should see buttons
   ```

2. **Test outcomes, not implementation**: Focus on user-visible behavior
   ```markdown
   Good: **Then** photos should appear in randomized order
   Bad:  **Then** the randomize function should be called
   ```

3. **One scenario = one behavior**: Keep scenarios focused
   ```markdown
   Good: Scenario: Configure timer duration
   Bad:  Scenario: Configure all settings (too broad)
   ```

## Troubleshooting

### Tests fail to import stepHandlers

**Error**: `Cannot find module '../../../acceptance/stepHandlers.js'`

**Fix**: Check import path in generated tests. It should be `../../../acceptance/` from `.build/generated/`

### Step handler not found

**Error**: `No handler found for step: Given I am on...`

**Fix**: Add exact matching handler in `stepHandlers.js`:
```javascript
'I am on the landing page viewing a quiz pack': async () => { ... }
```

### Dev server not running

**Error**: `Error: Navigation to http://localhost:5173 failed`

**Fix**: Start the dev server first:
```bash
cd vue-app
yarn dev
```

### Browser hangs in headed mode

**Fix**: Tests may be waiting for elements that don't exist. Check:
1. Is the customization screen implemented?
2. Are element selectors correct?
3. Add debug logging to step handlers

## Future Enhancements

### Test Impact Analysis

When `manifest.acceptance.impact_analysis` is enabled:
- Collect coverage per scenario
- Map scenarios to changed files
- Run only affected tests in inner loop

### Parameterized Steps

Support regex matching for dynamic step text:
```javascript
// Current: exact match
'I select "60s" timer': async () => { ... }

// Future: regex with parameters
/I select "(.+)" timer/: async (duration) => {
  await select(duration);
}
```

### Parallel Execution

Run scenarios in parallel for faster feedback:
```bash
npm run test:acceptance:parallel
```

## References

- **Taiko Documentation**: https://taiko.dev
- **Gherkin Syntax**: https://cucumber.io/docs/gherkin/reference/
- **DAE Principles**: Uncle Bob's "The Clean Coder" - Acceptance Tests chapter
