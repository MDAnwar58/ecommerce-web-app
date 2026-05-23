import { Link } from '@inertiajs/react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cartService } from '@/store/cart';
import cart from '@/routes/cart';
import shop from '@/routes/shop';
import checkout from '@/routes/checkout';
import type { CartItem } from '@/types/ecommerce';

type CartDrawerProps = {
    items: CartItem[];
    subtotal: number;
    itemCount?: number;
    children?: React.ReactNode;
};

export function CartDrawer({ items, subtotal, itemCount, children }: CartDrawerProps) {
    const totalCount = itemCount ?? items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children ?? (
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="size-5" />
                        {totalCount > 0 && (
                            <Badge
                                variant="default"
                                className="absolute -top-1.5 -right-1.5 size-5 p-0 flex items-center justify-center text-[10px] font-bold rounded-full"
                            >
                                {totalCount}
                            </Badge>
                        )}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="size-5" />
                        Shopping Cart
                        {totalCount > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({totalCount} items)
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ShoppingCart className="size-16 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-medium">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground/60 mt-1">
                            Add some products to get started
                        </p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href={cart.index().url}>Browse Products</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto space-y-3 py-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 bg-muted/30 rounded-lg p-3"
                                >
                                    <div className="size-16 rounded-md overflow-hidden bg-muted shrink-0">
                                        {item.product.primary_image ? (
                                            <img
                                                src={item.product.primary_image.image}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                                                <ShoppingCart className="size-6" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={shop.show({ product: item.product.slug }).url}
                                            className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors"
                                        >
                                            {item.product.name}
                                        </Link>
                                        {item.variant && (
                                            <p className="text-xs text-muted-foreground">
                                                {item.variant.name}
                                            </p>
                                        )}
                                        <p className="text-sm font-semibold mt-1">
                                            ${item.total.toFixed(2)}
                                        </p>

                                        <div className="flex items-center gap-1 mt-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="size-6"
                                                disabled={item.quantity <= 1}
                                                onClick={() =>
                                                    cartService.update(item.id, item.quantity - 1)
                                                }
                                            >
                                                <Minus className="size-3" />
                                            </Button>
                                            <span className="w-8 text-center text-xs font-medium">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="size-6"
                                                onClick={() =>
                                                    cartService.update(item.id, item.quantity + 1)
                                                }
                                            >
                                                <Plus className="size-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-6 ml-auto text-destructive hover:text-destructive"
                                                onClick={() => cartService.remove(item.id)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Shipping and taxes calculated at checkout
                            </p>
                            <Button className="w-full" size="lg" asChild>
                                <Link href={checkout.index().url}>
                                    Proceed to Checkout
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full" size="sm" asChild>
                                <Link href={cart.index().url}>View Cart</Link>
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
