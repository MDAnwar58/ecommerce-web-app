import { useState } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { QuickViewModal } from '@/components/products/quick-view-modal';
import type { Product } from '@/types/ecommerce';

type ProductGridProps = {
    products: Product[];
    wishlistedIds?: number[];
};

export function ProductGrid({ products, wishlistedIds = [] }: ProductGridProps) {
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={wishlistedIds.includes(product.id)}
                        onQuickView={setQuickViewProduct}
                    />
                ))}
            </div>

            {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-muted-foreground/40 mb-4">
                        <svg className="size-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No products found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your filters or search terms.
                    </p>
                </div>
            )}

            <QuickViewModal
                product={quickViewProduct!}
                open={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </>
    );
}
