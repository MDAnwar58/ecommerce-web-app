import { Head, Link, usePage, router } from '@inertiajs/react';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import cart from '@/routes/cart';
import checkout from '@/routes/checkout';
import shop from '@/routes/shop';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ShoppingBag, Minus, Plus, ArrowLeft, Package } from 'lucide-react';
import type { CartItem } from '@/types/ecommerce';

interface Props {
    cartItems: CartItem[];
    subtotal: number;
    total: number;
    [key: string]: unknown;
}

export default function CartIndex() {
    const { cartItems, subtotal, total } = usePage<Props>().props;
    const { currency } = usePage().props as { currency?: string };

    function handleUpdateQuantity(item: CartItem, newQty: number) {
        if (newQty < 1) return;
        router.patch(
            cart.update({ cartItem: item.id }).url,
            { quantity: newQty },
            { preserveScroll: true },
        );
    }

    function handleRemove(item: CartItem) {
        router.delete(cart.destroy({ cartItem: item.id }).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Shopping Cart" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Shopping Cart</h1>
                        <p className="text-gray-500">{cartItems.length} items in your cart</p>
                    </div>
                    <Link href={shop.index().url}>
                        <Button variant="outline" size="sm" className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex flex-col items-center py-20 text-center">
                            <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">Your cart is empty</h3>
                            <p className="mb-6 text-sm text-gray-500">Add some products to get started</p>
                            <Link href={shop.index().url}>
                                <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <div className="flex-1 space-y-3">
                            {cartItems.map((item) => {
                                const product = item.product;
                                const imageUrl = product.primary_image?.url || '/placeholder.svg';
                                const unitPrice = item.unit_price ?? product.final_price;
                                const lineTotal = item.subtotal ?? unitPrice * item.quantity;

                                return (
                                    <Card key={item.id} className="border-0 shadow-sm">
                                        <CardContent className="flex gap-4 p-4">
                                            <Link href={shop.show({ slug: product.slug }).url} className="shrink-0">
                                                <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-50">
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </Link>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <Link href={shop.show({ slug: product.slug }).url}>
                                                            <h3 className="font-medium text-gray-900 hover:text-green-600 transition-colors">
                                                                {product.name}
                                                            </h3>
                                                        </Link>
                                                        {item.variant && (
                                                            <p className="text-sm text-gray-500">{item.variant.name}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(item)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <Price amount={lineTotal} currency={currency} className="font-semibold text-gray-900" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="w-full shrink-0 lg:w-80">
                            <Card className="border-0 shadow-sm sticky top-24">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <Price amount={subtotal} currency={currency} />
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span className="text-green-600">Calculated at checkout</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
                                            <span>Total</span>
                                            <Price amount={total} currency={currency} />
                                        </div>
                                    </div>
                                    <Link href={checkout.index().url} className="mt-6 block">
                                        <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" size="lg">
                                            <Package className="h-4 w-4" />
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
