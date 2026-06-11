<template>
  <div class="customization-container">
    <div class="customization-card">
      <header class="customization-header">
        <h1 class="title">Nastavení kvízu</h1>
        <p class="subtitle">Přizpůsobte si kvíz podle vašich potřeb</p>
      </header>

      <div class="settings-grid">
        <!-- Timer Settings -->
        <section class="setting-section">
          <h2 class="section-title">⏱️ Question Timer / Časovač otázek</h2>
          <div class="setting-control">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="settings.timerEnabled"
                class="checkbox"
              />
              <span>Enable Timer / Povolit časovač</span>
            </label>
          </div>
          <div v-if="settings.timerEnabled" class="setting-control">
            <label class="label">Timer Duration / Délka časovače:</label>
            <select v-model.number="settings.timerDuration" class="select">
              <option :value="30">30 sekund</option>
              <option :value="45">45 sekund</option>
              <option :value="60">60 sekund</option>
              <option :value="90">90 sekund</option>
              <option :value="120">120 sekund</option>
            </select>
          </div>
          <div v-if="!settings.timerEnabled" class="setting-control">
            <p class="help-text">Timer Duration: No timer (disabled)</p>
          </div>
        </section>

        <!-- Questions Per Photo -->
        <section class="setting-section">
          <h2 class="section-title">❓ Questions Per Photo / Počet otázek na fotku</h2>
          <div class="setting-control">
            <label class="label">Questions per photo / Otázek na fotku:</label>
            <select v-model.number="settings.questionsPerPhoto" class="select">
              <option :value="1">1 otázka</option>
              <option :value="2">2 otázky</option>
              <option :value="3">Všechny otázky (3) / All questions</option>
            </select>
          </div>
        </section>

        <!-- Randomization -->
        <section class="setting-section">
          <h2 class="section-title">🔀 Order Settings / Náhodné pořadí</h2>
          <div class="setting-control">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="settings.randomizePhotos"
                class="checkbox"
              />
              <span>Randomize photo order / Zamíchat pořadí fotek</span>
            </label>
          </div>
          <div class="setting-control">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="settings.randomizeQuestions"
                class="checkbox"
              />
              <span>Randomize question order / Zamíchat pořadí otázek</span>
            </label>
          </div>
        </section>

        <!-- Summary -->
        <section class="setting-section summary-section">
          <h2 class="section-title">📊 Souhrn nastavení</h2>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Časovač:</span>
              <span class="summary-value">
                {{ settings.timerEnabled ? `${settings.timerDuration}s` : 'Vypnuto' }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Otázek na fotku:</span>
              <span class="summary-value">{{ settings.questionsPerPhoto }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Zamíchané fotky:</span>
              <span class="summary-value">{{ settings.randomizePhotos ? 'Ano' : 'Ne' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Zamíchané otázky:</span>
              <span class="summary-value">{{ settings.randomizeQuestions ? 'Ano' : 'Ne' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Celkem fotek:</span>
              <span class="summary-value">{{ totalPhotos }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Celkem otázek:</span>
              <span class="summary-value">{{ totalQuestions }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <button @click="startQuiz" class="btn btn-primary">
          Start Quiz
        </button>
        <button @click="useDefaults" class="btn btn-secondary">
          Skip
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { getPackMetadata } from '@/data/quizPacks';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

// Get quiz pack ID from route or use default
const quizPackId = route.params.quizId || gameStore.selectedQuizPackId;

// Settings state
const settings = ref({
  timerEnabled: false,
  timerDuration: 60,
  questionsPerPhoto: 3,
  randomizePhotos: false,
  randomizeQuestions: false,
});

// Get metadata for summary
const metadata = computed(() => getPackMetadata(quizPackId));
const totalPhotos = computed(() => metadata.value.photoCount);
const totalQuestions = computed(() => totalPhotos.value * settings.value.questionsPerPhoto);

function startQuiz() {
  // Select quiz pack and apply settings
  gameStore.selectQuizPack(quizPackId, settings.value);
  router.push('/presenter');
}

function useDefaults() {
  // Navigate directly to presenter with default settings
  gameStore.selectQuizPack(quizPackId);
  router.push('/presenter');
}
</script>

<style scoped>
.customization-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customization-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.customization-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.setting-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  transition: border-color 0.3s ease;
}

.setting-section:hover {
  border-color: #667eea;
}

.summary-section {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-color: #667eea;
}

.section-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.setting-control {
  margin-bottom: 1rem;
}

.setting-control:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: #495057;
  user-select: none;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.select {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.select:hover,
.select:focus {
  border-color: #667eea;
  outline: none;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.summary-label {
  font-weight: 600;
  color: #495057;
}

.summary-value {
  font-weight: bold;
  color: #667eea;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #63398b 100%);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Responsive Design */
@media (max-width: 768px) {
  .customization-card {
    padding: 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .settings-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .summary-content {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
