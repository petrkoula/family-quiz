# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-10

### Added
- Complete Vue.js application with local-first architecture
- 23 vintage family photos with 69 Czech quiz questions
- E2E testing with Taiko (11 comprehensive tests)
- Docker support (development and production)
- GitHub Actions CI/CD pipeline
- Comprehensive documentation (README, GETTING-STARTED, DOCKER, PRD)
- Keyboard navigation controls
- Progress dots for question tracking
- Presenter View for quiz presentation
- Team View for future Firebase integration
- Admin View for future team monitoring

### Features

#### Quiz
- 23 vintage family photos from 1960s-1980s
- 3 questions per photo (69 total)
- Czech language questions with humor
- Multiple choice (4 options per question)
- Visual progress dots
- Answer reveal functionality

#### User Interface
- Fullscreen photo display
- Smooth question transitions
- Keyboard-first navigation
- Responsive design
- Modern Vue 3 Composition API

#### Developer Experience
- Hot reload in development
- E2E tests with headless/interactive modes
- Docker containerization
- Multi-stage builds for production
- Automated CI/CD testing
- Comprehensive documentation

#### Keyboard Controls
- `Space` - Toggle questions visibility
- `←` `→` - Navigate between photos
- `↑` `↓` - Navigate between questions
- `A` - Reveal correct answer
- `F` - Toggle fullscreen
- `ESC` - Hide questions/exit fullscreen

### Technical Stack
- Vue 3.4 with Composition API
- Vite 5.0 build tool
- Pinia state management
- Vue Router for navigation
- Taiko for E2E testing
- Docker & Docker Compose
- GitHub Actions for CI/CD
- Nginx for production serving

### Documentation
- Main README with badges and quick start
- GETTING-STARTED.md for beginners
- DOCKER.md for containerization
- PRD.md with technical specifications
- FIREBASE-DEPLOYMENT.md for future features
- Inline code comments and JSDoc

### Testing
- 11 E2E tests covering complete user workflow
- Automated screenshot capture on failure
- Headless mode for CI/CD
- Interactive mode for debugging
- GitHub Actions integration

### Deployment
- Docker development mode (hot reload)
- Docker production mode (optimized)
- Static hosting ready (Netlify, Vercel)
- Firebase Hosting ready (future)
- GitHub Pages ready

## [0.2.0] - 2026-06-09

### Added
- Initial Vue.js refactoring from vanilla JavaScript
- Pinia state management
- Vue Router setup
- Basic presenter view

### Removed
- Vanilla JavaScript version
- Node.js WebSocket server (moved to future Firebase integration)
- Team participation HTML files (replaced with Vue components)

## [0.1.0] - 2026-06-08

### Added
- Initial vanilla JavaScript implementation
- 23 photos with quiz data
- Node.js server with Socket.io
- Team participation interface
- Admin dashboard
- Progress dots
- Czech translations

### Features
- Photo display with questions
- Keyboard navigation
- Real-time team responses via WebSocket
- Leaderboard and scoring
- QR code for team access

---

## Future Releases

### [1.1.0] - Planned

#### Firebase Integration
- [ ] Real-time team participation
- [ ] Live leaderboard
- [ ] Score tracking and persistence
- [ ] QR code generation for team access
- [ ] Admin dashboard with live data

#### PWA Features
- [ ] Service worker for offline support
- [ ] Installable web app
- [ ] Push notifications for teams
- [ ] Background sync

#### Enhanced Features
- [ ] Timer for questions
- [ ] Sound effects
- [ ] Animations for correct answers
- [ ] Confetti celebration
- [ ] Photo zoom capability
- [ ] Export results as PDF

#### Customization
- [ ] Theme selector
- [ ] Custom color schemes
- [ ] Font size adjustment
- [ ] Accessibility improvements

### [1.2.0] - Future

#### Advanced Features
- [ ] Multiple quiz sets
- [ ] Quiz editor UI
- [ ] Import/export quiz data
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Photo slideshow mode

#### Mobile App
- [ ] React Native mobile app
- [ ] iOS and Android support
- [ ] Offline mode
- [ ] Camera integration for custom photos

---

**Legend:**
- `Added` - New features
- `Changed` - Changes to existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security improvements
