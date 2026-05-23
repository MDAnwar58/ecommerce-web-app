<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Auth::user()->orders()
            ->with(['items', 'address'])
            ->latest()
            ->paginate(10);

        return inertia('user/orders/index', ['orders' => $orders]);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items.product.primaryImage', 'address', 'assignedStaff']);

        return inertia('user/orders/show', ['order' => $order]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|string',
            'shipping_method' => 'nullable|string',
            'notes' => 'nullable|string|max:500',
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

            $shippingCost = 0;
            $discount = 0;
            $tax = $subtotal * 0.1;
            $total = $subtotal + $shippingCost + $tax - $discount;

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $user->id,
                'address_id' => $address->id,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'shipping_method' => $data['shipping_method'] ?? 'standard',
                'status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cartItems as $item) {
                $price = $item->variant?->price ?? $item->product->price;

                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->variant?->sku ?? $item->product->sku,
                    'price' => $price,
                    'quantity' => $item->quantity,
                    'total' => $price * $item->quantity,
                ]);

                if ($item->product->track_inventory) {
                    if ($item->variant) {
                        $item->variant->decrement('stock_quantity', $item->quantity);
                    } else {
                        $item->product->decrement('stock_quantity', $item->quantity);
                    }
                }

                $item->product->increment('sold_count', $item->quantity);
            }

            $user->cartItems()->delete();

            return $order;
        });

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order placed successfully.');
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        if (! in_array($order->status, ['pending', 'processing'])) {
            return back()->withErrors(['order' => 'This order cannot be cancelled.']);
        }

        DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            foreach ($order->items as $item) {
                if ($item->product->track_inventory) {
                    if ($item->variant) {
                        $item->variant->increment('stock_quantity', $item->quantity);
                    } else {
                        $item->product->increment('stock_quantity', $item->quantity);
                    }
                }
            }
        });

        return back()->with('success', 'Order cancelled.');
    }
}
