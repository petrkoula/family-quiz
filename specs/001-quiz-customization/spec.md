# Feature: Quiz Customization Settings

## Background
As a quiz presenter
I want to customize quiz settings before starting a presentation
So that I can adapt the quiz experience to my audience and presentation style

## Acceptance Criteria

### Scenario 1: Access customization settings from landing page
**Given** I am on the landing page viewing a quiz pack
**When** I click on a quiz pack card
**Then** I should see customization options before entering presenter mode
**And** I should see a "Start Quiz" button to proceed with selected settings
**And** I should see a "Skip" or "Use Defaults" option to bypass customization

### Scenario 2: Configure question timer duration
**Given** I am on the quiz customization screen
**When** I view timer settings
**Then** I should see an option to enable or disable question timers
**And** I should see a duration selector for timer length
**And** timer duration options should include: 30s, 45s, 60s, 90s, 120s, "No timer"
**And** the default should be "No timer"

### Scenario 3: Configure number of questions per photo
**Given** I am on the quiz customization screen
**When** I view question settings
**Then** I should see an option to select questions per photo
**And** options should include: 1, 2, 3, or "All questions"
**And** the default should be "All questions" (3)
**And** selecting fewer questions should randomly select from available questions

### Scenario 4: Enable photo and question randomization
**Given** I am on the quiz customization screen
**When** I view order settings
**Then** I should see a toggle to randomize photo order
**And** I should see a toggle to randomize question order within each photo
**And** both toggles should be off by default

### Scenario 5: Preview customization summary
**Given** I have configured quiz settings
**When** I review my selections
**Then** I should see a summary showing:
  - Timer setting
  - Questions per photo
  - Randomization settings
  - Total number of photos
  - Total number of questions (based on questions per photo)

### Scenario 6: Start quiz with custom settings
**Given** I have configured quiz settings on the customization screen
**When** I click "Start Quiz"
**Then** the presenter view should load
**And** the quiz should apply my selected settings
**And** photos should appear in randomized order if randomization was enabled
**And** only the configured number of questions should be available per photo
**And** question timer should activate if enabled

### Scenario 7: Skip customization and use defaults
**Given** I am on the quiz customization screen
**When** I click "Skip" or "Use Defaults"
**Then** the presenter view should load immediately
**And** the quiz should use default settings:
  - No timer
  - All 3 questions per photo
  - Original photo order
  - Original question order

### Scenario 8: Settings persist during quiz session
**Given** I started a quiz with custom timer settings
**When** I navigate through photos and questions
**Then** the timer should apply to every question consistently
**And** randomization should remain stable throughout the session
**And** the configured number of questions should apply to all photos

### Scenario 9: Return to customization from presenter
**Given** I am in presenter mode
**When** I exit to the landing page and select the same quiz again
**Then** I should see the customization screen again
**And** previous settings should not be remembered (start fresh)
**And** all options should be at default values

### Scenario 10: Customization screen is responsive
**Given** I am on the quiz customization screen
**When** I view it on different screen sizes
**Then** all controls should be accessible and usable
**And** the layout should adapt to mobile, tablet, and desktop viewports
**And** touch controls should work on mobile devices

## Non-Functional Requirements
- Settings should apply instantly when starting quiz
- Timer should be visually prominent when enabled
- Settings screen should load quickly (under 1 second)
- All controls should have clear labels and helpful tooltips
