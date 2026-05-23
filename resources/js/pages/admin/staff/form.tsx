import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import admin from '@/routes/admin';
import type { User } from '@/types/ecommerce';

type StaffFormProps = {
    staff?: User;
};

const permissionOptions = [
    { value: 'process_orders', label: 'Process Orders' },
    { value: 'manage_inventory', label: 'Manage Inventory' },
    { value: 'manage_products', label: 'Manage Products' },
    { value: 'customer_support', label: 'Customer Support' },
];

export default function StaffForm({ staff }: StaffFormProps) {
    const isEditing = !!staff;

    const { data, setData, post, put, processing, errors } = useForm({
        name: staff?.name || '',
        email: staff?.email || '',
        password: '',
        password_confirmation: '',
        permissions: staff?.permissions || [] as string[],
        is_active: staff?.is_active ?? true,
    });

    function handlePermissionToggle(permission: string, checked: boolean) {
        const current = data.permissions;
        if (checked) {
            setData('permissions', [...current, permission]);
        } else {
            setData('permissions', current.filter((p) => p !== permission));
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing && staff) {
            post(admin.staff.update(staff.id).url);
        } else {
            post(admin.staff.store().url);
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit Staff' : 'Add Staff'} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <Link href={admin.staff.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Staff
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Staff' : 'Add Staff'}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isEditing ? `Editing ${staff.name}` : 'Create a new staff account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>
                            {!isEditing && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                                        <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {permissionOptions.map((perm) => (
                                    <div key={perm.value} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`perm_${perm.value}`}
                                            checked={data.permissions.includes(perm.value)}
                                            onCheckedChange={(checked) => handlePermissionToggle(perm.value, !!checked)}
                                        />
                                        <Label htmlFor={`perm_${perm.value}`}>{perm.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
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
                        <Link href={admin.staff.index().url}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="size-4" />
                            {processing ? 'Saving...' : isEditing ? 'Update Staff' : 'Create Staff'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

StaffForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Staff', href: admin.staff.index().url },
        { title: 'Create', href: '#' },
    ],
};
