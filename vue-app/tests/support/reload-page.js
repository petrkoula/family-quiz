/**
 * Page-object pro reload kvíz-packu na landing page.
 *
 * Drží všechny selektory reload UI a umožní testům vstříknout deterministický
 * „katalog fotek" (fake zdroj aktuálních souborů) přes setPhotoCatalogSource.
 * Selektory cílí přes přístupný název / data-testid. Viz TESTING.md.
 */
import { render, within, fireEvent } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setPhotoCatalogSource, resetPhotoCatalogSource } from '@/data/photoCatalog';
import { quizPacks } from '@/data/quizPacks';
import { useGameStore } from '@/stores/gameStore';
import { usePackLibraryStore } from '@/stores/packLibraryStore';
import LandingView from '@/views/LandingView.vue';
import PresenterView from '@/views/PresenterView.vue';

function makeRouter() {
  const stub = { template: '<div />' };
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'landing', component: LandingView },
      { path: '/presenter', name: 'presenter', component: stub },
      { path: '/customize/:quizId', name: 'customize', component: stub },
    ],
  });
}

/**
 * Render landing page se zadaným katalogem fotek.
 * @param {{catalog?: (packId: string, currentImages: string[]) => string[]}} [opts]
 */
export async function renderLandingForReload({ catalog } = {}) {
  if (catalog) setPhotoCatalogSource(catalog);
  else resetPhotoCatalogSource();

  const pinia = createPinia();
  setActivePinia(pinia);

  const router = makeRouter();
  const view = render(LandingView, { global: { plugins: [router, pinia] } });
  await router.isReady();
  return new ReloadPage(view);
}

export function resetCatalog() {
  resetPhotoCatalogSource();
}

/**
 * Reloadne pack daným katalogem a začne ho hrát v presenteru — pro scénáře,
 * které ověřují obsah fotek (placeholdery vs. zachované otázky) „jak to vidí
 * hráč".
 */
export async function playPackAfterReload(packId, { catalog } = {}) {
  if (catalog) setPhotoCatalogSource(catalog);
  else resetPhotoCatalogSource();

  const pinia = createPinia();
  setActivePinia(pinia);

  const library = usePackLibraryStore();
  await library.reloadPack(packId);
  useGameStore().selectQuizPack(packId);

  const view = render(PresenterView, { global: { plugins: [pinia] } });
  return new PlayingPack(view);
}

class PlayingPack {
  constructor(view) {
    this.view = view;
  }

  progress() {
    return this.view.getByTestId('photo-progress').textContent.trim();
  }

  async goToPhoto(number) {
    for (let i = 1; i < number; i++) {
      await fireEvent.keyDown(window, { key: 'ArrowRight' });
      await flushPromises();
    }
  }

  async showQuestions() {
    await fireEvent.keyDown(window, { key: ' ' });
    await flushPromises();
  }

  async revealAnswer() {
    await fireEvent.keyDown(window, { key: 'a' });
    await flushPromises();
  }

  questionText() {
    return this.view.getByTestId('question-text').textContent.trim();
  }

  revealedCorrectAnswer() {
    const correct = this.view
      .getAllByTestId('option')
      .find((el) => el.getAttribute('data-correct') === 'true');
    return correct ? correct.textContent.trim() : null;
  }
}

class ReloadPage {
  constructor(view) {
    this.view = view;
  }

  /** Scoped queries pro kartu daného balíčku (přes jeho titulek). */
  card(title) {
    const heading = this.view.getByRole('heading', { name: title, level: 2 });
    return within(heading.closest('[data-testid="quiz-card"]'));
  }

  reloadButtons() {
    return this.view.getAllByTestId('reload-pack');
  }

  /** Počet fotek z textu „N fotek" na kartě. */
  photoCount(title) {
    const text = this.card(title).getByText(/\d+\s+fotek/).textContent;
    return Number(text.match(/(\d+)\s+fotek/)[1]);
  }

  /** Počet otázek z textu „N otázek" na kartě. */
  questionCount(title) {
    const text = this.card(title).getByText(/\d+\s+otázek/).textContent;
    return Number(text.match(/(\d+)\s+otázek/)[1]);
  }

  async clickReload(title) {
    await fireEvent.click(this.card(title).getByRole('button', { name: /Reload/i }));
    await flushPromises();
  }

  reloadResult(title) {
    const el = this.card(title).queryByTestId('reload-result');
    return el ? el.textContent.trim() : null;
  }
}

export { quizPacks };
