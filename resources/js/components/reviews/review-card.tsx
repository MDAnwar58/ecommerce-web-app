import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import type { Review } from '@/types/ecommerce';

type ReviewCardProps = {
    review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
    const initials = review.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="flex gap-3 py-4 border-b border-border last:border-b-0">
            <Avatar className="size-10 shrink-0">
                <AvatarImage src={review.user.avatar ?? undefined} alt={review.user.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{review.user.name}</span>
                    <span className="text-xs text-muted-foreground">{formattedDate}</span>
                </div>
                <div className="mt-1">
                    <StarRating rating={review.rating} size={14} />
                </div>
                {review.comment && (
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                        {review.comment}
                    </p>
                )}
            </div>
        </div>
    );
}
