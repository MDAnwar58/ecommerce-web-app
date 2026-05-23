import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Package, CheckCircle } from 'lucide-react';
import staff from '@/routes/staff';
import type { Order } from '@/types/ecommerce';

type StaffDashboardProps = {
    stats: {
        assigned_orders: number;
        pending: number;
        processing: number;
        completed_today: number;
    };
    assignedOrders: Order[];
};

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    processing: 'default',
    shipped: 'outline',
    delivered: 'outline',
    cancelled: 'destructive',
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function StaffDashboard({ stats, assignedOrders }: StaffDashboardProps) {
    return (
        <>
            <Head title="Staff Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Your assigned tasks and orders</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Assigned Orders</p>
                                    <p className="text-2xl font-bold">{stats.assigned_orders}</p>
                                </div>
                                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-600">
                                    <ShoppingCart className="size-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold">{stats.pending}</p>
                                </div>
                                <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600">
                                    <Clock className="size-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Processing</p>
                                    <p className="text-2xl font-bold">{stats.processing}</p>
                                </div>
                                <div className="rounded-lg bg-purple-500/10 p-3 text-purple-600">
                                    <Package className="size-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Completed Today</p>
                                    <p className="text-2xl font-bold">{stats.completed_today}</p>
                                </div>
                                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600">
                                    <CheckCircle className="size-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Assigned Orders</CardTitle>
                        <Link
                            href={staff.orders.index().url}
                            className="text-sm text-primary hover:underline"
                        >
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {assignedOrders.length === 0 ? (
                            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">No assigned orders</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="pb-3 font-medium text-muted-foreground">Order #</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Date</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Total</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedOrders.map((order) => (
                                            <tr key={order.id} className="border-b last:border-0">
                                                <td className="py-3 font-medium">{order.order_number}</td>
                                                <td className="py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="py-3">{formatCurrency(order.total)}</td>
                                                <td className="py-3">
                                                    <Badge variant={statusColors[order.status] || 'default'} className="capitalize">
                                                        {order.status}
                                                    </Badge>
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
        </>
    );
}

StaffDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: staff.dashboard().url },
    ],
};
