import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import staff from '@/routes/staff';
import type { Product, Category } from '@/types/ecommerce';

type StaffProductFormProps = {
    product: Product;
    categories: Category[];
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function StaffProductForm({ product, categories }: StaffProductFormProps) {
    const { data, setData, put, processing, errors } = useForm({
        price: product.price,
        stock_quantity: product.stock_quantity,
        is_active: product.is_active,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(staff.products.update(product.id).url);
    }

    return (
        <>
            <Head title={`Edit ${product.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <Link href={staff.products.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Products
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Editing {product.name}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 mb-6 text-sm">
                                <p><span className="text-muted-foreground">SKU:</span> {product.sku}</p>
                                <p><span className="text-muted-foreground">Category:</span> {product.category?.name || '—'}</p>
                                <p><span className="text-muted-foreground">Current Price:</span> {formatCurrency(product.price)}</p>
                                <p><span className="text-muted-foreground">Current Stock:</span> {product.track_inventory ? product.stock_quantity : 'Not tracked'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sold</span>
                                <span>{product.sold_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Rating</span>
                                <span>{product.rating}/5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Reviews</span>
                                <span>{product.review_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span>{product.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Fields</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" step="0.01" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value) || 0)} />
                                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                <Input id="stock_quantity" type="number" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)} />
                                {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity}</p>}
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', !!v)} />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-3 justify-end mt-6">
                        <Link href={staff.products.index().url}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="size-4" />
                            {processing ? 'Saving...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

StaffProductForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: staff.dashboard().url },
        { title: 'Products', href: staff.products.index().url },
        { title: 'Edit', href: '#' },
    ],
};
