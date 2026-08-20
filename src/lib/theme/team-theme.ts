const DEFAULT_BRAND = "#1f6b3a";

/** Colore di testo leggibile (bianco o quasi-nero) sopra un dato colore di sfondo. */
function readableForeground(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  // Luminanza relativa (WCAG), variante semplificata sRGB.
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.45 ? "#14201a" : "#ffffff";
}

function isValidHex(value: string | null | undefined): value is string {
  return !!value && /^#[0-9a-fA-F]{6}$/.test(value);
}

/** Variabili CSS del brand, calcolate dal colore squadra (o dal default). */
export function buildBrandStyle(primaryColor: string | null | undefined): string {
  const brand = isValidHex(primaryColor) ? primaryColor : DEFAULT_BRAND;
  const fg = readableForeground(brand);
  return `:root{--brand:${brand};--brand-fg:${fg};}`;
}
