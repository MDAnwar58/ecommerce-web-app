<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        $currentRevenue = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->where('created_at', '>=', $currentMonth)
            ->sum('total');

        $lastRevenue = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->sum('total');

        $currentOrders = Order::where('created_at', '>=', $currentMonth)->count();
        $lastOrders = Order::where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->count();

        $stats = [
            'total_revenue' => Order::whereNotIn('status', ['cancelled', 'refunded'])->sum('total'),
            'total_orders' => Order::count(),
            'total_products' => Product::count(),
            'total_customers' => User::where('role', 'user')->count(),
            'revenue_growth' => $lastRevenue > 0 ? round((($currentRevenue - $lastRevenue) / $lastRevenue) * 100) : 0,
            'orders_growth' => $lastOrders > 0 ? round((($currentOrders - $lastOrders) / $lastOrders) * 100) : 0,
        ];

        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(10)
            ->get();

        $driver = Config::get('database.default');
        $monthFormat = match ($driver) {
            'pgsql' => "TO_CHAR(created_at, 'YYYY-MM')",
            'sqlite' => "strftime('%Y-%m', created_at)",
            default => "DATE_FORMAT(created_at, '%Y-%m')",
        };

        $revenueData = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->select(
                DB::raw("$monthFormat as month"),
                DB::raw('SUM(total) as revenue')
            )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $topProducts = Product::withCount(['orderItems as items_sold' => function ($q) {
            $q->whereHas('order', fn ($q) => $q->whereNotIn('status', ['cancelled', 'refunded']));
        }])
            ->orderByDesc('items_sold')
            ->take(5)
            ->get(['id', 'name']);

        $topProductsData = $topProducts->map(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'sold' => (int) $p->items_sold,
            'revenue' => (float) Order::whereHas('items', fn ($q) => $q->where('product_id', $p->id))
                ->whereNotIn('status', ['cancelled', 'refunded'])
                ->sum('total'),
        ]);

        return inertia('admin/dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'revenueData' => $revenueData,
            'topProducts' => $topProductsData,
        ]);
    }
}
