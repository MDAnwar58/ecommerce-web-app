<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = $user->orders()
            ->with(['items'])
            ->latest()
            ->take(5)
            ->get();

        $wishlistCount = $user->wishlists()->count();

        return inertia('user/dashboard', [
            'orders' => $orders,
            'wishlistCount' => $wishlistCount,
        ]);
    }
}
