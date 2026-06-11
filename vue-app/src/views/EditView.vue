<template>
  <div class="edit-container">
    <header class="edit-header">
      <RouterLink to="/" class="back-link">← Zpět na knihovnu</RouterLink>
      <h1 class="edit-title">Úprava kvízu</h1>
      <p v-if="pack" class="pack-name">{{ pack.title }}</p>
    </header>

    <p v-if="!pack" class="not-found">Kvíz nenalezen.</p>

    <main v-else class="photo-list">
      <section
        v-for="(photo, photoIndex) in pack.photos"
        :key="photo.image"
        class="photo-editor"
        data-testid="photo-editor"
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

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
  opacity: 0.9;
}

.back-link:hover {
  opacity: 1;
  text-decoration: underline;
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
