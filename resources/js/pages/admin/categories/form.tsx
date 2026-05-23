import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import admin from '@/routes/admin';
import type { Category } from '@/types/ecommerce';

type CategoryFormProps = {
    categories: Category[];
    category?: Category;
};

export default function CategoryForm({ categories, category }: CategoryFormProps) {
    const isEditing = !!category;
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        parent_id: category?.parent_id ? String(category.parent_id) : '',
        is_active: category?.is_active ?? true,
        sort_order: category?.sort_order ?? 0,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing && category) {
            post(admin.categories.update(category.id).url);
        } else {
            post(admin.categories.store().url);
        }
    }

    function generateSlug(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    return (
    <>
        <Head title={isEditing ? `Edit ${category.name}` : 'Create Category'} />
        <div className="flex flex-col gap-6 p-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <div>
                    <Link href={admin.categories.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Categories
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Category' : 'Create Category'}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isEditing ? `Editing ${category.name}` : 'Add a new category to organize products'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
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
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                            />
                            {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parent_id">Parent Category</Label>
                            <Select value={data.parent_id} onValueChange={(v) => setData('parent_id', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="None (top level)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (top level)</SelectItem>
                                    {categories
                                        .filter(c => c.id !== category?.id)
                                        .map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(v) => setData('is_active', !!v)}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3 justify-end">
                    <Link href={admin.categories.index().url}>
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        <Save className="size-4" />
                        {processing ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
                    </Button>
                </div>
            </form>
        </div>
    </>
    );
}

CategoryForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Categories', href: admin.categories.index().url },
        { title: 'Create', href: '#' },
    ],
};
