# Family Quiz - Vue.js Version

Modern, local-first Progressive Web App (PWA) implementation of Family Quiz using Vue 3 + Vite.

## 🎯 Features

- ✅ **Local-First Architecture** - Quiz data embedded, works offline
- ✅ **Vue 3 Composition API** - Modern, reactive framework
- ✅ **Progressive Web App** - Installable, works offline
- ✅ **Lazy Loading** - Images loaded on-demand
- ✅ **State Management** - Pinia for predictable state
- ✅ **Keyboard Navigation** - Full keyboard control
- ✅ **Responsive Design** - Works on all devices
- 🔜 **Firebase Integration** - Real-time team participation (coming soon)

## 🚀 Quick Start

### Prerequisites

- Node.js 14.0 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
vue-app/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable components
│   │   └── QuestionCard.vue
│   ├── views/           # Page components
│   │   ├── LandingView.vue
│   │   ├── CustomizationView.vue
│   │   ├── EditView.vue
│   │   └── PresenterView.vue
│   ├── stores/          # Pinia stores
│   │   └── gameStore.js
│   ├── data/            # Quiz data
│   │   └── quizData.js
│   ├── router/          # Vue Router
│   │   └── index.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
└── package.json
```

## 🎮 Routes

- `/` - Quiz library (landing)
- `/customize/:quizId` - Quiz settings
- `/edit/:quizId` - Question editor
- `/presenter` - Main presentation view

## 🔧 Configuration

### Quiz Data

Edit `src/data/quizData.js` to modify questions:

```javascript
export const quizData = [
  {
    image: "IMG_4246_1.jpg",
    questions: [
      {
        text: "Your question?",
        options: ["A", "B", "C", "D"],
        correct: 0
      }
    ]
  }
]
```

### Images

Place images in:
- Development: Parent `/images` folder (shared with vanilla version)
- Production: `public/images/` folder

## 🌐 Local-First Design

### How It Works

1. **Initial Load**: Quiz data embedded in bundle (~5KB compressed)
2. **Service Worker**: Caches app shell for offline use
3. **Lazy Images**: Photos loaded only when displayed
4. **IndexedDB**: Future: Cache photos locally
5. **Background Sync**: Future: Sync team responses when online

### Benefits

- ⚡ **Fast**: No network requests for quiz data
- 🔒 **Reliable**: Works offline after first load
- 💾 **Efficient**: Only loads what's needed
- 🌍 **Global**: No server required

## 🚀 Deployment

### Vite Build

```bash
npm run build
# Output in dist/ folder
```

### Firebase Hosting (Future)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

## 🎨 Customization

### Theme Colors

Edit `src/style.css`:

```css
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Font Sizes

Edit component styles for presentation-optimized fonts:
- Question: `2.4rem`
- Options: `1.8rem`

## 🔌 Firebase Integration (Planned)

The app is ready for Firebase integration:

1. **Firestore** - Real-time team responses
2. **Functions** - Score calculation
3. **Hosting** - Global CDN deployment
4. **Auth** - Optional presenter authentication

See `FIREBASE-DEPLOYMENT.md` in parent folder for details.

## 📱 PWA Features

- **Installable**: Add to home screen
- **Offline**: Service Worker caching
- **Fast**: Pre-cached app shell
- **Reliable**: Works without connection

## 🎯 Development

### Hot Module Replacement

Vite provides instant updates:

```bash
npm run dev
# App auto-reloads on file changes
```

### Component Development

All components use Composition API:

```vue
<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>
```

### Testing

Tests run on Vitest + @testing-library/vue in jsdom — no browser, no dev server:

```bash
# Run once
npm test

# Watch mode
npm run test:unit:watch
```

Tests cover the complete UX flow:
- Photo display and navigation
- Question toggling and cycling
- Answer revealing
- Keyboard controls
- Landing library, quick start, and customization flows

See [tests/README.md](tests/README.md) for details.

## 🐛 Troubleshooting

### Images not loading
- Check image paths in `quizData.js`
- Ensure images in `/images` folder (dev) or `public/images` (prod)

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Port already in use
```bash
# Change port in package.json
"dev": "vite --port 3001"
```

## 📚 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation build tool
- **Pinia** - Vue state management
- **Vue Router** - Official router
- **Vitest + @testing-library/vue** - jsdom testing
- **Firebase** - Backend platform (future)

## 🤝 Contributing

This is part of the Family Quiz project. See main README for contribution guidelines.

## 📄 License

MIT License - same as parent project

## 🔗 Links

- [Parent Project](../)
- [Vue.js Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Pinia Docs](https://pinia.vuejs.org/)

---

**Made with Vue.js for modern, fast, offline-first experience! ⚡**
