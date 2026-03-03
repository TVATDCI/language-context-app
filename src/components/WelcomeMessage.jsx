import { useLanguage } from "../hooks/useLanguage";

const greetings = {
  EN: "Hello World!",
  DE: "Hallo Welt!",
  TR: "Selam Dünya!",
  IR: "سلام دنیا!",
  FR: "Bonjour le monde!",
  SP: "¡Hola Mundo!",
  DU: "Hallo Wereld!",
  TH: "สวัสดีชาวโลก!",
};

const WelcomeMessage = () => {
  const { language } = useLanguage();

  return (
    <p className="text-3xl font-semibold text-accent mt-2">
      {greetings[language] ?? "Hello World!"}
    </p>
  );
};

export default WelcomeMessage;
