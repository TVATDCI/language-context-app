# Refactor Plan v1 — language-context-app

**Date:** March 3, 2026  
**Branch:** main  
**Stack:** React 19, Vite 6, JavaScript/JSX (no TypeScript), Tailwind CSS v4.2, Vitest

---

## Goals

Full upgrade across dependencies, styling, code quality, and testing.

- Stay in JavaScript/JSX — TypeScript migration deferred to a future refactor
- Tailwind CSS v4.2 via the first-party `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- CSS-first `@theme` semantic token system — replaces raw `:root` variables
- Fix a silent language-code mismatch bug present throughout the app
- Add a custom `useLanguage` hook and a centralized language list
- Install Vitest + Testing Library and write meaningful tests

---

## Progress Tracker

| #   | Task                                                                | Status  |
| --- | ------------------------------------------------------------------- | ------- |
| 1   | Fix the silent language-code mismatch bug                           | ✅ Done |
| 2   | Centralize language list (`src/utils/languages.js`)                 | ✅ Done |
| 3   | Add `useLanguage` custom hook (`src/hooks/useLanguage.js`)          | ✅ Done |
| 4   | Install Tailwind CSS v4.2 (`@tailwindcss/vite`)                     | ✅ Done |
| 5   | Update `vite.config.js` — add Tailwind plugin + Vitest config       | ✅ Done |
| 6   | Rewrite `src/index.css` — `@import "tailwindcss"` + `@theme` tokens | ✅ Done |
| 7   | Apply Tailwind classes to all components                            | ✅ Done |
| 8   | Remove stale `import React` statements                              | ✅ Done |
| 9   | Install Vitest + Testing Library + `@testing-library/dom`           | ✅ Done |
| 10  | Create `src/setupTests.js`, rewrite `App.test.jsx` (4 tests)        | ✅ Done |
| 11  | Fix ESLint config — Vitest globals for test files                   | ✅ Done |
| 12  | Fix `index.html` — title, meta, move Google Font links              | ✅ Done |
| 13  | Update `README.md`                                                  | ✅ Done |

**Verification results:**

- ✅ `npm run build` — clean build, 39 modules, 730ms
- ✅ `npm test -- --run` — 4/4 tests pass
- ✅ `npm run lint` — zero errors

---

## Step-by-Step Detail

---

### Step 1 — Fix the silent language-code bug

**Problem:**  
The app has a silent lookup mismatch. `LanguageSelector` emits codes like `"DE"`, `"US"`, `"th"` (Thai is lowercase), while `WelcomeMessage` keys on `"en"`, `"de"`, `"IR"`, `"TR"` (inconsistent casing), and `dictionary.js` uses all-lowercase. Most greetings and translations silently fall back to defaults.

**Fix:**  
Normalize all language codes to **2-letter uppercase** everywhere (`EN`, `DE`, `TR`, `IR`, `FR`, `SP`, `DU`, `TH`).

Files changed:

- `src/utils/dictionary.js` — change all inner keys to uppercase
- `src/contexts/LanguageContext.js` — `createContext({ language: "EN" })`
- `src/contexts/LanguageProvider.jsx` — `useState("EN")`
- `src/components/WelcomeMessage.jsx` — normalize `greetings` keys; remove mismatch
- `src/components/Translator.jsx` — remove the `languageMap` translation layer; look up `dictionary[word][language]` directly
- `src/components/LanguageSelector.jsx` — fix `value="th"` → `value="TH"`, add Thai flag 🇹🇭

---

### Step 2 — Centralize language list

**Problem:**  
`LanguageSelector` and `Translator` both hard-code the same 8-language array independently.

**Fix:**  
Create `src/utils/languages.js` exporting a shared `LANGUAGES` array:

```js
export const LANGUAGES = [
  { code: "EN", label: "🇺🇸 English" },
  { code: "DE", label: "🇩🇪 German" },
  { code: "TR", label: "🇹🇷 Turkish" },
  { code: "IR", label: "🇮🇷 Persian" },
  { code: "FR", label: "🇫🇷 French" },
  { code: "SP", label: "🇪🇸 Spanish" },
  { code: "DU", label: "🇳🇱 Dutch" },
  { code: "TH", label: "🇹🇭 Thai" },
];
```

Update `LanguageSelector.jsx` and `Translator.jsx` to import and map over `LANGUAGES`.

---

### Step 3 — Add `useLanguage` custom hook

Create `src/hooks/useLanguage.js`:

```js
import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
```

Update all consumers (`LanguageSelector`, `Translator`, `WelcomeMessage`) to use `useLanguage()` instead of `useContext(LanguageContext)`.

---

### Step 4 — Install Tailwind CSS v4.2

```bash
npm install tailwindcss @tailwindcss/vite
```

**Key v4 differences from v3:**

- No `tailwind.config.js` — all config lives in CSS
- No `content` array — automatic source detection
- No `@tailwind base/components/utilities` directives — replaced by `@import "tailwindcss"`
- `@theme {}` directive replaces the JS config `theme.extend`
- First-party Vite plugin (`@tailwindcss/vite`) — faster than PostCSS for Vite projects

---

### Step 5 — Update `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
```

---

### Step 6 — Rewrite `src/index.css` with `@theme` semantic tokens

Replace all raw `:root` variables with properly scoped `@theme` tokens.  
This generates real Tailwind utility classes: `bg-surface`, `text-text-primary`, `bg-accent`, etc.

Color space: **oklch** — matches Tailwind v4's modernized P3 palette standard.

**Semantic token groups defined:**

- `--color-surface-*` — 5 dark background layers
- `--color-text-*` — 4 text hierarchy levels
- `--color-accent-*` — 8 accent colours (purple, gold, coral, green, indigo, pink, cream, peach)
- `--color-stroke` — border/divider colour
- `--font-sans`, `--font-mono`, `--font-grotesk` — typography tokens

---

### Step 7 — Apply Tailwind classes to components

Replace all inline `style={{}}` props with utility classes using the new semantic tokens.

| Component              | Key classes applied                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `App.jsx`              | `min-h-screen bg-surface text-text-primary font-sans`                                                                                   |
| `Header.jsx`           | `flex items-center justify-between px-6 py-4 border-b border-stroke`                                                                    |
| `Content.jsx`          | `max-w-2xl mx-auto px-4 py-8`                                                                                                           |
| `WelcomeMessage.jsx`   | `text-4xl font-semibold text-accent`                                                                                                    |
| `LanguageSelector.jsx` | `bg-surface-overlay border border-stroke rounded-md text-text-secondary`                                                                |
| `Translator.jsx`       | Remove all `style={{}}`, language buttons with `bg-surface-raised hover:bg-surface-muted rounded px-2 py-1 text-sm disabled:opacity-40` |

---

### Step 8 — Remove stale `import React` statements

React 19 + Vite's JSX transform doesn't require the default `React` import.  
Remove from: `Content.jsx`, `Header.jsx`, `LanguageSelector.jsx`, `Translator.jsx`, `WelcomeMessage.jsx`, `LanguageProvider.jsx`.  
Keep named imports (`useState`, `useContext`) where needed.

---

### Step 9 — Install Vitest + Testing Library

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add to `package.json` scripts:

```json
"test": "vitest",
"test:ui": "vitest --ui"
```

---

### Step 10 — Setup tests and rewrite `App.test.jsx`

Create `src/setupTests.js`:

```js
import "@testing-library/jest-dom";
```

Rewrite `src/App.test.js` → `src/App.test.jsx`:

- Test 1: App renders without crashing
- Test 2: Switching language in `LanguageSelector` updates the greeting in `WelcomeMessage`
- Test 3: `Translator` returns the correct dictionary word for a given language

---

### Step 11 — Fix `index.html`

- Change `<title>Vite + React</title>` → `<title>Language Context App</title>`
- Add `<meta name="description">`
- Move Google Font `<link>` tags from CSS into `<head>` (better performance — avoids FOUT)

---

### Step 12 — Update `README.md`

- Remove `npx create-react-app` section (project uses Vite)
- Add Getting Started: `npm install`, `npm run dev`, `npm test`, `npm run build`
- Update project structure tree (add `hooks/`, `utils/languages.js`)
- Add "Language codes" section with the 8 supported codes
- Document how to add a new language

---

## Verification Checklist

- [x] `npm run dev` — app loads; all 8 languages update WelcomeMessage greeting and Translator correctly
- [x] `npm test -- --run` — 4/4 tests pass
- [x] `npm run lint` — zero ESLint errors
- [x] `npm run build` — clean production build, no warnings

---

## Commit History (feature/v1)

| Hash      | Type     | Scope      | Description                                                                                 |
| --------- | -------- | ---------- | ------------------------------------------------------------------------------------------- |
| `225dd09` | fix      | lang       | Normalize all language codes to uppercase; expand dictionary 4→60 words; add `languages.js` |
| `a48fc64` | feat     | hooks      | Add `useLanguage` custom hook with provider guard                                           |
| `3db06a6` | feat     | styling    | Install Tailwind CSS v4.2 via `@tailwindcss/vite`; rewrite `index.css` with `@theme` tokens |
| `0e612fa` | refactor | components | Apply Tailwind classes, `useLanguage`, `LANGUAGES` to all components                        |
| `684875e` | test     | —          | Set up Vitest + Testing Library; rewrite `App.test.jsx` with 4 real tests                   |
| `74890a6` | docs     | config     | Update `index.html`, `README.md`; create `refactor-v1.md`                                   |

---

## Refactor v2 — Future Development Plan

### Priority 1 — UX Improvements

#### 1.1 Persist language selection to `localStorage`

- Store the selected language code in `localStorage` on every `setLanguage` call
- Read from `localStorage` as the initial value in `LanguageProvider` (with `EN` fallback)
- Files: `src/contexts/LanguageProvider.jsx`
- Why: currently refreshing the page resets to English

#### 1.2 "Word not found" indicator in Translator

- When a typed word is not in the dictionary, currently it passes through unchanged
- Show a subtle visual indicator — e.g. a dotted underline or `[word?]` badge — on unrecognized words in the translation output
- Files: `src/components/Translator.jsx`

#### 1.3 Translate on Enter key

- Currently requires clicking the Translate button
- Add `onKeyDown` handler to the input: if `key === 'Enter'` fire `handleTranslate`
- Files: `src/components/Translator.jsx`

#### 1.4 RTL layout support for Persian

- Persian (`IR`) is a right-to-left language; the current layout doesn't flip
- Add `dir="rtl"` dynamically to the `<html>` element (or a wrapper) when `language === 'IR'`
- Use Tailwind `rtl:` variant for mirrored padding/margins where needed
- Files: `src/App.jsx`, `src/contexts/LanguageProvider.jsx`

#### 1.5 Language auto-detection on first load

- Read `navigator.language` and map it to the closest supported code on first visit
- Only apply if no `localStorage` value exists yet
- Files: `src/contexts/LanguageProvider.jsx`

---

### Priority 2 — Content / Dictionary

#### 2.1 Expand dictionary to ~150+ words

- Add categories: numbers (one–ten), colours, body parts, emotions, transport, weather
- Maintain the compact inline object format already in use
- Files: `src/utils/dictionary.js`

#### 2.2 Multi-word phrase support

- Currently translates word-by-word; add a `phrases` lookup that is checked first before the word-by-word fallback
- Example: `"good morning"` → `"Guten Morgen"` (not `"Gut Morgen"`)
- Files: `src/utils/dictionary.js`, `src/components/Translator.jsx`

#### 2.3 Dictionary word count display

- Show a small stat in the UI: "X words in dictionary"
- Computed from `Object.keys(dictionary).length`
- Files: `src/components/Translator.jsx`

---

### Priority 3 — Code Quality

#### 3.1 Migrate to TypeScript

- Rename `.js` → `.ts`, `.jsx` → `.tsx`
- Add `tsconfig.json` (target ES2020, `"jsx": "react-jsx"`, `"strict": true`)
- Type the context: `LanguageCode = 'EN' | 'DE' | 'TR' | 'IR' | 'FR' | 'SP' | 'DU' | 'TH'`
- Type the dictionary: `Record<string, Record<LanguageCode, string>>`
- This is the largest scope change — do in a dedicated branch `feature/typescript`

#### 3.2 Expand test coverage

- Add tests for: `useLanguage` throws outside provider, `localStorage` persistence, RTL flag, "word not found" indicator
- Add a separate `dictionary.test.js` that asserts every word has all 8 language keys
- Target ≥ 80% statement coverage (`vitest --coverage`)
- Install: `@vitest/coverage-v8`

#### 3.3 Extract a `useTranslator` hook

- Move the `input`, `translated`, `handleTranslate` state logic out of `Translator.jsx` into `src/hooks/useTranslator.js`
- Keeps the component purely presentational
- Makes the translation logic independently testable

---

### Priority 4 — Architecture / DX

#### 4.1 Move Google Fonts to self-hosted

- Download Sora, Source Code Pro, Space Grotesk via `fontsource` npm packages
- Remove external Google Fonts `<link>` from `index.html`
- Eliminates external network dependency; improves privacy and load performance
- Install: `@fontsource/sora`, `@fontsource/source-code-pro`, `@fontsource/space-grotesk`
- Files: `src/main.jsx` (import font CSS), `index.html`

#### 4.2 Add absolute imports

- Configure Vite `resolve.alias` so `@/components/...`, `@/hooks/...`, `@/utils/...` work
- Avoids fragile `../../` relative imports as the tree grows
- Files: `vite.config.js`

#### 4.3 Add a `CHANGELOG.md`

- Document changes per version following Keep a Changelog format
- Start with v1.0.0 entry summarising the refactor-v1 work
