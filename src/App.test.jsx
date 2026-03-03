import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

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

  expect(screen.getByText("Bonjour")).toBeInTheDocument();
});
