<template>
  <div class="admin-container">
    <header>
      <h1>🎯 Photo Quiz - Admin Panel</h1>
    </header>

    <div class="admin-content">
      <!-- Current Question Info -->
      <div class="card current-question">
        <div class="status-badge" :class="questionsVisible ? 'active' : 'waiting'">
          {{ questionsVisible ? '✅ Otázka aktivní' : 'Čeká se na otázku' }}
        </div>
        <h3>{{ currentQuestion?.text || '-' }}</h3>
        <p>
          <strong>Fotka:</strong> {{ currentPhotoIndex + 1 }} / {{ totalPhotos }} |
          <strong>Otázka:</strong> {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
        </p>
      </div>

      <!-- Teams Leaderboard (Placeholder) -->
      <div class="card">
        <h2>🏆 Žebříček týmů</h2>
        <div class="no-data">
          Připojení týmů se zobrazí po integraci s Firebase
        </div>
      </div>

      <!-- Current Responses (Placeholder) -->
      <div class="card">
        <h2>📝 Odpovědi na aktuální otázku</h2>
        <div class="no-data">
          Odpovědi týmů se zobrazí po integraci s Firebase
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f7fafc;
  padding: 20px;
}

header {
  max-width: 1400px;
  margin: 0 auto 20px;
}

h1 {
  color: #1a202c;
  font-size: 2rem;
}

.admin-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.current-question {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.current-question h3 {
  margin: 10px 0;
  font-size: 1.5rem;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.waiting {
  background: #fef3c7;
  color: #92400e;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #a0aec0;
  font-style: italic;
}

@media (min-width: 768px) {
  .admin-content {
    grid-template-columns: 1fr 1fr;
  }

  .current-question {
    grid-column: 1 / -1;
  }
}
</style>
