import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import reviews from '@/routes/reviews';

type ReviewFormProps = {
    productId: number;
    orderId?: number;
    onSuccess?: () => void;
};

export function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setSubmitting(true);
        router.post(
            reviews.store().url,
            {
                product_id: productId,
                order_id: orderId,
                rating,
                comment,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRating(0);
                    setComment('');
                    onSuccess?.();
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label className="text-sm font-medium">Your Rating</Label>
                <div className="flex items-center gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                size={24}
                                className={cn(
                                    'transition-colors',
                                    (hoverRating || rating) >= star
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground/30',
                                )}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </span>
                    )}
                </div>
            </div>

            <div>
                <Label htmlFor="review-comment" className="text-sm font-medium">
                    Review (optional)
                </Label>
                <textarea
                    id="review-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                />
            </div>

            <Button type="submit" disabled={rating === 0 || submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    );
}
