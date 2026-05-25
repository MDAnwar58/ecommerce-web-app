const currencySymbols: Record<string, string> = {
    BDT: '৳',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'CA$',
    AUD: 'A$',
};

const currencyDecimals: Record<string, number> = {
    JPY: 0,
};

export function formatCurrency(amount: number, currency: string = 'USD'): string {
    const symbol = currencySymbols[currency] || currency;
    const decimals = currency in currencyDecimals ? currencyDecimals[currency] : 2;

    return `${symbol}${amount.toFixed(decimals)}`;
}
