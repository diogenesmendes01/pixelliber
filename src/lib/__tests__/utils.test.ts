import { describe, it, expect } from "vitest";
import { initials, formatCNPJ, coverBg, parseTags } from "../utils";

describe("initials", () => {
  it('returns "?" for null input', () => {
    expect(initials(null)).toBe("?");
  });

  it('returns "?" for empty string', () => {
    expect(initials("")).toBe("?");
  });

  it("returns initials for a full name", () => {
    expect(initials("João Silva")).toBe("JS");
  });

  it("repeats first letter for a single name", () => {
    expect(initials("Madonna")).toBe("MM");
  });
});

describe("formatCNPJ", () => {
  it("returns empty string for null", () => {
    expect(formatCNPJ(null)).toBe("");
  });

  it("formats a 14-digit CNPJ string correctly", () => {
    expect(formatCNPJ("12345678000190")).toBe("12.345.678/0001-90");
  });

  it("returns empty string for empty input", () => {
    expect(formatCNPJ("")).toBe("");
  });
});

describe("coverBg", () => {
  it("returns a string containing oklch", () => {
    const result = coverBg(38);
    expect(result).toContain("oklch");
  });

  it("includes the provided hue value in the output", () => {
    const result = coverBg(38);
    expect(result).toContain("38");
  });
});

describe("parseTags", () => {
  it("returns default values for null input", () => {
    expect(parseTags(null)).toEqual({ hue: 38, label: "geral" });
  });

  it("parses a valid JSON string", () => {
    expect(parseTags('{"hue":120,"label":"finanças"}')).toEqual({
      hue: 120,
      label: "finanças",
    });
  });

  it("returns fallback for invalid JSON", () => {
    expect(parseTags("invalid json")).toEqual({ hue: 38, label: "geral" });
  });

  it("fills in defaults for missing fields in the JSON", () => {
    expect(parseTags('{"hue":200}')).toEqual({ hue: 200, label: "geral" });
  });
});
