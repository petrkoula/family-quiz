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
      <div class="question-text">{{ question.text }}</div>

      <!-- Answer Options -->
      <div class="options">
        <div
          v-for="(option, index) in question.options"
          :key="index"
          class="option"
          :class="{ correct: answersRevealed && index === question.correct }"
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
    required: true
  },
  questionIndex: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answersRevealed: {
    type: Boolean,
    default: false
  }
})
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
  background: #cbd5e0;
  transition: all 0.3s ease;
}

.dot.active {
  background: #667eea;
  transform: scale(1.3);
  box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
}

.question {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 12px;
  border-left: 8px solid #667eea;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #1a202c;
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
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  border: 4px solid #cbd5e0;
  font-size: 1.8rem;
  font-weight: 600;
  transition: all 0.2s ease;
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option.correct {
  background: #48bb78;
  color: white;
  border-color: #38a169;
  font-size: 2rem;
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.5);
  transform: scale(1.05);
}

.option.correct::after {
  content: " ✓";
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
