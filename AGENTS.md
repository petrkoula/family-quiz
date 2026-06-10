# Agent Settings & Skills

This document serves as the repository-level registry for Claude Code agent instructions and skill configurations for the **family-quiz** project.

## Core Configuration

**Version & Tooling Policy:** Skills must detect actual project versions from `package.json` and lockfiles rather than hardcoding them. Web search validates latest stable patterns; version gaps trigger upgrade recommendations.

**Shell Entry Points:**
- JavaScript/TypeScript work uses `npm` or `yarn`
- Commands must be confirmed as available before execution

## Technology Stack Standards

The repository enforces these version and tool preferences:

| Technology       | Policy         | Primary | Fallback |
|-----------------|----------------|---------|----------|
| Node.js         | Latest LTS     | npm     | yarn     |
| Vue.js          | Latest stable  | v3.4+   | —        |
| Vite            | Latest stable  | v5.0+   | —        |
| Pinia           | Latest stable  | v2.1+   | —        |
| Taiko (testing) | Latest stable  | v1.4+   | —        |

## Distribution Boundaries

Portable surfaces include `.agents/skills/`, `.github/agents/`, and their owned references. Repository-only surfaces (CI, Docker configs, deployment workflows) must not be dependencies for distributable skills.

## Documentation Synchronization

Three truth surfaces must stay synchronized:
1. Runtime skill/agent definitions
2. Published explanation docs (README.md, documentation files)
3. Repository control surfaces (workflows, validation)

Documentation drift is a defect when skills lack docs, docs reference removed paths, or behavior changes without matching updates.

## Mandatory Skill

**ub-quality** (`.agents/skills/ub-quality/SKILL.md`) — Cross-language code quality standards covering design patterns, formatting, documentation, and refactoring. This skill loads unconditionally.

## Registered Skills (3 Total)

| Skill        | Focus                  | Path                                 |
|--------------|------------------------|--------------------------------------|
| ub-quality   | Code quality baseline  | `.agents/skills/ub-quality/SKILL.md` |
| ub-vuejs     | Vue.js patterns        | `.agents/skills/ub-vuejs/SKILL.md`   |
| ub-authoring | Authoring conventions  | `.agents/skills/ub-authoring/SKILL.md` |

## Project-Specific Standards

### Quiz Application Architecture
- **Local-First**: Quiz data embedded in bundle, works offline
- **Composition API**: Vue 3 with `<script setup>` exclusively
- **Presentation Focus**: Optimized for projector/TV displays (high contrast, large fonts)
- **Czech Language**: All quiz content in Czech; UI controls in English comments

### File Organization
- Quiz data: `vue-app/src/data/quizData.js`
- Components: `vue-app/src/components/`
- Views: `vue-app/src/views/`
- Stores: `vue-app/src/stores/`
- E2E tests: `vue-app/tests/`
- Images: `images/` (root) → copied to `vue-app/public/images/`

### Development Workflow
- Development server: `cd vue-app && npm run dev`
- E2E tests: `cd vue-app && npm run test:e2e`
- Build: `cd vue-app && npm run build`
- Docker dev: `docker-compose up dev`

## Workflow Routing

Before substantial work: consult `.ub-workflows/status.md` for current work state. Reference `.ub-workflows/vision.md` for product direction. Present options under forecast pressure; await explicit decisions before scope expansion.

## Quality Gates

All code changes must:
1. Maintain separator column alignment (longest-left-token rule)
2. Use Vue 3 Composition API with `<script setup>`
3. Format embedded `<style>` and `<script>` blocks as native CSS/JS
4. Pass E2E tests (`npm run test:e2e`)
5. Build successfully (`npm run build`)

## Version Policy

- **Current**: Vue 3.4, Vite 5.0, Pinia 2.1, Taiko 1.4
- **Target**: Latest stable releases
- **Detection**: Extract from `vue-app/package.json` and lockfiles
- **Gaps**: Trigger upgrade recommendations when version lags by minor release
