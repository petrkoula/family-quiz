/**
 * Page-object pro LandingView (knihovna kvízů).
 *
 * Veškeré selektory landing page žijí JEN tady. Cílíme přes přístupný název
 * (role heading / button / link), karty přes `data-testid="quiz-card"`.
 * Viz TESTING.md.
 */
import { render, within, fireEvent } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { quizPacks } from '@/data/quizPacks';
import LandingView from '@/views/LandingView.vue';

/** Minimální router se stejnými cestami jako produkční, ale bez lazy importů. */
function makeRouter() {
  const stub = { template: '<div />' };
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'landing', component: LandingView },
      { path: '/presenter', name: 'presenter', component: stub },
      { path: '/customize/:quizId', name: 'customize', component: stub },
      { path: '/edit/:quizId', name: 'edit', component: stub },
    ],
  });
}

export async function renderLanding() {
  const router = makeRouter();
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useGameStore();

  const view = render(LandingView, {
    global: { plugins: [router, pinia] },
  });

  await router.isReady();
  return new LandingPage(view, router, store);
}

class LandingPage {
  constructor(view, router, store) {
    this.view = view;
    this.router = router;
    this.store = store;
  }

  // --- Co uživatel vidí ------------------------------------------------------

  title() {
    return this.view.getByRole('heading', { name: 'Knihovna Kvízů', level: 1 }).textContent;
  }

  /** Karty kvízů (bez „Vytvořte vlastní" karty). */
  cards() {
    return this.view.getAllByTestId('quiz-card');
  }

  /** Vrátí scoped queries pro kartu daného packId (přes jeho titulek). */
  card(pack) {
    const heading = this.view.getByRole('heading', { name: pack.title, level: 2 });
    return within(heading.closest('[data-testid="quiz-card"]'));
  }

  hasCreateYourOwn() {
    return this.view.queryByRole('heading', { name: 'Vytvořte vlastní' }) !== null;
  }

  currentPath() {
    return this.router.currentRoute.value.fullPath;
  }

  // --- Co uživatel dělá ------------------------------------------------------

  async playNow(pack) {
    await fireEvent.click(this.card(pack).getByRole('button', { name: /Play Now/i }));
    await flushPromises();
  }

  /** Otevře svislé menu (⋮) na kartě — Nastavení kvízu / Upravit / Reload žijí v něm. */
  async openCardMenu(pack) {
    await fireEvent.click(this.card(pack).getByTestId('card-menu'));
  }

  async customize(pack) {
    await this.openCardMenu(pack);
    await fireEvent.click(this.card(pack).getByRole('menuitem', { name: /Nastavení kvízu/i }));
    await flushPromises();
  }

  async edit(pack) {
    await this.openCardMenu(pack);
    await fireEvent.click(this.card(pack).getByRole('menuitem', { name: /Upravit/ }));
    await flushPromises();
  }
}

export { quizPacks };
