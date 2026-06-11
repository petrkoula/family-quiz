# Quiz Customization - Acceptance Tests

This directory contains the acceptance tests for the Quiz Customization feature, following the Disciplined Agile Engineering (DAE) approach.

## Structure

```
001-quiz-customization/
├── spec.md                     # Human-readable Gherkin specification
├── run-acceptance-tests.js     # Test runner (cross-platform)
├── run-acceptance-tests.sh     # Test runner (bash)
├── run-acceptance-tests.bat    # Test runner (Windows)
└── .build/                     # Generated files (gitignored)
    ├── spec.json               # Intermediate Representation (IR)
    └── generated/              # Generated Taiko test files
        ├── 01-*.test.js
        ├── 02-*.test.js
        └── ...
```

## Pipeline Components

### 1. Parser (Portable)
- **File**: `C:\dev\quiz\dae_gherkin.js`
- **Purpose**: Parses `spec.md` (Gherkin-in-markdown) into standardized JSON IR
- **Input**: `spec.md`
- **Output**: `.build/spec.json`

### 2. Generator (Project-specific)
- **File**: `C:\dev\quiz\acceptance\generator.js`
- **Purpose**: Reads IR and generates executable Taiko tests
- **Input**: `.build/spec.json`
- **Output**: `.build/generated/*.test.js`

### 3. Step Handlers (Project-specific)
- **File**: `C:\dev\quiz\acceptance\stepHandlers.js`
- **Purpose**: Maps Gherkin steps to Taiko actions with deep system knowledge
- **Key Feature**: Each handler directly interacts with Vue app internals

### 4. Runner
- **Files**: `run-acceptance-tests.js|sh|bat`
- **Purpose**: Orchestrates the full pipeline: parse → generate → execute

## Running Tests

### Quick Start

```bash
# From feature directory
cd specs/001-quiz-customization

# Run all tests (headless)
node run-acceptance-tests.js

# Run with visible browser (for debugging)
node run-acceptance-tests.js --headed
```

### From Project Root

```bash
# Using npm scripts
npm run test:acceptance           # Headless mode
npm run test:acceptance:headed    # With visible browser
```

### Manual Steps

```bash
# 1. Parse spec to IR
node dae_gherkin.js specs/quiz-customization.spec.md specs/001-quiz-customization/.build/spec.json

# 2. Generate tests
node acceptance/generator.js specs/001-quiz-customization/.build/spec.json specs/001-quiz-customization/.build/generated

# 3. Run individual test
node specs/001-quiz-customization/.build/generated/01-access-customization-settings-from-landing-page.test.js
```

## Specification

The acceptance criteria are defined in `spec.md` using standard Gherkin syntax:

- **Feature**: Quiz Customization Settings
- **Scenarios**: 10 test scenarios covering all customization features
- **Steps**: Given/When/Then/And statements mapped to system behavior

### Example Scenario

```gherkin
### Scenario 1: Access customization settings from landing page
**Given** I am on the landing page viewing a quiz pack
**When** I click on a quiz pack card
**Then** I should see customization options before entering presenter mode
**And** I should see a "Start Quiz" button to proceed with selected settings
**And** I should see a "Skip" or "Use Defaults" option to bypass customization
```

## Step Handler Implementation

Each step's exact text is mapped to a handler function in `stepHandlers.js`:

```javascript
stepHandlers = {
  'I am on the landing page viewing a quiz pack': async () => {
    await goto(`${BASE_URL}/`);
    await waitForCondition(async () => await $('.quiz-card').exists());
  },

  'I click on a quiz pack card': async () => {
    await click($('.quiz-card'));
  },

  'I should see customization options before entering presenter mode': async () => {
    await waitForCondition(async () =>
      await text(/customization|nastavení|settings/i).exists()
    );
  },
  // ... more handlers
};
```

## Test Output

### Success
```
✓ Parsed 10 scenarios from spec.md
✓ Generated 10 test files
🚀 Running: 01-access-customization-settings-from-landing-page.test.js
  Given I am on the landing page viewing a quiz pack
  When I click on a quiz pack card
  Then I should see customization options before entering presenter mode
✅ Test passed
```

### Failure
```
❌ Test failed: Access customization settings from landing page
Error: No handler found for step: Given I am on an unknown page
📸 Screenshot saved: vue-app/tests/screenshots/acceptance-*-failure.png
```

## Integration with Existing Tests

The acceptance tests complement the existing E2E tests:

- **Existing**: `vue-app/tests/presenter.test.js` - Tests implemented presenter features
- **Acceptance**: Tests the quiz customization feature (not yet implemented)

Both use Taiko and share the same browser automation patterns.

## Prerequisites

1. **Node.js** with ES modules support (type: "module" in package.json)
2. **Taiko** installed (already in vue-app/package.json)
3. **Dev server running** on http://localhost:5173

## Development Workflow

1. **Define behavior** in `spec.md` (Gherkin scenarios)
2. **Generate IR**: `node dae_gherkin.js ...`
3. **Implement step handlers** in `stepHandlers.js` (if new steps)
4. **Generate tests**: `node acceptance/generator.js ...`
5. **Run tests**: Tests will fail (feature not implemented)
6. **Implement feature** in Vue app
7. **Verify**: Tests should pass

This is Outside-In TDD: acceptance tests define the "what", guide implementation, and verify the complete feature.

## Notes

- `.build/` directory is gitignored (generated files are ephemeral)
- `spec.md` is the source of truth (committed to git)
- Generator and step handlers are committed (project-specific code)
- Tests are generated deterministically from IR
