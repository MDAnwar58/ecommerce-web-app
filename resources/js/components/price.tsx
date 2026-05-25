import { formatCurrency } from '@/lib/format';

type PriceProps = {
    amount: number;
    currency?: string;
    className?: string;
};

export function Price({ amount, currency, className = '' }: PriceProps) {
    return (
        <span className={`font-mono ${className}`}>
            {formatCurrency(amount, currency)}
        </span>
    );
}
