# Feature: Resume a Quiz in Progress

## Background
As a quiz presenter
I want to leave a running quiz back to the library and resume it later
So that an interrupted game night can continue right where it left off

This builds on:
- `quick-start-quiz.spec.md` — how a quiz starts from a card (Spustit, defaults)
- `landing-page.spec.md` — the quiz library cards

## Acceptance Criteria

### Scenario 1: Esc returns from a running quiz to the library
**Given** a quiz is running in the presenter
**And** no questions are visible
**When** I press Esc
**Then** I should be back on the landing page
**And** the quiz should be marked as in progress

### Scenario 2: In-progress quiz card offers "Pokračovat"
**Given** a quiz is in progress
**When** I view the library
**Then** that quiz's card should show a "Pokračovat" button instead of "Spustit"
**And** every other card should still show "Spustit"

### Scenario 3: "Pokračovat" resumes at the same spot
**Given** a quiz was left in progress on a later photo
**When** I click "Pokračovat" on its card
**Then** the presenter should open
**And** the quiz should continue from the same photo

### Scenario 4: Esc with questions visible only hides questions
**Given** a quiz is running and questions are visible
**When** I press Esc
**Then** the questions should hide
**And** the presenter should stay open

### Scenario 5: A fresh start clears previous progress
**Given** a quiz is in progress
**When** I start a quiz with "Spustit"
**Then** the quiz should start from the first photo
**And** no quiz should be marked as in progress anymore

## Technical Notes (guidance, not contract)
- Esc keeps its cascade in the presenter: help overlay closes first, then open
  questions hide, then fullscreen exits, and only then Esc leaves to the library.
- Position (photo/question index) lives in the game store; resume must not
  reset it — only a fresh `selectQuizPack` (Spustit / Start Quiz) does.
