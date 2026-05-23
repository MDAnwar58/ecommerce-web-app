import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import user from '@/routes/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Plus,
    Pencil,
    Trash2,
    Phone,
    User,
    Home,
    X,
    Check,
} from 'lucide-react';
import type { Address } from '@/types/ecommerce';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    addresses: Address[];
    [key: string]: unknown;
}

export default function AddressesIndex() {
    const { addresses } = usePage<Props>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        label: '',
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
        is_default: false,
    });

    const openCreate = () => {
        setEditingAddress(null);
        reset();
        setIsOpen(true);
    };

    const openEdit = (address: Address) => {
        setEditingAddress(address);
        setData({
            label: address.label ?? '',
            name: address.name ?? address.full_name,
            phone: address.phone ?? '',
            street: address.street ?? address.street_address,
            city: address.city ?? '',
            state: address.state ?? '',
            zip: address.zip ?? address.postal_code,
            country: address.country ?? '',
            is_default: address.is_default ?? false,
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            put(user.addresses.url() + '/' + editingAddress.id, {
                preserveScroll: true,
                onSuccess: () => { setIsOpen(false); reset(); },
            });
        } else {
            post(user.addresses.url(), {
                preserveScroll: true,
                onSuccess: () => { setIsOpen(false); reset(); },
            });
        }
    };

    const handleDelete = (address: Address) => {
        if (confirm(`Delete "${address.label}" address?`)) {
            router.delete(user.addresses.url() + '/' + address.id, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="My Addresses" />

            <div className="px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">My Addresses</h1>
                            <p className="text-gray-500">Manage your shipping addresses</p>
                        </div>
                        <Button onClick={openCreate} className="gap-2 bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4" />
                            Add Address
                        </Button>
                    </div>

                    {addresses.length === 0 ? (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="flex flex-col items-center py-20 text-center">
                                <MapPin className="mb-4 h-16 w-16 text-gray-300" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">No addresses yet</h3>
                                <p className="mb-6 text-sm text-gray-500">Add a shipping address to start ordering</p>
                                <Button onClick={openCreate} className="gap-2 bg-green-600 hover:bg-green-700">
                                    <Plus className="h-4 w-4" />
                                    Add Address
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {addresses.map((address) => (
                                <Card
                                    key={address.id}
                                    className={`border-0 shadow-sm transition-all hover:shadow-md ${
                                        address.is_default ? 'ring-2 ring-green-200' : ''
                                    }`}
                                >
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                                    <Home className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-gray-900">{address.label}</p>
                                                        {address.is_default && (
                                                            <Badge className="bg-green-100 text-green-700 text-xs">Default</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-blue-500"
                                                    onClick={() => openEdit(address)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                    onClick={() => handleDelete(address)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600 pl-12">
                                            <p className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-gray-400" /> {address.name}</p>
                                            <p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-gray-400" /> {address.phone}</p>
                                            <p className="mt-2">{address.street}</p>
                                            <p>{address.city}, {address.state} {address.zip}</p>
                                            <p>{address.country}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Add/Edit Dialog */}
                    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setIsOpen(false); reset(); } }}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                                <DialogDescription>
                                    {editingAddress ? 'Update your address details' : 'Fill in the details for your shipping address'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="label">Label</Label>
                                        <Input
                                            id="label"
                                            value={data.label}
                                            onChange={(e) => setData('label', e.target.value)}
                                            placeholder="Home, Work, etc."
                                            required
                                        />
                                        {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="addr_name">Full Name</Label>
                                        <Input
                                            id="addr_name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="addr_phone">Phone</Label>
                                        <Input
                                            id="addr_phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input
                                            id="street"
                                            value={data.street}
                                            onChange={(e) => setData('street', e.target.value)}
                                            required
                                        />
                                        {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            required
                                        />
                                        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            required
                                        />
                                        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input
                                            id="zip"
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            required
                                        />
                                        {errors.zip && <p className="text-sm text-red-500">{errors.zip}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            required
                                        />
                                        {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={data.is_default}
                                                onChange={(e) => setData('is_default', e.target.checked)}
                                                className="h-4 w-4 accent-green-600"
                                            />
                                            Set as default address
                                        </label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => { setIsOpen(false); reset(); }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                        {processing ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}

AddressesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: user.dashboard().url },
        { title: 'Addresses', href: user.addresses().url },
    ],
};
