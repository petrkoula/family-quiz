# UB-Quality Skill

## Core Purpose

UB-Quality is a companion skill that enforces code quality, formatting alignment, and documentation standards alongside primary implementation skills. It applies when users need code review, repo scanning, maintainability feedback, or clearer structural responses.

## Mandatory Baseline Rules

### Separator Column Alignment

All vertical separator blocks must align separators into a single column using the longest-left-token rule:

**Correct:**
```javascript
export const quizData = [
  {
    image     : "IMG_4246_1.jpg",
    questions : [
      {
        text    : "Který módní prvek křičí '70. léta cool'?",
        options : ["Kožená bunda", "Zvonové kalhoty", "Boty na platformě", "Disco koule"],
        correct : 0
      }
    ]
  }
]
```

**Incorrect:**
```javascript
export const quizData = [
  {
    image: "IMG_4246_1.jpg",
    questions: [
      {
        text: "Který módní prvek křičí '70. léta cool'?",
        options: ["Kožená bunda", "Zvonové kalhoty", "Boty na platformě", "Disco koule"],
        correct: 0
      }
    ]
  }
]
```

This applies across code, configs, comments, docstrings, markup, and documentation when structures are eligible.

### Native Language Treatment

Embedded `<style>` and `<script>` blocks must be formatted as native CSS and JavaScript, not generic HTML.

**Correct:**
```vue
<style scoped>
.presenter {
  display         : flex;
  flex-direction  : column;
  align-items     : center;
  justify-content : center;
}
</style>
```

**Incorrect:**
```vue
<style scoped>
.presenter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
```

## Decision Analysis Baseline

- Surface 2–4 plausible approaches with concise pros/cons and a recommendation.
- If only one path is meaningful, state that explicitly rather than fabricating alternatives.

## Readability Baseline

- Lead with the answer or recommendation.
- Use informative headings, short paragraphs, bullets for collections, numbered steps for sequences.
- Keep list items parallel in grammar and intent.
- Use tables only for compact multi-attribute comparisons; convert to fallback structures if too wide or dense.

## Non-Compliance

- Separator blocks without single-column alignment in touched regions.
- Value-column alignment instead of separator-column alignment.
- Unformatted embedded CSS/JS when content is eligible.
- Skipping alignment for convenience or local style preference.
- Normalizing unrelated blocks outside touched scope.

## Output Requirements

1. Include pros/cons and recommendations for meaningful choices.
2. Keep solutions simple; avoid overengineering.
3. Preserve existing behavior unless explicitly requested.
4. Flag intentionally retained technical debt.
5. Favor high-signal documentation over broad narration.
6. Match structure to information shape.

## Completion Gate

Verify all touched eligible separator blocks are aligned, embedded language blocks are native-formatted, dense structures are expanded one-per-line, no unrelated blocks are normalized, and user-facing responses expose answers early with appropriate structure for scanability.

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
