import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, ImagePlus } from 'lucide-react';
import admin from '@/routes/admin';
import type { Product, Category, Brand } from '@/types/ecommerce';

type ProductFormProps = {
    categories: Category[];
    brands: Brand[];
    product?: Product;
};

export default function ProductForm({ categories, brands, product }: ProductFormProps) {
    const isEditing = !!product;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product?.name || '',
        slug: product?.slug || '',
        description: product?.description || '',
        short_description: product?.short_description || '',
        price: product?.price || 0,
        compare_price: product?.compare_price || null as number | null,
        sku: product?.sku || '',
        barcode: product?.barcode || '',
        category_id: product?.category_id ? String(product.category_id) : '',
        brand: product?.brand || '',
        unit: product?.unit || '',
        weight: product?.weight || null as number | null,
        stock_quantity: product?.stock_quantity || 0,
        low_stock_threshold: product?.low_stock_threshold || 0,
        track_inventory: product?.track_inventory ?? true,
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
        is_trending: product?.is_trending ?? false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing && product) {
            post(admin.products.update(product.id).url);
        } else {
            post(admin.products.store().url);
        }
    }

    function generateSlug(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    return (
    <>
        <Head title={isEditing ? 'Edit Product' : 'Create Product'} />
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href={admin.products.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Products
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Product' : 'Create Product'}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isEditing ? `Editing ${product.name}` : 'Add a new product to your catalog'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => {
                                    setData('name', e.target.value);
                                    if (!isEditing) setData('slug', generateSlug(e.target.value));
                                }}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                            {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Category</Label>
                            <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Select value={data.brand} onValueChange={(v) => setData('brand', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.filter(b => b.slug).map((brand) => (
                                        <SelectItem key={brand.id} value={brand.slug}>{brand.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="short_description">Short Description</Label>
                            <textarea
                                id="short_description"
                                value={data.short_description}
                                onChange={(e) => setData('short_description', e.target.value)}
                                rows={3}
                                className={cn("border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Full Description</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={6}
                                className={cn("border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]")}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pricing</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" type="number" step="0.01" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value) || 0)} />
                            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="compare_price">Compare Price (was)</Label>
                            <Input id="compare_price" type="number" step="0.01" value={data.compare_price ?? ''} onChange={(e) => setData('compare_price', e.target.value ? parseFloat(e.target.value) : null)} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Inventory</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input id="sku" value={data.sku} onChange={(e) => setData('sku', e.target.value)} />
                            {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="barcode">Barcode</Label>
                            <Input id="barcode" value={data.barcode} onChange={(e) => setData('barcode', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Input id="unit" value={data.unit} onChange={(e) => setData('unit', e.target.value)} placeholder="e.g. kg, piece" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight</Label>
                            <Input id="weight" type="number" step="0.01" value={data.weight ?? ''} onChange={(e) => setData('weight', e.target.value ? parseFloat(e.target.value) : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock_quantity">Stock Quantity</Label>
                            <Input id="stock_quantity" type="number" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)} />
                            {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                            <Input id="low_stock_threshold" type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <Checkbox id="track_inventory" checked={data.track_inventory} onCheckedChange={(v) => setData('track_inventory', !!v)} />
                            <Label htmlFor="track_inventory">Track Inventory</Label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <ImagePlus className="size-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload images</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max 2MB each)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status & Visibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', !!v)} />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', !!v)} />
                                <Label htmlFor="is_featured">Featured</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_trending" checked={data.is_trending} onCheckedChange={(v) => setData('is_trending', !!v)} />
                                <Label htmlFor="is_trending">Trending</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3 justify-end">
                    <Link href={admin.products.index().url}>
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        <Save className="size-4" />
                        {processing ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    </>
    );
}

ProductForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Products', href: admin.products.index().url },
        { title: 'Create', href: '#' },
    ],
};
