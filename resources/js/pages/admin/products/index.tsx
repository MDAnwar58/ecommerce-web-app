import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Package, RotateCcw } from 'lucide-react';
import admin from '@/routes/admin';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import type { Product, Category } from '@/types/ecommerce';
import { useState, useEffect } from 'react';
import DeleteModal from '@/components/delete-modal';

type ProductsIndexProps = {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: Category[];
    filters: { search?: string; category?: string };
};

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const { currency } = usePage().props as { currency?: string };
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [categoryValue, setCategoryValue] = useState(filters?.category || 'all');
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    useEffect(() => {
        setSearchTerm(filters?.search || '');
        setCategoryValue(filters?.category || 'all');
    }, [filters?.search, filters?.category]);

    function applyFilters(search: string, category: string) {
        router.reload({
            data: {
                search: search || undefined,
                category: category === 'all' ? undefined : category,
            },
            only: ['products', 'filters'],
        });
    }

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        applyFilters(searchTerm, categoryValue);
    }

    function handleCategoryChange(value: string) {
        setCategoryValue(value);
        applyFilters(searchTerm, value);
    }

    function handleReset() {
        setSearchTerm('');
        setCategoryValue('all');
        router.visit(admin.products.index().url, { only: ['products', 'filters'] });
    }

    function handlePageClick(url: string | null) {
        if (!url) return;
        const pageUrl = new URL(url, window.location.origin);
        if (filters?.search) pageUrl.searchParams.set('search', filters.search);
        if (filters?.category) pageUrl.searchParams.set('category', filters.category);
        router.get(pageUrl.pathname + pageUrl.search, {}, { replace: true });
    }

    function handleDelete(product: Product) {
        setDeletingProduct(product);
    }

    function confirmDelete() {
        if (deletingProduct) {
            router.delete(admin.products.destroy(deletingProduct.id).url, {
                onFinish: () => setDeletingProduct(null),
            });
        }
    }

    return (
        <>
            <Head title="Products" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
                    </div>
                    <Link href={admin.products.create().url}>
                        <Button>
                            <Plus className="size-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        name="search"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit">Search</Button>
                            </form>
                            <Select value={categoryValue} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories?.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {(filters?.search || filters?.category || new URLSearchParams(window.location.search).has('page')) && (
                                <Button variant="outline" onClick={handleReset}>
                                    <RotateCcw className="size-4" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {products.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Package className="size-12 mb-3 opacity-40" />
                                <p className="text-sm">No products found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="pb-3 font-medium text-muted-foreground">Product</th>
                                            <th className="pb-3 font-medium text-muted-foreground">SKU</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Category</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Price</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Stock</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Status</th>
                                            <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
                                                            {product.primary_image ? (
                                                                <img src={product.primary_image.image} alt={product.name} className="size-full object-cover" />
                                                            ) : (
                                                                <div className="size-full flex items-center justify-center text-muted-foreground">
                                                                    <Package className="size-4" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Link href={admin.products.edit(product.id).url} className="font-medium hover:underline">
                                                                {product.name}
                                                            </Link>
                                                            {product.brand && (
                                                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted-foreground font-mono text-xs">{product.sku}</td>
                                                <td className="py-3 text-muted-foreground">{product.category?.name || '—'}</td>
                                                <td className="py-3 font-medium"><Price amount={product.price} currency={currency} /></td>
                                                <td className="py-3">
                                                    <span className={product.stock_quantity <= product.low_stock_threshold ? 'text-amber-600 font-medium' : ''}>
                                                        {product.track_inventory ? product.stock_quantity : '—'}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={admin.products.edit(product.id).url}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product)}>
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {products.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {products.from}–{products.to} of {products.total}
                                </p>
                                <div className="flex gap-1">
                                    {products.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => handlePageClick(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <DeleteModal
                open={!!deletingProduct}
                onOpenChange={(open) => { if (!open) setDeletingProduct(null); }}
                title="Delete Product"
                description={deletingProduct ? `Delete "${deletingProduct.name}"? This action cannot be undone.` : ''}
                onConfirm={confirmDelete}
            />
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Products', href: admin.products.index().url },
    ],
};
