export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

/** Valores são sempre centavos inteiros; rejeita notação científica e precisão excessiva. */
export function parseAmount(input: string): number | null {
  const value = input.trim();
  if (!/^\d{1,4}(?:[,.]\d{1,2})?$/.test(value)) return null;
  const [whole, decimal = ""] = value.split(/[,.]/);
  const cents = Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

export function validateAmount(cents: unknown, min: number, max: number): string | null {
  if (typeof cents !== "number" || !Number.isSafeInteger(cents)) return "Digite um valor válido, com até duas casas decimais.";
  if (cents < min || cents > max) return `Escolha um valor entre ${formatMoney(min)} e ${formatMoney(max)}.`;
  return null;
}
