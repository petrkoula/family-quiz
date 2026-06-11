# Feature: Landing Page with Quiz Library

## Background
As a user visiting the quiz application
I want to see a landing page with a library of available quizzes
So that I can browse and select quizzes organized by category

## Acceptance Criteria

### Scenario 1: Landing page displays on root route
**Given** I am a user visiting the application
**When** I navigate to the root URL "/"
**Then** I should see the landing page
**And** I should see a page title or heading
**And** I should see a library section showing quiz packs

### Scenario 2: Quiz library displays organized quiz packs
**Given** I am on the landing page
**When** the page loads
**Then** I should see multiple quiz pack cards
**And** each card should display a title
**And** each card should display a description
**And** each card should display the number of photos
**And** each card should display the number of questions
**And** each card should display a thumbnail image

### Scenario 3: Quiz packs are organized by subfolder
**Given** quiz images are organized in subfolders under /images/
**When** the application loads quiz data
**Then** each subfolder should represent one quiz pack
**And** the quiz pack should include all images from that subfolder
**And** the quiz pack metadata should be derived from subfolder structure

### Scenario 4: User can select a quiz pack to play
**Given** I am on the landing page viewing quiz packs
**When** I click on a quiz pack card
**Then** I should navigate to the presenter view
**And** the presenter should load the selected quiz pack
**And** I should see the first photo from the selected quiz pack

### Scenario 5: Create your own quiz CTA is visible
**Given** I am on the landing page
**When** I scroll to view all content
**Then** I should see a "Create Your Own" section or button
**And** clicking it should indicate future functionality

### Scenario 6: Quiz cards display accurate metadata
**Given** a quiz pack has 10 photos
**And** each photo has 3 questions
**When** I view that quiz pack's card
**Then** it should display "10 fotek" (10 photos)
**And** it should display "30 otázek" (30 questions)

### Scenario 7: Landing page is responsive
**Given** I am on the landing page
**When** I resize the browser window
**Then** quiz cards should arrange in a responsive grid
**And** content should remain readable on mobile sizes
**And** images should scale appropriately

### Scenario 8: Quiz pack thumbnails load correctly
**Given** a quiz pack has images in a subfolder
**When** I view the quiz pack card
**Then** I should see a thumbnail from that quiz pack
**And** the image should load without errors
**And** the image should have appropriate alt text

## Technical Requirements

### Data Structure
- Quiz packs should be auto-discovered from `/images/[subfolder]/` structure
- Each subfolder becomes one quiz pack
- Metadata should include:
  - `id`: subfolder name
  - `title`: derived from subfolder name (humanized)
  - `description`: optional, can be auto-generated or manual
  - `photoCount`: number of images in subfolder
  - `questionCount`: photoCount × 3
  - `thumbnail`: first image from subfolder
  - `images`: array of image filenames

### Routes
- `/` → Landing page with quiz library
- `/presenter/:quizId` → Presenter view for selected quiz pack

### Non-Functional Requirements
- Page should load within 2 seconds
- Images should lazy-load for performance
- Should work without authentication (public access)
- Should maintain existing presenter functionality
