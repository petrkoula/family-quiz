# UB VueJS Skill

## Purpose
This skill enforces Vue core best practices for modern, stable releases. It applies to SFCs, reactivity, props/emits contracts, template patterns, and Vue architecture in Vite projects.

## Scope Boundaries
**Use this skill for:** Vue component and composable authoring, Vite-based Vue projects where Vue authoring is the primary concern.

**Do not use for:** Plain CSS architecture, Docker configuration, Firebase deployment, or E2E testing patterns (these have their own domains).

## Core Workflow

1. **Detect environment:** Extract Vue version from `package.json` and lockfiles.
2. **Confirm scope:** Verify the task is Vue-core focused.
3. **Compare sources:** Align official Vue guidance with repo reality.
4. **Surface conflicts:** Flag when authoritative sources materially disagree.
5. **Implement modern patterns:** Use Composition API, `<script setup>`, reactive state.
6. **Reject legacy:** Never generate Options API, mixins, or class-style components.
7. **Validate:** Run build and tests to confirm changes work.

## Implementation Rules

### Code Structure
- **Default to:** `<script setup>` in all SFCs.
- **Reactivity API:** Composition API exclusively; no Options API.
- **Component contracts:** Use `defineProps()` and `defineEmits()` with TypeScript when possible.
- **Store integration:** Pinia stores with Composition API pattern.

**Example:**
```vue
<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const currentPhoto = computed(() => gameStore.currentPhoto)
</script>
```

### Reactivity & State Management
- Use `ref()` for primitive reactivity, `reactive()` for objects
- Computed properties for derived state
- Watch with getter sources, never watch values directly
- Pinia stores for shared state across components

**Example:**
```javascript
// ✓ Correct
const count = ref(0)
const doubled = computed(() => count.value * 2)

// ✗ Incorrect
let count = 0
let doubled = count * 2
```

### Component Patterns
- **Single File Components:** One component per file
- **Props validation:** Define prop types explicitly
- **Event naming:** Use kebab-case for custom events
- **Slots:** Named slots for flexible composition

**Example:**
```vue
<script setup>
const props = defineProps({
  photo: {
    type    : Object,
    required: true
  },
  index: {
    type    : Number,
    required: true
  }
})

const emit = defineEmits(['photo-change', 'question-toggle'])
</script>
```

### Performance
- Use `v-show` for frequent toggles, `v-if` for conditional rendering
- Apply `key` attribute in `v-for` loops
- Lazy load components with `defineAsyncComponent()`
- Avoid deep reactivity when unnecessary

### Router Integration
- Use Vue Router 4 with Composition API
- Route guards for navigation control
- Lazy-loaded route components

**Example:**
```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path     : '/presenter',
    name     : 'Presenter',
    component: () => import('./views/Presenter.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

## Legacy Handling

**Hard constraints:** No Options API, mixins, filters, `this`-centric logic, or class components in new code.

**Migration path:** When touching legacy code:
1. Document the legacy pattern found
2. Propose Composition API equivalent
3. Get approval before full migration
4. Test thoroughly after migration

## Version & Research Policy

- **Target:** Latest stable Vue release (currently Vue 3.4+)
- **Detect:** Actual installed version from `package.json`
- **Verify:** Use web search for current best practices
- **Authority hierarchy:** Official Vue docs > Community patterns
- **Gap disclosure:** Note version gaps and recommend upgrades

## Output Checklist

When generating or reviewing code, include:

1. **Environment:** Detected Vue version and tooling
2. **Pattern rationale:** Which modern APIs were chosen and why
3. **Legacy disclosure:** Patterns removed or retained with justification
4. **Validation results:** Build and test outcomes

## Project-Specific Vue Standards

### Family Quiz Application

**Store Architecture:**
- Single game store (`gameStore.js`) manages quiz state
- State: `currentPhotoIndex`, `currentQuestionIndex`, `questionsVisible`
- Actions: `nextPhoto()`, `previousPhoto()`, `toggleQuestions()`, etc.
- Getters: `currentPhoto`, `currentQuestion`, `hasNextPhoto`, etc.

**Component Organization:**
```
components/
  PhotoDisplay.vue      - Displays current photo
  QuestionPanel.vue     - Shows questions with animations
  ProgressDots.vue      - Question progress indicator
  KeyboardHints.vue     - Context-aware keyboard controls
```

**Reactive Patterns:**
- Keyboard navigation via `@keydown` event listeners
- Fullscreen API integration with reactive state
- CSS transitions controlled by reactive visibility flags

**Router Configuration:**
- Hash-based routing for GitHub Pages compatibility
- Routes: `/presenter`, `/team`, `/admin`
- Lazy-loaded route components

**Data Flow:**
```
quizData.js (static) → gameStore (reactive) → Components (computed)
```

**Event Handling:**
- Centralized keyboard handler in Presenter view
- Context-aware controls (arrows for photos vs. questions)
- Fullscreen toggle with ESC key handling

## Common Patterns in This Project

### Photo Navigation
```javascript
const nextPhoto = () => {
  if (!questionsVisible.value) {
    gameStore.nextPhoto()
  }
}
```

### Question Display
```javascript
const currentQuestion = computed(() => {
  const photo = gameStore.currentPhoto
  return photo?.questions[gameStore.currentQuestionIndex]
})
```

### Keyboard Controls
```javascript
const handleKeydown = (event) => {
  switch (event.key) {
    case ' ':
      gameStore.toggleQuestions()
      break
    case 'ArrowRight':
      if (!questionsVisible.value) nextPhoto()
      break
    // ... more cases
  }
}
```
