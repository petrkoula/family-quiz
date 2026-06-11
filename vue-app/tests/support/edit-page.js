/**
 * Page-object pro EditView (úprava otázek balíčku).
 *
 * Veškeré selektory obrazovky úprav žijí JEN tady. Tlačítka cílíme přes
 * přístupný název (role button), strukturu fotek/otázek přes `data-testid`
 * (role na opakované bloky nestačí). Viz TESTING.md.
 *
 * Testy nikdy nesahají na síť/disk – katalog balíčků jde podstrčit přes
 * `injectPackCatalog()` a mezi testy se uklízí `resetLibraryEnvironment()`.
 */
import { render, within, fireEvent, cleanup } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setPackCatalogSource, resetPackCatalogSource } from '@/data/packCatalog';
import { LIBRARY_STORAGE_KEY } from '@/data/libraryStorage';
import EditView from '@/views/EditView.vue';

/** Podstrčí testovací katalog balíčků (místo vestavěných dat). */
export function injectPackCatalog(packs) {
  setPackCatalogSource(() => packs);
}

/** Úklid mezi testy: vestavěný katalog + prázdné úložiště knihovny. */
export function resetLibraryEnvironment() {
  resetPackCatalogSource();
  window.localStorage.removeItem(LIBRARY_STORAGE_KEY);
}

function makeRouter() {
  const stub = { template: '<div />' };
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'landing', component: stub },
      { path: '/edit/:quizId', name: 'edit', component: EditView },
      { path: '/presenter', name: 'presenter', component: stub },
    ],
  });
}

export async function renderEdit(packId) {
  const pinia = createPinia();
  setActivePinia(pinia);

  const router = makeRouter();
  router.push(`/edit/${packId}`);
  await router.isReady();

  const view = render(EditView, { global: { plugins: [router, pinia] } });
  return new EditPage(view, router, packId);
}

class EditPage {
  constructor(view, router, packId) {
    this.view = view;
    this.router = router;
    this.packId = packId;
  }

  // --- Co uživatel vidí ------------------------------------------------------

  title() {
    return this.view.getByRole('heading', { level: 1 }).textContent.trim();
  }

  photoCount() {
    return this.view.queryAllByTestId('photo-editor').length;
  }

  photo(index) {
    return new PhotoSection(this.view.getAllByTestId('photo-editor')[index]);
  }

  currentPath() {
    return this.router.currentRoute.value.fullPath;
  }

  hasBackToLibrary() {
    return this.view.queryByRole('link', { name: /Zpět na knihovnu/ }) !== null;
  }

  // --- Menu + reorder pořadí fotek -------------------------------------------

  async openMenu() {
    await fireEvent.click(this.view.getByTestId('edit-menu'));
  }

  hasMenu() {
    return this.view.queryByTestId('edit-menu') !== null;
  }

  canReorder() {
    return this.view.queryByTestId('reorder-photos') !== null;
  }

  /** Otevře menu a zvolí „Upravit pořadí". */
  async startReorder() {
    await this.openMenu();
    await fireEvent.click(this.view.getByTestId('reorder-photos'));
  }

  isReorderMode() {
    return this.view.queryByTestId('reorder-list') !== null;
  }

  hasSaveOrder() {
    return this.view.queryByTestId('save-order') !== null;
  }

  reorderItemCount() {
    return this.view.queryAllByTestId('reorder-item').length;
  }

  /** Pořadí fotek v reorder seznamu (podle jmen souborů). */
  reorderOrder() {
    return this.view.getAllByTestId('reorder-item').map(el => el.getAttribute('data-image'));
  }

  /** Pořadí fotek v normálním (rozbaleném) seznamu boxů (podle jmen souborů). */
  photoOrder() {
    return this.view.getAllByTestId('photo-editor').map(el => el.getAttribute('data-image'));
  }

