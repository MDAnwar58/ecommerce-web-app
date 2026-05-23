import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import admin from '@/routes/admin';
import type { User } from '@/types/ecommerce';
import { useState } from 'react';
import DeleteModal from '@/components/delete-modal';

type StaffIndexProps = {
    staff: User[];
};

export default function StaffIndex({ staff }: StaffIndexProps) {
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    function handleDelete(user: User) {
        setDeletingUser(user);
    }

    function confirmDelete() {
        if (deletingUser) {
            router.delete(admin.staff.destroy(deletingUser.id).url, {
                onFinish: () => setDeletingUser(null),
            });
        }
    }

    return (
        <>
            <Head title="Staff" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your staff members and their permissions</p>
                    </div>
                    <Link href={admin.staff.create().url}>
                        <Button>
                            <Plus className="size-4" />
                            Add Staff
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {staff.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Users className="size-12 mb-3 opacity-40" />
                                <p className="text-sm">No staff members yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="p-4 font-medium text-muted-foreground">Name</th>
                                            <th className="p-4 font-medium text-muted-foreground">Email</th>
                                            <th className="p-4 font-medium text-muted-foreground">Permissions</th>
                                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staff.map((user) => (
                                            <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-8">
                                                            <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground">{user.email}</td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.permissions && user.permissions.length > 0 ? (
                                                            user.permissions.map((perm) => (
                                                                <Badge key={perm} variant="outline" className="text-xs capitalize">
                                                                    {perm.replace('_', ' ')}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">None</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={admin.staff.edit(user.id).url}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
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
                open={!!deletingUser}
                onOpenChange={(open) => { if (!open) setDeletingUser(null); }}
                title="Remove Staff Member"
                description={deletingUser ? `Remove staff member "${deletingUser.name}"?` : ''}
                onConfirm={confirmDelete}
            />
        </>
    );
}

StaffIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Staff', href: admin.staff.index().url },
    ],
};
