// Photo catalog — the swappable source of "current photo files" for quiz packs.
//
// Two questions can be asked of it:
//   listPhotos(packId, current)  -> which photos exist for one pack (per-card reload)
//   listPacks()                  -> which packs (folders) exist, with their photos
//                                   (library refresh)
//
// The local-dev defaults talk to the dev-server catalog endpoints, which read
// the `images/<pack>/` folders at request time. When the source is unreachable
// (production static hosting, tests without injection) they fall back to
// "no changes" so a reload never wipes data. The longer-term target is a hosted
// store (e.g. a Google-hosted database / Google Photos): swap the sources with
// the setters below without touching reload behaviour. Tests inject
// deterministic fakes the same way.

/**
 * @typedef {(packId: string, currentImages: string[]) => string[] | Promise<string[]>} PhotosSource
 * @typedef {() => Array<{id: string, photos: string[]}> | null | Promise<Array<{id: string, photos: string[]}> | null>} PacksSource
 */

/** @type {PhotosSource} */
async function defaultPhotosSource(packId, currentImages) {
  try {
    const res = await fetch(`/__catalog/packs/${encodeURIComponent(packId)}/photos`);
    if (!res.ok) return currentImages;
    return await res.json();
  } catch {
    return currentImages; // source unreachable → report no changes
  }
}

/** @type {PacksSource} */
async function defaultPacksSource() {
  try {
    const res = await fetch('/__catalog/packs');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // source unreachable → library refresh is a no-op
  }
}

let photosSource = defaultPhotosSource;
let packsSource = defaultPacksSource;

/** Swap the per-pack photos source (production store, or a test fake). */
export function setPhotoCatalogSource(fn) {
  photosSource = fn;
}

/** Swap the whole-library packs source (production store, or a test fake). */
export function setPackCatalogSource(fn) {
  packsSource = fn;
}

/** Restore both default sources. */
export function resetPhotoCatalogSource() {
  photosSource = defaultPhotosSource;
  packsSource = defaultPacksSource;
}

/**
 * List the filenames of photos that currently exist for a pack.
 * @param {string} packId
 * @param {string[]} currentImages filenames the pack already knows about
 * @returns {Promise<string[]>}
 */
export async function listPhotos(packId, currentImages) {
  return photosSource(packId, currentImages);
}

/**
 * List the packs (photo folders) that currently exist, with their photos.
 * Returns null when the source is unreachable.
 * @returns {Promise<Array<{id: string, photos: string[]}> | null>}
 */
export async function listPacks() {
  return packsSource();
}
