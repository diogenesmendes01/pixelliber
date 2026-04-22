import { describe, it, expect } from "vitest";
import { validateCNPJ, cleanCNPJ } from "../cnpj";

describe("validateCNPJ", () => {
  it("accepts a known valid CNPJ (formatted)", () => {
    expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
  });

  it("accepts a known valid CNPJ (digits only)", () => {
    expect(validateCNPJ("11222333000181")).toBe(true);
  });

  it("rejects a CNPJ with wrong check digits", () => {
    // Last digit changed from 1 to 2
    expect(validateCNPJ("11.222.333/0001-82")).toBe(false);
  });

  it("rejects a CNPJ with all identical digits", () => {
    expect(validateCNPJ("11.111.111/1111-11")).toBe(false);
  });

  it("rejects all-zeros CNPJ", () => {
    expect(validateCNPJ("00.000.000/0000-00")).toBe(false);
  });

  it("rejects a CNPJ that is too short", () => {
    expect(validateCNPJ("1122233300018")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(validateCNPJ("")).toBe(false);
  });
});

describe("cleanCNPJ", () => {
  it("removes dots, slashes and dashes", () => {
    expect(cleanCNPJ("11.222.333/0001-81")).toBe("11222333000181");
  });

  it("returns digits-only string unchanged", () => {
    expect(cleanCNPJ("11222333000181")).toBe("11222333000181");
  });

  it("removes all non-digit characters", () => {
    expect(cleanCNPJ("  11.222.333/0001-81  ")).toBe("11222333000181");
  });
});
