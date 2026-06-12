# Getting Started with Family Quiz

Complete guide to set up, run, and customize your Family Quiz application.

## Table of Contents

- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Customizing Your Quiz](#customizing-your-quiz)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Using Docker (Easiest)

1. **Clone the repository**
   ```bash
   git clone https://github.com/petrkoula/family-quiz.git
   cd family-quiz
   ```

2. **Start the application**
   ```bash
   docker-compose up dev
   ```

3. **Open your browser**
   - Navigate to http://localhost:5173/#/presenter
   - Press `Space` to show questions
   - Use arrow keys to navigate

That's it! 🎉

### Using Node.js

1. **Prerequisites**
   - Node.js 18+ ([Download](https://nodejs.org/))
   - npm or yarn

2. **Install and run**
   ```bash
   git clone https://github.com/petrkoula/family-quiz.git
   cd family-quiz/vue-app
   npm install
   npm run dev
   ```

3. **Open your browser**
   - Navigate to http://localhost:5173/#/presenter

## Detailed Setup

### 1. Development Environment

**Recommended Tools:**
- Visual Studio Code with these extensions:
  - Vue Language Features (Volar)
  - ESLint
  - Prettier
  - Docker (if using Docker)

**Setup Steps:**

```bash
# Clone repository
git clone https://github.com/petrkoula/family-quiz.git
cd family-quiz

# Option A: Docker
docker-compose up dev

# Option B: Node.js
cd vue-app
npm install
npm run dev
```

### 2. Project Structure

```
family-quiz/
├── images/                   # Your quiz photos (23 photos)
├── vue-app/                  # Vue.js application
│   ├── src/
│   │   ├── views/
│   │   │   ├── PresenterView.vue    # Main presenter interface
│   │   │   ├── TeamView.vue         # Team participation (future)
│   │   │   └── AdminView.vue        # Admin dashboard (future)
│   │   ├── components/
│   │   │   └── QuestionCard.vue     # Question display component
│   │   ├── stores/
│   │   │   └── gameStore.js         # Pinia state management
│   │   ├── data/                    # library storage + photo catalog layers
│   │   │   ├── libraryStorage.js    # localStorage + disk backup (library.json)
│   │   │   └── photoCatalog.js      # photo folder source (dev server / hosted)
│   │   └── router/
│   │       └── index.js             # Vue Router setup
│   ├── tests/
│   │   └── presenter.test.js        # E2E tests
│   └── public/images/               # Copied images for production
├── docker-compose.yml        # Docker setup
└── README.md                 # Main documentation
```

### 3. Understanding the Application

**Three Main Views:**

1. **Presenter View** (`/#/presenter`)
   - Main quiz interface for projection
   - Keyboard controls for smooth presentation
   - Fullscreen mode support

2. **Team View** (`/#/team`)
   - Mobile interface for team participation
   - Submit answers in real-time
   - (Requires Firebase integration - future feature)

3. **Admin View** (`/#/admin`)
   - Monitor team responses
   - View leaderboard
   - (Requires Firebase integration - future feature)

**State Management:**

The app uses Pinia for state management. All quiz state is in `src/stores/gameStore.js`:

- `currentPhotoIndex` - Which photo is displayed
- `currentQuestionIndex` - Which question is active
- `questionsVisible` - Are questions shown or hidden
- `answersRevealed` - Is the correct answer highlighted

## Customizing Your Quiz

### Adding Your Own Photos

There is no quiz data in the source code — the photo folders are the library,
and questions live in the library state (browser storage, mirrored to
`images/library.json`).

1. **Add images** to a pack folder (one folder per quiz):
   ```bash
   cp /path/to/your/photos/* images/my-quiz/
   ```

2. **Reload in the app**: open the quiz card's menu → ↻ Reload (or
   „Obnovit knihovnu" to sync the whole library). New folders become new
   quiz cards; new photos get placeholder questions.

3. **Write the questions** in the app: card menu → **Upravit** opens the
   edit screen where you fill in text, options and the correct answer.
   Your edits are saved to the library state and backed up to
   `images/library.json` automatically.

### Customizing Questions

**Tips for Good Quiz Questions:**

1. **Make them fun** - Add humor and personality
2. **Mix difficulty** - Easy, medium, and hard questions
3. **Be specific** - Reference details in the photo
4. **4 options** - Always provide 4 answer choices
5. **One correct** - Mark the correct answer with index (0-3)

**Example Themes:**

- **Historical**: "What decade is this from?"
- **Personal**: "Who took this photo?"
- **Funny**: "What were they thinking?"
- **Detective**: "Spot the detail - what's unusual?"
- **Trivia**: "What happened this year?"

### Changing Colors/Style

Edit `vue-app/src/style.css`:

```css
/* Main gradient background */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Change to your colors */
.gradient-bg {
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
}
```

## Running Tests

### Tests (Vitest + @testing-library/vue, jsdom)

**Run all tests** — no dev server or browser needed:
```bash
cd vue-app

# Run once
npm test

# Watch mode
npm run test:unit:watch
```

**What's tested:**
- Photo display and navigation
- Question toggling (spacebar)
- Question cycling (arrow keys)
- Answer reveal (A key)
- Navigation blocking when questions visible
- Landing library, quick start, and customization flows

**Add your own tests:**

Pick a scenario from `specs/*.spec.md`, extend a page object under
`vue-app/tests/support/`, then add an editable `it()` in the matching
`vue-app/tests/*.spec.js`:

```javascript
it('does the thing the user expects', async () => {
  const page = renderPresenter();
  await page.toggleQuestions();
  expect(page.isQuestionsVisible()).toBe(true);
});
```

See [vue-app/tests/README.md](vue-app/tests/README.md) and
[TESTING.md](TESTING.md) for conventions.

## Deployment

### Option 1: Docker Container

**Build and run:**
```bash
# Build production image
docker-compose --profile production build prod

# Run on port 8080
docker-compose --profile production up prod
```

**Deploy to cloud:**
```bash
# Tag and push to Docker Hub
docker tag family-quiz username/family-quiz:latest
docker push username/family-quiz:latest

# Pull and run anywhere
docker pull username/family-quiz:latest
docker run -d -p 80:80 username/family-quiz:latest
```

### Option 2: Static Hosting

**Build for production:**
```bash
cd vue-app
npm run build
```

The `dist/` folder contains your static site.

**Deploy to:**
- **Netlify**: Drag & drop `dist/` folder
- **Vercel**: Connect GitHub repo
- **Firebase Hosting**: `firebase deploy`
- **GitHub Pages**: Push to `gh-pages` branch

### Option 3: Firebase (Recommended for Full Features)

See [FIREBASE-DEPLOYMENT.md](FIREBASE-DEPLOYMENT.md) for:
- Real-time team participation
- Live leaderboards
- Score tracking
- Admin dashboard

## Keyboard Controls

### Presenter View

| Key | Action | Available When |
|-----|--------|----------------|
| `Space` | Show/hide questions | Always |
| `←` `→` | Previous/next photo | Questions hidden |
| `↑` `↓` | Previous/next question | Questions visible |
| `A` | Reveal answer | Questions visible |
| `F` | Fullscreen toggle | Always |
| `Esc` | Hide questions/exit fullscreen | Context |

**Pro Tips:**
- Start with photo fullscreen
- Press `Space` to show questions
- Navigate with `↑` `↓` through questions
- Press `A` to highlight correct answer
- Press `Space` again to hide and move to next photo

## Troubleshooting

### Images not loading

**Problem:** Photos show broken image icon

**Solution:**
```bash
# Make sure images are in the right place
ls images/  # Should show your photos

# Copy to public folder
cp -r images/* vue-app/public/images/

# Restart dev server
npm run dev
```

### Port already in use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5173`

**Solution:**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or change port
npm run dev -- --port 3000
```

### Tests failing

**Problem:** tests fail

**Solutions:**

1. **Reinstall dependencies** (tests run in jsdom, no dev server needed):
   ```bash
   cd vue-app
   yarn install
   npm test
   ```

2. **Run a single file while debugging:**
   ```bash
   npx vitest run tests/presenter.spec.js
   ```

3. **Watch mode** for fast feedback:
   ```bash
   npm run test:unit:watch
   ```

### Docker issues

**Problem:** Docker container won't start

**Solutions:**

1. **Rebuild:**
   ```bash
   docker-compose down -v
   docker-compose up --build dev
   ```

2. **Check logs:**
   ```bash
   docker-compose logs dev
   ```

3. **Remove old images:**
   ```bash
   docker system prune -a
   ```

## Next Steps

1. ✅ **Customize** your quiz questions
2. ✅ **Add** your own photos
3. ✅ **Test** the presenter view
4. ✅ **Deploy** to the web
5. 🔜 **Add Firebase** for team participation
6. 🔜 **Create** a mobile team app

## Need Help?

- 📖 Read the [main README](README.md)
- 🐳 Check [Docker docs](DOCKER.md)
- 🔥 See [Firebase guide](FIREBASE-DEPLOYMENT.md)
- 📋 Review [PRD](PRD.md) for technical details
- 🐛 [Report issues](https://github.com/petrkoula/family-quiz/issues)

---

**Have fun creating your family quiz! 🎉**
