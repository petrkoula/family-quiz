<template>
  <div class="edit-container">
    <header class="edit-header">
      <div class="edit-toolbar">
        <div class="toolbar-left">
          <RouterLink v-if="!reorderMode" to="/" class="back-link">← Zpět na knihovnu</RouterLink>
          <template v-else>
            <button
              type="button"
              class="btn-toolbar btn-toolbar-primary"
              data-testid="save-order"
              @click="saveOrder"
            >
              Uložit
            </button>
            <button
              type="button"
              class="btn-toolbar"
              data-testid="cancel-order"
              @click="cancelReorder"
            >
              Zrušit
            </button>
          </template>
        </div>
        <div v-if="pack && !reorderMode" class="toolbar-right">
          <button
            type="button"
            class="kebab"
            aria-label="Menu"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
            data-testid="edit-menu"
            @click="toggleMenu"
          >
            ⋮
          </button>
          <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
          <div v-if="menuOpen" class="menu" role="menu">
            <button
              type="button"
              class="menu-item"
              role="menuitem"
              data-testid="reorder-photos"
              @click="startReorder"
            >
              Upravit pořadí
            </button>
          </div>
        </div>
      </div>
      <h1 class="edit-title">Úprava kvízu</h1>
      <p v-if="pack" class="pack-name">{{ pack.title }}</p>
    </header>

    <p v-if="!pack" class="not-found">Kvíz nenalezen.</p>

    <ul v-else-if="reorderMode" class="reorder-list" data-testid="reorder-list">
      <li
        v-for="(photo, index) in workingOrder"
        :key="photo.image"
        class="reorder-item"
        :class="{ dragging: draggingIndex === index }"
        data-testid="reorder-item"
        :data-image="photo.image"
        draggable="true"
        :aria-label="`Fotka ${index + 1}`"
        @dragstart="onDragStart(index)"
        @dragover.prevent="onDragOver(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      >
        <span class="drag-handle" aria-hidden="true">⠿</span>
        <img
          :src="getImageUrl(photo.image)"
          :alt="`Fotka ${index + 1}`"
          loading="lazy"
          class="reorder-thumb"
        />
        <span class="reorder-position" data-testid="reorder-position">Fotka {{ index + 1 }}</span>
      </li>
    </ul>

    <main v-else class="photo-list">
      <section
        v-for="(photo, photoIndex) in pack.photos"
        :key="photo.image"
        class="photo-editor"
        data-testid="photo-editor"
        :data-image="photo.image"
      >
        <div class="photo-preview">
          <img
            :src="getImageUrl(photo.image)"
            :alt="`Fotka ${photoIndex + 1}`"
            loading="lazy"
            class="photo-thumbnail"
          />
          <h2 class="photo-heading">Fotka {{ photoIndex + 1 }}</h2>
        </div>

        <ul class="question-list">
          <li
            v-for="(question, questionIndex) in photo.questions"
            :key="questionIndex"
            class="question-item"
            data-testid="question-item"
          >
            <div v-if="!isEditing(photo.image, questionIndex)" class="question-display">
              <p class="question-text" data-testid="question-text">
                {{ question.text }}
                <span
                  v-if="question.placeholder"
                  class="suggestion-badge"
                  data-testid="suggestion-badge"
                  >Návrh</span
                >
              </p>
              <ul class="option-list">
                <li
                  v-for="(option, optionIndex) in question.options"
                  :key="optionIndex"
                  class="option"
                  :class="{ correct: optionIndex === question.correct }"
                >
                  <span
                    data-testid="question-option"
                    :data-correct="optionIndex === question.correct ? 'true' : 'false'"
                    >{{ option }}</span
                  >
                  <span v-if="optionIndex === question.correct" class="check" aria-hidden="true"
                    >✓</span
                  >
                </li>
              </ul>
              <div class="question-actions">
                <button type="button" class="btn-small" @click="startEdit(photo, questionIndex)">
                  Upravit
                </button>
                <button
                  v-if="photo.questions.length > QUESTION_LIMITS.minQuestionsPerPhoto"
                  type="button"
                  class="btn-small btn-delete"
                  @click="deleteQuestion(photo, questionIndex)"
                >
                  Smazat
                </button>
              </div>
            </div>

            <form
              v-else
              class="question-editor"
              data-testid="question-editor"
              @submit.prevent="saveDraft"
            >
              <label class="field-label" :for="`question-text-${photoIndex}`">Text otázky</label>
              <input
                :id="`question-text-${photoIndex}`"
                v-model="draft.text"
                class="text-input"
                data-testid="question-text-input"
              />

              <fieldset class="options-fieldset">
                <legend class="field-label">Možnosti (správnou odpověď označte)</legend>
                <div
                  v-for="(option, optionIndex) in draft.options"
                  :key="optionIndex"
                  class="option-row"
                >
                  <input
                    type="radio"
                    :name="`correct-${photoIndex}`"
                    :checked="draft.correct === optionIndex"
                    :aria-label="`Správná odpověď je možnost ${optionIndex + 1}`"
                    data-testid="option-correct"
                    @change="draft.correct = optionIndex"
                  />
                  <input
                    v-model="draft.options[optionIndex]"
                    class="text-input option-text"
                    :aria-label="`Možnost ${optionIndex + 1}`"
                    data-testid="option-input"
                  />
                  <button
                    type="button"
                    class="btn-small"
                    :disabled="draft.options.length <= QUESTION_LIMITS.minOptions"
                    @click="removeOption(optionIndex)"
                  >
                    Odebrat možnost
                  </button>
                </div>
                <button
                  type="button"
                  class="btn-small"
                  :disabled="draft.options.length >= QUESTION_LIMITS.maxOptions"
                  @click="addOption"
                >
                  Přidat možnost
                </button>
              </fieldset>

              <div class="editor-actions">
                <button type="submit" class="btn-small btn-save" :disabled="!draftValid">
                  Uložit
                </button>
                <button type="button" class="btn-small" @click="cancelEdit">Zrušit</button>
              </div>
            </form>
          </li>
        </ul>

        <div class="add-question-area">
          <button
            v-if="
              !isAdding(photo.image) &&
              photo.questions.length < QUESTION_LIMITS.maxQuestionsPerPhoto
            "
            type="button"
            class="btn-small"
            @click="startAdd(photo)"
          >
            Přidat otázku
          </button>

          <form
            v-if="isAdding(photo.image)"
            class="question-editor"
            data-testid="question-editor"
            @submit.prevent="saveDraft"
          >
            <label class="field-label" :for="`new-question-text-${photoIndex}`">Text otázky</label>
            <input
              :id="`new-question-text-${photoIndex}`"
              v-model="draft.text"
              class="text-input"
              data-testid="question-text-input"
            />

            <fieldset class="options-fieldset">
              <legend class="field-label">Možnosti (správnou odpověď označte)</legend>
              <div
                v-for="(option, optionIndex) in draft.options"
                :key="optionIndex"
                class="option-row"
              >
                <input
                  type="radio"
                  :name="`new-correct-${photoIndex}`"
                  :checked="draft.correct === optionIndex"
                  :aria-label="`Správná odpověď je možnost ${optionIndex + 1}`"
                  data-testid="option-correct"
                  @change="draft.correct = optionIndex"
                />
                <input
                  v-model="draft.options[optionIndex]"
                  class="text-input option-text"
                  :aria-label="`Možnost ${optionIndex + 1}`"
                  data-testid="option-input"
                />
                <button
                  type="button"
                  class="btn-small"
                  :disabled="draft.options.length <= QUESTION_LIMITS.minOptions"
                  @click="removeOption(optionIndex)"
                >
                  Odebrat možnost
                </button>
              </div>
              <button
                type="button"
                class="btn-small"
                :disabled="draft.options.length >= QUESTION_LIMITS.maxOptions"
                @click="addOption"
              >
                Přidat možnost
              </button>
            </fieldset>

            <div class="editor-actions">
              <button type="submit" class="btn-small btn-save" :disabled="!draftValid">
                Uložit
              </button>
              <button type="button" class="btn-small" @click="cancelEdit">Zrušit</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePackLibraryStore, isValidQuestion, QUESTION_LIMITS } from '@/stores/packLibraryStore';
