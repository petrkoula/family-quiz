# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Family Quiz is an interactive photo quiz application built with Vue 3. The app displays vintage family photos with quiz questions and supports both standalone presentation mode and planned real-time team participation via Firebase.

**Key Technologies:**
- Vue 3 (Composition API)
- Pinia (state management)
- Vue Router
- Vite (build tool)
- Vitest + @testing-library/vue (jsdom testing)

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
# Unified runner (see TESTING.md): exit 0 = green; on failure read the
# printed test-results/<suite>.failures.txt instead of parsing terminal output
yarn test                                  # all suites (parallel)
yarn test tests/quiz-card-reload.spec.js   # one suite

# Watch mode while developing
yarn test:unit:watch
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

- **Design system "rodinné album"**: token spec in `design/tokens.md`, binding
  do/don't rules in `design/taste.md` — read both before touching any UI.
  Tokens live in code as CSS vars (`src/style.css`) + Naive UI overrides
  (`src/theme.js`, exports `themeName`). All views are on album tokens;
  Presenter keeps its bespoke fullscreen layout (dark stage), token colors only.
- Design screenshots: `yarn screenshots [label]` → `screenshots/<themeName>/`
  (flat, fixed shot names) for file-against-file design comparison.
- High-contrast colors for projector visibility (presenter)
- Large fonts (2.4rem questions, 1.8rem options) for distance viewing
- Smooth animations for question panel and answer reveals
- Responsive design with viewport-relative units

## Images & Quiz Library

Photos live in the repo root as **one folder per quiz pack**: `images/<pack-id>/*.jpg`.
The folder structure IS the library (see `specs/quiz-library-sync.spec.md` and
`specs/quiz-pack-structure.spec.md`):

- **Dev**: `scripts/photo-catalog-plugin.mjs` (wired in vite.config.js) serves
  `/images/*` straight from the root folder and exposes `/__catalog` endpoints
  that list folders **at request time** (docker fallback: `public/images` mount).
- **Library state** is remembered in localStorage (`src/data/libraryStorage.js`)
  and changes **only on explicit reload**: per-card ↻ Reload syncs one pack's
  photos; „Obnovit knihovnu" full-syncs the pack list and all photos. First
  visit (no remembered state) populates from current folders.
- **Questions**: `quizData.js` acts as a question bank matched by photo
  filename; photos without known questions get placeholder questions (no
  correct answer) until an author fills them in.
- **Swap point for a hosted store** (Google DB / Google Photos planned):
  `setPhotoCatalogSource` / `setPackCatalogSource` in `src/data/photoCatalog.js`.
- **Production**: images copied to `vue-app/public/images/` during deploy;
  catalog endpoints don't exist there, so reloads report "no changes" until
  the hosted store lands.

## Testing

> **Acceptance-test methodology:** see @TESTING.md — spec-first Gherkin as contract, hand-written editable tests (no codegen), selector conventions.

Tests run on **Vitest + @testing-library/vue in jsdom** (no browser, no dev server).
Selectors live in a page-object layer under `vue-app/tests/support/` and target
accessible role/name or `data-testid` — never CSS classes or text regex.

Specs in `specs/*.spec.md` are the contracts; each implemented scenario maps to an
editable `*.spec.js` test:
- `tests/presenter.spec.js` — photo/question navigation, reveal, navigation blocking
- `tests/landing-page.spec.js` — quiz library cards, metadata, navigation
- `tests/quick-start-quiz.spec.js` — Play Now / Customize from a card
- `tests/customization.spec.js` — timer, questions-per-photo, summary, Start/Skip
- `tests/quiz-card-reload.spec.js` — reload a pack from current photo files (placeholder questions for new photos)
- `tests/quiz-library-sync.spec.js` — library from photo folders, localStorage cache, full sync
- `tests/photo-catalog-plugin.spec.js` — folder→pack listing rules (node env)

Run via the unified runner: `yarn test [tests/<suite>.spec.js]` —
exit 0 = green; on failure read the printed `test-results/<suite>.failures.txt`.

## CI/CD

GitHub Actions workflows:

**`.github/workflows/ci.yml`** (runs on PRs and pushes):
1. Prettier format check
2. Build application
3. Run tests (`yarn test:unit`, jsdom; dedicated CI report format planned)
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
