<template>
  <div class="landing">
    <!-- Logo — svislá tmavá záložka přilehlá k levému okraji, invertovaný text -->
    <div class="brand-ribbon">
      <svg class="brand-star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
      </svg>
      <span class="brand-name">FamilyQuiz</span>
    </div>

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
            type="primary"
            round
            size="large"
            tag="a"
            href="https://github.com/petrkoula/family-quiz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
              </svg>
            </template>
            Založit nový kvíz
          </n-button>
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

    <!-- Lišta nad kartami — menu knihovny po stylu Edit (kebab + vlastní menu) -->
    <div class="grid-toolbar">
      <p v-if="libraryReloadResult" class="muted" data-testid="library-reload-result">
        {{ libraryReloadResult }}
      </p>
      <div class="library-menu-wrap">
        <button
          type="button"
          class="kebab"
          aria-label="Menu knihovny"
          aria-haspopup="true"
          :aria-expanded="menuOpen"
          data-testid="library-menu"
          @click="menuOpen = !menuOpen"
        >
          ☰
        </button>
        <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
        <div v-if="menuOpen" class="menu" role="menu">
          <button
            type="button"
            class="menu-item"
            role="menuitem"
            data-testid="reload-library"
            @click="reloadLibrary"
          >
            Přegenerovat ze souborů
          </button>
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
            <img :src="getImageUrl(pack.thumbnail)" :alt="pack.title" loading="lazy" />
            <!-- Hlavní akce v levém spodním rohu fotky -->
            <div class="card-cta">
              <n-button
                v-if="gameStore.isPackInProgress(pack.id)"
                color="#e2f2dd"
                text-color="#2c5e2e"
                data-testid="resume-quiz"
                @click="resumeQuiz()"
              >
                Pokračovat
              </n-button>
              <n-button v-else type="primary" @click="playNow(pack.id)">Spustit</n-button>
            </div>
          </div>
        </template>

        <div class="card-head">
          <div>
            <p class="card-kicker">Rodinný fotokvíz</p>
            <h2 class="card-title">{{ pack.title }}</h2>
          </div>
          <div class="card-menu-wrap">
            <button
              type="button"
              class="kebab kebab-card"
              aria-label="Menu kvízu"
              aria-haspopup="true"
              :aria-expanded="openCardMenu === pack.id"
              data-testid="card-menu"
              @click="toggleCardMenu(pack.id)"
            >
              ⋮
            </button>
            <div
              v-if="openCardMenu === pack.id"
              class="menu-backdrop"
              @click="openCardMenu = null"
            ></div>
            <div v-if="openCardMenu === pack.id" class="menu" role="menu">
              <button
                type="button"
                class="menu-item"
                role="menuitem"
                @click="customizeQuiz(pack.id)"
              >
                <svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                  />
                </svg>
                Nastavení kvízu
              </button>
              <button type="button" class="menu-item" role="menuitem" @click="editQuiz(pack.id)">
                <svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
                  />
                </svg>
                Upravit
              </button>
              <button
                type="button"
                class="menu-item"
                role="menuitem"
                data-testid="reload-pack"
                @click="reloadPack(pack.id)"
              >
                <span class="menu-icon" aria-hidden="true"></span>
                Reload
              </button>
            </div>
          </div>
        </div>
        <p class="card-desc">{{ pack.description }}</p>

        <div class="meta">
          <span>{{ pack.photos.length }} fotek</span>
          <span class="meta-dot">·</span>
          <span>{{ questionCount(pack) }} otázek</span>
        </div>

        <p v-if="reloadResults[pack.id]" class="muted reload-result" data-testid="reload-result">
          {{ reloadResults[pack.id] }}
        </p>
      </n-card>

      <!-- Create Your Own Card -->
      <n-card class="quiz-card create-card" :bordered="false">
        <template #cover>
          <div class="thumb create-thumb">
            <div class="polaroid-empty">
              <span class="create-icon">+</span>
            </div>
          </div>
        </template>
        <p class="card-kicker">Přidejte vlastní</p>
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
// Menu knihovny (☰) nad kartami.
const menuOpen = ref(false);
// Otevřené svislé menu (⋮) na kartě — id packu, nebo null.
const openCardMenu = ref(null);

