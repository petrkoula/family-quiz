# Feature: Quick Start Quiz from Card

## Background
As a quiz presenter
I want to start a quiz immediately from the landing page card
So that I can quickly begin a presentation without configuring settings

## Acceptance Criteria

### Scenario 1: Quiz card displays quick start option
**Given** I am on the landing page viewing quiz packs
**When** I view a quiz pack card
**Then** I should see a "Play Now" or quick start button
**And** the card's menu should offer a "Nastavení kvízu" option for accessing settings

### Scenario 2: Quick start launches quiz with defaults
**Given** I am on the landing page viewing a quiz pack
**When** I click the "Play Now" button on a quiz card
**Then** the quiz presentation should begin immediately
**And** the quiz should use default settings
**And** I should not be prompted to configure settings

### Scenario 3: Default settings are applied on quick start
**Given** I clicked "Play Now" on a quiz card
**When** the quiz presentation begins
**Then** no timer should be active
**And** all 3 questions per photo should be available
**And** photos should appear in original order
**And** questions should appear in original order

### Scenario 4: "Nastavení kvízu" shows configuration options
**Given** I am on the landing page viewing a quiz pack
**When** I choose "Nastavení kvízu" from the quiz card's menu
**Then** I should be shown the quiz configuration options
**And** I should see all setting options
**And** I should see "Start Quiz" and "Skip" buttons

### Scenario 5: Quick start and customize are clearly distinguished
**Given** I am viewing a quiz pack card
**When** I look at the available actions
**Then** the "Play Now" button should be visually prominent
**And** the "Nastavení kvízu" menu option should be clearly labeled
**And** both actions should be easily accessible on desktop
**And** both actions should be easily accessible on mobile

### Scenario 6: Quick start works for all quiz packs
**Given** there are multiple quiz packs on the landing page
**When** I click "Play Now" on any quiz pack
**Then** the quiz should begin with that specific quiz pack
**And** default settings should apply
**And** the correct quiz photos should be displayed

### Scenario 7: Quick start is keyboard accessible
**Given** I am on the landing page with keyboard focus on a quiz card
**When** I navigate to the "Play Now" button using Tab key
**And** I press Enter or Space
**Then** the quiz should start immediately with default settings

## Non-Functional Requirements
- Quick start should load presenter within 1 second
- Button labels should be clear and unambiguous
- UI should maintain responsive design on all screen sizes
- Keyboard navigation should follow accessibility standards
