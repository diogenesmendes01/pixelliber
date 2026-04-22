export function initials(name: string | null): string {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[p.length - 1]?.[0] ?? "")).toUpperCase();
}

export function formatCNPJ(cnpj: string | null): string {
  if (!cnpj) return "";
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export function coverBg(hue: number): string {
  return `linear-gradient(150deg, oklch(0.42 0.1 ${hue}), oklch(0.22 0.08 ${(hue + 30) % 360}))`;
}

export function parseTags(tags: string | null): { hue: number; label: string } {
  try {
    const t = JSON.parse(tags ?? "{}");
    return { hue: t.hue ?? 38, label: t.label ?? "geral" };
  } catch {
    return { hue: 38, label: "geral" };
  }
}
