import { describe, it, expect } from "vitest";
import {
  BOOKS,
  NEW_IDS,
  TOP_IDS,
  RECOMMEND_IDS,
  PLANS,
  booksByTag,
  booksByTags,
  booksWithNew,
} from "../books-data";

describe("books-data — BOOKS integrity", () => {
  it("has 16 seeded books matching the design data.js", () => {
    expect(BOOKS).toHaveLength(16);
  });

  it("every book has required fields with correct types", () => {
    BOOKS.forEach((b) => {
      expect(typeof b.id).toBe("number");
      expect(b.t.length).toBeGreaterThan(0);
      expect(b.a.length).toBeGreaterThan(0);
      expect(b.tag.length).toBeGreaterThan(0);
      expect(typeof b.hue).toBe("number");
      expect(b.hue).toBeGreaterThanOrEqual(0);
      expect(b.hue).toBeLessThanOrEqual(360);
    });
  });

  it("every NEW_IDS / TOP_IDS / RECOMMEND_IDS points to a real book", () => {
    const ids = new Set(BOOKS.map((b) => b.id));
    [...NEW_IDS, ...TOP_IDS, ...RECOMMEND_IDS].forEach((id) => {
      expect(ids.has(id)).toBe(true);
    });
  });
});

describe("booksByTag", () => {
  it("returns only books matching the tag", () => {
    const f = booksByTag("finanças");
    expect(f.length).toBeGreaterThan(0);
    f.forEach((b) => expect(b.tag).toBe("finanças"));
  });

  it("returns empty array for unknown tag", () => {
    expect(booksByTag("inexistente")).toEqual([]);
  });
});

describe("booksByTags", () => {
  it("returns books matching any of the tags", () => {
    const out = booksByTags(["marketing", "vendas"]);
    expect(out.length).toBeGreaterThan(0);
    out.forEach((b) => expect(["marketing", "vendas"]).toContain(b.tag));
  });
});

describe("booksWithNew", () => {
  it("sets isNew=true for books in NEW_IDS", () => {
    const out = booksWithNew(BOOKS);
    out.forEach((b) => {
      if (NEW_IDS.includes(Number(b.id))) {
        expect(b.isNew).toBe(true);
      } else {
        expect(!!b.isNew).toBe(false);
      }
    });
  });

  it("preserves original fields", () => {
    const [first] = booksWithNew(BOOKS);
    const src = BOOKS[0];
    expect(first.t).toBe(src.t);
    expect(first.a).toBe(src.a);
    expect(first.hue).toBe(src.hue);
  });
});

describe("PLANS", () => {
  it("has exactly one plan flagged as atual", () => {
    const atual = PLANS.filter((p) => p.atual);
    expect(atual).toHaveLength(1);
    expect(atual[0].id).toBe("standard");
  });

  it("has exactly one destaque", () => {
    const destaques = PLANS.filter((p) => p.destaque);
    expect(destaques).toHaveLength(1);
  });

  it("enterprise plan has null price and ilimitado usuarios", () => {
    const enterprise = PLANS.find((p) => p.id === "custom");
    expect(enterprise).toBeDefined();
    expect(enterprise?.preco).toBeNull();
    expect(enterprise?.usuarios).toBe("ilimitado");
  });
});
