# Firebase Deployment Guide

Complete guide for deploying Family Quiz to Firebase/Google Cloud Platform.

## 📋 Table of Contents

- [Deployment Options](#deployment-options)
- [Option 1: Firebase Hosting (Serverless)](#option-1-firebase-hosting-serverless)
- [Option 2: Cloud Run (Containerized)](#option-2-cloud-run-containerized)
- [Comparison](#comparison)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Environment Setup](#environment-setup)
- [Future: Firebase Features](#future-firebase-features)

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Serverless) ⭐ Recommended

**Best for:**
- Static web apps
- No backend needed
- Free tier (10GB/month)
- Global CDN
- Automatic SSL

**What it is:**
Firebase Hosting is a **serverless static hosting** service. It serves your built Vue.js app (HTML, CSS, JS) from Google's global CDN.

**Cost:** FREE up to 10GB/month, 360MB/day

### Option 2: Cloud Run (Containerized)

**Best for:**
- Need backend logic
- Custom server configuration
- Docker containers
- More control

**What it is:**
Cloud Run is a **serverless container platform**. It runs your Docker container and scales automatically.

**Cost:** Pay per request, FREE tier 2 million requests/month

---

## Option 1: Firebase Hosting (Serverless)

### Step 1: Prerequisites

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify login
firebase projects:list
```

### Step 2: Create Firebase Project

**Via Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `family-quiz`
4. Disable Google Analytics (optional)
5. Click "Create Project"

**Via CLI:**
```bash
# Create project (requires billing account)
firebase projects:create family-quiz
```

### Step 3: Initialize Firebase in Your Project

```bash
cd /path/to/family-quiz/vue-app

# Initialize Firebase
firebase init

# Select features:
# - Hosting: Configure files for Firebase Hosting
# - (Optional) Firestore: For future team features
# - (Optional) Functions: For backend logic

# Configuration:
# - Public directory: dist
# - Single-page app: Yes
# - Set up automatic builds with GitHub: No (we'll use Actions)
# - Overwrite index.html: No
```

This creates `firebase.json` and `.firebaserc` files.

### Step 4: Build Your Application

```bash
cd vue-app

# Install dependencies
npm install

# Copy images
cp -r ../images/* public/images/

# Build for production
npm run build

# Verify build
ls -la dist/
```

### Step 5: Deploy to Firebase Hosting

```bash
# Test locally first
firebase emulators:start

# Visit http://localhost:5000 to test

# Deploy to production
firebase deploy --only hosting

# Output:
# ✔  Deploy complete!
# Project Console: https://console.firebase.google.com/project/family-quiz
# Hosting URL: https://family-quiz.web.app
```

### Step 6: Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain: `quiz.yourdomain.com`
4. Follow DNS setup instructions
5. Wait for SSL certificate (automatic, free)

### Firebase Hosting Commands

```bash
# Deploy to production
firebase deploy --only hosting

# Deploy to preview channel
firebase hosting:channel:deploy preview

# View active sites
firebase hosting:sites:list

# Rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL DEST_SITE_ID:live
```

---

## Option 2: Cloud Run (Containerized)

### When to Use Cloud Run?

Use Cloud Run if you need:
- Backend API endpoints
- Server-side rendering
- Database connections
- Custom server logic
- Scheduled tasks

For Family Quiz (static app), **Firebase Hosting is recommended**.

But if you want to run the Docker container:

### Step 1: Prerequisites

```bash
# Install Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install

# Initialize gcloud
gcloud init

# Login
gcloud auth login

# Set project
gcloud config set project family-quiz
```

### Step 2: Enable Required APIs

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Enable Cloud Build API (for building images)
gcloud services enable cloudbuild.googleapis.com
```

### Step 3: Build Docker Image

**Option A: Build Locally and Push**

```bash
cd vue-app

# Build image
docker build -t gcr.io/family-quiz/quiz-app:latest .

# Authenticate Docker
gcloud auth configure-docker

# Push to Google Container Registry
docker push gcr.io/family-quiz/quiz-app:latest
```

**Option B: Build in Cloud (Recommended)**

```bash
# Cloud Build builds the image for you
gcloud builds submit --tag gcr.io/family-quiz/quiz-app:latest
```

### Step 4: Deploy to Cloud Run

```bash
# Deploy container
gcloud run deploy family-quiz \
  --image gcr.io/family-quiz/quiz-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 80

# Output:
# Service [family-quiz] revision [family-quiz-00001] has been deployed.
# Service URL: https://family-quiz-xxxxx-uc.a.run.app
```

### Step 5: Map Custom Domain

```bash
# Map domain to Cloud Run service
gcloud run domain-mappings create \
  --service family-quiz \
  --domain quiz.yourdomain.com \
  --region us-central1

# Follow DNS instructions
```

### Cloud Run Commands

```bash
# List services
gcloud run services list

# Get service URL
gcloud run services describe family-quiz \
  --region us-central1 \
  --format 'value(status.url)'

# View logs
gcloud run services logs read family-quiz --region us-central1

# Update service
gcloud run services update family-quiz \
  --image gcr.io/family-quiz/quiz-app:v2 \
  --region us-central1

# Delete service
gcloud run services delete family-quiz --region us-central1
```

---

## 📊 Comparison

| Feature | Firebase Hosting | Cloud Run |
|---------|-----------------|-----------|
| **Type** | Static hosting | Container platform |
| **Best For** | Vue/React apps | Apps with backend |
| **Pricing** | Free 10GB/month | Free 2M requests/month |
| **Cold Start** | None (CDN) | ~1-3 seconds |
| **Scaling** | Automatic (CDN) | Automatic (0-1000+) |
| **SSL** | Free automatic | Free automatic |
| **Custom Domain** | Yes, free | Yes, free |
| **Setup Complexity** | ⭐ Easy | ⭐⭐ Moderate |
| **Cost (1M views)** | $0 | ~$0.50 |

### Recommendation for Family Quiz

**Use Firebase Hosting** ✅

Reasons:
1. Family Quiz is a static Vue.js app
2. No backend needed (local-first design)
3. Free tier is generous (10GB/month)
4. Global CDN for fast loading worldwide
5. Simpler setup and maintenance
6. Zero cold start time

**Use Cloud Run** only if you add:
- Real-time Firebase backend
- Custom API endpoints
- Server-side data processing
- Scheduled tasks/cron jobs

---

## 🔄 CI/CD with GitHub Actions

### Automatic Deployment from Development Branch

The project includes GitHub Actions workflow for automatic deployment.

**Setup:**

1. **Create Firebase Service Account**

```bash
# Generate service account key
firebase init hosting:github

# Or manually:
# 1. Go to Firebase Console → Project Settings → Service Accounts
# 2. Click "Generate New Private Key"
# 3. Save the JSON file
```

2. **Add Secret to GitHub**

```bash
# Go to GitHub repo → Settings → Secrets and variables → Actions
# Click "New repository secret"
# Name: FIREBASE_SERVICE_ACCOUNT
# Value: Paste the entire JSON content
```

3. **Update Workflow File**

Edit `.github/workflows/firebase-deploy.yml`:

```yaml
# Change this line:
projectId: your-firebase-project-id

# To your actual project ID:
projectId: family-quiz
```

4. **Push to Development Branch**

```bash
git checkout development
git add .
git commit -m "Setup Firebase deployment"
git push origin development

# Workflow triggers automatically
# Check: https://github.com/yourusername/family-quiz/actions
```

### Manual Deployment

```bash
# Build locally
cd vue-app
npm run build

# Deploy
firebase deploy --only hosting

# Or deploy preview
firebase hosting:channel:deploy staging
```

---

## 🔧 Environment Setup

### Local Development with Firebase Emulators

```bash
# Install emulators
firebase init emulators

# Select:
# - Hosting
# - Firestore (optional)
# - Functions (optional)

# Start emulators
firebase emulators:start

# Access:
# - Hosting: http://localhost:5000
# - Firestore UI: http://localhost:4000
```

### Environment Variables

Create `vue-app/.env.production`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=family-quiz
VITE_FIREBASE_APP_ID=your-app-id
```

Access in code:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}
```

---

## 🔮 Future: Firebase Features

When adding team participation features:

### Firestore (Database)

```bash
firebase init firestore

# Enable in Firebase Console
# Security rules in firestore.rules
```

**Schema:**

```javascript
// Collection: games
{
  gameId: "game-123",
  started: true,
  currentPhotoIndex: 0,
  currentQuestionIndex: 0,
  questionsVisible: true
}

// Collection: teams
{
  teamId: "team-abc",
  name: "Team Alpha",
  score: 15,
  joinedAt: timestamp
}

// Collection: responses
{
  teamId: "team-abc",
  photoIndex: 0,
  questionIndex: 0,
  answer: 2,
  correct: true,
  timestamp: timestamp
}
```

### Firebase Functions

```bash
firebase init functions

# Language: TypeScript
```

**Example Function:**

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const calculateScore = functions.firestore
  .document('responses/{responseId}')
  .onCreate(async (snap, context) => {
    const response = snap.data();

    if (response.correct) {
      const teamRef = admin.firestore()
        .collection('teams')
        .doc(response.teamId);

      await teamRef.update({
        score: admin.firestore.FieldValue.increment(1)
      });
    }
  });
```

### Deploy with Functions

```bash
firebase deploy --only functions,hosting
```

---

## 📱 Progressive Web App (PWA)

Make it installable:

```bash
# Add PWA plugin
cd vue-app
npm install vite-plugin-pwa -D
```

Configure in `vite.config.js`:

```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Family Quiz',
        short_name: 'Quiz',
        theme_color: '#667eea',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
}
```

---

## 💰 Cost Estimation

### Firebase Hosting (Recommended)

**Free Tier:**
- 10 GB storage
- 360 MB/day bandwidth
- Free SSL certificate
- ~100,000 views/month (assuming 100KB per page)

**Paid (if exceeded):**
- $0.026 per GB storage
- $0.15 per GB bandwidth

**Example:** 1 million views/month
- Data transfer: ~100 GB
- Cost: $15/month

### Cloud Run

**Free Tier:**
- 2 million requests/month
- 360,000 GB-seconds memory
- 180,000 vCPU-seconds

**Paid:**
- $0.40 per million requests
- $0.0000025 per GB-second
- $0.00001 per vCPU-second

**Example:** 1 million views/month (512MB, 1 vCPU, 100ms avg)
- Requests: $0.40
- Memory: $1.25
- CPU: $0.10
- **Total: ~$2/month**

---

## 🎯 Quick Reference

### Firebase Hosting (Static App)

```bash
# One-time setup
npm install -g firebase-tools
firebase login
firebase init hosting

# Every deployment
npm run build
firebase deploy --only hosting
```

### Cloud Run (Docker Container)

```bash
# One-time setup
gcloud init
gcloud services enable run.googleapis.com

# Every deployment
gcloud builds submit --tag gcr.io/PROJECT_ID/quiz
gcloud run deploy quiz --image gcr.io/PROJECT_ID/quiz
```

---

## 📞 Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts)

---

**Recommended: Start with Firebase Hosting, add Firestore/Functions later for team features! 🚀**
