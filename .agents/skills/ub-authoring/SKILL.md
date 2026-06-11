# UB Authoring Skill

## Core Purpose
This skill governs documentation authoring conventions and standards for the Family Quiz project. It establishes consistent patterns for README files, guides, and inline documentation.

## When to Apply
Use ub-authoring when:
- Creating or updating README files
- Writing user guides or deployment documentation
- Documenting API contracts or configuration options
- Creating inline code documentation

**Avoid this skill for:**
- Code implementation
- Test writing
- Configuration file generation

## Documentation Principles

### 1. Routing over Marketing
Treat descriptions as navigation metadata, not promotional content.

**Example:**
```markdown
✓ "Deploy to Firebase Hosting (serverless static hosting)"
✗ "Amazing Firebase Hosting - The Best Way to Deploy!"
```

### 2. Explicit Boundaries
Define clear non-use cases where confusion creates real costs.

**Example:**
```markdown
## When to Use Cloud Run

Use Cloud Run if you need:
- Backend API endpoints
- Server-side rendering
- Custom server logic

## When NOT to Use Cloud Run

For static Vue.js apps like Family Quiz, use Firebase Hosting instead.
```

### 3. Concrete Guidance
Prefer specific examples to abstract recommendations.

**Example:**
```markdown
✓ "Run tests: cd vue-app && npm test"
✗ "Execute the testing commands in the appropriate directory"
```

### 4. Lean Structure
Keep main documents streamlined; move detailed guidance to dedicated files.

**Example:**
```markdown
README.md           - Quick start, overview, key features
GETTING-STARTED.md  - Detailed setup instructions
DOCKER.md           - Docker-specific documentation
FIREBASE-DEPLOYMENT.md - Firebase deployment details
```

### 5. Portability First
Ensure documentation works across different environments and setups.

**Example:**
```markdown
✓ "cd vue-app && npm run dev"
✗ "C:\Users\John\Projects\quiz\vue-app> npm run dev"
```

## Required Documentation Elements

### README Files
Each README should include:
- **Purpose statement** — What this is and why it exists
- **Quick start** — Fastest path to running/using it
- **Key features** — 3-5 bullet points of main capabilities
- **Usage examples** — Concrete commands or code snippets
- **Navigation** — Links to detailed guides

### Setup Guides
Setup documentation must include:
- **Prerequisites** — Required tools and versions
- **Installation steps** — Numbered, sequential, complete
- **Verification** — How to confirm it worked
- **Troubleshooting** — Common issues and fixes
- **Next steps** — Where to go after setup

### API Documentation
When documenting code APIs:
- **Function signature** with types
- **Parameters** with descriptions and constraints
- **Return value** with type and meaning
- **Example usage** with realistic scenario
- **Edge cases** if applicable

**Example:**
```javascript
/**
 * Navigate to the next photo in the quiz
 *
 * @returns {void}
 * @throws {Error} if already at last photo
 *
 * @example
 * gameStore.nextPhoto()
 */
nextPhoto() {
  if (this.currentPhotoIndex < quizData.length - 1) {
    this.currentPhotoIndex++
  } else {
    throw new Error('Already at last photo')
  }
}
```

## Family Quiz Documentation Standards

### File Organization
```
README.md                  - Main project overview
GETTING-STARTED.md         - Beginner's setup guide
DOCKER.md                  - Docker usage
FIREBASE-DEPLOYMENT.md     - Firebase deployment
CHANGELOG.md               - Version history
PRD.md                     - Product requirements
AGENTS.md                  - Agent settings (this file)
vue-app/README.md          - Vue.js specific docs
vue-app/tests/README.md    - Testing documentation
```

### README Structure Template
```markdown
# Project Title

Brief description (1-2 sentences)

## Features
- Key feature 1
- Key feature 2
- Key feature 3

## Quick Start

### Option 1: Docker (Recommended)
```bash
docker-compose up dev
```

### Option 2: Node.js
```bash
cd vue-app && npm install && npm run dev
```

## Documentation
- [Getting Started](GETTING-STARTED.md)
- [Docker Guide](DOCKER.md)
- [Deployment](FIREBASE-DEPLOYMENT.md)

## License
MIT
```

### Code Comments
- **When to comment:** Complex logic, non-obvious decisions, workarounds
- **When NOT to comment:** Self-explanatory code, variable names, obvious operations

**Example:**
```javascript
// ✓ Good: Explains WHY
// ESC key hides questions if visible, otherwise exits fullscreen
if (event.key === 'Escape') {
  if (questionsVisible.value) {
    hideQuestions()
  } else {
    exitFullscreen()
  }
}

// ✗ Bad: Explains WHAT (already obvious)
// Increment the photo index by one
this.currentPhotoIndex++
```

### Markdown Standards
- Use `#` for headings (not underlines)
- Use fenced code blocks with language hints
- Use tables for structured comparisons
- Use numbered lists for sequences
- Use bullet lists for collections
- Keep line length reasonable (80-120 chars)

### Version Documentation
When documenting versions:
- Reference package.json as source of truth
- Provide minimum version requirements
- Note breaking changes explicitly
- Include upgrade paths

**Example:**
```markdown
## Requirements

- Node.js 14.0 or higher
- Vue 3.4+ (current: 3.4.0)
- Vite 5.0+ (current: 5.0.8)

See `vue-app/package.json` for exact versions.
```

## Validation Checklist

Before finalizing documentation:

✓ Purpose is clear in first paragraph
✓ Quick start works from clean state
✓ All code examples are tested
✓ File paths are relative and portable
✓ Links are valid and not broken
✓ Commands include working directory context
✓ Screenshots are up-to-date
✓ Version numbers reference package.json
✓ Troubleshooting covers common issues

## Output Format

When creating documentation, structure as:

1. **Lead with the answer** — Don't bury key information
2. **Use informative headings** — Enable scanning
3. **Short paragraphs** — 2-4 sentences max
4. **Code blocks** — Always include language hint
5. **Examples before explanations** — Show, then tell
6. **Progressive detail** — Overview → Details → Advanced
