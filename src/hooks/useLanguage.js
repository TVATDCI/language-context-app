import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

/**
 * Custom hook to consume LanguageContext.
 * Throws a clear error if used outside of LanguageProvider.
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a <LanguageProvider>");
  }
  return ctx;
}
