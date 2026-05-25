import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import checkout from '@/routes/checkout';
import shop from '@/routes/shop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    MapPin,
    CreditCard,
    Banknote,
    Truck,
    Percent,
    ChevronLeft,
    Trash2,
    Package,
    Plus,
    Minus,
} from 'lucide-react';
import type { Address, CartItem, DeliveryMethod } from '@/types/ecommerce';

interface Props {
    cartItems: CartItem[];
    addresses: Address[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    couponCode: string | null;
    [key: string]: unknown;
}

export default function CheckoutIndex() {
    const { cartItems, addresses, subtotal, shipping, discount, total, couponCode } = usePage<Props>().props;
    const { currency } = usePage().props as { currency?: string };

    const { data, setData, post, processing, errors } = useForm({
        address_id: addresses[0]?.id || '',
        delivery_method: 'standard' as string,
        payment_method: 'cod' as string,
        coupon_code: '',
        notes: '',
    });

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [applyCoupon, setApplyCoupon] = useState(false);

    const deliveryMethods: DeliveryMethod[] = [
        { id: 1, name: 'Standard', description: '5-7 business days', price: 4.99, estimated_days: '5-7' },
        { id: 2, name: 'Express', description: '2-3 business days', price: 12.99, estimated_days: '2-3' },
        { id: 3, name: 'Next Day', description: 'Delivery by tomorrow', price: 24.99, estimated_days: '1' },
    ];

    const handlePlaceOrder = () => {
        post(checkout.process().url, {
            preserveScroll: true,
            onError: () => { },
        });
    };

    const handleCouponApply = () => {
        setApplyCoupon(false);
    };

    const shippingCost = deliveryMethods.find((m) => m.name.toLowerCase().replace(' ', '_') === data.delivery_method)?.price || 0;

    return (
        <>
            <Head title="Checkout" />

            <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-8 text-white lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-2xl font-bold md:text-3xl">Checkout</h1>
                    <p className="text-green-100">Complete your order</p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Forms */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Shipping Address */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-green-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                                        {showAddressForm ? 'Select Saved' : 'Add New'}
                                    </Button>
                                </div>

                                {showAddressForm ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="full_name">Full Name</Label>
                                            <Input id="full_name" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input id="phone" placeholder="+1 234 567 890" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label htmlFor="street">Street Address</Label>
                                            <Input id="street" placeholder="123 Main St" />
                                        </div>
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" placeholder="New York" />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State</Label>
                                            <Input id="state" placeholder="NY" />
                                        </div>
                                        <div>
                                            <Label htmlFor="zip">ZIP Code</Label>
                                            <Input id="zip" placeholder="10001" />
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <Input id="country" placeholder="United States" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.length === 0 ? (
                                            <p className="text-sm text-gray-500">No saved addresses. Add a new one.</p>
                                        ) : (
                                            addresses.map((addr) => (
                                                <label
                                                    key={addr.id}
                                                    className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${
                                                        data.address_id === addr.id
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address_id"
                                                        value={addr.id}
                                                        checked={data.address_id === addr.id}
                                                        onChange={(e) => setData('address_id', Number(e.target.value))}
                                                        className="mt-1 h-4 w-4 accent-green-600"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900">{addr.name}</p>
                                                            {addr.is_default && (
                                                                <Badge className="bg-green-100 text-green-700 text-xs">Default</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                                                        <p className="text-sm text-gray-500">{addr.phone}</p>
                                                    </div>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Delivery Method */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-green-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Delivery Method</h2>
                                </div>
                                <div className="space-y-3">
                                    {deliveryMethods.map((dm) => {
                                        const dmKey = dm.name.toLowerCase().replace(' ', '_');
                                        return (
                                            <label
                                                key={dm.id}
                                                className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                                                    data.delivery_method === dmKey
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <input
                                                        type="radio"
                                                        name="delivery_method"
                                                        value={dmKey}
                                                        checked={data.delivery_method === dmKey}
                                                        onChange={(e) => setData('delivery_method', e.target.value)}
                                                        className="mt-1 h-4 w-4 accent-green-600"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{dm.name}</p>
                                                        <p className="text-sm text-gray-500">{dm.description}</p>
                                                    </div>
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {dm.price === 0 ? 'Free' : <Price amount={dm.price} currency={currency} />}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { value: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
                                        { value: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
                                        { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard, desc: 'Direct bank payment' },
                                    ].map((pm) => (
                                        <label
                                            key={pm.value}
                                            className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                                                data.payment_method === pm.value
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={pm.value}
                                                checked={data.payment_method === pm.value}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="h-4 w-4 accent-green-600"
                                            />
                                            <pm.icon className={`h-5 w-5 ${data.payment_method === pm.value ? 'text-green-600' : 'text-gray-400'}`} />
                                            <div>
                                                <p className="font-medium text-gray-900">{pm.label}</p>
                                                <p className="text-sm text-gray-500">{pm.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <Label htmlFor="notes">Order Notes (Optional)</Label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Special instructions for delivery"
                                    className="mt-2 min-h-[100px] w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8 border-0 shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

                                {/* Items */}
                                <div className="mb-4 space-y-3">
                                    {cartItems.length === 0 ? (
                                        <div className="flex flex-col items-center py-8 text-center">
                                            <Package className="mb-3 h-12 w-12 text-gray-300" />
                                            <p className="text-sm text-gray-500">Your cart is empty</p>
                                            <Link href={shop.index()}>
                                                <Button variant="outline" size="sm" className="mt-3">
                                                    Continue Shopping
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div key={item.id} className="flex items-start gap-3">
                                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                                                    {item.product.images?.[0]?.url ? (
                                                        <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <Package className="h-6 w-6 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    <Price amount={item.total} currency={currency} className="text-sm font-semibold text-gray-900" />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="space-y-3 border-t pt-4">
                                    {/* Coupon */}
                                    <div>
                                        {couponCode ? (
                                            <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2">
                                                <div className="flex items-center gap-2 text-sm text-green-700">
                                                    <Percent className="h-4 w-4" />
                                                    {couponCode}
                                                </div>
                                                <button className="text-sm text-red-500 hover:text-red-600">Remove</button>
                                            </div>
                                        ) : (
                                            applyCoupon ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={data.coupon_code}
                                                        onChange={(e) => setData('coupon_code', e.target.value)}
                                                        placeholder="Enter coupon code"
                                                        className="h-9 text-sm"
                                                    />
                                                    <Button size="sm" className="h-9 bg-green-600 hover:bg-green-700" onClick={handleCouponApply}>
                                                        Apply
                                                    </Button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setApplyCoupon(true)}
                                                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                                                >
                                                    <Percent className="h-4 w-4" />
                                                    Have a coupon code?
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <Price amount={subtotal} currency={currency} className="text-gray-900" />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-gray-900">
                                            {shippingCost === 0 ? 'Free' : <Price amount={shippingCost} currency={currency} />}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Discount</span>
                                            <span className="text-green-600">-<Price amount={discount} currency={currency} /></span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                        <span className="text-gray-900">Total</span>
                                        <Price amount={total} currency={currency} className="text-green-600" />
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    disabled={cartItems.length === 0 || processing}
                                    onClick={handlePlaceOrder}
                                >
                                    Place Order
                                </Button>

                                <p className="mt-3 text-center text-xs text-gray-400">
                                    By placing this order, you agree to our Terms & Conditions
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
