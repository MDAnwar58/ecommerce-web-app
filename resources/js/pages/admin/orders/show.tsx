import { Head, useForm, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, CreditCard, Radio } from 'lucide-react';
import admin from '@/routes/admin';
import type { Order, User } from '@/types/ecommerce';
import { useEffect, useRef } from 'react';

const POLL_INTERVAL = 10000;

type OrderShowProps = {
    order: Order;
    staffList?: User[];
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

export default function OrderShow({ order, staffList = [] }: OrderShowProps) {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            router.reload({ only: ['order'] });
        }, POLL_INTERVAL);

        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);
    const statusForm = useForm({ status: order.status });
    const assignForm = useForm({ staff_id: order.assigned_staff_id ? String(order.assigned_staff_id) : '' });
    function handleStatusUpdate(e: React.FormEvent) {
        e.preventDefault();
        statusForm.patch(admin.orders.status(order.id).url);
    }

    function handleAssign(e: React.FormEvent) {
        e.preventDefault();
        assignForm.post(admin.orders.assign(order.id).url);
    }

    return (
        <>
            <Head title={`Order ${order.order_number}`} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <Link href={admin.orders.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Orders
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Order {order.order_number}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1.5 text-xs">
                                <Radio className="size-3 text-emerald-500 animate-pulse" />
                                Live
                            </Badge>
                            <Badge variant={statusColors[order.status] || 'default'} className="capitalize text-sm px-3 py-1">
                                {order.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="pb-3 font-medium text-muted-foreground">Product</th>
                                                <th className="pb-3 font-medium text-muted-foreground">SKU</th>
                                                <th className="pb-3 font-medium text-muted-foreground">Price</th>
                                                <th className="pb-3 font-medium text-muted-foreground">Qty</th>
                                                <th className="pb-3 font-medium text-muted-foreground text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item) => (
                                                <tr key={item.id} className="border-b last:border-0">
                                                    <td className="py-3 font-medium">{item.product_name}</td>
                                                    <td className="py-3 text-muted-foreground font-mono text-xs">{item.product_sku}</td>
                                                    <td className="py-3">{formatCurrency(item.price)}</td>
                                                    <td className="py-3">{item.quantity}</td>
                                                    <td className="py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={4} className="pt-3 text-sm text-muted-foreground text-right">Subtotal</td>
                                                <td className="pt-3 text-sm text-right">{formatCurrency(order.subtotal)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className="text-sm text-muted-foreground text-right">Shipping</td>
                                                <td className="text-sm text-right">{formatCurrency(order.shipping_cost)}</td>
                                            </tr>
                                            {order.discount > 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-sm text-muted-foreground text-right">Discount</td>
                                                    <td className="text-sm text-right text-emerald-600">-{formatCurrency(order.discount)}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td colSpan={4} className="text-sm text-muted-foreground text-right">Tax</td>
                                                <td className="text-sm text-right">{formatCurrency(order.tax)}</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td colSpan={4} className="pt-3 font-semibold text-right">Total</td>
                                                <td className="pt-3 font-semibold text-right">{formatCurrency(order.total)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status Update</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleStatusUpdate} className="flex items-end gap-3">
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="status">Order Status</Label>
                                        <Select value={statusForm.data.status} onValueChange={(v) => statusForm.setData('status', v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" disabled={statusForm.processing}>Update Status</Button>
                                </form>
                                {statusForm.errors.status && <p className="text-sm text-destructive mt-2">{statusForm.errors.status}</p>}
                            </CardContent>
                        </Card>

                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><MapPin className="size-4" /> Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.address ? (
                                    <div className="space-y-1 text-sm">
                                        <p className="font-medium">{order.address.full_name}</p>
                                        <p className="text-muted-foreground">{order.address.street_address}</p>
                                        {order.address.apartment && <p className="text-muted-foreground">{order.address.apartment}</p>}
                                        <p className="text-muted-foreground">
                                            {order.address.city}, {order.address.state} {order.address.postal_code}
                                        </p>
                                        <p className="text-muted-foreground">{order.address.country}</p>
                                        <p className="text-muted-foreground">{order.address.phone}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No address on file</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><CreditCard className="size-4" /> Payment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="capitalize">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                                        {order.payment_status}
                                    </Badge>
                                </div>
                                {order.coupon_code && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Coupon</span>
                                        <span className="font-mono text-xs">{order.coupon_code}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Assign Staff</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAssign} className="space-y-3">
                                    <Select value={assignForm.data.staff_id} onValueChange={(v) => assignForm.setData('staff_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select staff..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {staffList.map((staff) => (
                                                <SelectItem key={staff.id} value={String(staff.id)}>{staff.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="submit" disabled={assignForm.processing} className="w-full">Assign</Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                {order.shipped_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipped</span>
                                        <span>{new Date(order.shipped_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {order.delivered_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivered</span>
                                        <span>{new Date(order.delivered_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {order.cancelled_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cancelled</span>
                                        <span>{new Date(order.cancelled_at).toLocaleDateString()}</span>
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

OrderShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Orders', href: admin.orders.index().url },
        { title: 'Order Details', href: '#' },
    ],
};
