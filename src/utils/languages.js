/**
 * Single source of truth for all supported language options.
 * All codes are 2-letter uppercase — matches dictionary.js keys.
 */
export const LANGUAGES = [
  { code: "EN", label: "🇺🇸 English", rtl: false },
  { code: "DE", label: "🇩🇪 German", rtl: false },
  { code: "TR", label: "🇹🇷 Turkish", rtl: false },
  { code: "IR", label: "🇮🇷 Persian", rtl: true },
  { code: "FR", label: "🇫🇷 French", rtl: false },
  { code: "SP", label: "🇪🇸 Spanish", rtl: false },
  { code: "DU", label: "🇳🇱 Dutch", rtl: false },
  { code: "TH", label: "🇹🇭 Thai", rtl: false },
];

/**
 * Check if a language code is RTL (right-to-left).
 * @param {string} code - Language code
 * @returns {boolean}
 */
export const isRTL = (code) => {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang?.rtl || false;
};
