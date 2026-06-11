# Feature: Reorder a pack's photos in the edit screen

## Background
As a quiz author editing a pack
I want to rearrange the order of its photos by dragging them
So that the presentation plays the photos in the story order I want

The edit screen normally shows one expandable box per photo (its questions).
Reordering is a distinct mode reached from a menu: the boxes collapse to
compact draggable rows, the author drags them into the desired order, and an
explicit Save commits the new order. The chosen order is a property of the pack
(remembered between sessions) and is the order the presentation plays.

## Acceptance Criteria

### Scenario 1: A menu offers entering reorder mode
**Given** I open the edit screen of a quiz pack
**Then** the screen should offer a menu in the top-right corner
**And** the menu should contain a "Upravit pořadí" (reorder) option
**And** the photo boxes should be expanded (showing their questions)

### Scenario 2: Entering reorder mode collapses the boxes and reveals Save
**Given** I am on the edit screen
**When** I choose "Upravit pořadí" from the menu
**Then** every photo should appear as a collapsed row (no question editing)
**And** each collapsed row should show the photo and its position (1, 2, 3, …)
**And** a "Uložit" (save) control should appear in the top-left corner
**And** the menu's "Upravit pořadí" option should no longer be offered

### Scenario 3: Dragging a photo changes the order
**Given** I am in reorder mode
**When** I drag the photo at position 1 onto position 3
**Then** that photo should move to position 3
**And** the photos previously at positions 2 and 3 should shift up to 1 and 2
**And** all other photos should keep their relative order

### Scenario 4: Saving commits the new order and expands the boxes
**Given** I rearranged the photos in reorder mode
**When** I press "Uložit"
**Then** the screen should leave reorder mode
**And** the photo boxes should be expanded again (questions editable)
**And** the boxes should appear in my new order

### Scenario 5: The chosen order survives an app restart
**Given** I rearranged the photos and saved
**When** I close and reopen the edit screen of the same pack later
**Then** the photos should appear in my saved order

### Scenario 6: The presentation plays photos in the saved order
**Given** I rearranged a pack's photos and saved
**When** I start that pack
**Then** the first displayed photo should be the one I placed first
**And** navigating forward should follow my arrangement photo by photo

### Scenario 7: Cancelling reorder mode keeps the original order
**Given** I entered reorder mode and dragged some photos around
**When** I press "Zrušit" (cancel) instead of saving
**Then** the screen should leave reorder mode
**And** the photos should appear in their original order
**And** a later visit should also show the original order

## Non-Functional Requirements
- Reorder mode and editing mode are mutually exclusive: while reordering, the
  per-question controls (edit, add, delete) are not shown.
- The collapsed rows should stay usable for packs with many photos (the list
  scrolls — see the layout scroll fix).
- The drag handle / row should have a clear accessible label naming the photo.

## Technical Notes (guidance, not contract)
- Persistence reuses the existing library layer: the pack's `photos` array IS
  the play order, stored under `quiz-library-v1` and read by
  `packLibraryStore.getQuizData()` for the presenter. Reordering therefore just
  reorders that array and persists — no separate `photoOrder` field.
- The store exposes `setPhotoOrder(packId, imagesInOrder)`: it rearranges the
  pack's photos to match the given filename order (must be a permutation of the
  pack's current photos) and persists. Invalid input is rejected (returns
  false), leaving the order untouched.
- The edit screen keeps a local working copy of the order while dragging; only
  Save calls `setPhotoOrder`. Cancel discards the working copy.
- Drag-and-drop is native HTML5 (`draggable`): the dragged row's index is held
  in component state on `dragstart`; `drop` on a target row moves the dragged
  photo to the target position.
