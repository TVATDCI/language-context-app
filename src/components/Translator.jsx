import React, { useContext, useState } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const dictionary = {
  hello: {
    en: "Hello",
    es: "Hola",
    fr: "Bonjour",
    de: "Hallo",
  },
  world: {
    en: "World",
    es: "Mundo",
    fr: "le monde",
    de: "Welt",
  },
};

const Translator = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = () => {
    const words = input.trim().split(" ");
    const result = words
      .map((word) => dictionary[word.toLowerCase()]?.[language] || word)
      .join(" ");
    setTranslated(result);
  };

  const languages = ["en", "es", "fr", "de"];

  return (
    <div>
      <h2>Enter Text to Translate</h2>
      <input
        type="text"
        placeholder="e.g., hello world"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "200px", marginBottom: "10px" }}
      />
      <div>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            disabled={language === lang}
            style={{ marginRight: "5px" }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
        <button onClick={handleTranslate}>Translate</button>
      </div>
      <p style={{ marginTop: "20px" }}>
        <strong>Translation:</strong> {translated}
      </p>
    </div>
  );
};

export default Translator;
