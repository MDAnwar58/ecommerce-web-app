import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, CalendarDays, ShoppingBag } from 'lucide-react';
import admin from '@/routes/admin';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import type { User, Order } from '@/types/ecommerce';

type CustomerShowProps = {
    user: User;
    orders: Order[];
};

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    processing: 'default',
    shipped: 'outline',
    delivered: 'outline',
    cancelled: 'destructive',
};

export default function CustomerShow({ user, orders }: CustomerShowProps) {
    const { currency } = usePage().props as { currency?: string };
    return (
        <>
            <Head title={user.name} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <Link href={admin.customers.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Customers
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Details</h1>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Avatar className="size-16 mx-auto mb-3">
                                <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                            <div className="mt-4 space-y-2 text-left text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="size-4" />
                                    <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="size-4" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="size-4" />
                                    <span>Joined {new Date((user as any).created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2 justify-center">
                                <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="size-4" />
                                    Order History ({orders.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {orders.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-8 text-center">No orders yet</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b text-left">
                                                    <th className="pb-3 font-medium text-muted-foreground">Order #</th>
                                                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                                                    <th className="pb-3 font-medium text-muted-foreground">Total</th>
                                                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                                                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                        <td className="py-3 font-medium">{order.order_number}</td>
                                                        <td className="py-3 text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="py-3"><Price amount={order.total} currency={currency} /></td>
                                                        <td className="py-3">
                                                            <Badge variant={statusColors[order.status] || 'default'} className="capitalize">
                                                                {order.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            <Link href={admin.orders.show(order.id).url}>
                                                                <Button variant="ghost" size="sm">View</Button>
                                                            </Link>
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
                </div>
            </div>
        </>
    );
}

CustomerShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Customers', href: admin.customers.index().url },
        { title: 'Details', href: '#' },
    ],
};
