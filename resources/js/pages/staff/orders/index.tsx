import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import staff from '@/routes/staff';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import type { Order } from '@/types/ecommerce';

type StaffOrdersIndexProps = {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    status?: string;
};

const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
];

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    processing: 'default',
    shipped: 'outline',
    delivered: 'outline',
    cancelled: 'destructive',
};

export default function StaffOrdersIndex({ orders, status }: StaffOrdersIndexProps) {
    const { currency } = usePage().props as { currency?: string };
    function handleTabClick(tabValue: string) {
        router.get(staff.orders.index().url, tabValue ? { status: tabValue } : {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Assigned Orders" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Assigned Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">Orders assigned to you</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap gap-2">
                            {statusTabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabClick(tab.value)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        (status || '') === tab.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {orders.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <p className="text-sm">No assigned orders</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="pb-3 font-medium text-muted-foreground">Order #</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Date</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Total</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Status</th>
                                            <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="py-3 font-medium">{order.order_number}</td>
                                                <td className="py-3 text-muted-foreground">{order.assigned_staff?.name || `User #${order.user_id}`}</td>
                                                <td className="py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="py-3"><Price amount={order.total} currency={currency} /></td>
                                                <td className="py-3">
                                                    <Badge variant={statusColors[order.status] || 'default'} className="capitalize">
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <Link href={staff.orders.show(order.id).url}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {orders.from}–{orders.to} of {orders.total}
                                </p>
                                <div className="flex gap-1">
                                    {orders.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

StaffOrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: staff.dashboard().url },
        { title: 'Orders', href: staff.orders.index().url },
    ],
};
