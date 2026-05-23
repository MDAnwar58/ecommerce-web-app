<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $cartItems = $user->cartItems()
            ->with(['product.primaryImage', 'variant'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('shop.index');
        }

        $addresses = $user->addresses()->latest()->get();

        $total = $cartItems->sum(function ($item) {
            $price = $item->variant?->price ?? $item->product->price;

            return $price * $item->quantity;
        });

        return inertia('checkout/index', [
            'cartItems' => $cartItems,
            'addresses' => $addresses,
            'total' => $total,
        ]);
    }

    public function process(Request $request)
    {
        $data = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|string',
            'shipping_method' => 'nullable|string',
            'notes' => 'nullable|string|max:500',
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ]);

        $user = Auth::user();
        $cartItems = $user->cartItems()->with(['product', 'variant'])->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        $address = $user->addresses()->findOrFail($data['address_id']);

        $order = DB::transaction(function () use ($user, $cartItems, $address, $data) {
            $subtotal = 0;

            foreach ($cartItems as $item) {
                $price = $item->variant?->price ?? $item->product->price;
                $subtotal += $price * $item->quantity;
            }

            $discount = 0;
            if (! empty($data['coupon_code'])) {
                $coupon = Coupon::where('code', $data['coupon_code'])->first();
                if ($coupon && $coupon->isValid()) {
                    if ($subtotal >= $coupon->min_order_amount) {
                        $discount = $coupon->type === 'percentage'
                            ? min($subtotal * $coupon->value / 100, $coupon->max_discount ?? PHP_FLOAT_MAX)
                            : min($coupon->value, $coupon->max_discount ?? $coupon->value);
                    }
                }
            }

            $shippingCost = 0;
            $tax = ($subtotal - $discount) * 0.1;
            $total = $subtotal + $shippingCost + $tax - $discount;

            $order = Order::create([
                'order_number' => \App\Models\Order::generateOrderNumber(),
                'user_id' => $user->id,
                'address_id' => $address->id,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
                'coupon_code' => $data['coupon_code'] ?? null,
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'shipping_method' => $data['shipping_method'] ?? 'standard',
                'status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->variant?->sku ?? $item->product->sku,
                    'price' => $item->variant?->price ?? $item->product->price,
                    'quantity' => $item->quantity,
                    'total' => ($item->variant?->price ?? $item->product->price) * $item->quantity,
                ]);

                if ($item->product->track_inventory) {
                    $item->variant
                        ? $item->variant->decrement('stock_quantity', $item->quantity)
                        : $item->product->decrement('stock_quantity', $item->quantity);
                }

                $item->product->increment('sold_count', $item->quantity);
            }

            $user->cartItems()->delete();

            return $order;
        });

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order placed successfully.');
    }
}
