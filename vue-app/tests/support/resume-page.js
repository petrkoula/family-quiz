/**
 * Page-object pro resume flow: Landing ↔ Presenter přes skutečný router.
 *
 * Renderuje `<router-view />` s reálnými view komponentami, takže Esc
 * v presenteru opravdu naviguje na landing a „Pokračovat" zase zpět.
 * Selektory cílí přes přístupný název / data-testid. Viz TESTING.md.
 */
import { render, within, fireEvent } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { quizPacks } from '@/data/quizPacks';
import LandingView from '@/views/LandingView.vue';
import PresenterView from '@/views/PresenterView.vue';

export async function renderApp() {
  const stub = { template: '<div />' };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'landing', component: LandingView },
      { path: '/presenter', name: 'presenter', component: PresenterView },
      { path: '/customize/:quizId', name: 'customize', component: stub },
      { path: '/edit/:quizId', name: 'edit', component: stub },
    ],
  });

  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useGameStore();

  const view = render({ template: '<router-view />' }, { global: { plugins: [router, pinia] } });
  await router.isReady();
  await flushPromises(); // first-visit init knihovny doběhne

  return new ResumeFlow(view, router, store);
}

class ResumeFlow {
  constructor(view, router, store) {
    this.view = view;
    this.router = router;
    this.store = store;
  }

  // --- Co uživatel vidí ------------------------------------------------------

  currentPath() {
    return this.router.currentRoute.value.fullPath;
  }

  /** Scoped queries pro kartu daného packu (přes jeho titulek). */
  card(pack) {
    const heading = this.view.getByRole('heading', { name: pack.title, level: 2 });
    return within(heading.closest('[data-testid="quiz-card"]'));
  }

  resumeButton(pack) {
    return this.card(pack).queryByRole('button', { name: /Pokračovat/ });
  }

  playNowButton(pack) {
    return this.card(pack).queryByRole('button', { name: /Play Now/i });
  }

  photoProgress() {
    return this.view.getByTestId('photo-progress').textContent.trim();
  }

  questionsVisible() {
    return this.store.questionsVisible;
  }

  // --- Co uživatel dělá ------------------------------------------------------

  async playNow(pack) {
    await fireEvent.click(this.card(pack).getByRole('button', { name: /Play Now/i }));
    await flushPromises();
  }

  async resume(pack) {
    await fireEvent.click(this.card(pack).getByRole('button', { name: /Pokračovat/ }));
    await flushPromises();
  }

  async pressKey(key) {
    await fireEvent.keyDown(window, { key });
    await flushPromises();
  }

  async nextPhoto() {
    await this.pressKey('ArrowRight');
  }

  async showQuestions() {
    await this.pressKey(' ');
  }

  async pressEsc() {
    await this.pressKey('Escape');
  }
}

export { quizPacks };
