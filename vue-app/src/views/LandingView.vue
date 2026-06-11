<template>
  <div class="landing">
    <!-- Hero — sluníčkový panel jako pozvánka na herní večer -->
    <header class="hero">
      <div class="hero-text">
        <p class="kicker">Rodinný herní večer</p>
        <h1 class="landing-title">Knihovna Kvízů</h1>
        <p class="landing-subtitle">
          Vyberte si kvíz a zahrajte si s rodinou — žádná příprava, samá zábava.
        </p>
        <div class="toolbar">
          <n-button
            round
            size="large"
            color="#fffdfb"
            text-color="#6e574b"
            data-testid="reload-library"
            @click="reloadLibrary"
          >
            Obnovit knihovnu
          </n-button>
          <p v-if="libraryReloadResult" class="hero-note" data-testid="library-reload-result">
            {{ libraryReloadResult }}
          </p>
        </div>
      </div>
      <div v-if="collage.length" class="hero-collage" aria-hidden="true">
        <div v-for="item in collage" :key="item.id" class="hero-polaroid">
          <img :src="item.src" :alt="''" loading="lazy" />
        </div>
      </div>
    </header>

    <!-- Statistiky knihovny — barevné chipy jako v dětské hře -->
    <div class="stats">
      <div class="stat-card">
        <span class="stat-icon icon-sun">📚</span>
        <div class="stat-info">
          <strong>{{ stats.packs }}</strong>
          <span>Kvízy v knihovně</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon icon-coral">📸</span>
        <div class="stat-info">
          <strong>{{ stats.photos }}</strong>
          <span>Rodinné fotky</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon icon-mint">❓</span>
        <div class="stat-info">
          <strong>{{ stats.questions }}</strong>
          <span>Záludné otázky</span>
        </div>
      </div>
    </div>

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
          <span class="meta-chip chip-sun">{{ pack.photos.length }} fotek</span>
          <span class="meta-chip chip-mint">{{ questionCount(pack) }} otázek</span>
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
import { ref, computed, onMounted } from 'vue';
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

// Hromádka polaroidů v hero — náhledy prvních tří kvízů.
const collage = computed(() =>
  library.packs.slice(0, 3).map(pack => ({ id: pack.id, src: getImageUrl(pack.thumbnail) }))
);

const stats = computed(() => ({
  packs: library.packs.length,
  photos: library.packs.reduce((sum, pack) => sum + pack.photos.length, 0),
  questions: library.packs.reduce((sum, pack) => sum + questionCount(pack), 0),
}));

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
  padding: 2.5rem 2rem 4rem;
  max-width: 1280px;
  margin: 0 auto;
}

/* Hero — velký žlutý panel, první věc kterou oko potká */
.hero {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  align-items: center;
  gap: 2rem;
  background: var(--sun);
  border-radius: calc(var(--radius-lg) + 6px);
  padding: 3rem 3.25rem;
  margin-bottom: 2rem;
}

.kicker {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ink);
  opacity: 0.75;
}

.landing-title {
  font-family: var(--font-display);
  font-size: 3.1rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--ink);
  margin-top: 0.35rem;
}

.landing-subtitle {
  margin-top: 0.7rem;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--ink);
  opacity: 0.85;
  max-width: 34rem;
}

.toolbar {
  margin-top: 1.6rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.hero-note {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink);
}

/* Hromádka polaroidů — fotky vykukují ze žlutého panelu */
.hero-collage {
  position: relative;
  height: 240px;
}

.hero-polaroid {
  position: absolute;
  width: 56%;
  background: #fff;
  padding: 8px 8px 26px;
  border-radius: 4px;
  box-shadow: 0 3px 8px rgba(86, 56, 35, 0.18);
  transform: rotate(-7deg);
}

.hero-polaroid:nth-child(2) {
  left: 30%;
  top: 12%;
  transform: rotate(5deg);
}

.hero-polaroid:nth-child(3) {
  left: 12%;
  top: 36%;
  transform: rotate(-2deg);
}

.hero-polaroid img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  filter: saturate(1.08);
}

/* Statistiky — bílé kartičky s barevnými chipy */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 1.1rem 1.4rem;
  box-shadow: var(--shadow-soft);
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  font-size: 1.5rem;
}

.icon-sun {
  background: var(--sun-soft);
}

.icon-coral {
  background: var(--accent-soft);
}

.icon-mint {
  background: var(--success-soft);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-info strong {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.15;
  color: var(--ink);
}

.stat-info span {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ink-muted);
}

.muted {
  font-size: 1rem;
  color: var(--ink-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.quiz-card {
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.quiz-card:hover {
  transform: translateY(-4px) rotate(-0.4deg);
  box-shadow:
    0 4px 10px rgba(86, 56, 35, 0.08),
    0 18px 40px rgba(86, 56, 35, 0.12);
}

/* Fotky jako polaroidy — podpisový prvek; pruhy pod nimi se střídají
   ve veselých pastelech, ať je knihovna barevná jako dětská hra. */
.thumb {
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sun-soft);
  overflow: hidden;
}

.grid > .quiz-card:nth-child(3n + 2) .thumb {
  background: #fde0d6;
}

.grid > .quiz-card:nth-child(3n) .thumb {
  background: var(--success-soft);
}

.polaroid {
  width: 72%;
  background: #fff;
  padding: 10px 10px 30px;
  border-radius: 4px;
  box-shadow:
    0 1px 2px rgba(86, 56, 35, 0.12),
    0 10px 24px rgba(86, 56, 35, 0.18);
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
  filter: saturate(1.08);
}

.quiz-card:hover .polaroid {
  transform: rotate(0deg) scale(1.05);
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--ink);
}

.card-desc {
  margin-top: 0.4rem;
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--ink-soft);
}

.meta {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-chip {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--ink);
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
}

.chip-sun {
  background: var(--sun-soft);
}

.chip-mint {
  background: var(--success-soft);
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
  font-size: 0.95rem;
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

.create-card:hover {
  transform: none;
  box-shadow: none;
}

.create-thumb,
.grid > .quiz-card.create-card .thumb {
  background: transparent;
}

.polaroid-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  padding: 10px;
  border: 2px dashed rgba(245, 106, 71, 0.45);
  background: var(--surface);
  box-shadow: none;
}

.create-icon {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--accent);
}

.create-link {
  display: inline-block;
  margin-top: 1.1rem;
  font-size: 1.05rem;
  color: var(--accent);
  font-weight: 800;
  text-decoration: none;
}

.create-link:hover {
  text-decoration: underline;
}

.landing-footer {
  text-align: center;
  margin-top: 3.5rem;
  color: var(--ink-muted);
  font-size: 1.05rem;
  font-weight: 600;
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2.25rem 1.75rem;
  }

  .hero-collage {
    display: none;
  }
}

@media (max-width: 560px) {
  .landing {
    padding: 1.5rem 1rem 3rem;
  }

  .landing-title {
    font-size: 2.3rem;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>