import { getImageUrl } from '@/data/quizData';

const route = useRoute();
const library = usePackLibraryStore();

const pack = computed(() => library.getPack(route.params.quizId));

// Rozpracovaná úprava: vždy nejvýš jedna otevřená otázka.
// `questionIndex === null` znamená přidávání nové otázky k fotce.
const editing = ref(null); // { image, questionIndex } | null
const draft = ref(null); // { text, options: [], correct } | null

// --- Menu + reorder pořadí fotek -------------------------------------------
const menuOpen = ref(false);
const reorderMode = ref(false);
// Pracovní kopie pořadí během tažení; uloží se až na „Uložit".
const workingOrder = ref([]);
const draggingIndex = ref(null);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function startReorder() {
  cancelEdit(); // zavři případnou rozpracovanou otázku
  workingOrder.value = [...pack.value.photos];
  reorderMode.value = true;
  menuOpen.value = false;
}

function onDragStart(index) {
  draggingIndex.value = index;
}

function onDragOver() {
  // @dragover.prevent jen povolí drop; přeskládá se až v onDrop.
}

function onDrop(targetIndex) {
  const from = draggingIndex.value;
  if (from === null || from === targetIndex) return;
  const next = [...workingOrder.value];
  const [moved] = next.splice(from, 1);
  next.splice(targetIndex, 0, moved);
  workingOrder.value = next;
  draggingIndex.value = null;
}

function onDragEnd() {
  draggingIndex.value = null;
}

function saveOrder() {
  library.setPhotoOrder(
    pack.value.id,
    workingOrder.value.map(photo => photo.image)
  );
  reorderMode.value = false;
  workingOrder.value = [];
  draggingIndex.value = null;
}

function cancelReorder() {
  reorderMode.value = false;
  workingOrder.value = [];
  draggingIndex.value = null;
}

const draftValid = computed(() => draft.value !== null && isValidQuestion(draft.value));

