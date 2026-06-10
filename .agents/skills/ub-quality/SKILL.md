# UB-Quality Skill

## Core Purpose

UB-Quality is a companion skill that enforces code quality, formatting, and documentation standards alongside primary implementation skills. It applies when users need code review, repo scanning, maintainability feedback, or clearer structural responses.

## Mandatory Baseline Rules

### Code Formatting with Prettier

All code must be formatted using Prettier with the project's configuration:

**Workflow:**
1. **NEVER manually format code** - Always use Prettier
2. **After writing/editing code** - Run `npm run format` or `prettier --write <file>`
3. **Before committing** - Verify formatting with `npm run format:check`
4. **Prettier handles** - Indentation, spacing, line breaks, quotes, semicolons

**Example:**
```javascript
// Prettier formats this automatically
export const quizData = [
  {
    image: "IMG_4246_1.jpg",
    questions: [
      {
        text: "Který módní prvek křičí '70. léta cool'?",
        options: ["Kožená bunda", "Zvonové kalhoty"],
        correct: 0,
      },
    ],
  },
];
```

**Agent responsibilities:**
- Write clean, readable code
- Run Prettier after code changes
- Never manually adjust spacing, indentation, or alignment
- Trust Prettier's formatting decisions

## Decision Analysis Baseline

- Surface 2–4 plausible approaches with concise pros/cons and a recommendation.
- If only one path is meaningful, state that explicitly rather than fabricating alternatives.

## Readability Baseline

- Lead with the answer or recommendation.
- Use informative headings, short paragraphs, bullets for collections, numbered steps for sequences.
- Keep list items parallel in grammar and intent.
- Use tables only for compact multi-attribute comparisons; convert to fallback structures if too wide or dense.

## Non-Compliance

- Committing code without running Prettier
- Manually formatting code instead of using Prettier
- Skipping `npm run format` after code changes
- Overriding Prettier configuration without team discussion
- Mixing formatted and unformatted code in same commit

## Output Requirements

1. Include pros/cons and recommendations for meaningful choices.
2. Keep solutions simple; avoid overengineering.
3. Preserve existing behavior unless explicitly requested.
4. Flag intentionally retained technical debt.
5. Favor high-signal documentation over broad narration.
6. Match structure to information shape.

## Completion Gate

Before completing any code task:
1. Run Prettier on all modified files
2. Verify no formatting errors with `npm run format:check`
3. Ensure user-facing responses expose answers early with appropriate structure for scanability
4. Confirm code changes preserve existing behavior unless explicitly requested

## Project-Specific Quality Standards

### Family Quiz Application

**Code Organization:**
- One component per file
- Clear separation of concerns (data, components, views, stores)
- E2E tests mirror user workflows

**Naming Conventions:**
- Components: PascalCase (e.g., `QuestionPanel.vue`)
- Composables: camelCase with `use` prefix (e.g., `useGameStore`)
- Constants: UPPER_SNAKE_CASE for magic numbers
- Files: kebab-case for assets, PascalCase for components

**Documentation Requirements:**
- All quiz data entries must have descriptive image filenames
- Complex keyboard navigation logic requires inline comments
- Public API methods require JSDoc comments
- README files in each major directory

**Testing Standards:**
- E2E tests must cover complete user workflows
- Tests must be idempotent and independent
- Screenshot on failure for visual debugging
- Tests run headless in CI, interactive for debugging
