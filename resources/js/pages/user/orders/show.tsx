import { Head, Link, usePage, router } from '@inertiajs/react';
import orders from '@/routes/orders';
import user from '@/routes/user';
import shop from '@/routes/shop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronLeft,
    X,
    Printer,
} from 'lucide-react';
import type { Order } from '@/types/ecommerce';

interface Props {
    order: Order;
    [key: string]: unknown;
}

const statusFlow: { status: string; label: string; icon: any }[] = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'processing', label: 'Processing', icon: Package },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
    processing: { label: 'Processing', color: 'bg-indigo-100 text-indigo-700', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    refunded: { label: 'Refunded', color: 'bg-orange-100 text-orange-700', icon: X },
};

export default function OrderShow() {
    const { order } = usePage<Props>().props;
    const StatusIcon = statusConfig[order.status]?.icon || Package;
    const currentStepIndex = statusFlow.findIndex((s) => s.status === order.status);

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.post(orders.cancel({ order: order.id }).url, {}, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title={`Order #${order.order_number}`} />

            <div className="px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link href={orders.index()} className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600">
                                <ChevronLeft className="h-4 w-4" />
                                Back to Orders
                            </Link>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Order #{order.order_number}</h1>
                                <Badge className={statusConfig[order.status]?.color}>
                                    <StatusIcon className="mr-1 h-3.5 w-3.5" />
                                    {statusConfig[order.status]?.label || order.status}
                                </Badge>
                            </div>
                            <p className="text-gray-500">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-red-500 border-red-200 hover:bg-red-50"
                                    onClick={handleCancel}
                                >
                                    <XCircle className="h-4 w-4" />
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Status Timeline */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900">Order Status</h2>
                                <div className="relative">
                                    {order.status === 'cancelled' || order.status === 'refunded' ? (
                                        <div className="flex items-center gap-4 rounded-xl bg-red-50 p-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                                {order.status === 'cancelled' ? (
                                                    <XCircle className="h-6 w-6 text-red-500" />
                                                ) : (
                                                    <X className="h-6 w-6 text-orange-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-red-700">
                                                    Order {order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}
                                                </p>
                                                <p className="text-sm text-red-500">
                                                    {order.status === 'cancelled'
                                                        ? 'This order has been cancelled.'
                                                        : 'This order has been refunded.'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-0">
                                            {statusFlow.map((step, i) => {
                                                const StepIcon = step.icon;
                                                const isComplete = i <= currentStepIndex;
                                                const isCurrent = i === currentStepIndex;
                                                return (
                                                    <div key={step.status} className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                                                    isComplete
                                                                        ? 'border-green-500 bg-green-500 text-white'
                                                                        : 'border-gray-300 bg-white text-gray-400'
                                                                } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                                                            >
                                                                <StepIcon className="h-5 w-5" />
                                                            </div>
                                                            {i < statusFlow.length - 1 && (
                                                                <div className={`h-8 w-0.5 ${isComplete ? 'bg-green-500' : 'bg-gray-200'}`} />
                                                            )}
                                                        </div>
                                                        <div className={`pb-8 ${i === statusFlow.length - 1 ? 'pb-0' : ''}`}>
                                                            <p className={`font-medium ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                                                                {step.label}
                                                            </p>
                                                            {isCurrent && (
                                                                <p className="text-sm text-green-600">Current</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Items</h2>
                                <div className="divide-y">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                                                {item.product?.images?.[0]?.url ? (
                                                    <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Package className="h-8 w-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <Link href={item.product ? shop.show({ product: item.product.slug }).url : '#'} className="font-medium text-gray-900 hover:text-green-600">
                                                    {item.product?.name ?? item.product_name}
                                                </Link>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity} x ${(item.unit_price ?? item.price).toFixed(2)}</p>
                                                <p className="mt-1 font-semibold text-gray-900">${item.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Shipping Address */}
                            <Card className="border-0 shadow-sm lg:col-span-2">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-green-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                                    </div>
                                    {order.address ? (
                                        <div className="text-sm text-gray-600">
                                            <p className="font-medium text-gray-900">{order.address.full_name}</p>
                                            <p>{order.address.street_address}</p>
                                            <p>{order.address.city}, {order.address.state} {order.address.postal_code}</p>
                                            <p>{order.address.country}</p>
                                            <p>{order.address.phone}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No address on file</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment & Totals */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-green-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Method</span>
                                            <span className="font-medium text-gray-900 capitalize">{order.payment_method || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Status</span>
                                            <Badge className={order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                                {order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'N/A'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span>${order.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Shipping</span>
                                            <span>${order.shipping_cost.toFixed(2)}</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Discount</span>
                                                <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between border-t pt-2 text-base font-bold">
                                            <span className="text-gray-900">Total</span>
                                            <span className="text-green-600">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = function(page: { props: { order: Order } }): { breadcrumbs: { title: string; href: string }[] } {
    return {
        breadcrumbs: [
            { title: 'Dashboard', href: user.dashboard().url },
            { title: 'Orders', href: orders.index().url },
            { title: `#${page.props.order.order_number}`, href: '' },
        ],
    };
};
