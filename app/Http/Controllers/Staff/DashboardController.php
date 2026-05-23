<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'assigned_count' => Order::where('assigned_staff_id', Auth::id())->count(),
            'pending_count' => Order::where('assigned_staff_id', Auth::id())->where('status', 'pending')->count(),
            'processing_count' => Order::where('assigned_staff_id', Auth::id())->where('status', 'processing')->count(),
            'delivered_today' => Order::where('assigned_staff_id', Auth::id())
                ->whereDate('delivered_at', today())
                ->count(),
        ];

        $assignedOrders = Order::where('assigned_staff_id', Auth::id())
            ->with(['user', 'items'])
            ->latest()
            ->take(10)
            ->get();

        return inertia('staff/dashboard', [
            'stats' => $stats,
            'assignedOrders' => $assignedOrders,
        ]);
    }
}
