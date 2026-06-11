# Feature: Keyboard Help Overlay in the Presenter

## Background
As a quiz presenter
I want to call up an overview of all keyboard controls right inside the presentation
So that I don't have to remember them or look them up in a guide

## Acceptance Criteria

### Scenario 1: Presenter hints that help is available
**Given** I am presenting a quiz
**When** I look at the on-screen hints
**Then** I should see that pressing "?" opens the keyboard help

### Scenario 2: "?" opens the help overlay
**Given** I am presenting a quiz
**When** I press "?"
**Then** a help overlay should appear above the presentation
**And** it should list every presentation control with what it does:
  showing/hiding questions, switching photos, switching questions,
  revealing the answer, fullscreen, and closing/hiding

### Scenario 3: "?" again closes the overlay
**Given** the help overlay is open
**When** I press "?"
**Then** the overlay should disappear
**And** the presentation should look the same as before opening it

### Scenario 4: ESC closes the overlay without side effects
**Given** the questions panel is open
**And** the help overlay is open above it
**When** I press ESC
**Then** the overlay should close
**And** the questions panel should stay open

### Scenario 5: Help is available in any presentation state
**Given** I am presenting with the questions panel open
**When** I press "?"
**Then** the help overlay should appear
**And** after closing it the questions panel should still be open