  /** Přetáhne fotku z pozice `from` (0-based) na pozici `to`. */
  async dragPhoto(from, to) {
    const items = this.view.getAllByTestId('reorder-item');
    await fireEvent.dragStart(items[from]);
    await fireEvent.dragOver(items[to]);
    await fireEvent.drop(items[to]);
    await fireEvent.dragEnd(items[from]);
  }

  async saveOrder() {
    await fireEvent.click(this.view.getByTestId('save-order'));
    await flushPromises();
  }

  async cancelReorder() {
    await fireEvent.click(this.view.getByTestId('cancel-order'));
  }

  // --- Simulace restartu aplikace -------------------------------------------

  /** „Zavřu a znovu otevřu aplikaci": čerstvý store i DOM, úložiště zůstává. */
  async reload() {
    cleanup();
    const reopened = await renderEdit(this.packId);
    this.view = reopened.view;
    this.router = reopened.router;
    return this;
  }
}

class PhotoSection {
  constructor(element) {
    this.element = element;
    this.scope = within(element);
  }

  questionCount() {
    return this.scope.getAllByTestId('question-item').length;
  }

  question(index) {
    return new QuestionItem(this.scope.getAllByTestId('question-item')[index]);
  }

  canAddQuestion() {
    return this.scope.queryByRole('button', { name: 'Přidat otázku' }) !== null;
  }

  async addQuestion() {
    await fireEvent.click(this.scope.getByRole('button', { name: 'Přidat otázku' }));
    return new QuestionForm(this.scope.getByTestId('question-editor'));
  }
}

class QuestionItem {
  constructor(element) {
    this.element = element;
    this.scope = within(element);
  }

  text() {
    return this.scope.getByTestId('question-text').textContent.trim();
  }

  options() {
    return this.scope.getAllByTestId('question-option').map(el => el.textContent.trim());
  }

  /** Text možnosti označené jako správná odpověď. */
  correctOption() {
    const correct = this.scope
      .getAllByTestId('question-option')
      .find(el => el.getAttribute('data-correct') === 'true');
    return correct ? correct.textContent.trim() : null;
  }

  isSuggested() {
    return this.scope.queryByTestId('suggestion-badge') !== null;
  }

  canDelete() {
    return this.scope.queryByRole('button', { name: 'Smazat' }) !== null;
  }

  async delete() {
    await fireEvent.click(this.scope.getByRole('button', { name: 'Smazat' }));
  }

  async edit() {
    await fireEvent.click(this.scope.getByRole('button', { name: 'Upravit' }));
    return new QuestionForm(this.scope.getByTestId('question-editor'));
  }
}

class QuestionForm {
  constructor(element) {
    this.element = element;
    this.scope = within(element);
  }

  async setText(text) {
    await fireEvent.update(this.scope.getByTestId('question-text-input'), text);
  }

  async setOption(index, text) {
    await fireEvent.update(this.scope.getAllByTestId('option-input')[index], text);
  }

  optionCount() {
    return this.scope.getAllByTestId('option-input').length;
  }

  async chooseCorrect(index) {
    await fireEvent.click(this.scope.getAllByTestId('option-correct')[index]);
  }

  canAddOption() {
    return !this.scope.getByRole('button', { name: 'Přidat možnost' }).disabled;
  }

  async addOption() {
    await fireEvent.click(this.scope.getByRole('button', { name: 'Přidat možnost' }));
  }

  canRemoveOption() {
    return this.scope
      .getAllByRole('button', { name: 'Odebrat možnost' })
      .some(button => !button.disabled);
  }

  async removeOption(index) {
    await fireEvent.click(this.scope.getAllByRole('button', { name: 'Odebrat možnost' })[index]);
  }

  canSave() {
    return !this.scope.getByRole('button', { name: 'Uložit' }).disabled;
  }

  async save() {
    await fireEvent.click(this.scope.getByRole('button', { name: 'Uložit' }));
    await flushPromises();
  }

  async cancel() {
    await fireEvent.click(this.scope.getByRole('button', { name: 'Zrušit' }));
  }
}
