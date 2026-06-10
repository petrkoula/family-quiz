# Photo Quiz Presentation App

A simple, interactive photo quiz application for presenting images with accompanying quiz questions to an audience.

## Features

- Display 23 photos in sequence
- 3 quiz questions per photo with multiple choice answers
- Keyboard-controlled navigation
- Toggle show/hide questions with spacebar
- Reveal correct answers on demand
- Clean, presentation-friendly design

## How to Use

### 1. Setup Your Questions

Edit `quiz-data.json` to add your questions and answers for each photo:

```json
{
  "image": "IMG_4246_1.jpg",
  "questions": [
    {
      "text": "Your question here?",
      "options": ["Answer A", "Answer B", "Answer C", "Answer D"],
      "correct": 0
    }
  ]
}
```

- `text`: The question text
- `options`: Array of answer choices (2-4 options)
- `correct`: Index of the correct answer (0 = first option, 1 = second, etc.)

### 2. Run the Application

Simply open `index.html` in a web browser:
- Double-click `index.html`, or
- Right-click and select "Open with" your preferred browser

### 3. Present to Your Audience

**Keyboard Controls:**

| Key | Action |
|-----|--------|
| **SPACE** | Toggle show/hide questions |
| **→** (Right Arrow) | Next photo |
| **←** (Left Arrow) | Previous photo |
| **A** | Reveal correct answers (when questions are visible) |
| **F** | Toggle fullscreen mode |
| **ESC** | Hide questions or exit fullscreen |

## Presentation Flow

1. App opens showing first photo only
2. Press **F** to enter fullscreen mode for better presentation
3. Press **SPACE** to reveal questions for current photo
4. Press **A** to highlight correct answers
5. Press **SPACE** again to hide questions
6. Press **→** to move to next photo (questions auto-hide)
7. Repeat for all 23 photos
8. Press **ESC** to exit fullscreen when done

## File Structure

```
/quiz
  /images/              # Your 23 photos
  index.html           # Main application
  styles.css           # Styling
  app.js               # Application logic
  quiz-data.json       # Questions and answers
  README.md            # This file
```

## Customization

### Change Colors
Edit `styles.css` and modify the gradient background:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Photos
1. Add images to `/images` folder
2. Add corresponding entries to `quiz-data.json`
3. The app will automatically adjust

## Tips

- Press **F** to enter fullscreen mode for immersive presentation experience
- Test your quiz before presenting to ensure all images load correctly
- Keep questions concise for better readability from a distance
- Use 2-4 answer options per question for optimal layout
- Practice the keyboard controls before presenting to ensure smooth navigation

## Troubleshooting

**Photos not loading?**
- Ensure all images are in the `/images` folder
- Check that image filenames in `quiz-data.json` match exactly

**Questions not showing?**
- Open browser console (F12) to check for errors
- Verify `quiz-data.json` is valid JSON format

**Layout issues?**
- Try refreshing the page
- Check browser zoom is at 100%

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
