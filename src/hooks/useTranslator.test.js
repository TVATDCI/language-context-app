import { describe, it, expect } from "vitest";
import { translateText } from "./useTranslator";

describe("translateText", () => {
  it("translates single words correctly", () => {
    const result = translateText("hello", "DE");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      original: "hello",
      translated: "Hallo",
      found: true,
      isPhrase: false,
    });
  });

  it("translates multi-word phrases correctly", () => {
    const result = translateText("good morning", "DE");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      original: "good morning",
      translated: "Guten Morgen",
      found: true,
      isPhrase: true,
    });
  });

  it("marks unknown words as not found", () => {
    const result = translateText("xyzunknown", "EN");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      original: "xyzunknown",
      translated: "xyzunknown",
      found: false,
      isPhrase: false,
    });
  });

  it("handles mixed known and unknown words", () => {
    const result = translateText("hello xyzunknown", "FR");
    expect(result).toHaveLength(2);
    expect(result[0].found).toBe(true);
    expect(result[1].found).toBe(false);
  });

  it("handles phrases with surrounding words", () => {
    const result = translateText("hello good morning world", "DE");
    // Should be: hello (word) + good morning (phrase) + world (word) = 3 items
    expect(result).toHaveLength(3);
    expect(result[0].original).toBe("hello");
    expect(result[1].isPhrase).toBe(true);
    expect(result[2].original).toBe("world");
  });

  it("handles empty input", () => {
    const result = translateText("", "EN");
    expect(result).toHaveLength(0);
  });

  it("handles whitespace-only input", () => {
    const result = translateText("   ", "EN");
    expect(result).toHaveLength(0);
  });
});
