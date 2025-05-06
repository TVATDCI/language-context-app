import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div>
      <label htmlFor="language-select">Choose language: </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="DE">🇩🇪&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;German</option>
        <option value="US">🇺🇸&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;English</option>
        <option value="TR">🇹🇷&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Turkish</option>
        <option value="IR">🇮🇷&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Persian</option>
        <option value="FR">🇫🇷&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;French</option>
        <option value="SP">🇪🇸&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Spanish</option>
        <option value="DU">🇳🇱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dutch</option>
        <option value="th">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ไทย</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
