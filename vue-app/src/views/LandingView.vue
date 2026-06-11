<template>
  <div class="landing">
    <!-- Header -->
    <header class="landing-header">
      <h1 class="landing-title">Knihovna Kvízů</h1>
      <p class="landing-subtitle">Vyberte si kvíz a zahrajte si s rodinou</p>
      <div class="toolbar">
        <n-button tertiary round data-testid="reload-library" @click="reloadLibrary">
          Obnovit knihovnu
        </n-button>
        <p v-if="libraryReloadResult" class="muted" data-testid="library-reload-result">
          {{ libraryReloadResult }}
        </p>
      </div>
    </header>

    <!-- Quiz Library Grid -->
    <div class="grid">
      <n-card
        v-for="pack in library.packs"
        :key="pack.id"
        class="quiz-card"
        data-testid="quiz-card"
        :bordered="false"
      >
        <template #cover>
          <div class="thumb">
            <div class="polaroid">
              <img :src="getImageUrl(pack.thumbnail)" :alt="pack.title" loading="lazy" />
            </div>
          </div>
        </template>

        <h2 class="card-title">{{ pack.title }}</h2>
        <p class="card-desc">{{ pack.description }}</p>

        <div class="meta">
          <span>{{ pack.photos.length }} fotek</span>
          <span class="meta-dot">·</span>
          <span>{{ questionCount(pack) }} otázek</span>
        </div>

        <div class="card-actions">
          <n-button type="primary" @click="playNow(pack.id)">Play Now</n-button>
          <n-button tertiary @click="customizeQuiz(pack.id)">Customize</n-button>
          <n-button tertiary @click="editQuiz(pack.id)">Upravit</n-button>
        </div>

        <n-button text class="reload-link" data-testid="reload-pack" @click="reloadPack(pack.id)">
          Reload
        </n-button>
        <p v-if="reloadResults[pack.id]" class="muted reload-result" data-testid="reload-result">
          {{ reloadResults[pack.id] }}
        </p>
      </n-card>

      <!-- Create Your Own Card -->
      <n-card class="quiz-card create-card" :bordered="false">
        <template #cover>
          <div class="thumb create-thumb">
            <div class="polaroid polaroid-empty">
              <span class="create-icon">+</span>
            </div>
          </div>
        </template>
        <h2 class="card-title">Vytvořte vlastní</h2>
        <p class="card-desc">Nahrajte své fotky a vytvořte si vlastní rodinný kvíz</p>
        <a
          href="https://github.com/petrkoula/family-quiz"
          target="_blank"
          rel="noopener noreferrer"
          class="create-link"
        >
          Zjistit více →
        </a>
      </n-card>
    </div>

    <!-- Footer -->
    <footer class="landing-footer">
      <p>Vytvořeno s ❤️ pro rodinnou zábavu</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NButton } from 'naive-ui';
import { useGameStore } from '@/stores/gameStore';
import { usePackLibraryStore } from '@/stores/packLibraryStore';
import { getImageUrl } from '@/data/quizData';

const router = useRouter();
const gameStore = useGameStore();
const library = usePackLibraryStore();

// First visit only: populate the library from current folders (see store).
onMounted(() => library.ensureInitialized());

// Per-pack result summary shown after a reload.
const reloadResults = ref({});
// Summary shown after a whole-library refresh.
const libraryReloadResult = ref(null);

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

function formatLibraryResult(result) {
  if (!result) return 'Zdroj složek není dostupný';
  const { addedPacks, removedPacks, updatedPacks } = result;
  if (!addedPacks && !removedPacks && !updatedPacks) return 'Knihovna je aktuální';
  const parts = [];
  if (addedPacks) parts.push(`Přidáno kvízů: ${addedPacks}`);
  if (removedPacks) parts.push(`Odebráno kvízů: ${removedPacks}`);
  if (updatedPacks) parts.push(`Aktualizováno: ${updatedPacks}`);
  return parts.join(', ');
}

async function reloadLibrary() {
  const result = await library.reloadLibrary();
  libraryReloadResult.value = formatLibraryResult(result);
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

function editQuiz(packId) {
  // Open the question editor for this pack
  router.push(`/edit/${packId}`);
}
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--canvas);
  padding: 3.5rem 2rem 4rem;
}

.landing-header {
  text-align: center;
  margin-bottom: 3rem;
}

.landing-title {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.landing-subtitle {
  margin-top: 0.6rem;
  font-size: 1.15rem;
  color: var(--ink-muted);
}

.toolbar {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.muted {
  font-size: 0.95rem;
  color: var(--ink-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.75rem;
  max-width: 1280px;
  margin: 0 auto;
}

.quiz-card {
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 10px rgba(15, 23, 42, 0.06),
    0 18px 40px rgba(15, 23, 42, 0.1);
}

/* Fotky jako polaroidy ve starém albu — podpisový prvek designu. */
.thumb {
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper-deep);
  overflow: hidden;
}

.polaroid {
  width: 72%;
  background: #fff;
  padding: 10px 10px 30px;
  box-shadow:
    0 1px 2px rgba(82, 60, 39, 0.12),
    0 10px 24px rgba(82, 60, 39, 0.18);
  transform: rotate(-2deg);
  transition: transform 0.35s ease;
}

.quiz-card:nth-child(even) .polaroid {
  transform: rotate(1.6deg);
}

.polaroid img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  display: block;
  filter: sepia(0.18) saturate(0.92);
}

.quiz-card:hover .polaroid {
  transform: rotate(0deg) scale(1.03);
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 600;
  color: var(--ink);
}

.card-desc {
  margin-top: 0.4rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.meta {
  margin-top: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--ink-muted);
}

.meta-dot {
  opacity: 0.6;
}

.card-actions {
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-actions :deep(.n-button) {
  flex: 1 1 auto;
}

.reload-link {
  margin-top: 0.9rem;
  font-size: 0.9rem;
}

.reload-result {
  margin-top: 0.5rem;
  text-align: center;
}

/* Create-your-own card — prázdné místo v albu, žádný rámeček navíc */
.create-card {
  background: transparent;
  box-shadow: none;
}

.create-thumb {
  background: transparent;
}

.polaroid-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  padding: 10px;
  border: 1.5px dashed var(--hairline);
  background: var(--surface);
  box-shadow: none;
}

.create-icon {
  font-family: var(--font-display);
  font-size: 2.6rem;
  color: var(--ink-muted);
}

.create-link {
  display: inline-block;
  margin-top: 1.1rem;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.create-link:hover {
  text-decoration: underline;
}

.landing-footer {
  text-align: center;
  margin-top: 3.5rem;
  color: var(--ink-muted);
  font-size: 0.95rem;
}

@media (max-width: 560px) {
  .landing {
    padding: 2rem 1rem 3rem;
  }

  .landing-title {
    font-size: 2rem;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>
