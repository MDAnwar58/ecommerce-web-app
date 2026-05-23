import { cn } from '@/lib/utils';

type PriceDisplayProps = {
    price: number;
    comparePrice?: number | null;
    size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
};

export function PriceDisplay({ price, comparePrice, size = 'md' }: PriceDisplayProps) {
    const discountPercentage =
        comparePrice && comparePrice > price
            ? Math.round(((comparePrice - price) / comparePrice) * 100)
            : null;

    return (
        <div className="flex items-baseline gap-2 flex-wrap">
            <span
                className={cn(
                    'font-semibold text-foreground',
                    sizeClasses[size],
                )}
            >
                ${price.toFixed(2)}
            </span>
            {comparePrice && comparePrice > price && (
                <>
                    <span
                        className={cn(
                            'text-muted-foreground line-through',
                            sizeClasses[size === 'lg' ? 'sm' : 'sm'],
                        )}
                    >
                        ${comparePrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 px-1.5 py-0.5 rounded">
                        {discountPercentage}% OFF
                    </span>
                </>
            )}
        </div>
    );
}
