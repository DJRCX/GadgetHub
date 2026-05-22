export function formatCurrency(amount: number): string {
  // Using en-BD locale and BDT currency, then replacing BDT with the ৳ symbol for local format
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
}
