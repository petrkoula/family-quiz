# Family Quiz - Product Vision

## Mission
Create an interactive photo quiz application that brings families together through shared memories and friendly competition.

## Target Users
- **Primary:** Family reunion organizers
- **Secondary:** Party hosts, corporate event planners, educators

## Core Value Proposition
Local-first photo quiz that works offline with beautiful presentation optimized for large displays (projectors, TVs).

## Product Principles

1. **Offline-First:** No internet required during quiz presentation
2. **Presentation-Optimized:** High contrast, large fonts, smooth animations
3. **Simple Setup:** Docker or npm - running in under 2 minutes
4. **Maintainable:** Clear code structure, comprehensive tests, modern practices

## Success Metrics

**Technical:**
- E2E test coverage of core user flows
- Build time under 30 seconds
- Bundle size under 1MB
- Zero console errors in production

**User Experience:**
- First-time setup under 5 minutes
- Fullscreen mode works on all modern browsers
- Keyboard navigation is intuitive
- Question transitions are smooth

## Current State (v1.0.0)

**Completed:**
- ✅ 23 vintage family photos with Czech questions
- ✅ Vue 3 with Composition API
- ✅ Keyboard navigation
- ✅ E2E test suite with Taiko
- ✅ Docker support (dev and production)
- ✅ CI/CD with GitHub Actions
- ✅ Firebase deployment ready

**In Progress:**
- 🔄 Agent settings and quality standards (this release)

## Future Horizons

### v1.1 - Firebase Integration
- Real-time team participation
- Live leaderboard
- QR code team access
- Mobile team interface

### v1.2 - PWA Features
- Installable app
- Offline sync
- Background updates
- Push notifications for new quizzes

### v1.3 - Quiz Builder
- Web interface for creating quizzes
- Photo upload and management
- Question generator assistance
- Quiz templates

## Non-Goals

- Complex scoring algorithms (keep it simple)
- Social media integration (privacy-first)
- Ads or monetization (family project)
- Multi-language UI (Czech content is intentional)

## Constraints

- **Budget:** Open source, free hosting (Firebase free tier)
- **Timeline:** Iterative releases, no hard deadlines
- **Team:** Solo developer with AI assistance
- **Technical:** Modern browsers only (no IE11 support)

## Decision Log

**2024-06-10:** Adopted uncle-bob agent settings for quality standards
**2024-06-10:** Established development branch for Firebase deployments
**2024-06-10:** Standardized on separator column alignment
**2024-06-10:** Committed to Composition API exclusively (no Options API)
