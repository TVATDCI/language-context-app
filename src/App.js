import "./App.css";
import LanguageProvider from "./contexts/LanguageProvider";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <header className="App-header ">Language Context App</header>
      </div>
    </LanguageProvider>
  );
}

export default App;
