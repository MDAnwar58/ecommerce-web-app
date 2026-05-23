import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Pencil, PackageOpen } from 'lucide-react';
import staff from '@/routes/staff';
import type { Product } from '@/types/ecommerce';

type StaffProductsIndexProps = {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function StaffProductsIndex({ products }: StaffProductsIndexProps) {
    const [stockProduct, setStockProduct] = useState<Product | null>(null);
    const stockForm = useForm({ stock_quantity: 0 });

    function openStockUpdate(product: Product) {
        setStockProduct(product);
        stockForm.setData('stock_quantity', product.stock_quantity);
    }

    function handleStockUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!stockProduct) return;
        stockForm.patch(staff.products.stock(stockProduct.id).url, {
            onSuccess: () => setStockProduct(null),
        });
    }

    return (
        <>
            <Head title="Products" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground mt-1">View and update product inventory</p>
                </div>

                <Card>
                    <CardContent className="p-0">
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
                                            <th className="p-4 font-medium text-muted-foreground">Product</th>
                                            <th className="p-4 font-medium text-muted-foreground">SKU</th>
                                            <th className="p-4 font-medium text-muted-foreground">Price</th>
                                            <th className="p-4 font-medium text-muted-foreground">Stock</th>
                                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="p-4">
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
                                                            <Link href={staff.products.edit(product.id).url} className="font-medium hover:underline">
                                                                {product.name}
                                                            </Link>
                                                            {product.brand && (
                                                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground font-mono text-xs">{product.sku}</td>
                                                <td className="p-4 font-medium">{formatCurrency(product.price)}</td>
                                                <td className="p-4">
                                                    <span className={product.stock_quantity <= product.low_stock_threshold ? 'text-amber-600 font-medium' : ''}>
                                                        {product.track_inventory ? product.stock_quantity : '—'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={staff.products.edit(product.id).url}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button variant="ghost" size="icon" onClick={() => openStockUpdate(product)}>
                                                            <PackageOpen className="size-4" />
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
                            <div className="flex items-center justify-between p-4 border-t">
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
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={!!stockProduct} onOpenChange={(open) => { if (!open) setStockProduct(null); }}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Update Stock</DialogTitle>
                        </DialogHeader>
                        {stockProduct && (
                            <form onSubmit={handleStockUpdate} className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Update stock for <span className="font-medium text-foreground">{stockProduct.name}</span>
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="stock_qty">Stock Quantity</Label>
                                    <Input
                                        id="stock_qty"
                                        type="number"
                                        value={stockForm.data.stock_quantity}
                                        onChange={(e) => stockForm.setData('stock_quantity', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setStockProduct(null)}>Cancel</Button>
                                    <Button type="submit" disabled={stockForm.processing}>
                                        {stockForm.processing ? 'Saving...' : 'Update'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

StaffProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: staff.dashboard().url },
        { title: 'Products', href: staff.products.index().url },
    ],
};
