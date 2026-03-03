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

- [ ] `npm run dev` — app loads; all 8 languages update WelcomeMessage greeting and Translator correctly
- [ ] `npm test` — all tests green
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm run build` — clean production build, no warnings

---

## Future Refactor Ideas (v2)

- Migrate to TypeScript (`.ts`/`.tsx`) — add `tsconfig.json`, type the language context and dictionary
- Add more dictionary words and a "word not found" UI indicator
- Persist selected language to `localStorage`
- Add RTL layout support for Persian (`IR`) using Tailwind's `rtl:` variant
- Add language auto-detection based on browser `navigator.language`
- Add a loading/transition animation when switching languages
