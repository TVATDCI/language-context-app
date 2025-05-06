import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const Translator = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };
  const languages = ["en", "es", "fr", "de"];

  return (
    <div>
      <h2>Select Language</h2>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>
            <button
              onClick={() => handleLanguageChange(lang)}
              disabled={language === lang}
            >
              {lang.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
      <p>Current Language: {language.toUpperCase()}</p>
    </div>
  );
};

export default Translator;
