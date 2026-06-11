# Feature: Quiz Pack Data Structure from Image Subfolders

## Background
As a system organizing quiz content
I want to automatically discover and structure quiz packs from image subfolders
So that adding new quizzes is as simple as creating a new subfolder with images

## Acceptance Criteria

### Scenario 1: Discover quiz packs from image subfolders
**Given** the `/images/` directory contains subfolders
**And** each subfolder contains image files
**When** the application initializes
**Then** each subfolder should be identified as a quiz pack
**And** a quiz pack object should be created for each subfolder

### Scenario 2: Generate quiz pack metadata from subfolder
**Given** a subfolder exists at `/images/family-vintage/`
**And** it contains 15 JPG images
**When** the quiz pack is created
**Then** the pack `id` should be "family-vintage"
**And** the pack `title` should be "Family Vintage" (humanized)
**And** the `photoCount` should be 15
**And** the `questionCount` should be 45 (15 × 3)

### Scenario 3: Each quiz pack includes image list
**Given** a subfolder `/images/weddings/` contains:
```
wedding1.jpg
wedding2.jpg
wedding3.jpg
```
**When** the quiz pack is loaded
**Then** the pack should include an `images` array
**And** the array should contain all three image filenames
**And** images should be in sorted order

### Scenario 4: Quiz pack uses first image as thumbnail
**Given** a quiz pack has multiple images
**When** displaying the pack in the library
**Then** the first image (alphabetically) should be used as thumbnail
**And** the thumbnail path should be `/images/[subfolder]/[firstImage]`

### Scenario 5: Handle empty or invalid subfolders
**Given** a subfolder exists but contains no images
**When** discovering quiz packs
**Then** that subfolder should be skipped
**And** no quiz pack should be created for it

### Scenario 6: Support common image formats
**Given** a subfolder contains mixed image formats
**When** scanning for images
**Then** JPG files should be included
**And** JPEG files should be included
**And** PNG files should be included
**And** non-image files should be excluded

### Scenario 7: Quiz data structure remains backward compatible
**Given** existing quizData.js format with questions
**When** loading quiz packs from subfolders
**Then** the system should maintain compatibility
**And** questions should still be loaded from quizData.js
**And** questions should be matched to images by filename

### Scenario 8: Multiple quiz packs can coexist
**Given** multiple subfolders exist:
```
/images/family-70s/
/images/weddings/
/images/vintage-cars/
```
**When** the landing page loads
**Then** I should see all three quiz packs
**And** each should be independently selectable
**And** each should load its own images

## Technical Requirements

### Quiz Pack Data Model
```javascript
{
  id: string,              // subfolder name (e.g., "family-70s")
  title: string,           // humanized name (e.g., "Family 70s")
  description: string,     // optional description
  subfolder: string,       // relative path (e.g., "family-70s")
  images: string[],        // array of filenames
  photoCount: number,      // images.length
  questionCount: number,   // images.length * 3
  thumbnail: string,       // path to first image
}
```

### File System Structure
```
/images/
  /family-70s/
    IMG_001.jpg
    IMG_002.jpg
  /weddings/
    wedding1.jpg
    wedding2.jpg
  /vintage-cars/
    car1.jpg
```

### Helper Functions
- `discoverQuizPacks()`: scans /images/ for subfolders
- `createQuizPackFromFolder(folderName)`: creates pack object
- `humanizeTitle(folderName)`: converts "family-70s" to "Family 70s"
- `getImagesInFolder(folderPath)`: returns array of image files