function isEditing(image, questionIndex) {
  return editing.value?.image === image && editing.value?.questionIndex === questionIndex;
}

function isAdding(image) {
  return editing.value?.image === image && editing.value?.questionIndex === null;
}

function startEdit(photo, questionIndex) {
  const question = photo.questions[questionIndex];
  editing.value = { image: photo.image, questionIndex };
  draft.value = {
    text: question.text,
    options: [...question.options],
    correct: question.correct,
  };
}

function startAdd(photo) {
  editing.value = { image: photo.image, questionIndex: null };
  draft.value = { text: '', options: ['', ''], correct: 0 };
}

function deleteQuestion(photo, questionIndex) {
  if (isEditing(photo.image, questionIndex)) cancelEdit();
  library.removeQuestion(pack.value.id, photo.image, questionIndex);
}

function cancelEdit() {
  editing.value = null;
  draft.value = null;
}

function saveDraft() {
  if (!editing.value || !draftValid.value) return;
  const { image, questionIndex } = editing.value;
  const saved =
    questionIndex === null
      ? library.addQuestion(pack.value.id, image, draft.value)
      : library.updateQuestion(pack.value.id, image, questionIndex, draft.value);
  if (saved) cancelEdit();
}

function addOption() {
  if (draft.value.options.length >= QUESTION_LIMITS.maxOptions) return;
  draft.value.options.push('');
}

function removeOption(index) {
  if (draft.value.options.length <= QUESTION_LIMITS.minOptions) return;
  draft.value.options.splice(index, 1);
  if (index === draft.value.correct) {
    draft.value.correct = 0;
  } else if (index < draft.value.correct) {
    draft.value.correct -= 1;
  }
}
</script>

<style scoped>
.edit-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  color: #2c3e50;
}

.edit-header {
  max-width: 1000px;
  margin: 0 auto 2rem;
  text-align: center;
  color: white;
}

.edit-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  min-height: 2.4rem;
}

.toolbar-left {
  display: flex;
  gap: 0.5rem;
}

.toolbar-right {
  position: relative;
}

.back-link {
  display: inline-block;
  color: white;
  text-decoration: none;
  font-weight: bold;
  opacity: 0.9;
}

.back-link:hover {
  opacity: 1;
  text-decoration: underline;
}

.btn-toolbar {
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-toolbar:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-toolbar-primary {
  background: white;
  color: #5568d3;
  border-color: white;
}

.btn-toolbar-primary:hover {
  background: #f0f0ff;
}

.kebab {
  width: 2.4rem;
  height: 2.4rem;
  font-size: 1.5rem;
  line-height: 1;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}

.kebab:hover {
  background: rgba(255, 255, 255, 0.3);
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;
}

.menu {
  position: absolute;
  top: 2.8rem;
  right: 0;
  z-index: 11;
  min-width: 180px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  text-align: left;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 0.85rem 1.2rem;
  font-size: 1rem;
  text-align: left;
  border: none;
  background: white;
  color: #2c3e50;
  cursor: pointer;
}

.menu-item:hover {
  background: #f1f3f9;
}

.reorder-list {
  max-width: 1000px;
  margin: 0 auto;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reorder-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: grab;
  user-select: none;
}

.reorder-item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.drag-handle {
  font-size: 1.4rem;
  color: #adb5bd;
  cursor: grab;
}

.reorder-thumb {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  background: #e9ecef;
}

.reorder-position {
  font-size: 1.15rem;
  font-weight: 600;
  color: #495057;
}

.edit-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.pack-name {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-top: 0.5rem;
}

.not-found {
  text-align: center;
  color: white;
  font-size: 1.3rem;
}

.photo-list {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.photo-editor {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1.5rem;
}

.photo-preview {
  text-align: center;
}

.photo-thumbnail {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  aspect-ratio: 4 / 3;
  background: #e9ecef;
}

.photo-heading {
  font-size: 1.2rem;
  margin-top: 0.75rem;
  color: #495057;
}

.question-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
}

.question-text {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.suggestion-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: #ffe8a3;
  color: #8a6d00;
  font-size: 0.85rem;
  font-weight: bold;
  vertical-align: middle;
}

.option-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.option {
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.option.correct {
  border-color: #38a169;
  background: #f0fff4;
}

.check {
  color: #38a169;
  font-weight: bold;
}

.question-actions {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.4rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: 2px solid #667eea;
  border-radius: 6px;
  background: white;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-small:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.btn-small:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-save {
  background: #667eea;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #5568d3;
}

.add-question-area {
  grid-column: 2;
}

.add-question-area .question-editor {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
}

.btn-delete {
  border-color: #e53e3e;
  color: #e53e3e;
}

.btn-delete:hover:not(:disabled) {
  background: #e53e3e;
  color: white;
}

.question-editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-label {
  font-weight: 600;
  color: #495057;
}

.text-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
}

.text-input:focus {
  border-color: #667eea;
  outline: none;
}

.options-fieldset {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-row .option-text {
  flex: 1;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .photo-editor {
    grid-template-columns: 1fr;
  }
}
</style>
