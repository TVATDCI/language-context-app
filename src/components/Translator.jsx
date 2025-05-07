import React, { useContext, useState } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import dictionary from "../utils/dictionary";
const languageMap = {
  US: "en",
  DE: "de",
  TR: "tr",
  IR: "ir",
  FR: "fr",
  SP: "sp",
  DU: "du",
  th: "th",
};

const Translator = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = () => {
    const langCode = languageMap[language] || "en";
    const words = input.trim().split(" ");
    const result = words
      .map((word) => dictionary[word.toLowerCase()]?.[langCode] || word)
      .join(" ");
    setTranslated(result);
  };

  const languages = [
    { code: "DE", label: "🇩🇪 German" },
    { code: "US", label: "🇺🇸 English" },
    { code: "TR", label: "🇹🇷 Turkish" },
    { code: "IR", label: "🇮🇷 Persian" },
    { code: "FR", label: "🇫🇷 French" },
    { code: "SP", label: "🇪🇸 Spanish" },
    { code: "DU", label: "🇳🇱 Dutch" },
    { code: "th", label: "ไทย" },
  ];

  return (
    <div>
      <h2>Enter Text to Translate</h2>
      <input
        type="text"
        placeholder="e.g., good morning world"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "300px", marginBottom: "10px" }}
      />
      <div style={{ marginBottom: "10px" }}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            disabled={language === lang.code}
            style={{ marginRight: "5px" }}
          >
            {lang.label}
          </button>
        ))}
        <button onClick={handleTranslate}>Translate</button>
      </div>
      <p>
        <strong>Translation:</strong> {translated}
      </p>
    </div>
  );
};

export default Translator;
