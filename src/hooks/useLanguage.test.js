import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLanguage } from "./useLanguage";

// Wrapper component without provider for error testing
const WrapperWithoutProvider = ({ children }) => {
  return children;
};

describe("useLanguage", () => {
  it("throws an error when used outside of LanguageProvider", () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useLanguage(), {
        wrapper: WrapperWithoutProvider,
      });
    }).toThrow("useLanguage must be used within a <LanguageProvider>");

    consoleSpy.mockRestore();
  });
});
