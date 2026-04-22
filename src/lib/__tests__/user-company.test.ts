import { describe, it, expect, vi, beforeEach } from "vitest";
import { findUserWithCompany, subscriptionActive } from "../user-company";

// Mock do Prisma
vi.mock("../prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../prisma";

const findUnique = prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>;

const companyBase = {
  id: "co1",
  name: "Horizonte Livros",
  cnpj: "12345678000190",
  statusAssinatura: "ativa",
};

describe("subscriptionActive", () => {
  it("returns true for status 'ativa'", () => {
    expect(subscriptionActive({ ...companyBase })).toBe(true);
  });
  it("returns false for anything else", () => {
    expect(subscriptionActive({ ...companyBase, statusAssinatura: "trial" })).toBe(false);
    expect(subscriptionActive({ ...companyBase, statusAssinatura: "inativo" })).toBe(false);
    expect(subscriptionActive({ ...companyBase, statusAssinatura: null })).toBe(false);
  });
  it("returns false for null/undefined company", () => {
    expect(subscriptionActive(null)).toBe(false);
    expect(subscriptionActive(undefined)).toBe(false);
  });
});

describe("findUserWithCompany", () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it("returns null when user not found", async () => {
    findUnique.mockResolvedValueOnce(null);
    const out = await findUserWithCompany("missing");
    expect(out).toBeNull();
  });

  it("uses User.company (admin path)", async () => {
    findUnique.mockResolvedValueOnce({
      id: "u1",
      name: "Marina",
      email: "marina@example.com",
      role: "ADMIN",
      twoFaEnabled: false,
      notifSettings: null,
      isActive: true,
      company: companyBase,
      employee: null,
    });
    const out = await findUserWithCompany("u1");
    expect(out?.company?.id).toBe("co1");
    expect(out?.company?.cnpj).toBe("12345678000190");
    expect(out?.role).toBe("ADMIN");
  });

  it("falls back to Employee.company when User.company is null", async () => {
    findUnique.mockResolvedValueOnce({
      id: "u2",
      name: "Rafael",
      email: "rafael@example.com",
      role: "USER",
      twoFaEnabled: false,
      notifSettings: null,
      isActive: true,
      company: null,
      employee: { company: companyBase },
    });
    const out = await findUserWithCompany("u2");
    expect(out?.company?.id).toBe("co1");
    expect(out?.role).toBe("USER");
  });

  it("returns company=null when nor User.company nor Employee.company are set", async () => {
    findUnique.mockResolvedValueOnce({
      id: "u3",
      name: "Ghost",
      email: "ghost@example.com",
      role: "USER",
      twoFaEnabled: false,
      notifSettings: null,
      isActive: true,
      company: null,
      employee: null,
    });
    const out = await findUserWithCompany("u3");
    expect(out?.company).toBeNull();
  });

  it("prefers User.company over Employee.company when both exist", async () => {
    const other = { ...companyBase, id: "co2", cnpj: "99999999000199" };
    findUnique.mockResolvedValueOnce({
      id: "u4",
      name: "Marina",
      email: "marina@example.com",
      role: "ADMIN",
      twoFaEnabled: false,
      notifSettings: null,
      isActive: true,
      company: companyBase,       // <- admin link
      employee: { company: other }, // <- also has Employee
    });
    const out = await findUserWithCompany("u4");
    expect(out?.company?.id).toBe("co1");
  });
});
