import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import orders from '@/routes/orders';
import user from '@/routes/user';
import shop from '@/routes/shop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Package,
    Search,
    ChevronRight,
    XCircle,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Clock,
    CheckCircle2,
    Truck,
    X,
} from 'lucide-react';
import type { Order } from '@/types/ecommerce';
import { Input } from '@/components/ui/input';

interface Props {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    [key: string]: unknown;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
    processing: { label: 'Processing', color: 'bg-indigo-100 text-indigo-700', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    refunded: { label: 'Refunded', color: 'bg-orange-100 text-orange-700', icon: X },
};

export default function OrdersIndex() {
    const { orders: userOrders } = usePage<Props>().props;
    const { currency } = usePage().props as { currency?: string };
    const [search, setSearch] = useState('');

    const handleCancel = (order: Order) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.post(orders.cancel({ order: order.id }).url, {}, { preserveScroll: true });
        }
    };

    const filteredOrders = userOrders.data.filter((order) =>
        order.order_number.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="My Orders" />

            <div className="px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">My Orders</h1>
                            <p className="text-gray-500">Manage and track your orders</p>
                        </div>
                        <div className="relative max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search order #..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 rounded-xl pl-10"
                            />
                        </div>
                    </div>

                    {userOrders.total === 0 ? (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="flex flex-col items-center py-20 text-center">
                                <Package className="mb-4 h-16 w-16 text-gray-300" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">No orders yet</h3>
                                <p className="mb-6 text-sm text-gray-500">When you place an order, it will appear here</p>
                                <Link href={shop.index()}>
                                    <Button className="bg-green-600 hover:bg-green-700">Start Shopping</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {filteredOrders.map((order) => {
                                    const StatusIcon = statusConfig[order.status]?.icon || Package;
                                    return (
                                        <Card key={order.id} className="border-0 shadow-sm transition-all hover:shadow-md">
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                                                            <StatusIcon className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-gray-900">#{order.order_number}</p>
                                                                <Badge className={statusConfig[order.status]?.color}>
                                                                    {statusConfig[order.status]?.label || order.status}
                                                                </Badge>
                                                            </div>
                                                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                                                <span>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                                <span>{order.items?.length || 0} items</span>
                                                                <Price amount={order.total} currency={currency} className="font-semibold text-gray-900" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {(order.status === 'pending' || order.status === 'confirmed') && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-1 text-red-500 border-red-200 hover:bg-red-50"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleCancel(order);
                                                                }}
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                                Cancel
                                                            </Button>
                                                        )}
                                                        <Link href={orders.show({ order: order.id }).url}>
                                                            <Button variant="ghost" size="sm" className="gap-1">
                                                                View Details <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {userOrders.last_page > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-1">
                                    {userOrders.links.map((link, i) => {
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <Button
                                                    key={i}
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className="h-9 w-9"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        if (link.label === 'Next &raquo;') {
                                            return (
                                                <Button
                                                    key={i}
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className="h-9 w-9"
                                                >
                                                    <ChevronRightIcon className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        return (
                                            <Button
                                                key={i}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="icon"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={`h-9 w-9 text-sm ${link.active ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: user.dashboard().url },
        { title: 'Orders', href: orders.index().url },
    ],
};
