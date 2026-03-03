import { useLanguage } from "../hooks/useLanguage";
import { LANGUAGES } from "../utils/languages";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="language-select"
        className="text-text-muted text-sm font-medium"
      >
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-surface-overlay border border-stroke rounded-md px-3 py-1.5 text-text-secondary text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
