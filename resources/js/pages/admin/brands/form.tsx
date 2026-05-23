import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import admin from '@/routes/admin';
import type { Brand } from '@/types/ecommerce';

type BrandFormProps = {
    brand?: Brand;
};

export default function BrandForm({ brand }: BrandFormProps) {
    const isEditing = !!brand;

    const form = useForm({
        name: brand?.name ?? '',
        slug: brand?.slug ?? '',
        description: brand?.description ?? '',
        website: brand?.website ?? '',
        is_active: brand?.is_active ?? true,
        sort_order: brand?.sort_order ?? 0,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing) {
            form.post(admin.brands.update(brand.id).url);
        } else {
            form.post(admin.brands.store().url);
        }
    }

    function generateSlug(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    return (
        <>
            <Head title={isEditing ? `Edit ${brand.name}` : 'New Brand'} />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">
                <div>
                    <Link href={admin.brands.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Brands
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">{isEditing ? `Edit: ${brand.name}` : 'New Brand'}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{isEditing ? 'Update brand details' : 'Create a new product brand'}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Brand Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => {
                                            form.setData('name', e.target.value);
                                            if (!isEditing) form.setData('slug', generateSlug(e.target.value));
                                        }}
                                        placeholder="e.g. Nike"
                                    />
                                    {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug *</Label>
                                    <Input
                                        id="slug"
                                        value={form.data.slug}
                                        onChange={(e) => form.setData('slug', e.target.value)}
                                        placeholder="e.g. nike"
                                    />
                                    {form.errors.slug && <p className="text-sm text-destructive">{form.errors.slug}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Brief description of the brand"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={form.data.website}
                                    onChange={(e) => form.setData('website', e.target.value)}
                                    placeholder="https://example.com"
                                />
                                {form.errors.website && <p className="text-sm text-destructive">{form.errors.website}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={form.data.sort_order}
                                        onChange={(e) => form.setData('sort_order', Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={form.data.is_active}
                                            onChange={(e) => form.setData('is_active', e.target.checked)}
                                            className="size-4 rounded border-input"
                                        />
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Link href={admin.brands.index().url}>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={form.processing}>
                                    <Save className="size-4" />
                                    {form.processing ? 'Saving...' : isEditing ? 'Update Brand' : 'Create Brand'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

BrandForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Brands', href: admin.brands.index().url },
        { title: 'New Brand', href: '#' },
    ],
};
