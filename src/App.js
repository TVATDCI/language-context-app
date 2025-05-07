import "./App.css";
import LanguageProvider from "./contexts/LanguageProvider";
import Header from "./components/Header";
import Content from "./components/Content";
import Translator from "./components/Translator";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Header />
        <Content />
        <Translator />
      </div>
    </LanguageProvider>
  );
}

export default App;
