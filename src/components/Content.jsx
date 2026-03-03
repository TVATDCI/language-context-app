import WelcomeMessage from "./WelcomeMessage";

const Content = () => {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-text-muted text-sm uppercase tracking-widest mb-2">
        Greeting
      </h2>
      <WelcomeMessage />
    </main>
  );
};

export default Content;
