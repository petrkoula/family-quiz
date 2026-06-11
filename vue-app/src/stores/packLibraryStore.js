import { defineStore } from 'pinia';
import { ref } from 'vue';
import { quizPacks, getQuizDataForPack } from '@/data/quizPacks';
import { listPhotos } from '@/data/photoCatalog';

const PLACEHOLDER_QUESTION_COUNT = 3;

/**
 * Placeholder questions for a freshly discovered photo: clearly marked as not
 * yet written, and with no option flagged as correct.
 */
export function makePlaceholderQuestions() {
  return Array.from({ length: PLACEHOLDER_QUESTION_COUNT }, () => ({
    text: 'Doplň otázku',
    options: ['—', '—', '—', '—'],
    correct: null,
    placeholder: true,
  }));
}

/** Build the initial reactive pack list from the bundled quiz data. */
function buildInitialPacks() {
  return quizPacks.map(pack => ({
    id: pack.id,
    title: pack.title,
    description: pack.description,
    thumbnail: pack.thumbnail,
    color: pack.color,
    photos: getQuizDataForPack(pack.id).map(item => ({
      image: item.image,
      questions: item.questions,
    })),
  }));
}

/**
 * Reactive library of quiz packs the landing page renders. Unlike the static
 * quizPacks data, this can be reloaded from the current photo files.
 */
export const usePackLibraryStore = defineStore('packLibrary', () => {
  const packs = ref(buildInitialPacks());

  function getPack(packId) {
    return packs.value.find(p => p.id === packId) || null;
  }

  function metadata(packId) {
    const pack = getPack(packId);
    if (!pack) return { photoCount: 0, questionCount: 0 };
    return {
      photoCount: pack.photos.length,
      questionCount: pack.photos.reduce((sum, photo) => sum + photo.questions.length, 0),
    };
  }

  /**
   * Reload a pack from the current photo files: add newly discovered photos
   * (with placeholder questions), drop photos whose files are gone, and keep
   * the existing questions of photos that remain.
   * @returns {Promise<{added: number, removed: number}>}
   */
  async function reloadPack(packId) {
    const pack = getPack(packId);
    if (!pack) return { added: 0, removed: 0 };

    const currentImages = pack.photos.map(photo => photo.image);
    const latestImages = await listPhotos(packId, currentImages);

    const added = latestImages.filter(img => !currentImages.includes(img));
    const removed = currentImages.filter(img => !latestImages.includes(img));

    pack.photos = latestImages.map(img => {
      const existing = pack.photos.find(photo => photo.image === img);
      return existing || { image: img, questions: makePlaceholderQuestions() };
    });

    return { added: added.length, removed: removed.length };
  }

  return { packs, getPack, metadata, reloadPack };
});
