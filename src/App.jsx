import LanguageProvider from "./contexts/LanguageProvider";
import Header from "./components/Header";
import Content from "./components/Content";
import Translator from "./components/Translator";

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-surface text-text-primary font-sans">
        <Header />
        <div className="max-w-2xl mx-auto px-4">
          <Content />
          <Translator />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
