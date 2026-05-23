import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import shop from '@/routes/shop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    SlidersHorizontal,
    Grid3X3,
    List,
    Search,
    Star,
    ShoppingCart,
    Heart,
    ChevronLeft,
    ChevronRight,
    X,
    Package,
} from 'lucide-react';

interface Filters {
    category?: string;
    min_price?: string;
    max_price?: string;
    rating?: string;
    brand?: string;
    in_stock?: string;
    sort?: string;
    search?: string;
}

interface PaginatedData {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    products: PaginatedData;
    categories: any[];
    brands: any[];
    filters: Filters;
    [key: string]: unknown;
}

export default function ShopIndex() {
    const { products, categories, brands, filters: initialFilters } = usePage<Props>().props;

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>(initialFilters || {});
    const [searchInput, setSearchInput] = useState(filters.search || '');

    const updateQuery = useCallback((newFilters: Filters) => {
        const query: Record<string, string> = {};
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== '') {
                query[key] = value;
            }
        });
        router.get(shop.index().url, query, { preserveState: true, preserveScroll: true });
    }, []);

    const applyFilters = useCallback(() => {
        updateQuery({ ...filters, search: searchInput || undefined });
    }, [filters, searchInput, updateQuery]);

    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchInput('');
        router.get(shop.index().url, {}, { preserveState: true });
    }, []);

    const handleSort = useCallback((value: string) => {
        const newFilters = { ...filters, sort: value };
        setFilters(newFilters);
        updateQuery(newFilters);
    }, [filters, updateQuery]);

    const toggleFilter = useCallback((key: keyof Filters, value: string | undefined) => {
        const newFilters = { ...filters };
        if (newFilters[key] === value) {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }
        setFilters(newFilters);
        updateQuery(newFilters);
    }, [filters, updateQuery]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    }, [applyFilters]);

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
            ))}
        </div>
    );

    return (
        <>
            <Head title="Shop" />

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-12 text-white lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mb-2 text-3xl font-bold md:text-4xl">Our Products</h1>
                    <p className="text-green-100">Discover amazing products at great prices</p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
                {/* Search & Sort Bar */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="h-10 rounded-xl pl-10"
                        />
                    </form>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2 lg:hidden"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </Button>
                        <Select value={filters.sort || 'newest'} onValueChange={handleSort}>
                            <SelectTrigger className="h-10 w-44 rounded-xl">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="price_low">Price: Low to High</SelectItem>
                                <SelectItem value="price_high">Price: High to Low</SelectItem>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`w-64 shrink-0 ${showFilters ? 'fixed inset-0 z-50 overflow-y-auto bg-white p-6 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden lg:block'}`}>
                        {showFilters && (
                            <div className="mb-4 flex items-center justify-between lg:hidden">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Categories */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold text-gray-900">Categories</h4>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                            <Checkbox
                                                checked={filters.category === cat.slug}
                                                onCheckedChange={() => toggleFilter('category', cat.slug)}
                                            />
                                            <span>{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold text-gray-900">Price Range</h4>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.min_price || ''}
                                        onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                                        className="h-9 text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.max_price || ''}
                                        onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <Button size="sm" variant="outline" className="mt-2 w-full" onClick={applyFilters}>
                                    Apply
                                </Button>
                            </div>

                            {/* Rating */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold text-gray-900">Minimum Rating</h4>
                                <div className="space-y-2">
                                    {[4, 3, 2, 1].map((r) => (
                                        <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                            <Checkbox
                                                checked={filters.rating === r.toString()}
                                                onCheckedChange={() => toggleFilter('rating', r.toString())}
                                            />
                                            <div className="flex items-center gap-1">
                                                {renderStars(r)}
                                                <span className="ml-1">& up</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* In Stock */}
                            <div>
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                    <Checkbox
                                        checked={filters.in_stock === '1'}
                                        onCheckedChange={() => toggleFilter('in_stock', '1')}
                                    />
                                    <span className="font-medium">In Stock Only</span>
                                </label>
                            </div>

                            {/* Brands */}
                            {brands && brands.length > 0 && (
                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-gray-900">Brands</h4>
                                    <div className="space-y-2">
                                        {brands.map((brand) => (
                                            <label key={brand.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                                <Checkbox
                                                    checked={filters.brand === brand.slug}
                                                    onCheckedChange={() => toggleFilter('brand', brand.slug)}
                                                />
                                                <span>{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={clearFilters}>
                                Clear All Filters
                            </Button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {products.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Package className="mb-4 h-16 w-16 text-gray-300" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">No Products Found</h3>
                                <p className="mb-6 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                            </div>
                        ) : (
                            <>
                                <p className="mb-4 text-sm text-gray-500">
                                    Showing {products.data.length} of {products.total} products
                                </p>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {products.data.map((product: any) => (
                                        <Link key={product.id} href={shop.show({ product: product.slug }).url}>
                                            <Card className="group card-hover overflow-hidden border-0 bg-white shadow-sm transition-all hover:shadow-lg">
                                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                                    {product.images?.[0]?.url ? (
                                                        <img
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <Package className="h-16 w-16 text-gray-300" />
                                                        </div>
                                                    )}
                                                    {product.compare_price && (
                                                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                                                            -{Math.round((1 - product.price / product.compare_price) * 100)}%
                                                        </Badge>
                                                    )}
                                                    <button className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-all group-hover:opacity-100 hover:bg-white">
                                                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                                                    </button>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="mb-1 text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                                                    <div className="mb-2 flex items-center gap-1">
                                                        {renderStars(product.rating || 0)}
                                                        <span className="text-xs text-gray-400">({product.reviews_count || 0})</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-green-600">${product.price}</span>
                                                        {product.compare_price && (
                                                            <span className="text-sm text-gray-400 line-through">${product.compare_price}</span>
                                                        )}
                                                    </div>
                                                    <Button size="sm" className="mt-3 w-full gap-2 bg-green-600 hover:bg-green-700">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        Add to Cart
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-10 flex items-center justify-center gap-1">
                                        {products.links.map((link, i) => {
                                            if (link.label === '&laquo; Previous') {
                                                return (
                                                    <Button
                                                        key={i}
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={!link.url}
                                                        onClick={() => link.url && router.get(link.url)}
                                                        className="h-9 w-9"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                );
                                            }
                                            if (link.label === 'Next &raquo;') {
                                                return (
                                                    <Button
                                                        key={i}
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={!link.url}
                                                        onClick={() => link.url && router.get(link.url)}
                                                        className="h-9 w-9"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                );
                                            }
                                            return (
                                                <Button
                                                    key={i}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="icon"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className={`h-9 w-9 text-sm ${link.active ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                >
                                                    {link.label}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
