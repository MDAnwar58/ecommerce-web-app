import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ShoppingCart, Minus, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { PriceDisplay } from '@/components/ui/price-display';
import { cartService } from '@/store/cart';
import shop from '@/routes/shop';
import type { Product } from '@/types/ecommerce';

type QuickViewModalProps = {
    product: Product | null;
    open: boolean;
    onClose: () => void;
};

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [imgIndex, setImgIndex] = useState(0);

    if (!product) return null;

    const images = product.images?.length ? product.images : [];
    const currentImage = images[imgIndex] ?? product.primary_image;

    const handleAddToCart = () => {
        cartService.add(product.id, quantity);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        {currentImage ? (
                            <img
                                src={currentImage.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <ShoppingCart className="size-16 opacity-20" />
                            </div>
                        )}

                        {images.length > 1 && (
                            <>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80"
                                    onClick={() => setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80"
                                    onClick={() => setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </>
                        )}

                        {product.discount_percentage && product.discount_percentage > 0 && (
                            <Badge variant="destructive" className="absolute top-3 left-3">
                                -{product.discount_percentage}%
                            </Badge>
                        )}

                        {product.stock_quantity === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <Badge variant="secondary" className="text-sm px-4 py-1.5">
                                    Out of Stock
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            {product.brand && (
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                    {product.brand}
                                </p>
                            )}
                            <DialogHeader className="p-0">
                                <DialogTitle className="text-xl">{product.name}</DialogTitle>
                            </DialogHeader>
                            {product.short_description && (
                                <DialogDescription className="mt-2 text-sm">
                                    {product.short_description}
                                </DialogDescription>
                            )}
                        </div>

                        <PriceDisplay
                            price={product.final_price ?? product.price}
                            comparePrice={product.compare_price}
                            size="lg"
                        />

                        <div className="flex items-center gap-2">
                            <StarRating rating={product.rating} size={16} />
                            <span className="text-sm text-muted-foreground">
                                {product.rating.toFixed(1)} ({product.review_count} reviews)
                            </span>
                        </div>

                        {product.sku && (
                            <p className="text-xs text-muted-foreground">
                                SKU: <span className="font-mono">{product.sku}</span>
                            </p>
                        )}

                        <hr className="border-border" />

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center gap-1">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="size-8"
                                    disabled={quantity <= 1}
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                >
                                    <Minus className="size-3" />
                                </Button>
                                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="size-8"
                                    disabled={quantity >= product.stock_quantity}
                                    onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                                >
                                    <Plus className="size-3" />
                                </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {product.stock_quantity} available
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 mt-auto pt-2">
                            <Button
                                size="lg"
                                disabled={product.stock_quantity === 0}
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="size-4 mr-2" />
                                Add to Cart - ${((product.final_price ?? product.price) * quantity).toFixed(2)}
                            </Button>
                            <Link
                                href={shop.show({ product: product.slug }).url}
                                className="text-sm text-center text-muted-foreground hover:text-primary transition-colors"
                                onClick={onClose}
                            >
                                View Full Details &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
