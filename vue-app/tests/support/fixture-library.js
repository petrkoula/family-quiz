/**
 * Deterministická knihovna kvízů pro testy.
 *
 * Appka žádná vestavěná data nemá (specs/quiz-library-sync.spec.md, scénář 10)
 * — zdrojem pravdy je zapamatovaný stav (localStorage) a záloha na disku.
 * Testy si proto knihovnu PŘEDVYPLNÍ: `seedLibrary()` zapíše fixture packy do
 * localStorage jako zapamatovaný stav, přesně jak by ho zanechala minulá
 * návštěva. Tvar packů zrcadlí dřívější vestavěná data, aby testy zůstaly
 * čitelné (Rodinná Klasika 23 fotek, Retro Styl 8 fotek).
 */
import { LIBRARY_STORAGE_KEY } from '@/data/libraryStorage';

function makeQuestions(file) {
  return [
    {
      text: `Kdo je na fotce ${file}?`,
      options: ['Babička', 'Děda', 'Teta', 'Soused'],
      correct: 0,
    },
    {
      text: `Kde se fotka ${file} fotila?`,
      options: ['Doma', 'Na chatě', 'U moře'],
      correct: 1,
    },
    {
      text: `Ze kterého roku je ${file}?`,
      options: ['1965', '1975', '1985', '1995'],
      correct: 2,
    },
  ];
}

function makePhotos(packId, count) {
  return Array.from({ length: count }, (_, i) => {
    const file = `IMG_4246_${i + 1}.jpg`;
    return { image: `${packId}/${file}`, questions: makeQuestions(file) };
  });
}

/** Čerstvá kopie fixture packů (volat, když test data mutuje). */
export function makeFixturePacks() {
  return [
    {
      id: 'family-vintage',
      title: 'Rodinná Klasika',
      description: 'Vintage rodinné fotografie z 60. až 80. let',
      color: '#4a90e2',
      thumbnail: 'family-vintage/IMG_4246_1.jpg',
      photos: makePhotos('family-vintage', 23),
    },
    {
      id: 'retro-style',
      title: 'Retro Styl',
      description: 'Móda a styl vintage éry',
      color: '#e67e22',
      thumbnail: 'retro-style/IMG_4246_1.jpg',
      photos: makePhotos('retro-style', 8),
    },
    {
      id: 'family-moments',
      title: 'Rodinné Okamžiky',
      description: 'Vzpomínky na rodinné chvíle',
      color: '#27ae60',
      thumbnail: 'family-moments/IMG_4246_2.jpg',
      photos: makePhotos('family-moments', 8),
    },
  ];
}

/** Sdílená read-only instance pro selektory a očekávání v testech. */
export const fixturePacks = makeFixturePacks();

/** Zapíše packy do localStorage jako zapamatovaný stav knihovny. */
export function seedLibrary(packs = fixturePacks) {
  window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify({ packs }));
}

/** Zaseje fixture jen tehdy, když si test nepředvyplnil vlastní stav. */
export function seedLibraryIfEmpty(packs = fixturePacks) {
  if (!window.localStorage.getItem(LIBRARY_STORAGE_KEY)) seedLibrary(packs);
}

/** Očekávaná metadata karty packu (počty fotek/otázek) z fixture dat. */
export function fixtureMetadata(packId) {
  const pack = fixturePacks.find(p => p.id === packId);
  if (!pack) return { photoCount: 0, questionCount: 0 };
  return {
    photoCount: pack.photos.length,
    questionCount: pack.photos.reduce((sum, photo) => sum + photo.questions.length, 0),
  };
}
