/**
 * Currency utility functions
 * Helper untuk format mata uang
 */

export function formatCurrency(amount: number, locale: string = 'id-ID', currency: string = 'IDR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number, locale: string = 'id-ID', currency: string = 'IDR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    notation: 'compact',
  }).format(amount);
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
}
