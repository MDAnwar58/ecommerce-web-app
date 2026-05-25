import { Head, Link, usePage, router } from '@inertiajs/react';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import user from '@/routes/user';
import wishlist from '@/routes/wishlist';
import shop from '@/routes/shop';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Trash2, ShoppingBag, ChevronRight } from 'lucide-react';
import type { WishlistItem } from '@/types/ecommerce';

interface Props {
    wishlist: WishlistItem[];
    [key: string]: unknown;
}

export default function WishlistIndex() {
    const { wishlist: items } = usePage<Props>().props;
    const { currency } = usePage().props as { currency?: string };

    function handleRemove(productId: number) {
        router.delete(wishlist.destroy({ product: productId }).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="My Wishlist" />

            <div className="px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">My Wishlist</h1>
                        <p className="text-gray-500">{items.length} items saved</p>
                    </div>

                    {items.length === 0 ? (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="flex flex-col items-center py-20 text-center">
                                <Heart className="mb-4 h-16 w-16 text-gray-300" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Your wishlist is empty</h3>
                                <p className="mb-6 text-sm text-gray-500">Save your favorite items to come back later</p>
                                <Link href={shop.index()}>
                                    <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => {
                                const product = item.product;
                                const imageUrl = product.primary_image?.url || '/placeholder.svg';

                                return (
                                    <Card key={item.id} className="border-0 shadow-sm overflow-hidden group">
                                        <Link href={shop.show({ slug: product.slug }).url}>
                                            <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                {product.discount_percentage && product.discount_percentage > 0 && (
                                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                                        -{product.discount_percentage}%
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                        <CardContent className="p-4">
                                            <Link href={shop.show({ slug: product.slug }).url}>
                                                <h3 className="font-medium text-gray-900 truncate hover:text-green-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {product.category?.name}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Price amount={product.final_price} currency={currency} className="text-lg font-bold text-gray-900" />
                                                    {product.compare_price && product.compare_price > product.final_price && (
                                                        <Price amount={product.compare_price} currency={currency} className="text-sm text-gray-400 line-through" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <Link href={shop.show({ slug: product.slug }).url} className="flex-1">
                                                    <Button size="sm" className="w-full gap-1 bg-green-600 hover:bg-green-700">
                                                        <ShoppingBag className="h-4 w-4" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="shrink-0 text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleRemove(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

WishlistIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: user.dashboard().url },
        { title: 'Wishlist', href: wishlist.index().url },
    ],
};
