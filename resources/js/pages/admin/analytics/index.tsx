import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp, BarChart3 } from 'lucide-react';
import admin from '@/routes/admin';

type AnalyticsProps = {
    revenueChart: { date: string; revenue: number }[];
    sales: {
        total_revenue: number;
        today_revenue: number;
        total_orders: number;
        today_orders: number;
        average_order: number | null;
        total_customers: number;
        new_customers_today: number;
    };
    topProducts: { id: number; name: string; slug: string; price: number; sold_count: number; stock_quantity: number; primary_image?: { url?: string } | null }[];
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AnalyticsIndex({ revenueChart, sales, topProducts }: AnalyticsProps) {
    const maxRevenue = revenueChart.length > 0 ? Math.max(...revenueChart.map(d => d.revenue)) : 1;

    return (
        <>
            <Head title="Analytics" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">Store performance metrics</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                    <p className="text-2xl font-bold">{formatCurrency(sales.total_revenue)}</p>
                                </div>
                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                    <DollarSign className="size-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Today's Revenue</p>
                                    <p className="text-2xl font-bold">{formatCurrency(sales.today_revenue)}</p>
                                </div>
                                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600">
                                    <TrendingUp className="size-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Orders</p>
                                    <p className="text-2xl font-bold">{sales.total_orders}</p>
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
                                    <p className="text-sm text-muted-foreground">Total Customers</p>
                                    <p className="text-2xl font-bold">{sales.total_customers}</p>
                                </div>
                                <div className="rounded-lg bg-violet-500/10 p-3 text-violet-600">
                                    <Users className="size-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="size-4" />
                                Revenue (Last 30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {revenueChart.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available</div>
                            ) : (
                                <div className="flex items-end gap-1 h-48">
                                    {revenueChart.map((item) => (
                                        <div key={item.date} className="flex-1 flex flex-col items-center gap-1 group">
                                            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                {formatCurrency(item.revenue)}
                                            </span>
                                            <div
                                                className="w-full rounded-sm bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                                                style={{ height: `${(item.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topProducts.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data</div>
                            ) : (
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={product.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-muted-foreground w-5">#{index + 1}</span>
                                                <span className="text-sm font-medium truncate max-w-[160px]">{product.name}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {product.sold_count} sold
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">Average Order Value</p>
                            <p className="text-xl font-bold mt-1">{formatCurrency(sales.average_order ?? 0)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">Today's Orders</p>
                            <p className="text-xl font-bold mt-1">{sales.today_orders}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">New Customers Today</p>
                            <p className="text-xl font-bold mt-1">{sales.new_customers_today}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AnalyticsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Analytics', href: admin.analytics.index().url },
    ],
};
