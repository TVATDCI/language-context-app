import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const greetings = {
  en: "Hello World!",
  de: "Hallo Welt!",
  IR: "سلام دنیا!",
  th: "สวัสดีชาวโลก!",
  TR: "Selam Dünya!",
  FR: "Bonjour le monde!",
  SP: "Hola Mundo!",
  DU: "Hallo Wereld!",
};

const WelcomeMessage = () => {
  const { language } = useContext(LanguageContext);

  return <h1>{greetings[language] || "Hello World!"}</h1>;
};

export default WelcomeMessage;
