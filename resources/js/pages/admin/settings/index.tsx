import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Store, Settings2 } from 'lucide-react';
import admin from '@/routes/admin';

type SettingsIndexProps = {
    settings: Record<string, string>;
};

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const form = useForm({
        store_name: settings.store_name || '',
        store_email: settings.store_email || '',
        store_phone: settings.store_phone || '',
        store_address: settings.store_address || '',
        currency: settings.currency || 'USD',
        tax_rate: settings.tax_rate || '0',
        shipping_cost: settings.shipping_cost || '0',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(admin.settings.update().url);
    }

    return (
        <>
            <Head title="Settings" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">Configure your store preferences</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Store className="size-4" />
                                Store Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="store_name">Store Name</Label>
                                <Input id="store_name" value={form.data.store_name} onChange={(e) => form.setData('store_name', e.target.value)} />
                                {form.errors.store_name && <p className="text-sm text-destructive">{form.errors.store_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store_email">Store Email</Label>
                                <Input id="store_email" type="email" value={form.data.store_email} onChange={(e) => form.setData('store_email', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store_phone">Store Phone</Label>
                                <Input id="store_phone" value={form.data.store_phone} onChange={(e) => form.setData('store_phone', e.target.value)} />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="store_address">Store Address</Label>
                                <textarea
                                    id="store_address"
                                    value={form.data.store_address}
                                    onChange={(e) => form.setData('store_address', e.target.value)}
                                    rows={3}
                                    className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings2 className="size-4" />
                                Store Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select
                                    id="currency"
                                    value={form.data.currency}
                                    onChange={(e) => form.setData('currency', e.target.value)}
                                    className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                    <option value="CAD">CAD ($)</option>
                                    <option value="AUD">AUD ($)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                                <Input id="tax_rate" type="number" step="0.01" value={form.data.tax_rate} onChange={(e) => form.setData('tax_rate', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shipping_cost">Shipping Cost</Label>
                                <Input id="shipping_cost" type="number" step="0.01" value={form.data.shipping_cost} onChange={(e) => form.setData('shipping_cost', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.processing} size="lg">
                            <Save className="size-4" />
                            {form.processing ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Settings', href: admin.settings.index().url },
    ],
};
