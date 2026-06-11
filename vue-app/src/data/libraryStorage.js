// Remembered library state — the swappable storage behind the quiz library.
//
// Local default is browser localStorage; behind this interface it can later
// move to a local DB or a hosted store without changing library behaviour.

const STORAGE_KEY = 'quiz-library-v1';

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

let storage = browserLibraryStorage;

/** Swap the storage backend (hosted store, or a test fake). */
export function setLibraryStorage(s) {
  storage = s;
}

/** Restore the browser localStorage backend. */
export function resetLibraryStorage() {
  storage = browserLibraryStorage;
}

export function loadLibrary() {
  return storage.load();
}

export function saveLibrary(state) {
  storage.save(state);
}
