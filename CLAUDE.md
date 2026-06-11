# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Family Quiz is an interactive photo quiz application built with Vue 3. The app displays vintage family photos with quiz questions and supports both standalone presentation mode and planned real-time team participation via Firebase.

**Key Technologies:**
- Vue 3 (Composition API)
- Pinia (state management)
- Vue Router
- Vite (build tool)
- Taiko (E2E testing)

## Development Commands

### Setup and Development
```bash
# Install dependencies (from vue-app directory)
cd vue-app
yarn install

# Start development server (http://localhost:5173)
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Testing
```bash
# Run E2E tests (headless, for CI/CD)
yarn test:e2e
# or explicitly:
yarn test:e2e:headless

# Run E2E tests with visible browser (for debugging)
yarn test:e2e:interactive

# Note: Dev server must be running on http://localhost:5173 before running tests
```

### Code Formatting
```bash
# Format code with Prettier
yarn format

# Check formatting
yarn format:check
```

### Docker
```bash
# From root directory
docker-compose up dev    # Development with hot reload
docker-compose up prod   # Production build
```

## Architecture

### State Management (Pinia)

The app uses a single Pinia store (`gameStore.js`) that manages:
- **Photo navigation**: `currentPhotoIndex`, `nextPhoto()`, `previousPhoto()`
- **Question navigation**: `currentQuestionIndex`, `nextQuestion()`, `previousQuestion()`
- **UI state**: `questionsVisible`, `answersRevealed`
- **Quiz data**: Loaded from `quizData.js` (local-first design)

Key pattern: Photo navigation is blocked when questions are visible. Users must hide questions (SPACE or ESC) before navigating to different photos.

### Data Structure

Quiz data is defined in `vue-app/src/data/quizData.js`:
```javascript
{
  image: "filename.jpg",  // Located in /images or public/images
  questions: [
    {
      text: "Question text in Czech",
      options: ["A", "B", "C", "D"],  // 2-4 options
      correct: 0  // Zero-based index
    }
    // Exactly 3 questions per photo
  ]
}
```

### Routes

- `/` → redirects to `/presenter`
- `/presenter` → Main presentation interface (PresenterView.vue)
- `/team` → Mobile team interface (placeholder for Firebase integration)
- `/admin` → Admin dashboard (placeholder for Firebase integration)

### Presentation Flow

1. Photo displayed fullscreen (initial state)
2. SPACE → Questions panel slides in from right (photo 1/3, questions 2/3)
3. ↑↓ → Navigate between 3 questions
4. A → Reveal correct answer (green highlight with checkmark)
5. SPACE/ESC → Hide questions
6. ←→ → Navigate between photos (only when questions hidden)

### Keyboard Controls

**Always Available:**
- SPACE: Toggle questions panel
- F: Toggle fullscreen

**When Questions Hidden:**
- ←→: Previous/next photo

**When Questions Visible:**
- ↑↓: Previous/next question
- A: Reveal correct answer
- ESC: Hide questions

Navigation state is enforced in `gameStore.js` actions.

### Component Structure

- **App.vue**: Root component with router-view
- **PresenterView.vue**: Main presentation interface with keyboard handlers
- **QuestionCard.vue**: Reusable question display component
- **TeamView.vue**: Placeholder for mobile team interface
- **AdminView.vue**: Placeholder for admin dashboard

### Styling

- High-contrast colors for projector visibility
- Large fonts (2.4rem questions, 1.8rem options) for distance viewing
- Smooth animations for question panel and answer reveals
- Responsive design with viewport-relative units

## Images

Images are handled differently in development vs production:
- **Development**: Loaded from parent `/images` folder
- **Production**: Copied to `vue-app/public/images/` during build
- **GitHub Pages deployment**: Images copied automatically in CI/CD workflow

## Testing

> **Acceptance-test methodology:** see @TESTING.md — spec-first Gherkin as contract, hand-written editable Vitest tests (no codegen), selector conventions. Replaces the previous generated-Taiko (DAE) codegen pipeline, now removed.

E2E tests use Taiko (browser automation) and cover:
- Photo display and navigation
- Question panel toggling
- Question cycling
- Answer reveal functionality
- Keyboard control validation
- Navigation blocking when questions visible

Screenshots saved to `vue-app/tests/screenshots/`:
- `presenter-initial.png`
- `presenter-questions.png`
- `presenter-answer.png`
- `error.png` (on failure)

## CI/CD

GitHub Actions workflows:

**`.github/workflows/ci.yml`** (runs on PRs and pushes):
1. Prettier format check
2. Build application
3. Run E2E tests (headless)
4. Build Docker images

**`.github/workflows/deploy.yml`** (deploys to GitHub Pages):
1. Build Vue app
2. Copy images to public folder
3. Deploy to GitHub Pages

**`.github/workflows/firebase-deploy.yml`**:
- Placeholder for future Firebase deployment

## Code Style

- Vue 3 Composition API with `<script setup>` syntax
- Pinia stores use composables pattern (defineStore with arrow function)
- Path alias: `@/` maps to `src/`
- Prettier formatting enforced via git hooks (nano-staged + simple-git-hooks)
- Czech language for quiz questions

## Future Plans

Firebase integration planned for:
- Real-time team participation
- Mobile team interface
- Live scoring and leaderboard
- Admin dashboard

See `FIREBASE-DEPLOYMENT.md` for implementation details.
