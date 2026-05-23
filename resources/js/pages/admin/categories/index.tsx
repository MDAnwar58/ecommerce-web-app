import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, ChevronRight, Check, X } from 'lucide-react';
import admin from '@/routes/admin';
import type { Category } from '@/types/ecommerce';
import { useState } from 'react';
import DeleteModal from '@/components/delete-modal';

type CategoriesIndexProps = {
    categories: Category[];
};

function CategoryRow({ category, depth = 0, onEdit, onDelete }: {
    category: Category;
    depth: number;
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
}) {
    return (
        <>
            <tr className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="py-3">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 1.5}rem` }}>
                        {depth > 0 && <ChevronRight className="size-3 text-muted-foreground" />}
                        <span className="font-medium">{category.name}</span>
                    </div>
                </td>
                <td className="py-3 text-muted-foreground text-xs font-mono">{category.slug}</td>
                <td className="py-3 text-muted-foreground">{category.products_count ?? 0}</td>
                <td className="py-3">
                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </td>
                <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                            <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(category)}>
                            <Trash2 className="size-4 text-destructive" />
                        </Button>
                    </div>
                </td>
            </tr>
            {category.children?.map((child) => (
                <CategoryRow key={child.id} category={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </>
    );
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const form = useForm({
        name: '',
        slug: '',
        description: '',
        parent_id: '',
        is_active: true,
    });

    function resetForm() {
        form.reset();
        setEditingCategory(null);
        setShowAddForm(false);
    }

    function openEdit(cat: Category) {
        setEditingCategory(cat);
        setShowAddForm(true);
        form.setData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            parent_id: cat.parent_id ? String(cat.parent_id) : '',
            is_active: cat.is_active,
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const parentId = form.data.parent_id ? Number(form.data.parent_id) : null;
        form.setData('parent_id', parentId as never);

        if (editingCategory) {
            form.post(admin.categories.update(editingCategory.id).url, {
                onSuccess: () => resetForm(),
            });
        } else {
            form.post(admin.categories.store().url, {
                onSuccess: () => resetForm(),
            });
        }
    }

    function handleDelete(cat: Category) {
        setDeletingCategory(cat);
    }

    function confirmDelete() {
        if (deletingCategory) {
            router.delete(admin.categories.destroy(deletingCategory.id).url, {
                onFinish: () => setDeletingCategory(null),
            });
        }
    }

    function generateSlug(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const rootCategories = categories.filter(c => !c.parent_id);

    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                        <p className="text-sm text-muted-foreground mt-1">Organize your products with categories</p>
                    </div>
                    {!showAddForm && (
                        <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
                            <Plus className="size-4" />
                            Add Category
                        </Button>
                    )}
                </div>

                {showAddForm && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editingCategory ? 'Edit Category' : 'New Category'}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={resetForm}>
                                <X className="size-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cat_name">Name</Label>
                                    <Input
                                        id="cat_name"
                                        value={form.data.name}
                                        onChange={(e) => {
                                            form.setData('name', e.target.value);
                                            if (!editingCategory) form.setData('slug', generateSlug(e.target.value));
                                        }}
                                    />
                                    {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cat_slug">Slug</Label>
                                    <Input id="cat_slug" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <Label htmlFor="cat_description">Description</Label>
                                    <Input id="cat_description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cat_parent">Parent Category</Label>
                                    <Select value={form.data.parent_id} onValueChange={(v) => form.setData('parent_id', v === 'none' ? '' : v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="None (top level)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None (top level)</SelectItem>
                                            {categories
                                                .filter(c => c.id !== editingCategory?.id)
                                                .map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex items-center gap-2 pb-2">
                                        <input
                                            type="checkbox"
                                            id="cat_active"
                                            checked={form.data.is_active}
                                            onChange={(e) => form.setData('is_active', e.target.checked)}
                                            className="size-4 rounded border-input"
                                        />
                                        <Label htmlFor="cat_active">Active</Label>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                    <Button type="submit" disabled={form.processing}>
                                        <Check className="size-4" />
                                        {form.processing ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="p-4 font-medium text-muted-foreground">Name</th>
                                        <th className="p-4 font-medium text-muted-foreground">Slug</th>
                                        <th className="p-4 font-medium text-muted-foreground">Products</th>
                                        <th className="p-4 font-medium text-muted-foreground">Status</th>
                                        <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rootCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">No categories yet</td>
                                        </tr>
                                    ) : (
                                        rootCategories.map((cat) => (
                                            <CategoryRow key={cat.id} category={cat} depth={0} onEdit={openEdit} onDelete={handleDelete} />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DeleteModal
                open={!!deletingCategory}
                onOpenChange={(open) => { if (!open) setDeletingCategory(null); }}
                title="Delete Category"
                description={deletingCategory ? `Delete "${deletingCategory.name}"? This will also delete all child categories.` : ''}
                onConfirm={confirmDelete}
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Categories', href: admin.categories.index().url },
    ],
};
