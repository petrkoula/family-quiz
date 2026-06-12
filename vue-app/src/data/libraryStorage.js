// Remembered library state — the swappable storage behind the quiz library.
//
// Local default is browser localStorage; behind this interface it can later
// move to a local DB or a hosted store without changing library behaviour.
//
// Beside the primary storage lives a BACKUP (specs/library-disk-backup.spec.md):
// in local dev a JSON file next to the photo folders, written through the
// catalog dev server. Every save mirrors to it fire-and-forget; it is read
// only when the primary storage has no remembered state. Where the backup
// location is unavailable (static production hosting) it quietly no-ops.

const STORAGE_KEY = 'quiz-library-v1';
const BACKUP_URL = '/__catalog/library';

export const LIBRARY_STORAGE_KEY = STORAGE_KEY;

export const browserLibraryStorage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null; // corrupted or unavailable storage → start fresh
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota/unavailable — the app keeps working, state just won't persist
    }
  },
};

export const devServerLibraryBackup = {
  async load() {
    try {
      const res = await fetch(BACKUP_URL);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null; // backup unreachable → behave as if there is no backup
    }
  },
  save(state) {
    try {
      fetch(BACKUP_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      }).catch(() => {});
    } catch {
      // no fetch / unreachable — disk is just a backup, the app keeps working
    }
  },
};

let storage = browserLibraryStorage;
let backup = devServerLibraryBackup;

/** Swap the storage backend (hosted store, or a test fake). */
export function setLibraryStorage(s) {
  storage = s;
}

/** Swap the backup backend (hosted store, or a test fake). */
export function setLibraryBackup(b) {
  backup = b;
}

/** Restore the default backends (browser storage + dev-server backup). */
export function resetLibraryStorage() {
  storage = browserLibraryStorage;
  backup = devServerLibraryBackup;
}

export function loadLibrary() {
  return storage.load();
}

export function saveLibrary(state) {
  storage.save(state);
  backup.save(state); // mirror fire-and-forget; failures stay silent
}

/** Read the backup; resolves null when there is none or it is unreachable. */
export async function loadLibraryBackup() {
  try {
    return (await backup.load()) ?? null;
  } catch {
    return null;
  }
}
