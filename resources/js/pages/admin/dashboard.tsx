import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
import admin from '@/routes/admin';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import type { Order } from '@/types/ecommerce';

type DashboardProps = {
    stats: {
        total_revenue: number;
        total_orders: number;
        total_products: number;
        total_customers: number;
        revenue_growth?: number;
        orders_growth?: number;
    };
    recentOrders: Order[];
    revenueData: { month: string; revenue: number }[];
    topProducts: { id: number; name: string; sold: number; revenue: number }[];
};

function StatCard({ title, value, icon: Icon, href, growth, prefix = '' }: { title: string; value: string | number; icon: React.ElementType; href: string; growth?: number; prefix?: string }) {
    return (
        <Link href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{title}</p>
                            <p className="text-2xl font-bold">{prefix}{value}</p>
                            {growth !== undefined && (
                                <div className={`flex items-center gap-1 text-xs ${growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {growth >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                    <span>{Math.abs(growth)}% from last month</span>
                                </div>
                            )}
                        </div>
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                            <Icon className="size-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    processing: 'default',
    shipped: 'outline',
    delivered: 'outline',
    cancelled: 'destructive',
};

function statusBadgeVariant(status: string) {
    return statusColors[status] || 'default';
}

export default function AdminDashboard({ stats, recentOrders, revenueData, topProducts }: DashboardProps) {
    const { currency } = usePage().props as { currency?: string };
    const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.revenue)) : 1;

    return (
    <>
        <Head title="Admin Dashboard" />
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Overview of your store performance</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={<Price amount={stats.total_revenue} currency={currency} />}
                    icon={DollarSign}
                    href="#"
                    growth={stats.revenue_growth}
                    prefix=""
                />
                <StatCard
                    title="Total Orders"
                    value={stats.total_orders}
                    icon={ShoppingCart}
                    href={admin.orders.index().url}
                    growth={stats.orders_growth}
                />
                <StatCard
                    title="Total Products"
                    value={stats.total_products}
                    icon={Package}
                    href={admin.products.index().url}
                />
                <StatCard
                    title="Total Customers"
                    value={stats.total_customers}
                    icon={Users}
                    href={admin.customers.index().url}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {revenueData.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No revenue data available</div>
                        ) : (
                            <div className="flex items-end gap-2 h-48">
                                {revenueData.map((item) => (
                                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Price amount={item.revenue} currency={currency} />
                                        </span>
                                        <div
                                            className="w-full rounded-md bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                                            style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                                        />
                                        <span className="text-xs text-muted-foreground">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topProducts.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No product data</div>
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-muted-foreground w-5">#{index + 1}</span>
                                            <span className="text-sm font-medium truncate max-w-[140px]">{product.name}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {product.sold} sold &bull; <Price amount={product.revenue} currency={currency} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Link
                        href={admin.orders.index().url}
                        className="text-sm text-primary hover:underline"
                    >
                        View All
                    </Link>
                </CardHeader>
                <CardContent>
                    {recentOrders.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">No orders yet</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-3 font-medium text-muted-foreground">Order</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Date</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Total</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b last:border-0">
                                            <td className="py-3 font-medium">{order.order_number}</td>
                                            <td className="py-3 text-muted-foreground">
                                                {order.assigned_staff?.name || `User #${order.user_id}`}
                                            </td>
                                            <td className="py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="py-3"><Price amount={order.total} currency={currency} /></td>
                                            <td className="py-3">
                                                <Badge variant={statusBadgeVariant(order.status)} className="capitalize">
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

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
    ],
};
