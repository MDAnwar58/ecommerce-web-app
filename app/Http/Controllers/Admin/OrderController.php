<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items']);

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

        return inertia('admin/orders/index', [
            'orders' => $orders,
            'status' => $request->status,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product.primaryImage', 'address', 'assignedStaff']);

        $staff = User::where('role', 'staff')->where('is_active', true)->get();

        return inertia('admin/orders/show', [
            'order' => $order,
            'staffList' => $staff,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled,refunded',
            'cancellation_reason' => 'required_if:status,cancelled|nullable|string|max:500',
        ]);

        $timestamps = [];
        if ($data['status'] === 'shipped') {
            $timestamps['shipped_at'] = now();
        }
        if ($data['status'] === 'delivered') {
            $timestamps['delivered_at'] = now();
        }
        if ($data['status'] === 'cancelled') {
            $timestamps['cancelled_at'] = now();
        }

        $order->update(array_merge(
            ['status' => $data['status']],
            $data['cancellation_reason'] ? ['cancellation_reason' => $data['cancellation_reason']] : [],
            $timestamps
        ));

        return back()->with('success', 'Order status updated.');
    }

    public function assignStaff(Request $request, Order $order)
    {
        $data = $request->validate([
            'assigned_staff_id' => 'required|exists:users,id',
        ]);

        $staff = User::findOrFail($data['assigned_staff_id']);

        if (! $staff->isStaff()) {
            return back()->withErrors(['assigned_staff_id' => 'Selected user is not staff.']);
        }

        $order->update(['assigned_staff_id' => $staff->id]);

        return back()->with('success', 'Staff assigned to order.');
    }
}
