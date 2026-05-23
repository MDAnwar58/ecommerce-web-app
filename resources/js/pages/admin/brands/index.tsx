import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Globe, ExternalLink } from 'lucide-react';
import admin from '@/routes/admin';
import type { Brand } from '@/types/ecommerce';
import { useState } from 'react';
import DeleteModal from '@/components/delete-modal';

type BrandsIndexProps = {
    brands: (Brand & { products_count?: number })[];
};

export default function BrandsIndex({ brands }: BrandsIndexProps) {
    const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

    function handleDelete(brand: Brand) {
        setDeletingBrand(brand);
    }

    function confirmDelete() {
        if (deletingBrand) {
            router.delete(admin.brands.destroy(deletingBrand.id).url, {
                onFinish: () => setDeletingBrand(null),
            });
        }
    }

    return (
        <>
            <Head title="Brands" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage product brands</p>
                    </div>
                    <Link href={admin.brands.create().url}>
                        <Button>
                            <Plus className="size-4" />
                            Add Brand
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="p-4 font-medium text-muted-foreground">Brand</th>
                                        <th className="p-4 font-medium text-muted-foreground">Slug</th>
                                        <th className="p-4 font-medium text-muted-foreground">Products</th>
                                        <th className="p-4 font-medium text-muted-foreground">Status</th>
                                        <th className="p-4 font-medium text-muted-foreground">Website</th>
                                        <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No brands yet</td>
                                        </tr>
                                    ) : (
                                        brands.map((brand) => (
                                            <tr key={brand.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="p-4 font-medium">{brand.name}</td>
                                                <td className="p-4 text-muted-foreground text-xs font-mono">{brand.slug}</td>
                                                <td className="p-4 text-muted-foreground">{brand.products_count ?? 0}</td>
                                                <td className="p-4">
                                                    <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                                                        {brand.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    {brand.website ? (
                                                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                                            <Globe className="size-3" />
                                                            Visit
                                                            <ExternalLink className="size-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={admin.brands.edit(brand.id).url}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(brand)}>
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DeleteModal
                open={!!deletingBrand}
                onOpenChange={(open) => { if (!open) setDeletingBrand(null); }}
                title="Delete Brand"
                description={deletingBrand ? `Delete "${deletingBrand.name}"? This action cannot be undone.` : ''}
                onConfirm={confirmDelete}
            />
        </>
    );
}

BrandsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Brands', href: admin.brands.index().url },
    ],
};
