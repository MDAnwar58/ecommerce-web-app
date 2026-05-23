<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::where('assigned_staff_id', Auth::id())
            ->with(['user', 'items']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        return inertia('staff/orders/index', [
            'orders' => $orders,
            'status' => $statuses,
        ]);
    }

    public function show(Order $order)
    {
        if ($order->assigned_staff_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['user', 'items.product.primaryImage', 'address']);

        return inertia('staff/orders/show', ['order' => $order]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        if ($order->assigned_staff_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'status' => 'required|string|in:processing,shipped,delivered',
        ]);

        $timestamps = [];
        if ($data['status'] === 'shipped') {
            $timestamps['shipped_at'] = now();
        }
        if ($data['status'] === 'delivered') {
            $timestamps['delivered_at'] = now();
        }

        $order->update(array_merge(['status' => $data['status']], $timestamps));

        return back()->with('success', 'Order status updated.');
    }

    public function updateNotes(Request $request, Order $order)
    {
        if ($order->assigned_staff_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'staff_notes' => 'required|string|max:2000',
        ]);

        $order->update($data);

        return back()->with('success', 'Notes updated.');
    }
}
