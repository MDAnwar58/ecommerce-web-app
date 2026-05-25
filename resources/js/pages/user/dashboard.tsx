import { Head, Link, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import user from '@/routes/user';
import wishlist from '@/routes/wishlist';
import orders from '@/routes/orders';
import shop from '@/routes/shop';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    ShoppingBag,
    Heart,
    MapPin,
    User,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';
import type { Order } from '@/types/ecommerce';

interface Props {
    orders: Order[];
    wishlistCount: number;
    stats?: {
        total: number;
        pending: number;
        processing: number;
        delivered: number;
    };
    [key: string]: unknown;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-orange-100 text-orange-700',
};

export default function UserDashboard() {
    const { auth } = usePage().props;
    const { orders: userOrders, wishlistCount, stats } = usePage<Props>().props;
    const { currency } = usePage().props as { currency?: string };

    const statCards = [
        { label: 'Total Orders', value: stats?.total ?? userOrders.length, icon: ShoppingBag, color: 'text-blue-600 bg-blue-100' },
        { label: 'Pending', value: stats?.pending ?? userOrders.filter((o) => o.status === 'pending').length, icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
        { label: 'Processing', value: stats?.processing ?? userOrders.filter((o) => o.status === 'processing').length, icon: Package, color: 'text-indigo-600 bg-indigo-100' },
        { label: 'Delivered', value: stats?.delivered ?? userOrders.filter((o) => o.status === 'delivered').length, icon: CheckCircle2, color: 'text-green-600 bg-green-100' },
    ];

    const recentOrders = userOrders.slice(0, 5);

    return (
        <>
            <Head title="Dashboard" />

            <div className="px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* Welcome */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Welcome back, {auth.user.name}
                        </h1>
                        <p className="text-gray-500">Here's what's happening with your account</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat) => (
                            <Card key={stat.label} className="border-0 shadow-sm">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                {userOrders.length > 5 && (
                                    <Link href={orders.index().url}>
                                        <Button variant="ghost" size="sm" className="gap-1 text-green-600">
                                            View All <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {recentOrders.length === 0 ? (
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="flex flex-col items-center py-12 text-center">
                                        <Package className="mb-4 h-12 w-12 text-gray-300" />
                                        <p className="mb-1 text-lg font-medium text-gray-900">No orders yet</p>
                                        <p className="mb-6 text-sm text-gray-500">Start shopping to see your orders here</p>
                                        <Link href={shop.index()}>
                                            <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <Link key={order.id} href={orders.show({ order: order.id }).url}>
                                            <Card className="border-0 shadow-sm transition-all hover:shadow-md">
                                                <CardContent className="flex items-center justify-between p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                                                            <Package className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">#{order.order_number}</p>
                                                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Badge className={statusColors[order.status]}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </Badge>
                                                        <Price amount={order.total} currency={currency} className="font-semibold text-gray-900" />
                                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Links</h2>
                            <div className="space-y-3">
                                <Link href={wishlist.index().url}>
                                    <Card className="border-0 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex items-center gap-4 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                                                <Heart className="h-5 w-5 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Wishlist</p>
                                                <p className="text-sm text-gray-500">{wishlistCount} items</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                                <Link href={user.addresses().url}>
                                    <Card className="border-0 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex items-center gap-4 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                                                <MapPin className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Addresses</p>
                                                <p className="text-sm text-gray-500">Manage your addresses</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                                <Link href={user.profile().url}>
                                    <Card className="border-0 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex items-center gap-4 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                                <User className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Profile</p>
                                                <p className="text-sm text-gray-500">Edit your information</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

UserDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: user.dashboard().url },
    ],
};
