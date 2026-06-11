<template>
  <div class="presenter-container" :class="{ fullscreen: isFullscreen }">
    <!-- Progress Bar -->
    <div class="progress-bar">
      <span class="progress-text" data-testid="photo-progress"
        >Foto {{ currentPhotoIndex + 1 }} / {{ totalPhotos }}</span
      >
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Photo Container -->
      <div class="photo-container" :class="{ 'with-questions': questionsVisible }">
        <img
          v-if="currentQuiz"
          :src="getImageUrl(currentQuiz.image)"
          :alt="`Photo ${currentPhotoIndex + 1}`"
          :data-image="currentQuiz.image"
          data-testid="photo-image"
          class="photo"
          loading="lazy"
        />
      </div>

      <!-- Questions Container -->
      <transition name="slide">
        <div v-if="questionsVisible" class="questions-container" data-testid="questions-panel">
          <QuestionCard
            :question="currentQuestion"
            :questionIndex="currentQuestionIndex"
            :totalQuestions="totalQuestions"
            :answersRevealed="answersRevealed"
          />
        </div>
      </transition>
    </div>

    <!-- Controls Hint -->
    <div class="controls-hint">
      <span class="hint-text" data-testid="controls-hint">{{ controlsHintText }}</span>
      <span class="navigation-hint">
        ← → Fotky | ↑ ↓ Otázky | <span data-testid="help-hint">? Nápověda</span>
      </span>
    </div>

    <!-- Keyboard Help Overlay -->
    <transition name="fade">
      <div
        v-if="helpVisible"
        class="help-overlay"
        data-testid="help-overlay"
        @click="helpVisible = false"
      >
        <div class="help-card">
          <h2 class="help-title">Klávesové zkratky</h2>
          <dl class="help-list">
            <div class="help-row">
              <dt>Mezerník</dt>
              <dd>Zobrazit / skrýt otázky</dd>
            </div>
            <div class="help-row">
              <dt>← →</dt>
              <dd>Předchozí / další foto</dd>
            </div>
            <div class="help-row">
              <dt>↑ ↓</dt>
              <dd>Předchozí / další otázka</dd>
            </div>
            <div class="help-row">
              <dt>A</dt>
              <dd>Odhalit správnou odpověď</dd>
            </div>
            <div class="help-row">
              <dt>F</dt>
              <dd>Celá obrazovka</dd>
            </div>
            <div class="help-row">
              <dt>ESC</dt>
              <dd>Skrýt otázky / zavřít nápovědu</dd>
            </div>
            <div class="help-row">
              <dt>?</dt>
              <dd>Tato nápověda</dd>
            </div>
          </dl>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/gameStore';
import { getImageUrl } from '@/data/quizData';
import QuestionCard from '@/components/QuestionCard.vue';

const gameStore = useGameStore();
const {
  currentPhotoIndex,
  currentQuestionIndex,
  questionsVisible,
  answersRevealed,
  currentQuiz,
  currentQuestion,
  totalPhotos,
  totalQuestions,
} = storeToRefs(gameStore);

const isFullscreen = ref(false);
const helpVisible = ref(false);

const controlsHintText = computed(() => {
  if (questionsVisible.value) {
    return 'Mezerník skryje | ↑↓ Otázky | A Odpovědi';
  }
  return 'Mezerník zobrazí otázky | F pro celou obrazovku';
});

// Keyboard event handler
function handleKeyPress(e) {
  switch (e.key) {
    case ' ':
      e.preventDefault();
      gameStore.toggleQuestions();
      break;
    case 'ArrowRight':
      e.preventDefault();
      gameStore.nextPhoto();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      gameStore.previousPhoto();
      break;
    case 'ArrowDown':
      e.preventDefault();
      gameStore.nextQuestion();
      break;
    case 'ArrowUp':
      e.preventDefault();
      gameStore.previousQuestion();
      break;
    case 'a':
    case 'A':
      e.preventDefault();
      gameStore.revealAnswer();
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleFullscreen();
      break;
    case '?':
      e.preventDefault();
      helpVisible.value = !helpVisible.value;
      break;
    case 'Escape':
      if (helpVisible.value) {
        helpVisible.value = false; // help closes first, nothing else changes
      } else if (questionsVisible.value) {
        gameStore.hideQuestions();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      break;
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
/* Projekce: teplá tma, ať vyniknou fotky; panel otázek je papír (tokens). */
.presenter-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #2a2018;
  padding: 20px;
}

.progress-bar {
  text-align: right;
  padding: 10px 20px;
  color: #e8ddcc;
  font-size: 1.2rem;
  font-weight: 600;
}

.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 20px;
  overflow: hidden;
  min-height: 0;
}

.photo-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1812;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.4s ease;
}

.photo-container.with-questions {
  flex: 0 0 33.33%;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.questions-container {
  flex: 0 0 66.67%;
  background: var(--canvas);
  border-radius: var(--radius-lg);
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.controls-hint {
  text-align: center;
  padding: 15px;
  color: #e8ddcc;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint-text {
  font-weight: 600;
  background: rgba(232, 221, 204, 0.14);
  padding: 8px 16px;
  border-radius: var(--radius);
}

.navigation-hint {
  font-weight: 500;
}

/* Keyboard Help Overlay */
.help-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: pointer;
}

.help-card {
  background: var(--surface);
  color: var(--ink);
  border-radius: var(--radius-lg);
  padding: 2.5rem 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  min-width: 420px;
}

.help-title {
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--ink);
}

.help-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
}

.help-row {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
}

.help-row dt {
  flex: 0 0 7.5rem;
  font-weight: 600;
  font-size: 1.2rem;
  background: var(--field-fill);
  border-radius: var(--radius);
  padding: 0.3rem 0.7rem;
  text-align: center;
}

.help-row dd {
  margin: 0;
  font-size: 1.15rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
