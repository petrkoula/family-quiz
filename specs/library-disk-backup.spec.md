# Feature: Library Backup Stored Beside the Photo Folders

## Background
As a quiz author
I want the app to keep a backup of my quiz library beside the photo folders
So that my titles, authored questions and photo ordering survive a lost or
different browser
While the state remembered by the browser stays the source of truth day to day

This builds on:
- `quiz-library-sync.spec.md` — how the library mirrors photo folders and is
  remembered between visits
- `quiz-card-reload.spec.md` — per-pack reload rules (placeholders, preserved
  hand-written questions)

## Acceptance Criteria

### Scenario 1: Library changes are mirrored to the backup
**Given** the library is loaded
**When** the library changes (first sync, a refresh, an edit)
**Then** the backup beside the photo folders should match the library's current state

### Scenario 2: Remembered state stays primary between visits
**Given** the app remembers my library from a previous visit
**And** the backup contains a different library state
**When** I open the app
**Then** I should see the remembered library, not the backup's content

### Scenario 3: Lost browser memory is restored from the backup
**Given** the app has no remembered library (a new browser, or one whose memory of the app was wiped)
**And** a backup exists beside the photo folders
**When** I open the app
**Then** the library should be restored from the backup
**And** my custom titles and authored questions should be back
**And** the restored library should be remembered for the next visit

### Scenario 4: Restoring from backup does not silently sync folders
**Given** the app has no remembered library
**And** a backup exists beside the photo folders
**And** the photo folders have changed since the backup was written
**When** I open the app
**Then** I should see the backed-up library
**And** the folder changes should appear only after I refresh the library

### Scenario 5: First visit with no backup populates from folders
**Given** the app has no remembered library
**And** no backup exists beside the photo folders
**When** I open the app
**Then** the library should reflect the current photo folders

### Scenario 6: The app works when the backup location is unavailable
**Given** the backup location is unavailable
**When** the library changes
**Then** the app should keep working without errors
**And** the change should still be remembered for the next visit

## Technical Notes (guidance, not contract)
- The backup lives as human-readable JSON at the images root, next to the pack
  folders: `images/library.json`. It holds the same state shape as the
  remembered library.
- The browser cannot write files; in local dev the catalog dev server gains a
  `GET`/`PUT /__catalog/library` endpoint pair that reads/writes
  `<imagesRoot>/library.json` at request time (same pattern as `/__catalog/packs`).
- Client side, the backup is a second swappable storage behind
  `libraryStorage.js` (like the photo catalog sources): every save mirrors to
  it fire-and-forget; it is read only when the browser has no remembered state.
- On static production hosting the endpoints don't exist: backup load returns
  "nothing", backup save quietly no-ops — behaviour falls back to
  `quiz-library-sync.spec.md` exactly as today. A hosted store later replaces
  the backup the same way it replaces the catalog sources.
