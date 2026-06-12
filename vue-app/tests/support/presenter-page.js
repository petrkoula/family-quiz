/**
 * Page-object pro PresenterView.
 *
 * Veškeré selektory presenteru žijí JEN tady. Když se UI hne, ladí se jedno
 * místo (viz TESTING.md – „Selektory drž v helper / page-object vrstvě").
 *
 * Konvence: cílíme přes přístupný název (role img + alt) a `data-testid`,
 * nikdy přes CSS třídy ani regex na text.
 */
import { render, fireEvent, cleanup } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '@/stores/gameStore';
import PresenterView from '@/views/PresenterView.vue';

/**
 * Vyrenderuje presenter s čerstvým Pinia store a načtenými quiz daty –
 * stejně, jako kdyby uživatel přišel na /presenter.
 */
export function renderPresenter() {
  setActivePinia(createPinia());
  useGameStore().initializeQuizData();

  const view = render(PresenterView);
  return new PresenterPage(view);
}

/**
 * Spustí prezentaci vybraného balíčku nad AKTIVNÍ Pinia (jako „Spustit").
 * Předchozí obrazovky odmountuje, aby v DOMu nehrály dvě views najednou.
 */
export function startPresentationForPack(packId) {
  cleanup();
  useGameStore().selectQuizPack(packId);

  const view = render(PresenterView);
  return new PresenterPage(view);
}

class PresenterPage {
  constructor(view) {
    this.view = view;
  }

  // --- Co uživatel vidí ------------------------------------------------------

  /** Text postupu, např. „Foto 1 / 23". */
  photoProgress() {
    return this.view.getByTestId('photo-progress').textContent.trim();
  }

  /** Jméno souboru aktuálně zobrazené fotky (pro ověření pořadí přehrávání). */
  currentPhotoImage() {
    return this.view.getByTestId('photo-image').getAttribute('data-image');
  }

  /** Je panel s otázkami zobrazený? */
  isQuestionsVisible() {
    return this.view.queryByTestId('questions-panel') !== null;
  }

  /** Nápověda ovládání ve spodní liště. */
  controlsHint() {
    return this.view.getByTestId('controls-hint').textContent.trim();
  }

  /** Text aktuálně zobrazené otázky (jen když jsou otázky vidět). */
  questionText() {
    return this.view.getByTestId('question-text').textContent.trim();
  }

  /** Text odpovědi označené jako správná, nebo null když nic odhaleno není. */
  revealedCorrectAnswer() {
    const correct = this.view
      .getAllByTestId('option')
      .find(el => el.getAttribute('data-correct') === 'true');
    return correct ? correct.textContent.trim() : null;
  }

  /** Nápověda v liště, že existuje klávesová nápověda. */
  helpHint() {
    const el = this.view.queryByTestId('help-hint');
    return el ? el.textContent.trim() : null;
  }

  /** Je overlay s klávesovými zkratkami zobrazený? */
  isHelpVisible() {
    return this.view.queryByTestId('help-overlay') !== null;
  }

  /** Celý text overlay nápovědy (pro ověření, že vyjmenovává ovládání). */
  helpOverlayText() {
    const el = this.view.queryByTestId('help-overlay');
    return el ? el.textContent : '';
  }

  // --- Co uživatel dělá (klávesnice) ----------------------------------------

  toggleQuestions() {
    return this._key(' ');
  }

  hideWithEsc() {
    return this._key('Escape');
  }

  nextQuestion() {
    return this._key('ArrowDown');
  }

  previousQuestion() {
    return this._key('ArrowUp');
  }

  nextPhoto() {
    return this._key('ArrowRight');
  }

  previousPhoto() {
    return this._key('ArrowLeft');
  }

  revealAnswer() {
    return this._key('a');
  }

  toggleHelp() {
    return this._key('?');
  }

  _key(key) {
    // Handler presenteru visí na window (onMounted addEventListener).
    return fireEvent.keyDown(window, { key });
  }
}
