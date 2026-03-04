import { useState, useCallback } from "react";
import { useLanguage } from "./useLanguage";
import dictionary, { phrases } from "../utils/dictionary";

/**
 * Translates input text using phrases first, then word-by-word fallback.
 * Longer phrases are matched first (greedy algorithm).
 *
 * @param {string} input - Text to translate
 * @param {string} language - Target language code
 * @returns {Array<{original: string, translated: string, found: boolean, isPhrase: boolean}>}
 */
export const translateText = (input, language) => {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const result = [];
  let i = 0;

  while (i < tokens.length) {
    let matched = false;

    // Try to match phrases from longest to shortest (max 4 words)
    for (let len = Math.min(4, tokens.length - i); len >= 1; len--) {
      const phrase = tokens
        .slice(i, i + len)
        .join(" ")
        .toLowerCase();
      const phraseTranslation = phrases[phrase]?.[language];

      if (phraseTranslation && len > 1) {
        // It's a multi-word phrase match
        result.push({
          original: tokens.slice(i, i + len).join(" "),
          translated: phraseTranslation,
          found: true,
          isPhrase: true,
        });
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Fall back to single word lookup
      const word = tokens[i].toLowerCase();
      const translated = dictionary[word]?.[language];
      result.push({
        original: tokens[i],
        translated: translated || tokens[i],
        found: !!translated,
        isPhrase: false,
      });
      i++;
    }
  }

  return result;
};

/**
 * Custom hook for translation functionality.
 * Manages input state and provides translation results.
 *
 * @returns {{
 *   input: string,
 *   setInput: (value: string) => void,
 *   result: Array | null,
 *   translate: () => void,
 *   wordCount: number
 * }}
 */
export function useTranslator() {
  const { language } = useLanguage();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  // Get dictionary word count
  const wordCount = Object.keys(dictionary).length;

  /**
   * Perform translation based on current input and language.
   */
  const translate = useCallback(() => {
    const translationResult = translateText(input, language);
    setResult(translationResult);
  }, [input, language]);

  /**
   * Clear the translation result.
   */
  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    input,
    setInput,
    result,
    translate,
    clearResult,
    wordCount,
  };
}

export default useTranslator;
