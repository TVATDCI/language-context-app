import LanguageSelector from "./LanguageSelector";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface-raised">
      <h1 className="text-xl font-semibold text-text-primary tracking-tight">
        🌍 Language Context App
      </h1>
      <LanguageSelector />
    </header>
  );
};

export default Header;
