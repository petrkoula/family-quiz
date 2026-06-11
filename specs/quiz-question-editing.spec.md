# Feature: Quiz Question Editing

## Background

As a quiz presenter
I want to adjust the questions of a quiz pack — wording, answer options and the correct answer
So that the quiz fits my family and my adjustments are kept for future sessions

### Vocabulary

- **Quiz pack card** — a quiz pack shown in the library on the landing page.
- **Editing screen** — the screen where one quiz pack's photos and questions can be adjusted.
- **Suggested question** — a question that was prepared automatically as a draft;
  it is visibly marked as a suggestion until a person confirms it by editing.
- **Authored question** — a question written or confirmed by a person; it is never
  replaced by automatic content.

## Acceptance Criteria

### Scenario 1: Editing screen is reachable from a quiz card

**Given** I am on the landing page viewing quiz packs
**When** I choose "Upravit" on a quiz pack card
**Then** I should see the editing screen for that quiz pack
**And** I should see every photo of the pack together with its questions
**And** each question should show its text, all its options and which option is correct

### Scenario 2: Edit a question's text, options and correct answer

**Given** I am on the editing screen of a quiz pack
**When** I open a question for editing
**And** I change the question text and one of its options
**And** I mark a different option as the correct answer
**And** I save the question
**Then** the question list shows the new text and the new option
**And** the newly chosen option is marked as the correct one

### Scenario 3: Edited questions play in the presentation

**Given** I edited and saved a question of a quiz pack
**When** I start the presentation of that quiz pack
**Then** the presentation shows the edited question with its edited options
**And** revealing the answer highlights the newly chosen correct option

### Scenario 4: Edits survive an application reload

**Given** I edited and saved a question
**When** I close and reopen the application
**Then** the editing screen still shows my edited question

### Scenario 5: Editing a suggested question turns it into an authored one

**Given** a photo in a quiz pack has a suggested question, visibly marked as a suggestion
**When** I edit that question and save it
**Then** the suggestion mark disappears
**And** after an application reload the question is still my edited version, without the mark

### Scenario 6: A photo holds at most three questions

**Given** a photo on the editing screen has three questions
**Then** there is no way to add another question to that photo
**When** I delete one of its questions
**Then** the photo shows the remaining questions
**And** adding a question becomes possible
**And** after a new question is added (back to three) the possibility disappears again
**And** a photo always keeps at least one question — the last one cannot be deleted

### Scenario 7: A question offers two to four options

**Given** I am editing a question that has two options
**Then** there is no way to remove another option
**When** I add options until the question has four
**Then** there is no way to add a fifth option

### Scenario 8: An incomplete question cannot be saved

**Given** I am editing a question
**When** I clear the question text or one of its options
**Then** the question cannot be saved until the missing text is filled in

### Scenario 9: Cancelling an edit keeps the question unchanged

**Given** I am editing a question
**When** I change its text and then cancel the edit
**Then** the question list still shows the original question

## Non-Functional Requirements

- All editing texts are in Czech.
- The editing screen offers a way back to the library.
- Adjustments apply to the presentation immediately — no separate publish step.

## Technical Notes (guidance, not contract)

- Route: `/edit/:quizId`, entered via the "Upravit" option in the quiz card's menu.
- Persistence goes through the pack library layer: a Pinia store
  (`packLibraryStore`) backed by `libraryStorage` writing the localStorage key
  `quiz-library-v1`. Stored data holds **per-photo question overrides** —
  whatever a person saved is authored content.
- Merge rule on load: an authored (stored) photo entry always wins over the
  catalog's questions for that photo; photos without stored entries fall back to
  the catalog. Catalog questions may carry `placeholder: true`; saving an edit
  stores the photo's questions with the flag cleared, so placeholders give way
  to hand-written content and authored questions are never clobbered.
- The presenter obtains pack data through the same library layer, so edits play
  immediately.
- Limits enforced both in UI and store actions: 1–3 questions per photo,
  2–4 non-empty options, correct index within range, non-empty question text.
- Tests inject a fake pack catalog (`setPackCatalogSource`) instead of touching
  network/disk, and reset localStorage between tests.
