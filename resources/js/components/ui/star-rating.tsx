import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
    rating: number;
    size?: number;
    interactive?: boolean;
    onChange?: (rating: number) => void;
};

export function StarRating({
    rating,
    size = 16,
    interactive = false,
    onChange,
}: StarRatingProps) {
    const stars = Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        const filled = rating >= value;
        const half = !filled && rating >= value - 0.5;

        return (
            <button
                key={i}
                type="button"
                disabled={!interactive}
                onClick={() => interactive && onChange?.(value)}
                className={cn(
                    'transition-colors',
                    interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
                )}
            >
                {filled ? (
                    <Star
                        size={size}
                        className="fill-yellow-400 text-yellow-400"
                    />
                ) : half ? (
                    <StarHalf
                        size={size}
                        className="fill-yellow-400 text-yellow-400"
                    />
                ) : (
                    <Star size={size} className="text-muted-foreground/30" />
                )}
            </button>
        );
    });

    return (
        <div className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
            {stars}
        </div>
    );
}
