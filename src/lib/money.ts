// Prices are stored in "minor units" (like pesewas/cents) as integers to avoid
// floating point rounding issues. Adjust CURRENCY/LOCALE for your market.
const CURRENCY = "GHS";
const LOCALE = "en-GH";

export function formatMoney(minor: number): string {
  const major = minor / 100;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
  }).format(major);
}

export function toMinor(major: number): number {
  return Math.round(major * 100);
}
