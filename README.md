# Language Context App

A React project demonstrating the `useContext` hook for global state management — switching between 8 languages in real time.

Built with **React 19**, **Vite 6**, and **Tailwind CSS v4.2**.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

---

## Project Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css              # @import "tailwindcss" + @theme tokens
├── setupTests.js
├── App.test.jsx
├── components/
│   ├── Header.jsx
│   ├── Content.jsx
│   ├── LanguageSelector.jsx
│   ├── Translator.jsx
│   └── WelcomeMessage.jsx
├── contexts/
│   ├── LanguageContext.js
│   └── LanguageProvider.jsx
├── hooks/
│   └── useLanguage.js     # custom hook wrapping useContext
└── utils/
    ├── dictionary.js      # word translations keyed by uppercase code
    └── languages.js       # single source of truth for language list
```

---

## Supported Languages

| Code | Language   |
| ---- | ---------- |
| `EN` | 🇺🇸 English |
| `DE` | 🇩🇪 German  |
| `TR` | 🇹🇷 Turkish |
| `IR` | 🇮🇷 Persian |
| `FR` | 🇫🇷 French  |
| `SP` | 🇪🇸 Spanish |
| `DU` | 🇳🇱 Dutch   |
| `TH` | 🇹🇭 Thai    |

All language codes are **2-letter uppercase** throughout the codebase.

### Adding a new language

1. Add an entry to `src/utils/languages.js` (`{ code: "JP", label: "🇯🇵 Japanese" }`)
2. Add the greeting to the `greetings` object in `src/components/WelcomeMessage.jsx`
3. Add translations to each word entry in `src/utils/dictionary.js`

---

## Refactor

See [refactor-v1.md](./refactor-v1.md) for the full upgrade plan and progress tracker.
