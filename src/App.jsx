import LanguageProvider from "./contexts/LanguageProvider";
import Header from "./components/Header";
import Content from "./components/Content";
import Translator from "./components/Translator";

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

// Separate component to access language context
import { useLanguage } from "./hooks/useLanguage";
import { isRTL } from "./utils/languages";

function AppContent() {
  const { language } = useLanguage();
  const dir = isRTL(language) ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      className="min-h-screen bg-surface text-text-primary font-sans"
    >
      <Header />
      <div className="max-w-2xl mx-auto px-4">
        <Content />
        <Translator />
      </div>
    </div>
  );
}

export default App;
