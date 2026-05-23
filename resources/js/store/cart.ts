import { router } from '@inertiajs/react';
import cart from '@/routes/cart';

export const cartService = {
    add(productId: number, quantity: number = 1, variantId?: number) {
        router.post(cart.store().url, {
            product_id: productId,
            quantity,
            product_variant_id: variantId,
        });
    },

    update(itemId: number, quantity: number) {
        router.patch(cart.update({ cartItem: itemId }).url, { quantity });
    },

    remove(itemId: number) {
        router.delete(cart.destroy({ cartItem: itemId }).url);
    },
};
