import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, CreditCard, StickyNote } from 'lucide-react';
import staff from '@/routes/staff';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import type { Order } from '@/types/ecommerce';

type StaffOrderShowProps = {
    order: Order;
};

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    processing: 'default',
    shipped: 'outline',
    delivered: 'outline',
    cancelled: 'destructive',
};

export default function StaffOrderShow({ order }: StaffOrderShowProps) {
    const { currency } = usePage().props as { currency?: string };
    const statusForm = useForm({ status: order.status });
    const notesForm = useForm({ staff_notes: order.staff_notes || '' });

    function handleStatusUpdate(e: React.FormEvent) {
        e.preventDefault();
        statusForm.patch(staff.orders.status(order.id).url);
    }

    function handleNotesUpdate(e: React.FormEvent) {
        e.preventDefault();
        notesForm.post(staff.orders.notes(order.id).url);
    }

    return (
        <>
            <Head title={`Order ${order.order_number}`} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <Link href={staff.orders.index().url} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1">
                        <ArrowLeft className="size-4" />
                        Back to Orders
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Order {order.order_number}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <Badge variant={statusColors[order.status] || 'default'} className="capitalize text-sm px-3 py-1">
                            {order.status}
                        </Badge>
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
                                                    <td className="py-3"><Price amount={item.price} currency={currency} /></td>
                                                    <td className="py-3">{item.quantity}</td>
                                                    <td className="py-3 text-right font-medium"><Price amount={item.total} currency={currency} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={4} className="pt-3 text-sm text-muted-foreground text-right">Subtotal</td>
                                                <td className="pt-3 text-sm text-right"><Price amount={order.subtotal} currency={currency} /></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className="text-sm text-muted-foreground text-right">Shipping</td>
                                                <td className="text-sm text-right"><Price amount={order.shipping_cost} currency={currency} /></td>
                                            </tr>
                                            {order.discount > 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-sm text-muted-foreground text-right">Discount</td>
                                                    <td className="text-sm text-right text-emerald-600">-<Price amount={order.discount} currency={currency} /></td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td colSpan={4} className="text-sm text-muted-foreground text-right">Tax</td>
                                                <td className="text-sm text-right"><Price amount={order.tax} currency={currency} /></td>
                                            </tr>
                                            <tr className="border-t">
                                                <td colSpan={4} className="pt-3 font-semibold text-right">Total</td>
                                                <td className="pt-3 font-semibold text-right"><Price amount={order.total} currency={currency} /></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
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
                                    <Button type="submit" disabled={statusForm.processing}>Update</Button>
                                </form>
                                {statusForm.errors.status && <p className="text-sm text-destructive mt-2">{statusForm.errors.status}</p>}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <StickyNote className="size-4" />
                                    Staff Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleNotesUpdate} className="space-y-3">
                                    <textarea
                                        value={notesForm.data.staff_notes}
                                        onChange={(e) => notesForm.setData('staff_notes', e.target.value)}
                                        rows={4}
                                        className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        placeholder="Add notes about this order..."
                                    />
                                    <Button type="submit" disabled={notesForm.processing}>Save Notes</Button>
                                    {notesForm.errors.staff_notes && <p className="text-sm text-destructive">{notesForm.errors.staff_notes}</p>}
                                </form>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

StaffOrderShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: staff.dashboard().url },
        { title: 'Orders', href: staff.orders.index().url },
        { title: 'Details', href: '#' },
    ],
};
