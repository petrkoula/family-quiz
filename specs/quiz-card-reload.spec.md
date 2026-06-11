# Feature: Reload a Quiz Pack from Current Photo Files

## Background
As a quiz author
I want to reload a quiz pack from the photo files that currently exist
So that photos I have added or removed are reflected in the quiz without
hand-editing the quiz data

A quiz pack corresponds to a collection of photo files. Each photo has a set of
questions. Some photos have hand-written questions; photos that have just appeared
do not yet have any.

## Acceptance Criteria

### Scenario 1: Reload control is available on a quiz card
**Given** I am on the landing page viewing a quiz pack card
**When** I open the card's menu
**Then** I should see a "Reload" control for that card

### Scenario 2: Reload picks up newly added photos
**Given** a quiz pack currently has 8 photos
**And** 2 new photo files have since been added to that pack
**When** I reload the card
**Then** the card should show 10 photos
**And** the 2 new photos should become part of the quiz

### Scenario 3: Newly discovered photos get placeholder questions
**Given** a new photo file has been added to a pack
**When** I reload the card
**And** I play the quiz and reach that new photo
**Then** the photo should have questions
**And** those questions should be clearly marked as placeholders awaiting content
**And** the placeholder questions should not claim any answer as correct

### Scenario 4: Reload reflects removed photos
**Given** a quiz pack currently has 8 photos
**And** 1 of its photo files has since been removed
**When** I reload the card
**Then** the card should show 7 photos
**And** the removed photo should no longer appear in the quiz

### Scenario 5: Existing hand-written questions are preserved
**Given** a photo already has hand-written questions
**When** I reload the card
**Then** that photo should keep its existing questions unchanged
**And** its questions should not be replaced with placeholders

### Scenario 6: Reload with no file changes leaves the pack unchanged
**Given** a quiz pack whose photo files have not changed
**When** I reload the card
**Then** the card should show the same number of photos as before
**And** every photo should keep the same questions as before

### Scenario 7: Card metadata stays consistent after reload
**Given** a quiz pack with 8 photos, each with 3 questions
**And** 2 new photos are added and then the card is reloaded
**When** I view the card
**Then** the photo count should read "10 fotek"
**And** the question count should include the placeholder questions of the new photos

### Scenario 8: Author gets feedback about what reload changed
**Given** I reload a quiz pack card
**When** the reload completes
**Then** I should see a summary of the result
**And** the summary should indicate how many photos were added or removed
**And** if nothing changed, it should indicate that the pack is up to date

### Scenario 9: Placeholders give way to newly written questions
**Given** a photo currently has placeholder questions
**And** hand-written questions for that photo have since become available
**When** I reload the card
**Then** the photo should use the hand-written questions
**And** photos whose questions were already hand-written keep them unchanged

## Technical Notes (guidance, not contract)
- The set of "current photo files" comes from a **swappable catalog source**.
  - For local development the source scans the project's image files directly.
  - The longer-term target is a hosted store (e.g. a Google-hosted database or
    object store); the catalog source is an interface so this can be swapped
    without changing the reload behaviour above.
- A "placeholder question" is a question whose text marks it as not yet written
  and whose options expose no correct answer, so a photo is always playable but
  visibly incomplete until an author fills it in.
- Reload must never overwrite a photo's existing (non-placeholder) questions;
  it only adds questions for photos that have none and drops photos whose files
  are gone.
