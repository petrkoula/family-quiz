<template>
  <div class="landing-container">
    <!-- Header -->
    <header class="landing-header">
      <h1 class="landing-title">Knihovna Kvízů</h1>
      <p class="landing-subtitle">Vyberte si kvíz a zahrajte si s rodinou</p>
    </header>

    <!-- Quiz Library Grid -->
    <div class="quiz-library">
      <div
        v-for="pack in library.packs"
        :key="pack.id"
        class="quiz-card"
        data-testid="quiz-card"
        :style="{ borderColor: pack.color }"
      >
        <!-- Thumbnail -->
        <div class="card-thumbnail">
          <img
            :src="getImageUrl(pack.thumbnail)"
            :alt="pack.title"
            loading="lazy"
            class="thumbnail-image"
          />
        </div>

        <!-- Card Content -->
        <div class="card-content">
          <h2 class="card-title">{{ pack.title }}</h2>
          <p class="card-description">{{ pack.description }}</p>

          <!-- Metadata -->
          <div class="card-metadata">
            <span class="metadata-item">
              <span class="icon">🖼️</span>
              {{ pack.photos.length }} fotek
            </span>
            <span class="metadata-item">
              <span class="icon">❓</span>
              {{ questionCount(pack) }} otázek
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="card-actions">
            <button @click.stop="playNow(pack.id)" class="btn btn-play-now">▶ Play Now</button>
            <button @click.stop="customizeQuiz(pack.id)" class="btn btn-customize">
              ⚙ Customize
            </button>
          </div>
          <button
            @click.stop="reloadPack(pack.id)"
            class="btn btn-reload"
            data-testid="reload-pack"
          >
            ↻ Reload
          </button>
          <p v-if="reloadResults[pack.id]" class="reload-result" data-testid="reload-result">
            {{ reloadResults[pack.id] }}
          </p>
        </div>
      </div>

      <!-- Create Your Own Card -->
      <div class="quiz-card create-card">
        <div class="card-thumbnail create-thumbnail">
          <div class="create-icon">✨</div>
        </div>
        <div class="card-content">
          <h2 class="card-title">Vytvořte vlastní</h2>
          <p class="card-description">Nahrajte své fotky a vytvořte si vlastní rodinný kvíz</p>
          <a
            href="https://github.com/petrkoula/family-quiz"
            target="_blank"
            rel="noopener noreferrer"
            class="create-link"
          >
            Zjistit více →
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="landing-footer">
      <p>Vytvořeno s ❤️ pro rodinnou zábavu</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { usePackLibraryStore } from '@/stores/packLibraryStore';
import { getImageUrl } from '@/data/quizData';

const router = useRouter();
const gameStore = useGameStore();
const library = usePackLibraryStore();

// Per-pack result summary shown after a reload.
const reloadResults = ref({});

function questionCount(pack) {
  return pack.photos.reduce((sum, photo) => sum + photo.questions.length, 0);
}

function formatReloadResult({ added, removed }) {
  if (!added && !removed) return 'Pack je aktuální';
  return `Přidáno: ${added}, Odebráno: ${removed}`;
}

async function reloadPack(packId) {
  const result = await library.reloadPack(packId);
  reloadResults.value = { ...reloadResults.value, [packId]: formatReloadResult(result) };
}

function playNow(packId) {
  // Start quiz immediately with default settings
  gameStore.selectQuizPack(packId);
  router.push('/presenter');
}

function customizeQuiz(packId) {
  // Navigate to customization screen
  gameStore.selectQuizPack(packId);
  router.push(`/customize/${packId}`);
}
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  color: white;
}

.landing-header {
  text-align: center;
  margin-bottom: 3rem;
}

.landing-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.landing-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
}

.quiz-library {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.quiz-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 3px solid transparent;
}

.quiz-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.card-thumbnail {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.quiz-card:hover .thumbnail-image {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quiz-card:hover .overlay {
  opacity: 1;
}

.play-icon {
  font-size: 4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.card-content {
  padding: 1.5rem;
  color: #333;
}

.card-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.card-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
}

.card-metadata {
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
  color: #555;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.2rem;
}

.card-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-reload {
  width: 100%;
  margin-top: 0.75rem;
  background: white;
  color: #555;
  border: 2px solid #cbd5e0;
}

.btn-reload:hover {
  border-color: #667eea;
  color: #667eea;
}

.reload-result {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #555;
  text-align: center;
}

.btn-play-now {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.btn-play-now:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-customize {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-customize:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Create Your Own Card */
.create-card {
  border: 3px dashed #667eea;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.create-card:hover {
  border-color: #764ba2;
}

.create-thumbnail {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-icon {
  font-size: 6rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.create-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.create-link:hover {
  transform: scale(1.05);
}

.landing-footer {
  text-align: center;
  margin-top: 4rem;
  opacity: 0.8;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .landing-title {
    font-size: 2.5rem;
  }

  .landing-subtitle {
    font-size: 1.2rem;
  }

  .quiz-library {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card-thumbnail {
    height: 200px;
  }

  .card-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
