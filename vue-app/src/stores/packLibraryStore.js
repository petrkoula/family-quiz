import { defineStore } from 'pinia';
import { ref } from 'vue';
import { quizPacks, getQuizDataForPack } from '@/data/quizPacks';
import { quizData } from '@/data/quizData';
import { listPhotos, listPacks } from '@/data/photoCatalog';
import { loadLibrary, saveLibrary } from '@/data/libraryStorage';

const PLACEHOLDER_QUESTION_COUNT = 3;
const PACK_COLORS = ['#4a90e2', '#e67e22', '#27ae60', '#9b59b6', '#e74c3c', '#16a085'];

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

/** "family-vintage" → "Family Vintage" */
export function humanizeTitle(folderName) {
  return folderName
    .split(/[-_]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Hand-written questions from the bundled data, keyed by photo filename.
// Synced packs match their photos against this bank; only unknown photos
// fall back to placeholders.
const questionBank = new Map(quizData.map(item => [item.image, item.questions]));

/** Bare filename of a photo path ("family-vintage/IMG_1.jpg" → "IMG_1.jpg"). */
function filenameOf(imagePath) {
  return imagePath.split('/').pop();
}

/** Static seed shown until the first sync with the folder source. */
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
 * Reactive library of quiz packs the landing page renders. State is remembered
 * between visits (libraryStorage) and changes only on explicit reloads, which
 * sync it with the photo-folder catalog (photoCatalog).
 */
export const usePackLibraryStore = defineStore('packLibrary', () => {
  const remembered = loadLibrary();
  const packs = ref(remembered?.packs ?? buildInitialPacks());
  // With no remembered state the library still needs its first folder sync.
  const initialized = ref(remembered != null);

  function persist() {
    saveLibrary({ packs: packs.value });
  }

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
   * Photo entry for a catalog filename. Hand-written questions of an already
   * known photo are never replaced; placeholder questions give way to the
   * bank as soon as it has hand-written ones for the filename. The image path
   * is always canonical `<packId>/<file>`.
   */
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

  /**
   * Sync one pack's photos with the catalog: add newly discovered photos,
   * drop photos whose files are gone, keep existing questions.
   * @returns {Promise<{added: number, removed: number}>}
   */
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

  /**
   * Full sync of the whole library with the folder catalog: new folders become
   * packs, packs whose folders are gone disappear, and every surviving pack's
   * photos are synced (same per-photo rules as reloadPack).
   * @returns {Promise<{addedPacks: number, removedPacks: number, updatedPacks: number} | null>}
   *          null when the folder source is unreachable (library unchanged).
   */
  async function reloadLibrary() {
    const catalog = await listPacks();
    if (!catalog) return null;

    const beforeIds = packs.value.map(p => p.id);
    let updatedPacks = 0;

    packs.value = catalog
      .filter(entry => entry.photos.length > 0) // empty folders are not packs
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

  /**
   * First-visit hook: with no remembered state, populate the library from the
   * current folders (when reachable). Never re-syncs an already remembered
   * library — that only happens on explicit reload.
   */
  async function ensureInitialized() {
    if (initialized.value) return;
    initialized.value = true;
    await reloadLibrary(); // unreachable source → keep the static seed
  }

  return { packs, getPack, metadata, reloadPack, reloadLibrary, ensureInitialized };
});
