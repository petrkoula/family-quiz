# Feature: Quiz Library Synced from Photo Folders, Cached Locally

## Background
As a quiz author
I want the quiz library to mirror my photo folders (one folder per quiz)
And the app to remember the last synced state between visits
So that quizzes live in folders on disk and the app updates only when I ask it to

This builds on:
- `quiz-pack-structure.spec.md` — how a folder maps to a quiz pack (id, humanized
  title, photo list, thumbnail, question matching by filename)
- `quiz-card-reload.spec.md` — how a single card reloads and reports its changes

## Acceptance Criteria

### Scenario 1: Each photo folder appears as a quiz pack
**Given** photo folders exist for "family-vintage", "celebrations" and "funny"
**When** I refresh the library
**Then** the library should show one card per folder
**And** a previously known pack should keep its existing title
**And** a newly discovered pack's title should derive from its folder name (humanized)
**And** each card's photo count should equal the number of photos in its folder

### Scenario 2: Library has a refresh control
**Given** I am on the landing page
**When** I look at the library
**Then** I should see a control to refresh the whole library from current folders

### Scenario 3: New folder becomes a new quiz card
**Given** the library was synced earlier
**And** a new photo folder has since been created with photos in it
**When** I refresh the library
**Then** a new card should appear for that folder
**And** its photos without known questions should have placeholder questions

### Scenario 4: Removed folder disappears from the library
**Given** the library shows a pack whose folder has since been deleted
**When** I refresh the library
**Then** that card should no longer appear in the library

### Scenario 5: Authored questions survive a library sync
**Given** the library already has authored questions for a photo
**When** the library is synced
**Then** that photo's quiz should keep its authored questions
**And** only photos without authored questions should get placeholders

### Scenario 6: Library state persists between visits
**Given** the library was synced and shows packs from folders
**And** a folder has since been added or removed
**When** I leave and open the app again
**Then** I should see the same library as before, immediately
**And** the folder changes should not appear until I refresh the library

### Scenario 7: First visit populates the library from current folders
**Given** I have never opened the app before
**And** photo folders exist for my quizzes
**When** I open the app
**Then** the library should reflect the current photo folders

### Scenario 8: Refresh reports what changed
**Given** folders have changed since the last sync
**When** I refresh the library
**Then** I should see a summary of added and removed packs
**And** if nothing changed, it should say the library is up to date

### Scenario 9: Library refresh is a full sync
**Given** the library shows a pack whose folder has since lost one photo
**When** I refresh the library
**Then** that pack's card should reflect the folder's current photos
**And** the per-photo rules of `quiz-card-reload.spec.md` should apply
  (placeholders for unknown photos, authored questions preserved)

### Scenario 10: The app ships with no built-in quizzes
**Given** I have never opened the app before
**And** no photo folders exist and no library backup exists
**When** I open the app
**Then** the library should be empty
**And** the app should still offer creating my own quiz

## Technical Notes (guidance, not contract)
- The folder source is the same swappable catalog interface used by per-card
  reload; the local-dev implementation reads `images/<pack>/` directories at
  request time. A hosted store (Google DB / Google Photos) replaces it later
  without changing the behaviour above.
- The remembered state lives in browser local storage behind a small storage
  interface, so it can later move to a local DB or hosted store.
- Per-card reload behaviour (placeholders, preservation of authored questions,
  per-card summary) is specified in `quiz-card-reload.spec.md` and must keep
  holding after a library refresh.
- The app bundles no quiz content of its own: all packs, titles and questions
  live in the library state (browser storage + the disk backup of
  `library-disk-backup.spec.md`); authoring happens in the edit screen
  (`quiz-question-editing.spec.md`).
