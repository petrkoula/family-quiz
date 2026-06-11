// Photo catalog — the swappable source of "current photo files" for a quiz pack.
//
// The reload feature asks this module which photos currently exist for a pack.
// For local development the default source scans bundled image files. The
// longer-term target is a hosted store (e.g. a Google-hosted database / object
// store): swap the source with `setPhotoCatalogSource` without touching the
// reload behaviour. Tests inject a deterministic fake source the same way.

/**
 * @typedef {(packId: string, currentImages: string[]) => string[] | Promise<string[]>} PhotoCatalogSource
 * Returns the filenames of the photos that currently exist for the pack.
 */

/**
 * Local-dev default: until images are organised per pack on disk (or a hosted
 * store is wired up), report the pack's current photos unchanged. This keeps
 * reload safe (never wipes a pack) while the real source is being built out.
 *
 * @type {PhotoCatalogSource}
 */
function defaultLocalSource(_packId, currentImages) {
  return currentImages;
}

let source = defaultLocalSource;

/** Swap the catalog source (production store, or a test fake). */
export function setPhotoCatalogSource(fn) {
  source = fn;
}

/** Restore the local-dev default source. */
export function resetPhotoCatalogSource() {
  source = defaultLocalSource;
}

/**
 * List the filenames of photos that currently exist for a pack.
 * @param {string} packId
 * @param {string[]} currentImages filenames the pack already knows about
 * @returns {Promise<string[]>}
 */
export async function listPhotos(packId, currentImages) {
  return source(packId, currentImages);
}
