import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import type { ProductFilters } from '@/types/ecommerce';

type ProductFiltersProps = {
    categories: { id: number; name: string; slug: string; products_count?: number }[];
    brands: string[];
    filters: ProductFilters;
    onFilterChange: (filters: ProductFilters) => void;
};

const sortOptions = [
    { label: 'Latest', value: 'latest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Best Rating', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
];

export function ProductFilters({
    categories,
    brands,
    filters,
    onFilterChange,
}: ProductFiltersProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [localMinPrice, setLocalMinPrice] = useState(filters.min_price?.toString() ?? '');
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.max_price?.toString() ?? '');

    const updateFilter = <K extends keyof ProductFilters>(
        key: K,
        value: ProductFilters[K],
    ) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearAll = () => {
        setLocalMinPrice('');
        setLocalMaxPrice('');
        onFilterChange({
            category: null,
            brand: null,
            min_price: null,
            max_price: null,
            rating: null,
            search: null,
            sort: null,
            in_stock: null,
        });
    };

    const applyPrice = () => {
        updateFilter('min_price', localMinPrice ? Number(localMinPrice) : null);
        updateFilter('max_price', localMaxPrice ? Number(localMaxPrice) : null);
    };

    const hasActiveFilters = !!(
        filters.category ||
        filters.brand ||
        filters.min_price ||
        filters.max_price ||
        filters.rating ||
        filters.in_stock
    );

    const filterContent = (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="size-4" />
                    Filters
                </h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto px-2 py-1 text-xs text-muted-foreground"
                        onClick={clearAll}
                    >
                        <X className="size-3 mr-1" />
                        Clear all
                    </Button>
                )}
            </div>

            <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Sort By
                </h4>
                <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    value={filters.sort ?? 'latest'}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Categories
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                        <label
                            key={cat.id}
                            className="flex items-center gap-2 cursor-pointer py-0.5"
                        >
                            <Checkbox
                                checked={filters.category === cat.slug}
                                onCheckedChange={(checked) =>
                                    updateFilter(
                                        'category',
                                        checked ? cat.slug : null,
                                    )
                                }
                            />
                            <span className="text-sm">{cat.name}</span>
                            {cat.products_count !== undefined && (
                                <span className="text-xs text-muted-foreground ml-auto">
                                    ({cat.products_count})
                                </span>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Price Range
                </h4>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        onBlur={applyPrice}
                        className="h-8 text-sm"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        onBlur={applyPrice}
                        className="h-8 text-sm"
                    />
                </div>
            </div>

            <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Rating
                </h4>
                <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`flex items-center gap-2 w-full py-0.5 text-sm transition-colors hover:text-foreground ${
                                filters.rating === star
                                    ? 'text-foreground font-medium'
                                    : 'text-muted-foreground'
                            }`}
                            onClick={() =>
                                updateFilter(
                                    'rating',
                                    filters.rating === star ? null : star,
                                )
                            }
                        >
                            <StarRating rating={star} size={14} />
                            <span className="text-xs">& up</span>
                        </button>
                    ))}
                </div>
            </div>

            {brands.length > 0 && (
                <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Brands
                    </h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {brands.map((brand) => (
                            <label
                                key={brand}
                                className="flex items-center gap-2 cursor-pointer py-0.5"
                            >
                                <Checkbox
                                    checked={filters.brand === brand}
                                    onCheckedChange={(checked) =>
                                        updateFilter(
                                            'brand',
                                            checked ? brand : null,
                                        )
                                    }
                                />
                                <span className="text-sm">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                        checked={!!filters.in_stock}
                        onCheckedChange={(checked) =>
                            updateFilter('in_stock', checked ? true : null)
                        }
                    />
                    <span className="text-sm">In Stock Only</span>
                </label>
            </div>
        </div>
    );

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                <SlidersHorizontal className="size-4 mr-1" />
                Filters
                {hasActiveFilters && (
                    <span className="ml-1 size-2 rounded-full bg-primary" />
                )}
            </Button>

            <div className="hidden lg:block w-64 shrink-0">
                {filterContent}
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background p-6 overflow-y-auto shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Filters</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={() => setMobileOpen(false)}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                        {filterContent}
                    </div>
                </div>
            )}
        </>
    );
}
