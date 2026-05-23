import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { PriceDisplay } from '@/components/ui/price-display';
import { cartService } from '@/store/cart';
import shop from '@/routes/shop';
import wishlist from '@/routes/wishlist';
import type { Product } from '@/types/ecommerce';

type ProductCardProps = {
    product: Product;
    isWishlisted?: boolean;
    onQuickView?: (product: Product) => void;
};

export function ProductCard({ product, isWishlisted, onQuickView }: ProductCardProps) {
    const [imgError, setImgError] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        cartService.add(product.id);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(wishlist.store().url, { product_id: product.id });
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView?.(product);
    };

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <Link href={shop.show({ product: product.slug }).url} className="block">
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.primary_image && !imgError ? (
                        <img
                            src={product.primary_image.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ShoppingCart className="size-12 opacity-20" />
                        </div>
                    )}

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.discount_percentage && product.discount_percentage > 0 && (
                            <Badge variant="destructive" className="text-xs">
                                -{product.discount_percentage}%
                            </Badge>
                        )}
                        {product.is_featured && (
                            <Badge variant="default" className="text-xs bg-primary">
                                Featured
                            </Badge>
                        )}
                        {product.is_trending && (
                            <Badge variant="secondary" className="text-xs">
                                Trending
                            </Badge>
                        )}
                    </div>

                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="size-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white"
                            onClick={handleWishlist}
                        >
                            <Heart
                                className={cn(
                                    'size-4 transition-colors',
                                    isWishlisted && 'fill-red-500 text-red-500',
                                )}
                            />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="size-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white"
                            onClick={handleQuickView}
                        >
                            <Eye className="size-4" />
                        </Button>
                    </div>

                    {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                Out of Stock
                            </Badge>
                        </div>
                    )}
                </div>

                <CardContent className="p-4 space-y-2">
                    {product.brand && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            {product.brand}
                        </p>
                    )}
                    <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    <PriceDisplay
                        price={product.final_price ?? product.price}
                        comparePrice={product.compare_price}
                        size="sm"
                    />

                    <div className="flex items-center gap-2">
                        <StarRating rating={product.rating} size={14} />
                        <span className="text-xs text-muted-foreground">
                            ({product.review_count})
                        </span>
                        {product.sold_count > 0 && (
                            <span className="text-xs text-muted-foreground ml-auto">
                                {product.sold_count} sold
                            </span>
                        )}
                    </div>

                    <Button
                        className="w-full mt-1"
                        size="sm"
                        disabled={product.stock_quantity === 0}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="size-4 mr-1" />
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </CardContent>
            </Link>
        </Card>
    );
}
