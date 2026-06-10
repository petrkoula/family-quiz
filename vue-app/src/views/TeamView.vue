<template>
  <div class="team-container">
    <!-- Registration Form -->
    <div v-if="!isRegistered" class="registration-card card">
      <h1>🎯 Family Quiz</h1>
      <p class="subtitle">Připojte se k quiz!</p>

      <input
        v-model="teamName"
        type="text"
        class="team-input"
        placeholder="Jméno týmu"
        maxlength="30"
        @keyup.enter="registerTeam"
      />

      <button
        class="button button-primary"
        @click="registerTeam"
        :disabled="!teamName.trim()"
      >
        Připojit se
      </button>
    </div>

    <!-- Quiz Interface -->
    <div v-else class="quiz-interface">
      <!-- Team Info Card -->
      <div class="card team-info">
        <h1>🎯 Family Quiz</h1>
        <div class="score">Skóre: <span>{{ teamScore }}</span></div>
        <p class="team-name-display">Tým: <strong>{{ teamName }}</strong></p>
      </div>

      <!-- Question Card -->
      <div class="card question-card">
        <div v-if="!questionsVisible" class="status waiting">
          ⏳ Čekáme na další otázku...
        </div>

        <div v-else class="question-content">
          <div class="photo-info">
            Fotka {{ currentPhotoIndex + 1 }} / {{ totalPhotos }}
          </div>

          <!-- Progress Dots -->
          <div class="progress-dots">
            <span
              v-for="i in totalQuestions"
              :key="i"
              class="dot"
              :class="{ active: i - 1 === currentQuestionIndex }"
            ></span>
          </div>

          <div class="question-text">{{ currentQuestion.text }}</div>

          <!-- Answer Options -->
          <div class="answer-options">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option-btn"
              :class="{ selected: selectedAnswer === index }"
              @click="selectAnswer(index)"
            >
              {{ option }}
            </button>
          </div>

          <button
            class="button button-primary submit-btn"
            @click="submitAnswer"
            :disabled="selectedAnswer === null || answerSubmitted"
          >
            {{ answerSubmitted ? '✓ Odpověď odeslána!' : 'Odeslat odpověď' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const {
  currentPhotoIndex,
  currentQuestionIndex,
  questionsVisible,
  currentQuestion,
  totalPhotos,
  totalQuestions
} = storeToRefs(gameStore)

const isRegistered = ref(false)
const teamName = ref('')
const teamScore = ref(0)
const selectedAnswer = ref(null)
const answerSubmitted = ref(false)

function registerTeam() {
  if (!teamName.value.trim()) return

  isRegistered.value = true
  // In production, this would send to Firebase
  console.log('Team registered:', teamName.value)
}

function selectAnswer(index) {
  if (answerSubmitted.value) return
  selectedAnswer.value = index
}

function submitAnswer() {
  if (selectedAnswer.value === null || answerSubmitted.value) return

  answerSubmitted.value = true
  // In production, send answer to Firebase
  console.log('Answer submitted:', selectedAnswer.value)

  // Check if correct (for demo purposes)
  if (selectedAnswer.value === currentQuestion.value.correct) {
    teamScore.value++
  }
}

// Reset answer when question changes
watch([currentPhotoIndex, currentQuestionIndex], () => {
  selectedAnswer.value = null
  answerSubmitted.value = false
})

// Reset when questions hide
watch(questionsVisible, (visible) => {
  if (!visible) {
    selectedAnswer.value = null
    answerSubmitted.value = false
  }
})
</script>

<style scoped>
.team-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.registration-card {
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
}

h1 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  margin-bottom: 20px;
}

.team-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.button:disabled {
  background: #cbd5e0 !important;
  cursor: not-allowed;
}

.button-primary {
  background: #667eea;
  color: white;
}

.button-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.quiz-interface {
  max-width: 600px;
  margin: 0 auto;
}

.team-info {
  text-align: center;
}

.score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin: 10px 0;
}

.team-name-display {
  color: #666;
  margin-top: 10px;
}

.question-card {
  min-height: 400px;
}

.status {
  text-align: center;
  padding: 40px 20px;
  font-size: 1.2rem;
  color: #666;
}

.status.waiting {
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-weight: 600;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.photo-info {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e0;
  transition: all 0.3s ease;
}

.dot.active {
  background: #667eea;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
}

.question-text {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a202c;
  text-align: center;
  line-height: 1.4;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  padding: 15px;
  background: white;
  border: 3px solid #cbd5e0;
  color: #1a202c;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.option-btn:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.option-btn.selected {
  background: #667eea;
  color: white;
  border-color: #5568d3;
}

.submit-btn {
  margin-top: 10px;
}
</style>
