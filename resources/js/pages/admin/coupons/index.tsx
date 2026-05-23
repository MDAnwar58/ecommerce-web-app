import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Percent, DollarSign } from 'lucide-react';
import admin from '@/routes/admin';
import type { Coupon } from '@/types/ecommerce';
import DeleteModal from '@/components/delete-modal';

type CouponsIndexProps = {
    coupons: Coupon[];
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function CouponsIndex({ coupons }: CouponsIndexProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

    const form = useForm({
        code: '',
        type: 'fixed' as 'fixed' | 'percentage',
        value: 0,
        min_order_amount: null as number | null,
        max_discount: null as number | null,
        usage_limit: null as number | null,
        starts_at: '',
        expires_at: '',
        is_active: true,
    });

    function resetForm() {
        form.reset();
        setEditingCoupon(null);
    }

    function openEdit(coupon: Coupon) {
        setEditingCoupon(coupon);
        form.setData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            min_order_amount: coupon.min_order_amount,
            max_discount: coupon.max_discount,
            usage_limit: coupon.usage_limit,
            starts_at: coupon.starts_at || '',
            expires_at: coupon.expires_at || '',
            is_active: coupon.is_active,
        });
        setDialogOpen(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (editingCoupon) {
            form.post(admin.coupons.update(editingCoupon.id).url, {
                onSuccess: () => { setDialogOpen(false); resetForm(); },
            });
        } else {
            form.post(admin.coupons.store().url, {
                onSuccess: () => { setDialogOpen(false); resetForm(); },
            });
        }
    }

    function handleDelete(coupon: Coupon) {
        setDeletingCoupon(coupon);
    }

    function confirmDelete() {
        if (deletingCoupon) {
            router.delete(admin.coupons.destroy(deletingCoupon.id).url, {
                onFinish: () => setDeletingCoupon(null),
            });
        }
    }

    function isActive(coupon: Coupon): boolean {
        if (!coupon.is_active) return false;
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return false;
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return false;
        return true;
    }

    return (
        <>
            <Head title="Coupons" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
                        <p className="text-sm text-muted-foreground mt-1">Create and manage discount coupons</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
                        <DialogTrigger asChild>
                            <Button onClick={() => resetForm()}>
                                <Plus className="size-4" />
                                Add Coupon
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Coupon Code</Label>
                                    <Input id="code" value={form.data.code} onChange={(e) => form.setData('code', e.target.value.toUpperCase())} placeholder="SUMMER20" />
                                    {form.errors.code && <p className="text-sm text-destructive">{form.errors.code}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={form.data.type} onValueChange={(v) => form.setData('type', v as 'fixed' | 'percentage')}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                <SelectItem value="percentage">Percentage</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="value">Value</Label>
                                        <Input id="value" type="number" step="0.01" value={form.data.value} onChange={(e) => form.setData('value', parseFloat(e.target.value) || 0)} />
                                        {form.errors.value && <p className="text-sm text-destructive">{form.errors.value}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="min_order_amount">Min. Order Amount</Label>
                                        <Input id="min_order_amount" type="number" step="0.01" value={form.data.min_order_amount ?? ''} onChange={(e) => form.setData('min_order_amount', e.target.value ? parseFloat(e.target.value) : null)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max_discount">Max Discount</Label>
                                        <Input id="max_discount" type="number" step="0.01" value={form.data.max_discount ?? ''} onChange={(e) => form.setData('max_discount', e.target.value ? parseFloat(e.target.value) : null)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="usage_limit">Usage Limit</Label>
                                        <Input id="usage_limit" type="number" value={form.data.usage_limit ?? ''} onChange={(e) => form.setData('usage_limit', e.target.value ? parseInt(e.target.value) : null)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="is_active">Active</Label>
                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                checked={form.data.is_active}
                                                onChange={(e) => form.setData('is_active', e.target.checked)}
                                                className="size-4 rounded border-input"
                                            />
                                            <Label htmlFor="is_active">Enabled</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="starts_at">Start Date</Label>
                                        <Input id="starts_at" type="date" value={form.data.starts_at} onChange={(e) => form.setData('starts_at', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expires_at">Expiry Date</Label>
                                        <Input id="expires_at" type="date" value={form.data.expires_at} onChange={(e) => form.setData('expires_at', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
                                    <Button type="submit" disabled={form.processing}>
                                        {form.processing ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {coupons.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Percent className="size-12 mb-3 opacity-40" />
                                <p className="text-sm">No coupons yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="p-4 font-medium text-muted-foreground">Code</th>
                                            <th className="p-4 font-medium text-muted-foreground">Type</th>
                                            <th className="p-4 font-medium text-muted-foreground">Value</th>
                                            <th className="p-4 font-medium text-muted-foreground">Min Order</th>
                                            <th className="p-4 font-medium text-muted-foreground">Used/Limit</th>
                                            <th className="p-4 font-medium text-muted-foreground">Valid Dates</th>
                                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map((coupon) => (
                                            <tr key={coupon.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="p-4">
                                                    <span className="font-mono font-medium text-sm">{coupon.code}</span>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline">
                                                        {coupon.type === 'percentage' ? <Percent className="size-3 mr-1" /> : <DollarSign className="size-3 mr-1" />}
                                                        {coupon.type}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {coupon.min_order_amount ? formatCurrency(coupon.min_order_amount) : '—'}
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {coupon.used_count}/{coupon.usage_limit || '∞'}
                                                </td>
                                                <td className="p-4 text-xs text-muted-foreground">
                                                    {coupon.starts_at ? new Date(coupon.starts_at).toLocaleDateString() : '—'}
                                                    &nbsp;→&nbsp;
                                                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : '∞'}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={isActive(coupon) ? 'default' : 'secondary'}>
                                                        {isActive(coupon) ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}>
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon)}>
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
                    </CardContent>
                </Card>
            </div>

            <DeleteModal
                open={!!deletingCoupon}
                onOpenChange={(open) => { if (!open) setDeletingCoupon(null); }}
                title="Delete Coupon"
                description={deletingCoupon ? `Delete coupon "${deletingCoupon.code}"?` : ''}
                onConfirm={confirmDelete}
            />
        </>
    );
}

CouponsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Coupons', href: admin.coupons.index().url },
    ],
};
