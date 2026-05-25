import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import shop from '@/routes/shop';
import cart from '@/routes/cart';
import wishlist from '@/routes/wishlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Minus,
    Plus,
    Truck,
    ShieldCheck,
    RotateCcw,
    ChevronLeft,
    Package,
    Check,
    MessageSquare,
} from 'lucide-react';
import type { Product, Review } from '@/types/ecommerce';

interface Props {
    product: Product;
    relatedProducts: Product[];
    [key: string]: unknown;
}

export default function ShopShow() {
    const { product, relatedProducts } = usePage<Props>().props;
    const { currency } = usePage().props as { currency?: string };
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<number | undefined>(undefined);
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isWishlisted, setIsWishlisted] = useState(false);

    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        quantity: 1,
        product_variant_id: null as number | null,
    });

    const images = product.images?.length
        ? product.images
        : [{ id: 0, url: '', alt: product.name, is_primary: true }];

    const renderStars = (rating: number, size = 4) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-${size} w-${size} ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                />
            ))}
        </div>
    );

    const handleAddToCart = () => {
        post(cart.store().url, {
            preserveScroll: true,
            onSuccess: () => setQuantity(1),
        });
    };

    const handleBuyNow = () => {
        post(cart.store().url, {
            preserveScroll: true,
            onSuccess: () => router.get('/checkout'),
        });
    };

    const toggleWishlist = () => {
        if (isWishlisted) {
            router.delete(wishlist.destroy({ product: product.id }).url, {
                preserveScroll: true,
                onSuccess: () => setIsWishlisted(false),
            });
        } else {
            router.post(wishlist.store().url, { product_id: product.id }, {
                preserveScroll: true,
                onSuccess: () => setIsWishlisted(true),
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    };

    const discount = product.compare_price
        ? Math.round((1 - product.price / product.compare_price) * 100)
        : 0;

    return (
        <>
            <Head title={product.name} />

            {/* Breadcrumb */}
            <div className="border-b bg-white px-6 py-3 lg:px-12">
                <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-gray-500">
                    <Link href={shop.index()} className="hover:text-green-600 transition-colors">Shop</Link>
                    <ChevronLeft className="h-3 w-3 rotate-180" />
                    <span className="text-gray-900">{product.name}</span>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div>
                        <div
                            className="relative mb-4 aspect-square cursor-none overflow-hidden rounded-2xl bg-gray-50"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {images[selectedImage]?.url ? (
                                <>
                                    <img
                                        src={images[selectedImage].url}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-opacity"
                                        style={{ opacity: isZoomed ? 0 : 1 }}
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-0 bg-no-repeat"
                                        style={{
                                            opacity: isZoomed ? 1 : 0,
                                            backgroundImage: `url(${images[selectedImage].url})`,
                                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                            backgroundSize: '200%',
                                            transition: 'opacity 0.2s',
                                        }}
                                    />
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <Package className="h-24 w-24 text-gray-300" />
                                </div>
                            )}
                            {discount > 0 && (
                                <Badge className="absolute top-4 left-4 bg-red-500 text-lg text-white px-3 py-1">
                                    -{discount}%
                                </Badge>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(i)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                            i === selectedImage
                                                ? 'border-green-500 ring-2 ring-green-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {img.url ? (
                                            <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gray-50">
                                                <Package className="h-6 w-6 text-gray-300" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {product.category && (
                            <Link
                                href={`${shop.index()}?category=${product.category.slug}`}
                                className="mb-2 inline-block text-sm font-medium text-green-600 hover:text-green-700"
                            >
                                {product.category.name}
                            </Link>
                        )}
                        <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {renderStars(product.rating, 5)}
                                <span className="ml-1 text-sm font-medium text-gray-900">{product.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
                            {product.stock_quantity > 0 ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">In Stock</Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-700">Out of Stock</Badge>
                            )}
                        </div>

                        <div className="mb-6 flex items-baseline gap-3">
                            <Price amount={product.price} currency={currency} className="text-3xl font-bold text-green-600" />
                            {product.compare_price && (
                                <Price amount={product.compare_price} currency={currency} className="text-lg text-gray-400 line-through" />
                            )}
                        </div>

                        {product.short_description && (
                            <p className="mb-6 text-gray-600 leading-relaxed">{product.short_description}</p>
                        )}

                        {/* Variants */}
                        {product.product_variants && product.product_variants.length > 0 && (
                            <div className="mb-6">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Options</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.product_variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => {
                                                setSelectedVariant(v.id);
                                                setData('product_variant_id', v.id);
                                            }}
                                            disabled={!v.in_stock}
                                            className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                                                selectedVariant === v.id
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : !v.in_stock
                                                        ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {v.name}
                                            {v.price && <span className="ml-1">(+<Price amount={v.price} currency={currency} />)</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex items-center rounded-xl border">
                                <button
                                    onClick={() => {
                                        const newQty = Math.max(1, quantity - 1);
                                        setQuantity(newQty);
                                        setData('quantity', newQty);
                                    }}
                                    className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="flex h-10 w-14 items-center justify-center text-sm font-medium tabular-nums">{quantity}</span>
                                <button
                                    onClick={() => {
                                        const newQty = quantity + 1;
                                        setQuantity(newQty);
                                        setData('quantity', newQty);
                                    }}
                                    className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex flex-1 gap-3">
                                <Button
                                    size="lg"
                                    disabled={product.stock_quantity <= 0 || processing}
                                    onClick={handleAddToCart}
                                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Add to Cart
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={toggleWishlist}
                                    className={`gap-2 ${isWishlisted ? 'text-red-500 border-red-200 hover:bg-red-50' : ''}`}
                                >
                                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                                </Button>
                                <Button size="lg" variant="outline" className="gap-2">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            disabled={product.stock_quantity <= 0 || processing}
                            onClick={handleBuyNow}
                            className="mb-8 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            Buy Now
                        </Button>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 rounded-2xl bg-gray-50 p-4">
                            {[
                                { icon: Truck, title: 'Free Delivery', desc: 'Orders over $50' },
                                { icon: ShieldCheck, title: 'Secure', desc: 'Payment protected' },
                                { icon: RotateCcw, title: 'Returns', desc: '30-day returns' },
                            ].map((item) => (
                                <div key={item.title} className="text-center">
                                    <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                        <item.icon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Full Description & Reviews */}
                <div className="mt-12 grid gap-10 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Description</h2>
                        <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                            {product.description}
                        </div>
                    </div>

                    {/* Reviews Summary */}
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Customer Reviews</h2>
                        <Card className="border-0 bg-gray-50 shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-4 text-center">
                                    <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                                    <div className="mt-1 flex justify-center">{renderStars(product.rating, 5)}</div>
                                    <p className="mt-1 text-sm text-gray-500">{product.review_count} reviews</p>
                                </div>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const pct = 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2 text-sm">
                                                <span className="w-8 text-gray-500">{star} star</span>
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                                                    <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="w-8 text-right text-gray-400">0</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Button variant="outline" className="mt-4 w-full gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Write a Review
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Products</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((rp) => (
                                <Link key={rp.id} href={shop.show({ product: rp.slug }).url}>
                                    <Card className="group card-hover overflow-hidden border-0 bg-white shadow-sm transition-all hover:shadow-lg">
                                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                                            {rp.images?.[0]?.url ? (
                                                <img
                                                    src={rp.images[0].url}
                                                    alt={rp.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Package className="h-12 w-12 text-gray-300" />
                                                </div>
                                            )}
                                            {rp.compare_price && (
                                                <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                                                    -{Math.round((1 - rp.price / rp.compare_price) * 100)}%
                                                </Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="mb-1 text-sm font-medium text-gray-900 line-clamp-1">{rp.name}</h3>
                                            <div className="mb-2 flex items-center gap-1">
                                                {renderStars(rp.rating || 0)}
                                                <span className="text-xs text-gray-400">({rp.review_count || 0})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Price amount={rp.price} currency={currency} className="text-lg font-bold text-green-600" />
                                                {rp.compare_price && (
                                                    <Price amount={rp.compare_price} currency={currency} className="text-sm text-gray-400 line-through" />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
