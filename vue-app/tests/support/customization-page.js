/**
 * Page-object pro CustomizationView (nastavení kvízu před spuštěním).
 *
 * Veškeré selektory žijí JEN tady. Zaškrtávátka a tlačítka cílíme přes
 * přístupný název (role checkbox / button), selecty a souhrnné hodnoty přes
 * `data-testid` (role na ně nestačí). Viz TESTING.md.
 */
import { render, within, fireEvent } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import CustomizationView from '@/views/CustomizationView.vue';

function makeRouter() {
  const stub = { template: '<div />' };
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/customize/:quizId', name: 'customize', component: CustomizationView },
      { path: '/presenter', name: 'presenter', component: stub },
    ],
  });
}

export async function renderCustomization(packId = 'retro-style') {
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useGameStore();

  const router = makeRouter();
  router.push(`/customize/${packId}`);
  await router.isReady();

  const view = render(CustomizationView, { global: { plugins: [router, pinia] } });
  return new CustomizationPage(view, router, store, packId);
}

class CustomizationPage {
  constructor(view, router, store, packId) {
    this.view = view;
    this.router = router;
    this.store = store;
    this.packId = packId;
  }

  // --- Co uživatel vidí ------------------------------------------------------

  timerEnabled() {
    return (
      this.view.getByRole('switch', { name: /Enable Timer/i }).getAttribute('aria-checked') ===
      'true'
    );
  }

  hasDurationSelect() {
    return this.view.queryByTestId('timer-duration') !== null;
  }

  questionsPerPhoto() {
    return Number(this.view.getByTestId('questions-per-photo').value);
  }

  summaryTimer() {
    return this.view.getByTestId('summary-timer').textContent.trim();
  }

  summaryTotalQuestions() {
    return Number(this.view.getByTestId('summary-total-questions').textContent.trim());
  }

  currentPath() {
    return this.router.currentRoute.value.fullPath;
  }

  // --- Co uživatel dělá ------------------------------------------------------

  async enableTimer() {
    await fireEvent.click(this.view.getByRole('switch', { name: /Enable Timer/i }));
  }

  async setTimerDuration(seconds) {
    await fireEvent.update(this.view.getByTestId('timer-duration'), String(seconds));
  }

  async setQuestionsPerPhoto(count) {
    await fireEvent.update(this.view.getByTestId('questions-per-photo'), String(count));
  }

  async toggleRandomizePhotos() {
    await fireEvent.click(this.view.getByRole('switch', { name: /Randomize photo order/i }));
  }

  async startQuiz() {
    await fireEvent.click(this.view.getByRole('button', { name: 'Start Quiz' }));
    await flushPromises();
  }

  async skip() {
    await fireEvent.click(this.view.getByRole('button', { name: 'Skip' }));
    await flushPromises();
  }
}
