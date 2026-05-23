<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        $driver = Config::get('database.default');
        $dateFormat = match ($driver) {
            'pgsql' => "TO_CHAR(created_at, 'YYYY-MM-DD')",
            'sqlite' => "strftime('%Y-%m-%d', created_at)",
            default => "DATE_FORMAT(created_at, '%Y-%m-%d')",
        };

        $revenueChart = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->select(
                DB::raw("$dateFormat as date"),
                DB::raw('SUM(total) as revenue')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $salesData = [
            'total_revenue' => Order::whereNotIn('status', ['cancelled', 'refunded'])->sum('total'),
            'today_revenue' => Order::whereNotIn('status', ['cancelled', 'refunded'])
                ->whereDate('created_at', today())
                ->sum('total'),
            'total_orders' => Order::count(),
            'today_orders' => Order::whereDate('created_at', today())->count(),
            'average_order' => Order::whereNotIn('status', ['cancelled', 'refunded'])->avg('total'),
            'total_customers' => User::where('role', 'user')->count(),
            'new_customers_today' => User::where('role', 'user')->whereDate('created_at', today())->count(),
        ];

        $topProducts = Product::with(['primaryImage'])
            ->where('sold_count', '>', 0)
            ->orderByDesc('sold_count')
            ->take(10)
            ->get(['id', 'name', 'slug', 'price', 'sold_count', 'stock_quantity']);

        return inertia('admin/analytics/index', [
            'revenueChart' => $revenueChart,
            'sales' => $salesData,
            'topProducts' => $topProducts,
        ]);
    }
}
