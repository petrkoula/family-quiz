import { defineStore } from 'pinia';
import { ref } from 'vue';
import { quizData } from '@/data/quizData';
import { listPhotos, listPacks } from '@/data/photoCatalog';
import { loadLibrary, saveLibrary } from '@/data/libraryStorage';
import { getPackCatalog } from '@/data/packCatalog';

export const QUESTION_LIMITS = {
  minQuestionsPerPhoto: 1,
  maxQuestionsPerPhoto: 3,
  minOptions: 2,
  maxOptions: 4,
};

/** Platná otázka: neprázdný text, 2–4 neprázdné možnosti, správná v rozsahu. */
export function isValidQuestion(question) {
  if (!question || typeof question.text !== 'string' || question.text.trim() === '') return false;
  const options = question.options;
  if (!Array.isArray(options)) return false;
  if (options.length < QUESTION_LIMITS.minOptions) return false;
  if (options.length > QUESTION_LIMITS.maxOptions) return false;
  if (options.some(option => typeof option !== 'string' || option.trim() === '')) return false;
  if (!Number.isInteger(question.correct)) return false;
  if (question.correct < 0 || question.correct >= options.length) return false;
  return true;
}

const PACK_COLORS = ['#4a90e2', '#e67e22', '#27ae60', '#9b59b6', '#e74c3c', '#16a085'];

export function makePlaceholderQuestions() {
  return Array.from({ length: 3 }, () => ({
    text: 'Doplň otázku',
    options: ['—', '—', '—', '—'],
    correct: null,
    placeholder: true,
  }));
}

