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
      <span class="navigation-hint">← → Fotky | ↑ ↓ Otázky</span>
    </div>
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
    case 'Escape':
      if (questionsVisible.value) {
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
.presenter-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.progress-bar {
  text-align: right;
  padding: 10px 20px;
  color: white;
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
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.controls-hint {
  text-align: center;
  padding: 15px;
  color: white;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint-text {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 6px;
}

.navigation-hint {
  font-weight: 500;
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
