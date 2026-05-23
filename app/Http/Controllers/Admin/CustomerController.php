<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query->withCount('orders')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return inertia('admin/customers/index', ['customers' => $customers]);
    }

    public function show(User $user)
    {
        if (! $user->isCustomer()) {
            abort(404);
        }

        $user->loadCount('orders', 'reviews');

        $orders = $user->orders()
            ->with(['items'])
            ->latest()
            ->paginate(10);

        return inertia('admin/customers/show', [
            'customer' => $user,
            'orders' => $orders,
        ]);
    }
}