export function humanizeTitle(folderName) {
  return folderName
    .split(/[-_]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Hand-written questions from the bundled data, keyed by photo filename.
const questionBank = new Map(quizData.map(item => [item.image, item.questions]));

function filenameOf(imagePath) {
  return imagePath.split('/').pop();
}

function cloneQuestion(question) {
  const clone = { text: question.text, options: [...question.options], correct: question.correct };
  if (question.placeholder) clone.placeholder = true;
  return clone;
}

function buildPhoto(packId, file, existingPhotos) {
  const existing = existingPhotos?.find(photo => filenameOf(photo.image) === file);
  const handWritten =
    existing && !existing.questions.every(q => q.placeholder) ? existing.questions : null;
  return {
    image: `${packId}/${file}`,
    questions:
      handWritten ?? questionBank.get(file) ?? existing?.questions ?? makePlaceholderQuestions(),
  };
}

export const usePackLibraryStore = defineStore('packLibrary', () => {
  const remembered = loadLibrary();
  const rememberedPacks = Array.isArray(remembered?.packs) ? remembered.packs : null;
  const packs = ref(rememberedPacks ?? getPackCatalog());
  const initialized = ref(rememberedPacks != null);

  function persist() {
    saveLibrary({ packs: packs.value });
  }

  function getPack(packId) {
    return packs.value.find(p => p.id === packId) || null;
  }

  /** Data balíčku pro prezentaci – kopie, ať běžící kvíz nesdílí objekty. */
  function getQuizData(packId) {
    const pack = getPack(packId);
    if (!pack) return [];
    return pack.photos.map(photo => ({
      image: photo.image,
      questions: photo.questions.map(cloneQuestion),
    }));
  }

  function packMetadata(packId) {
    const pack = getPack(packId);
    if (!pack) return { photoCount: 0, questionCount: 0 };
    return {
      photoCount: pack.photos.length,
      questionCount: pack.photos.reduce((sum, photo) => sum + photo.questions.length, 0),
    };
  }

  // --- Reload ----------------------------------------------------------------

  async function reloadPack(packId) {
    const pack = getPack(packId);
    if (!pack) return { added: 0, removed: 0 };

    const currentFiles = pack.photos.map(photo => filenameOf(photo.image));
    const latestFiles = await listPhotos(packId, currentFiles);

    const added = latestFiles.filter(f => !currentFiles.includes(f)).length;
    const removed = currentFiles.filter(f => !latestFiles.includes(f)).length;

    pack.photos = latestFiles.map(f => buildPhoto(packId, f, pack.photos));
    if (latestFiles.length) pack.thumbnail = `${packId}/${latestFiles[0]}`;
    persist();

    return { added, removed };
  }

  async function reloadLibrary() {
    const catalog = await listPacks();
    if (!catalog) return null;

    const beforeIds = packs.value.map(p => p.id);
    let updatedPacks = 0;

    packs.value = catalog
      .filter(entry => entry.photos.length > 0)
      .map((entry, index) => {
        const existing = getPack(entry.id);
        if (existing) {
          const beforeFiles = existing.photos.map(photo => filenameOf(photo.image));
          const changed =
            beforeFiles.length !== entry.photos.length ||
            entry.photos.some(f => !beforeFiles.includes(f));
          if (changed) updatedPacks++;
        }
        return {
          id: entry.id,
          title: existing?.title ?? humanizeTitle(entry.id),
          description: existing?.description ?? '',
          color: existing?.color ?? PACK_COLORS[index % PACK_COLORS.length],
          thumbnail: `${entry.id}/${entry.photos[0]}`,
          photos: entry.photos.map(f => buildPhoto(entry.id, f, existing?.photos)),
        };
      });

    const afterIds = packs.value.map(p => p.id);
    persist();

    return {
      addedPacks: afterIds.filter(id => !beforeIds.includes(id)).length,
      removedPacks: beforeIds.filter(id => !afterIds.includes(id)).length,
      updatedPacks,
    };
  }

  async function ensureInitialized() {
    if (initialized.value) return;
    initialized.value = true;
    await reloadLibrary();
  }

  // --- Editace otázek --------------------------------------------------------

  function authoredQuestion(question) {
    return {
      text: typeof question?.text === 'string' ? question.text.trim() : '',
      options: Array.isArray(question?.options)
        ? question.options.map(option => (typeof option === 'string' ? option.trim() : ''))
        : [],
      correct: question?.correct,
    };
  }

  /** Uloží ruční úpravu otázky; zástupný štítek tím mizí. Vrací úspěch. */
  function updateQuestion(packId, image, questionIndex, question) {
    const pack = getPack(packId);
    if (!pack) return false;
    const photo = pack.photos.find(p => p.image === image);
    if (!photo) return false;
    if (questionIndex < 0 || questionIndex >= photo.questions.length) return false;
    const authored = authoredQuestion(question);
    if (!isValidQuestion(authored)) return false;
    photo.questions = photo.questions.map((existing, index) =>
      index === questionIndex ? authored : existing
    );
    persist();
    return true;
  }

  /** Přidá autorskou otázku; max 3 otázky na fotku. Vrací úspěch. */
  function addQuestion(packId, image, question) {
    const pack = getPack(packId);
    if (!pack) return false;
    const photo = pack.photos.find(p => p.image === image);
    if (!photo) return false;
    if (photo.questions.length >= QUESTION_LIMITS.maxQuestionsPerPhoto) return false;
    const authored = authoredQuestion(question);
    if (!isValidQuestion(authored)) return false;
    photo.questions = [...photo.questions, authored];
    persist();
    return true;
  }

  /** Smaže otázku; fotka si vždy nechá aspoň jednu. Vrací úspěch. */
  function removeQuestion(packId, image, questionIndex) {
    const pack = getPack(packId);
    if (!pack) return false;
    const photo = pack.photos.find(p => p.image === image);
    if (!photo) return false;
    if (photo.questions.length <= QUESTION_LIMITS.minQuestionsPerPhoto) return false;
    if (questionIndex < 0 || questionIndex >= photo.questions.length) return false;
    photo.questions = photo.questions.filter((_, index) => index !== questionIndex);
    persist();
    return true;
  }

  /**
   * Přeskládá fotky balíčku do zadaného pořadí (podle jmen souborů). Pořadí
   * pole `photos` JE pořadím přehrávání. `imagesInOrder` musí být permutací
   * současných fotek balíčku; jinak se nic nezmění. Vrací úspěch.
   */
  function setPhotoOrder(packId, imagesInOrder) {
    const pack = getPack(packId);
    if (!pack) return false;
    if (!Array.isArray(imagesInOrder)) return false;
    if (imagesInOrder.length !== pack.photos.length) return false;

    const byImage = new Map(pack.photos.map(photo => [photo.image, photo]));
    const reordered = [];
    for (const image of imagesInOrder) {
      const photo = byImage.get(image);
      if (!photo || !byImage.delete(image)) return false; // unknown or duplicate
      reordered.push(photo);
    }

    pack.photos = reordered;
    persist();
    return true;
  }

  return {
    packs,
    getPack,
    getQuizData,
    packMetadata,
    metadata: packMetadata, // backward-compat alias (CustomizationView)
    updateQuestion,
    addQuestion,
    removeQuestion,
    setPhotoOrder,
    reloadPack,
    reloadLibrary,
    ensureInitialized,
  };
});
