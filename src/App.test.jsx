import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// ── Test 1: App renders without crashing ─────────────────────────────────────
test("renders the app header", () => {
  render(<App />);
  expect(screen.getByText(/Language Context App/i)).toBeInTheDocument();
});

// ── Test 2: Default greeting is English ──────────────────────────────────────
test("shows the English greeting by default", () => {
  render(<App />);
  expect(screen.getByText("Hello World!")).toBeInTheDocument();
});

// ── Test 3: Switching language updates the greeting ───────────────────────────
test("switches greeting when a language button is clicked in Translator", async () => {
  const user = userEvent.setup();
  render(<App />);

  // Click the German button in the Translator language switcher
  const germanButton = screen.getByRole("button", { name: /German/i });
  await user.click(germanButton);

  expect(screen.getByText("Hallo Welt!")).toBeInTheDocument();
});

// ── Test 4: Translator returns correct dictionary word ───────────────────────
test("translates a word using the dictionary", async () => {
  const user = userEvent.setup();
  render(<App />);

  // Switch to French
  const frenchButton = screen.getByRole("button", { name: /French/i });
  await user.click(frenchButton);

  // Type a word and translate
  const input = screen.getByPlaceholderText(/hello world/i);
  await user.type(input, "hello");

  const translateButton = screen.getByRole("button", { name: /^Translate$/i });
  await user.click(translateButton);

  expect(screen.getByText(/Bonjour/i)).toBeInTheDocument();
});

// ── Test 5: localStorage persistence ─────────────────────────────────────────
test("persists language selection to localStorage", async () => {
  const user = userEvent.setup();
  render(<App />);

  // Click German button
  const germanButton = screen.getByRole("button", { name: /German/i });
  await user.click(germanButton);

  // Verify localStorage was called
  expect(localStorageMock.setItem).toHaveBeenCalledWith("language", "DE");
});

// ── Test 6: RTL layout for Persian ───────────────────────────────────────────
test("applies RTL direction when Persian is selected", async () => {
  const user = userEvent.setup();
  render(<App />);

  // Click Persian button
  const persianButton = screen.getByRole("button", { name: /Persian/i });
  await user.click(persianButton);

  // Check that the root div has dir="rtl"
  const container = document.querySelector('[dir="rtl"]');
  expect(container).toBeInTheDocument();
});

// ── Test 7: Translate on Enter key ───────────────────────────────────────────
test("translates when Enter key is pressed", async () => {
  const user = userEvent.setup();
  render(<App />);

  const input = screen.getByPlaceholderText(/hello world/i);
  await user.type(input, "hello");
  await user.keyboard("{Enter}");

  expect(screen.getByText(/Hello/i)).toBeInTheDocument();
});

// ── Test 8: Dictionary word count display ────────────────────────────────────
test("displays dictionary word count", () => {
  render(<App />);

  expect(screen.getByText(/\d+ words in dictionary/i)).toBeInTheDocument();
});

// ── Test 9: Unknown word indicator ───────────────────────────────────────────
test("shows indicator for unknown words", async () => {
  const user = userEvent.setup();
  render(<App />);

  // Type a word that doesn't exist in dictionary
  const input = screen.getByPlaceholderText(/hello world/i);
  await user.type(input, "xyzunknown123");

  const translateButton = screen.getByRole("button", { name: /^Translate$/i });
  await user.click(translateButton);

  // Check for the helper text about dotted words
  expect(screen.getByText(/not found in the dictionary/i)).toBeInTheDocument();
});

// ── Test 10: Phrase translation ──────────────────────────────────────────────
test("translates multi-word phrases correctly", async () => {
  const user = userEvent.setup();
  render(<App />);

  // Switch to German
  const germanButton = screen.getByRole("button", { name: /German/i });
  await user.click(germanButton);

  // Type a phrase
  const input = screen.getByPlaceholderText(/hello world/i);
  await user.type(input, "good morning");

  const translateButton = screen.getByRole("button", { name: /^Translate$/i });
  await user.click(translateButton);

  // Should translate as phrase "Guten Morgen", not word-by-word
  expect(screen.getByText(/Guten Morgen/i)).toBeInTheDocument();
});

// ── Test 11: Dictionary integrity ────────────────────────────────────────────
test("dictionary has all required language keys for every word", async () => {
  const requiredKeys = ["EN", "DE", "TR", "IR", "FR", "SP", "DU", "TH"];
  const { default: dictionary } = await import("./utils/dictionary");

  Object.entries(dictionary).forEach(([word, translations]) => {
    requiredKeys.forEach((lang) => {
      expect(
        translations[lang],
        `Missing ${lang} translation for "${word}"`,
      ).toBeDefined();
      expect(
        translations[lang].length,
        `Empty ${lang} translation for "${word}"`,
      ).toBeGreaterThan(0);
    });
  });
});
