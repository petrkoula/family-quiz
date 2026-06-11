<template>
  <div class="customize-page">
    <n-card class="customize-card" :bordered="false">
      <header class="customize-header">
        <h1 class="title">Nastavení kvízu</h1>
        <p class="subtitle">Přizpůsobte si kvíz podle vašich potřeb</p>
      </header>

      <div class="settings">
        <!-- Timer -->
        <section class="group">
          <h2 class="group-title">Časovač otázek</h2>
          <div class="row">
            <span class="row-label">Povolit časovač</span>
            <n-switch
              v-model:value="settings.timerEnabled"
              aria-label="Enable Timer / Povolit časovač"
            />
          </div>
          <div v-if="settings.timerEnabled" class="row">
            <span class="row-label">Délka časovače</span>
            <select
              v-model.number="settings.timerDuration"
              class="field-select"
              data-testid="timer-duration"
            >
              <option :value="30">30 sekund</option>
              <option :value="45">45 sekund</option>
              <option :value="60">60 sekund</option>
              <option :value="90">90 sekund</option>
              <option :value="120">120 sekund</option>
            </select>
          </div>
        </section>

        <!-- Questions per photo -->
        <section class="group">
          <h2 class="group-title">Otázky na fotku</h2>
          <div class="row">
            <span class="row-label">Počet otázek</span>
            <select
              v-model.number="settings.questionsPerPhoto"
              class="field-select"
              data-testid="questions-per-photo"
            >
              <option :value="1">1 otázka</option>
              <option :value="2">2 otázky</option>
              <option :value="3">Všechny (3)</option>
            </select>
          </div>
        </section>

        <!-- Order -->
        <section class="group">
          <h2 class="group-title">Pořadí</h2>
          <div class="row">
            <span class="row-label">Zamíchat pořadí fotek</span>
            <n-switch
              v-model:value="settings.randomizePhotos"
              aria-label="Randomize photo order / Zamíchat pořadí fotek"
            />
          </div>
          <div class="row">
            <span class="row-label">Zamíchat pořadí otázek</span>
            <n-switch
              v-model:value="settings.randomizeQuestions"
              aria-label="Randomize question order / Zamíchat pořadí otázek"
            />
          </div>
        </section>

        <!-- Summary -->
        <section class="group summary">
          <h2 class="group-title">Souhrn</h2>
          <dl class="summary-grid">
            <div class="summary-item">
              <dt>Časovač</dt>
              <dd data-testid="summary-timer">
                {{ settings.timerEnabled ? `${settings.timerDuration}s` : 'Vypnuto' }}
              </dd>
            </div>
            <div class="summary-item">
              <dt>Otázek na fotku</dt>
              <dd>{{ settings.questionsPerPhoto }}</dd>
            </div>
            <div class="summary-item">
              <dt>Zamíchané fotky</dt>
              <dd>{{ settings.randomizePhotos ? 'Ano' : 'Ne' }}</dd>
            </div>
            <div class="summary-item">
              <dt>Zamíchané otázky</dt>
              <dd>{{ settings.randomizeQuestions ? 'Ano' : 'Ne' }}</dd>
            </div>
            <div class="summary-item">
              <dt>Celkem fotek</dt>
              <dd>{{ totalPhotos }}</dd>
            </div>
            <div class="summary-item">
              <dt>Celkem otázek</dt>
              <dd data-testid="summary-total-questions">{{ totalQuestions }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div class="actions">
        <n-button type="primary" size="large" @click="startQuiz">Start Quiz</n-button>
        <n-button quaternary size="large" @click="useDefaults">Skip</n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NCard, NSwitch, NButton } from 'naive-ui';
import { useGameStore } from '@/stores/gameStore';
import { usePackLibraryStore } from '@/stores/packLibraryStore';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();
const library = usePackLibraryStore();

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

// Get metadata for summary (from the possibly synced/reloaded library)
const metadata = computed(() => library.metadata(quizPackId));
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
.customize-page {
  min-height: 100vh;
  background: var(--canvas);
  padding: 3rem 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.customize-card {
  max-width: 720px;
  width: 100%;
  box-shadow: var(--shadow-soft);
}

.customize-header {
  margin-bottom: 2rem;
}

.title {
  font-size: 1.9rem;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: 0.35rem;
  font-size: 1.05rem;
  color: var(--ink-muted);
}

.settings {
  display: flex;
  flex-direction: column;
}

.group {
  padding: 1.4rem 0;
  border-top: 1px solid var(--hairline);
}

.group:first-child {
  border-top: none;
  padding-top: 0;
}

.group-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
  margin-bottom: 1rem;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 2.4rem;
}

.row + .row {
  margin-top: 0.85rem;
}

.row-label {
  font-size: 1.05rem;
  color: var(--ink-soft);
}

.field-select {
  appearance: none;
  -webkit-appearance: none;
  min-width: 160px;
  padding: 0.55rem 2.2rem 0.55rem 0.9rem;
  font-size: 1rem;
  color: var(--ink);
  background-color: #f1f3f6;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.field-select:hover {
  background-color: #eceff3;
}

.field-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

/* Summary */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.5rem 1.5rem;
}

.summary-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.summary-item dt {
  font-size: 0.95rem;
  color: var(--ink-muted);
}

.summary-item dd {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink);
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.actions :deep(.n-button) {
  flex: 1;
}

@media (max-width: 560px) {
  .customize-page {
    padding: 1.5rem 1rem;
  }
}
</style>
