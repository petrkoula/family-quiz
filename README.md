# 🎯 Family Quiz

Interactive photo quiz application built with Vue.js. Perfect for family gatherings, parties, corporate events, or educational settings.

![CI](https://github.com/petrkoula/family-quiz/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.4-brightgreen.svg)
![Vite](https://img.shields.io/badge/vite-5.0-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

## ✨ Features

### 🖼️ Presentation Mode
- **23 Vintage Family Photos** with custom Czech quiz questions
- **Fullscreen Support** for projector/TV displays
- **Smooth Navigation** with keyboard controls
- **Question Cycling** - one question at a time with visual progress dots
- **Answer Reveal** with beautiful animations
- **Local-First** - works offline, no server required

### 🎨 Design Highlights
- Clean, modern Vue.js interface
- High-contrast colors for projector visibility
- Large, readable fonts (optimized for distance viewing)
- Smooth animations and transitions
- Responsive design

## 🚀 Quick Start

### Option 1: Docker (Recommended)

Easiest way to run the app locally:

```bash
# Start development server with hot reload
docker-compose up dev

# Access at http://localhost:5173
```

See [DOCKER.md](DOCKER.md) for full Docker documentation.

### Option 2: Node.js

**Prerequisites:**
- Node.js 14.0 or higher ([Download](https://nodejs.org/))
- npm or yarn

**Installation:**

```bash
# Navigate to the vue-app folder
cd vue-app

# Install dependencies
yarn install
# or
npm install

# Start development server
yarn dev
# or
npm run dev
```

**Access:** Open http://localhost:5173 in your browser

### Build for Production

```bash
cd vue-app

# Build
yarn build
# or
npm run build

# Preview build
yarn preview
# or
npm run preview
```

## 🎮 Controls

### Presenter Controls

| Key | Action | When Available |
|-----|--------|----------------|
| **SPACE** | Show/hide questions | Always |
| **← →** | Previous/next photo | Questions hidden |
| **↑ ↓** | Previous/next question | Questions visible |
| **A** | Reveal correct answer | Questions visible |
| **F** | Toggle fullscreen | Always |
| **ESC** | Exit fullscreen/hide questions | Context |

## 📖 How It Works

### Presentation Flow

```
1. 🖼️  Show photo (fullscreen)
2. ⌨️  Press SPACE → questions appear (photo 1/3, questions 2/3)
3. ⌨️  Press ↑↓ → navigate between questions
4. ⌨️  Press A → reveal correct answer
5. ⌨️  Press SPACE → hide questions
6. ⌨️  Press → → next photo
```

### Architecture

- **Vue 3** - Composition API for reactive state management
- **Pinia** - State management store
- **Vue Router** - Navigation between views
- **Vite** - Fast build tool and dev server
- **Local-First** - Quiz data embedded, works offline

## 🛠️ Configuration

### Edit Questions

Questions are in `vue-app/src/data/quizData.js`:

```javascript
export const quizData = [
  {
    image: "IMG_4246_1.jpg",
    questions: [
      {
        text: "Your question in Czech?",
        options: ["A", "B", "C", "D"],
        correct: 0  // Index of correct answer
      }
      // ... 2 more questions
    ]
  }
  // ... 22 more photos
]
```

### Add More Photos

1. Add images to `/images` folder
2. Add quiz entry in `vue-app/src/data/quizData.js`
3. Reload the app

## 📁 Project Structure

```
family-quiz/
├── images/              # 23 vintage family photos
├── vue-app/             # Vue.js application
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── views/       # Page views
│   │   ├── stores/      # Pinia stores
│   │   ├── data/        # Quiz data
│   │   └── router/      # Vue Router config
│   ├── package.json
│   ├── vite.config.js
│   └── README.md        # Detailed Vue.js docs
├── PRD.md               # Product requirements doc
├── FIREBASE-DEPLOYMENT.md  # Firebase deployment guide
├── LICENSE              # MIT License
└── README.md            # This file
```

## 🌐 Routes

The Vue app has multiple routes for different use cases:

- `/presenter` - Main presentation view (recommended)
- `/team` - Mobile team interface (future: Firebase integration)
- `/admin` - Admin dashboard (future: Firebase integration)

## 🔧 Development

### Hot Module Replacement

Vite provides instant updates during development:

```bash
cd vue-app
yarn dev
# App auto-reloads on file changes at http://localhost:5173
```

### Component Development

All components use Vue 3 Composition API:

```vue
<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>
```

## 🚀 Future Features

- 🔜 **Firebase Integration** - Real-time team participation
- 🔜 **Progressive Web App** - Installable, offline-first
- 🔜 **QR Codes** - Easy team access
- 🔜 **Leaderboard** - Live team scoring

See [FIREBASE-DEPLOYMENT.md](FIREBASE-DEPLOYMENT.md) for planned Firebase integration.

## 📚 Documentation

- **[vue-app/README.md](vue-app/README.md)** - Detailed Vue.js documentation
- **[PRD.md](PRD.md)** - Complete product requirements document
- **[FIREBASE-DEPLOYMENT.md](FIREBASE-DEPLOYMENT.md)** - Firebase deployment guide

## 🤝 Contributing

This is a family project, but feel free to fork and adapt for your own use!

## 📄 License

MIT License - feel free to use and modify.

## 🎉 Credits

- **Questions**: AI-generated based on real family photos
- **Photos**: Private family collection (23 vintage photos from 60s-80s)
- **Technology**: Vue 3, Vite, Pinia, Vue Router
- **Design**: Modern CSS with gradient backgrounds

## 💡 Use Cases

- 🏠 **Family Reunions** - Quiz about family history
- 🎉 **Parties** - Interactive entertainment
- 🏢 **Corporate Events** - Team building activity
- 🎓 **Education** - Classroom engagement tool
- 🎪 **Events** - Audience participation game

---

**Made with ❤️ for interactive family fun**

For technical specifications and implementation details, see [PRD.md](PRD.md) and [vue-app/README.md](vue-app/README.md)
