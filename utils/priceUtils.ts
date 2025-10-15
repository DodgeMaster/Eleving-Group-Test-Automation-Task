export function parsePricesToNumbers(prices: string[]): number[] {
  return prices
    .map((price) => Number(price.replace(/[^\d]/g, '')))
    .filter((n) => !isNaN(n) && n > 0);
}