# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.0.0] - 2026-03-03

### Added

#### Phase 1 — UX Improvements

- **localStorage persistence** — Language selection survives page reloads
- **Browser language auto-detection** — Detects `navigator.language` on first visit
- **RTL layout support** — Persian (IR) renders with `dir="rtl"`
- **Word not found indicator** — Unknown words show with dotted underline and [?] badge
- **Enter key translation** — Press Enter to translate without clicking
- **Dictionary word count** — Shows how many words are available

#### Phase 2 — Content Expansion

- **Dictionary expansion** — 60 → 134 words (+74 new words)
  - Numbers (one-ten)
  - Colors (10 colors)
  - Body Parts (8 parts)
  - Emotions (8 emotions)
  - Transport (8 items)
  - Weather (8 items)
  - Animals (8 animals)
  - Common Nouns (8 nouns)
- **Multi-word phrase support** — 10 common phrases (good morning, thank you, etc.)
- **Smart translation** — Phrases matched first, then word-by-word fallback

#### Phase 3 — Code Quality

- **`useTranslator` hook** — Extracted translation logic from Translator component
- **Hook unit tests** — Comprehensive tests for `translateText()` function
- **useLanguage error test** — Validates error when used outside provider
- **Dictionary validation script** — `npm run validate` checks dictionary integrity

#### Phase 4 — Developer Experience

- **Self-hosted fonts** — Migrated from Google Fonts to @fontsource packages
  - Sora (300, 400, 600)
  - Source Code Pro (400, 600)
  - Space Grotesk (300)
- **Absolute imports** — `@/` path alias configured in Vite
- **jsconfig.json** — IDE support for path autocompletion
- **CHANGELOG.md** — This file!

### Changed

- Translator component refactored to use `useTranslator()` hook
- All relative imports can now use `@/` prefix (e.g., `@/hooks/useLanguage`)
- Fonts now loaded from npm packages instead of external CDN

### Fixed

- Removed external Google Fonts dependency for better privacy
- Translation logic now handles multi-word phrases correctly

## [1.0.0] - 2026-03-03

### Added Features

#### Core Features

- **8-language support** — EN, DE, TR, IR, FR, SP, DU, TH
- **Normalized uppercase codes** — All language codes standardized
- **LanguageContext** — Global state management with React Context
- **useLanguage hook** — Custom hook with provider guard

#### Dictionary

- **60 words** across 6 categories:
  - Greetings (7 words)
  - Time (7 words)
  - Nature (11 words)
  - People & Family (6 words)
  - Adjectives (12 words)
  - Food & Drink (5 words)
  - Places (4 words)
  - Verbs (12 words)

#### Tech Stack

- React 19
- Vite 6
- Tailwind CSS v4.2 with `@theme` tokens
- Vitest + Testing Library

#### Tests

- 4 initial tests for App rendering and translation

### Changes

- Migrated from Create React App to Vite
- Upgraded to Tailwind CSS v4.2 with CSS-first configuration
- Removed `tailwind.config.js` in favor of CSS `@theme`

### Fixed (v1.0.0)

- Silent language-code mismatch bug (all codes now uppercase)
- Stale `import React` statements removed

---

## Versioning Notes

- **v1.0.0** — Initial refactor complete (migrated to Vite, Tailwind v4, normalized codes)
- **v2.0.0** — Major feature additions (Phases 1-4 of refactor-v2 roadmap)

See [refactor-v1.md](./refactor-v1.md) and [refactor-v2.md](./refactor-v2.md) for detailed implementation plans.
