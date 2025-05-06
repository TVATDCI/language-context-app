import { createContext } from "react";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
});

export { LanguageContext };

// Use create context to create a LanguageContext
// Set default values for language as a fallback.
// - For IDE autocomplete
// - To avoid undefined errors during development

// Next stop is to create a LanguageProvider component:
