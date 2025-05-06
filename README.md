# Language Context App

A small React application to demonstrate how to use the `useContext` hook for managing global state — in this case, switching between multiple languages.

## Step 1: Initial Setup

- Created a new React app using Create React App.

```bash
npx create-react-app language-context-app
cd language-context-app
```

## Project Structure

```css
src/
├── App.js
├── components/
│   ├── Header.jsx
│   └── Content.jsx
│   ├── LanguageSelector.jsx
│   └── Translator.jsx
│   ├── WelcomeMessage.jsx
├── contexts/
│   ├── LanguageContext.js
│   └── LanguageProvider.jsx
```
