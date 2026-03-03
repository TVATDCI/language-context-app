import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { LANGUAGES } from "../utils/languages";
import dictionary from "../utils/dictionary";

const Translator = () => {
  const { language, setLanguage } = useLanguage();
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = () => {
    const words = input.trim().split(" ");
    const result = words
      .map((word) => dictionary[word.toLowerCase()]?.[language] || word)
      .join(" ");
    setTranslated(result);
  };

  return (
    <section className="mt-8 p-6 bg-surface-raised rounded-xl border border-stroke">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Word Translator
      </h2>

      <input
        type="text"
        placeholder="e.g., hello world, good morning, love is beautiful"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full max-w-sm bg-surface-overlay border border-stroke rounded-md px-3 py-2 text-text-secondary text-sm placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-accent/50 mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            disabled={language === lang.code}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-surface-muted text-text-secondary hover:bg-stroke hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-default"
          >
            {lang.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleTranslate}
        className="px-4 py-2 rounded-md bg-accent text-surface font-semibold text-sm hover:opacity-90 transition-opacity mb-4"
      >
        Translate
      </button>

      {translated && (
        <p className="text-text-secondary text-sm">
          <span className="text-text-muted font-medium">Translation: </span>
          <span className="text-accent-gold font-semibold">{translated}</span>
        </p>
      )}
    </section>
  );
};

export default Translator;
