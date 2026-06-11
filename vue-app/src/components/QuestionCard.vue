<template>
  <div class="question-card">
    <!-- Progress Dots -->
    <div class="question-counter">
      <span
        v-for="i in totalQuestions"
        :key="i"
        class="dot"
        :class="{ active: i - 1 === questionIndex }"
      ></span>
    </div>

    <!-- Question -->
    <div class="question">
      <div class="question-text" data-testid="question-text">{{ question.text }}</div>

      <!-- Answer Options -->
      <div class="options">
        <div
          v-for="(option, index) in question.options"
          :key="index"
          class="option"
          :class="{ correct: answersRevealed && index === question.correct }"
          data-testid="option"
          :data-correct="answersRevealed && index === question.correct ? 'true' : 'false'"
        >
          {{ option }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    required: true,
  },
  questionIndex: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answersRevealed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.question-card {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100%;
  justify-content: center;
}

.question-counter {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--paper-deep);
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--accent);
  transform: scale(1.3);
}

.question {
  padding: 40px;
}

.question-text {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: var(--ink);
  line-height: 1.3;
  text-align: center;
}

.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.option {
  background: var(--surface);
  padding: 20px 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--ink);
  transition: all 0.2s ease;
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option.correct {
  background: var(--success);
  color: #fff;
  font-size: 2rem;
  box-shadow: 0 6px 20px rgba(77, 115, 64, 0.4);
  transform: scale(1.05);
}

.option.correct::after {
  content: ' ✓';
  margin-left: 15px;
  font-size: 2.2rem;
}

@media (max-width: 768px) {
  .options {
    grid-template-columns: 1fr;
  }

  .question-text {
    font-size: 1.6rem;
  }

  .option {
    font-size: 1.3rem;
  }
}
</style>
