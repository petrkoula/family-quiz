# Firebase Deployment Guide - Vue.js Implementation (Local-First)

## 📋 Overview

This guide describes how to deploy Family Quiz to Firebase using Vue.js framework with a **local-first architecture**. The app downloads quiz data once, works offline, and lazy-loads photos for optimal performance.

## 🏗️ Architecture

### Current (Vanilla JS + Node.js)
```
Local Network Only
├── Presenter (index.html)
├── Teams (team.html)
├── Admin (admin.html)
└── Node.js Server (WebSocket)
```

### Proposed (Vue.js + Firebase - Local-First PWA)
```
Progressive Web App (Works Offline)
├── Vue.js App (SPA)
│   ├── Presenter View
│   ├── Team View
│   └── Admin View
├── Service Worker (Offline support)
├── IndexedDB (Local quiz data cache)
├── Lazy Loading (Photos on-demand)
├── Firebase Hosting (Static files)
├── Firebase Firestore (Sync & real-time)
└── Firebase Functions (Server logic)
```

### 🎯 Local-First Principles

1. **Data Download**: Quiz questions downloaded once on first load
2. **Offline First**: Works without internet after initial load
3. **Lazy Images**: Photos loaded only when needed
4. **Background Sync**: Team responses synced when online
5. **PWA**: Installable as native app
6. **Cache Strategy**: Service Worker caches assets

## 🔧 Technology Stack

### Frontend
- **Framework:** Vue 3 with Composition API
- **Build Tool:** Vite
- **State Management:** Pinia (Vue store)
- **Routing:** Vue Router
- **UI Framework:** TailwindCSS (optional)
- **QR Code:** qrcode.vue

### Backend
- **Database:** Cloud Firestore (real-time)
- **Functions:** Firebase Cloud Functions
- **Hosting:** Firebase Hosting
- **Auth:** Firebase Authentication (optional)

## 📦 Project Structure

```
family-quiz-vue/
├── public/
│   └── images/              # Quiz photos
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── QuestionCard.vue
│   │   ├── AnswerOptions.vue
│   │   ├── ProgressDots.vue
│   │   ├── QRCodeDisplay.vue
│   │   └── Leaderboard.vue
│   ├── views/
│   │   ├── PresenterView.vue
│   │   ├── TeamView.vue
│   │   └── AdminView.vue
│   ├── composables/
│   │   ├── useFirestore.js
│   │   ├── useGameState.js
│   │   └── useTeamScore.js
│   ├── stores/
│   │   ├── gameStore.js
│   │   └── teamStore.js
│   ├── router/
│   │   └── index.js
│   ├── firebase/
│   │   └── config.js
│   ├── App.vue
│   └── main.js
├── functions/               # Firebase Functions
│   ├── index.js
│   └── package.json
├── firestore.rules          # Security rules
├── firebase.json            # Firebase config
└── package.json
```

## 🚀 Implementation Plan

### Phase 1: Setup (1-2 hours)

1. **Create Vue Project**
```bash
npm create vite@latest family-quiz-vue -- --template vue
cd family-quiz-vue
npm install
```

2. **Install Dependencies**
```bash
npm install vue-router pinia firebase
npm install -D tailwindcss postcss autoprefixer
npm install qrcode.vue
```

3. **Setup Firebase**
```bash
npm install -g firebase-tools
firebase login
firebase init
# Select: Hosting, Firestore, Functions
```

### Phase 2: Database Schema (30 min)

**Firestore Collections:**

```javascript
// /sessions/{sessionId}
{
  currentPhotoIndex: 0,
  currentQuestionIndex: 0,
  questionsVisible: false,
  createdAt: timestamp,
  status: 'active' | 'completed'
}

// /sessions/{sessionId}/teams/{teamId}
{
  name: 'Team Name',
  score: 0,
  joinedAt: timestamp
}

// /sessions/{sessionId}/responses/{photoIndex-questionIndex-teamId}
{
  teamId: 'abc123',
  teamName: 'Team Name',
  answer: 1,
  timestamp: timestamp,
  correct: false  // calculated on answer reveal
}

// /quizData/{photoId}
{
  image: 'IMG_4246_1.jpg',
  questions: [
    {
      text: 'Question?',
      options: ['A', 'B', 'C', 'D'],
      correct: 0
    }
  ]
}
```

### Phase 3: Core Components (3-4 hours)

1. **PresenterView.vue**
   - Photo display (fullscreen capable)
   - Question cycling
   - Keyboard controls
   - QR code display
   - Real-time sync with Firestore

2. **TeamView.vue**
   - Team registration
   - Question display (synced)
   - Answer selection
   - Score display
   - Progress dots

3. **AdminView.vue**
   - Live leaderboard
   - Response monitoring
   - Export functionality

### Phase 4: Firebase Functions (1-2 hours)

```javascript
// functions/index.js

// Calculate scores when answer is revealed
exports.revealAnswer = functions.firestore
  .document('sessions/{sessionId}/gameState/{stateId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // If answer was just revealed
    if (after.answerRevealed && !before.answerRevealed) {
      // Get correct answer
      const correctAnswer = after.correctAnswer;

      // Get all responses for this question
      const responses = await getResponses(
        context.params.sessionId,
        after.photoIndex,
        after.questionIndex
      );

      // Update scores
      await updateScores(responses, correctAnswer);
    }
  });
```

### Phase 5: Deployment (30 min)

1. **Build**
```bash
npm run build
```

2. **Deploy**
```bash
firebase deploy
```

3. **Access**
- Presenter: `https://your-app.web.app/presenter`
- Teams: `https://your-app.web.app/team`
- Admin: `https://your-app.web.app/admin`

## 🔐 Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sessions
    match /sessions/{sessionId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated presenters

      // Teams
      match /teams/{teamId} {
        allow read: if true;
        allow create: if request.resource.data.name is string;
        allow update: if false; // Scores updated by functions only
      }

      // Responses
      match /responses/{responseId} {
        allow read: if true;
        allow create: if request.resource.data.teamId is string;
        allow update: if false;
      }
    }

    // Quiz data
    match /quizData/{photoId} {
      allow read: if true;
      allow write: if false; // Read-only
    }
  }
}
```

## 💰 Cost Estimation

Firebase Free Tier (Spark Plan):
- ✅ Firestore: 50K reads, 20K writes, 20K deletes per day
- ✅ Hosting: 10GB storage, 10GB bandwidth per month
- ✅ Functions: 125K invocations, 40K GB-seconds per month

**Estimated Usage (one quiz session with 20 teams):**
- Reads: ~500 (well under limit)
- Writes: ~200 (well under limit)
- Bandwidth: <100MB (well under limit)

**Conclusion:** Free tier sufficient for most use cases!

## 🎯 Migration Path

### Option 1: Separate Vue App
- Create new repo `family-quiz-vue`
- Link from main repo README
- Keep vanilla JS as reference

### Option 2: Monorepo
- Create `/vue-app` folder
- Share `/images` and quiz data
- Maintain both versions

### Option 3: Replace
- Archive vanilla JS to branch
- Replace with Vue version
- Update README

## 📝 Next Steps

1. **Create Vue.js project structure**
2. **Setup Firebase project**
3. **Migrate quiz data to Firestore**
4. **Implement core components**
5. **Test locally with Firebase emulator**
6. **Deploy to Firebase Hosting**
7. **Update documentation**

## 🔗 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)

---

**Ready to start implementation?**

Run:
```bash
npm create vite@latest family-quiz-vue -- --template vue
```
