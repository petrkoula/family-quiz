# Feature 002: Quick Start Quiz from Card

## Overview

This feature enables quiz presenters to start a quiz immediately from the landing page without configuring settings. The "Play Now" button provides instant access to the quiz with sensible defaults, while a separate "Customize" button allows access to configuration options.

## Feature Goals

- Enable quick quiz launches from landing page cards
- Provide clear distinction between quick start and customization
- Apply default settings (no timer, all 3 questions, original order)
- Support keyboard accessibility
- Work consistently across all quiz packs

## Generated Acceptance Tests

This directory contains the DAE (Disciplined Agent Engineering) acceptance test pipeline for the Quick Start Quiz feature.

### Directory Structure

```
002-quick-start-quiz/
├── spec.md                     # Source specification (Gherkin-in-markdown)
├── .build/                     # Generated artifacts (gitignored)
│   ├── spec.json              # Intermediate Representation (IR)
│   └── generated/             # Generated Taiko test files
│       ├── 01-quiz-card-displays-quick-start-option.test.js
│       ├── 02-quick-start-launches-quiz-with-defaults.test.js
│       ├── 03-default-settings-are-applied-on-quick-start.test.js
│       ├── 04-customize-button-shows-configuration-options.test.js
│       ├── 05-quick-start-and-customize-are-clearly-distinguished.test.js
│       ├── 06-quick-start-works-for-all-quiz-packs.test.js
│       ├── 07-quick-start-is-keyboard-accessible.test.js
│       └── _suite.js
├── run-acceptance-tests.sh    # Unix/Mac test runner
├── run-acceptance-tests.bat   # Windows test runner
└── run-acceptance-tests.js    # Cross-platform Node.js runner

```

### Pipeline Components

1. **Parser**: `dae_gherkin.js` (project root) - Parses `spec.md` into `spec.json` IR
2. **Generator**: `acceptance/generator.js` - Generates Taiko tests from IR
3. **Step Handlers**: `acceptance/stepHandlers.js` - Maps Gherkin steps to Taiko actions
4. **Runners**: Execute the full pipeline (parse → generate → test)

## Running Tests

### Prerequisites

```bash
# Ensure dev server is running
cd vue-app
yarn dev
# Dev server should be running at http://localhost:5173
```

### Run All Tests

**Unix/Mac/Git Bash:**
```bash
./run-acceptance-tests.sh
```

**Windows:**
```cmd
run-acceptance-tests.bat
```

**Cross-platform (Node.js):**
```bash
node run-acceptance-tests.js
```

### Run with Visible Browser (for debugging)

**Unix/Mac/Git Bash:**
```bash
./run-acceptance-tests.sh --headed
```

**Windows:**
```cmd
run-acceptance-tests.bat --headed
```

**Cross-platform:**
```bash
node run-acceptance-tests.js --headed
```

### Run Individual Tests

```bash
# Run a specific scenario
node .build/generated/01-quiz-card-displays-quick-start-option.test.js

# Run in headed mode
HEADLESS=false node .build/generated/02-quick-start-launches-quiz-with-defaults.test.js
```

## Test Scenarios

### Scenario 1: Quiz card displays quick start option
Verifies that quiz pack cards display both "Play Now" and "Customize" buttons.

### Scenario 2: Quick start launches quiz with defaults
Tests that clicking "Play Now" immediately starts the quiz without prompting for settings.

### Scenario 3: Default settings are applied on quick start
Validates that default settings are correctly applied:
- No timer
- All 3 questions per photo
- Original photo order
- Original question order

### Scenario 4: Customize button shows configuration options
Ensures the "Customize" button navigates to the settings screen.

### Scenario 5: Quick start and customize are clearly distinguished
Verifies visual distinction and accessibility of both action buttons on desktop and mobile.

### Scenario 6: Quick start works for all quiz packs
Tests that "Play Now" works consistently across multiple quiz packs.

### Scenario 7: Quick start is keyboard accessible
Validates keyboard navigation (Tab, Enter, Space) for quick start functionality.

## Regenerating Tests

If you modify `spec.md`, regenerate the tests:

```bash
# Parse spec to IR
node ../../dae_gherkin.js spec.md .build/spec.json

# Generate tests from IR
node ../../acceptance/generator.js .build/spec.json .build/generated

# Or run the full pipeline
./run-acceptance-tests.sh
```

## Test Output

- **Screenshots**: Saved to `vue-app/tests/screenshots/`
  - `acceptance-<test-name>-success.png` - Success screenshots (if enabled)
  - `acceptance-<test-name>-failure.png` - Failure screenshots
- **Console**: Detailed step execution and results

## Integration with CI/CD

These tests integrate with the project's CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Quick Start Quiz Acceptance Tests
  run: |
    cd vue-app
    yarn dev &
    sleep 5
    cd ../specs/002-quick-start-quiz
    ./run-acceptance-tests.sh
```

## Adding New Steps

To add new step handlers:

1. Edit `acceptance/stepHandlers.js`
2. Add handler to `stepHandlers` object:
   ```javascript
   'your step text here': async () => {
     // Taiko actions with system knowledge
   }
   ```
3. Regenerate tests

## Deep System Integration

The generated tests have deep knowledge of the Vue app:
- Direct DOM interaction via Taiko selectors
- State verification through UI checks
- Navigation flow validation
- Accessibility testing

This follows Uncle Bob's principle: "a strange hybrid of Cucumber and the test fixtures" - combining readable Gherkin specs with deep system integration.

## Related Features

- **001-quiz-customization**: Settings configuration feature
- **landing-page.spec.md**: Landing page basic functionality
- **quiz-pack-structure.spec.md**: Quiz pack data structure

## Support

For issues with:
- **Test failures**: Check screenshots in `vue-app/tests/screenshots/`
- **Step handler errors**: Review `acceptance/stepHandlers.js`
- **Generation errors**: Verify `spec.md` syntax and IR in `.build/spec.json`
