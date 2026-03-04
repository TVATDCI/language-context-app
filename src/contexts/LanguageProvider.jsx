import { useState, useEffect, useCallback } from "react";
import { LanguageContext } from "./LanguageContext";
import { LANGUAGES } from "../utils/languages";

const STORAGE_KEY = "language";

/**
 * Maps browser language codes to supported language codes.
 * Handles variations like "de-DE", "de-AT" → "DE"
 */
const detectBrowserLanguage = () => {
  const browserLang = navigator.language?.toLowerCase() || "en";
  const langCode = browserLang.split("-")[0];

  const langMap = {
    de: "DE",
    tr: "TR",
    fa: "IR",
    fr: "FR",
    es: "SP",
    nl: "DU",
    th: "TH",
    en: "EN",
  };

  return langMap[langCode] || "EN";
};

/**
 * Gets initial language from localStorage or auto-detects from browser.
 * Falls back to "EN" if stored language is invalid.
 */
const getInitialLanguage = () => {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  const validCodes = LANGUAGES.map((l) => l.code);

  if (stored && validCodes.includes(stored)) {
    return stored;
  }

  // Auto-detect from browser if no valid stored value
  return detectBrowserLanguage();
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  /**
   * Wrapper for setLanguage that also persists to localStorage.
   */
  const setLanguage = useCallback((newLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem(STORAGE_KEY, newLanguage);
  }, []);

  // Sync language to localStorage on changes (backup safety net)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