function toggleCardMenu(packId) {
  openCardMenu.value = openCardMenu.value === packId ? null : packId;
}

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
  openCardMenu.value = null;
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
  menuOpen.value = false;
  const result = await library.reloadLibrary();
  libraryReloadResult.value = formatLibraryResult(result);
}

function playNow(packId) {
  // Start quiz immediately with default settings
  gameStore.selectQuizPack(packId);
  router.push('/presenter');
}

function resumeQuiz() {
  // Rozehraný kvíz — žádný reset, jen návrat do presenteru na stejné místo.
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
  /* Pozadí (textura) kreslí #app přes celý viewport — viz style.css. */
  padding: 2.5rem 2rem 4rem 3.5rem;
  max-width: 1280px;
  margin: 0 auto;
}

/* Logo — netradiční svislá záložka u levého okraje, téměř černá s invertovaným textem */
.brand-ribbon {
  position: fixed;
  left: 0;
  top: 2.5rem;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  padding: 1.1rem 0.5rem 1.4rem;
  background: #1e1410;
  color: var(--canvas);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  box-shadow: 0 8px 24px rgba(30, 20, 16, 0.3);
}

.brand-star {
  width: 22px;
  height: 22px;
  color: var(--sun);
}

.brand-name {
  writing-mode: vertical-rl;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--canvas);
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

/* Lišta nad kartami — výsledek synchronizace + menu knihovny vpravo */
.grid-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.library-menu-wrap {
  position: relative;
}

.kebab {
  width: 2.6rem;
  height: 2.6rem;
  font-size: 1.25rem;
  line-height: 1;
  border: none;
  border-radius: 50%;
  background: rgba(86, 56, 35, 0.07);
  color: var(--ink-soft);
  cursor: pointer;
  transition: background 0.2s ease;
}

.kebab:hover {
  background: rgba(86, 56, 35, 0.12);
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;
}

.menu {
  position: absolute;
  top: 3rem;
  right: 0;
  z-index: 11;
  min-width: 240px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(86, 56, 35, 0.25);
  overflow: hidden;
  text-align: left;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.85rem 1.2rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  text-align: left;
  border: none;
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--ink-soft);
}

.menu-item:hover {
  background: var(--field-fill);
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

/* V klidu tenký šedý rámeček (přes box-shadow ring jako na hoveru),
   na hover ho nahradí výrazný primární. */
.quiz-card {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.12),
    var(--shadow-soft);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Hover: výrazný rámeček v primární barvě (kreslený přes box-shadow,
   ať neposkakuje layout) + zvednutí karty. */
.quiz-card:hover {
  transform: translateY(-4px) rotate(-0.4deg);
  box-shadow:
    0 0 0 3px var(--accent),
    0 4px 10px rgba(86, 56, 35, 0.08),
    0 18px 40px rgba(86, 56, 35, 0.12);
}

/* Fotka přes celou šířku karty — bez polaroidového rámečku. */
.thumb {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
}

/* Hlavní akce karty — levý spodní roh fotky */
.card-cta {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  z-index: 2;
}

.card-cta :deep(.n-button) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.08);
  transition: transform 0.35s ease;
}

.quiz-card:hover .thumb img {
  transform: scale(1.04);
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-menu-wrap {
  position: relative;
  flex-shrink: 0;
}

.kebab-card {
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.2rem;
}

/* Podtitulek karty — stejný kicker vzor jako v hero, jen menší */
.card-kicker {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 0.15rem;
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
  margin-top: 0.9rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink-muted);
}

.meta-dot {
  opacity: 0.6;
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
  width: 72%;
  height: 160px;
  padding: 10px;
  border: 2px dashed rgba(245, 106, 71, 0.45);
  border-radius: var(--radius);
  background: var(--surface);
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

  .hero-collage,
  .brand-ribbon {
    display: none;
  }

  .landing {
    padding-left: 2rem;
  }
}

@media (max-width: 560px) {
  .landing {
    padding: 1.5rem 1rem 3rem;
  }

  .landing-title {
    font-size: 2.3rem;
  }
}
</style>
