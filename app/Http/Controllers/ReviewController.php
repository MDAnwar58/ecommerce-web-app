<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        $purchased = $user->orders()
            ->where('id', $data['order_id'])
            ->where('status', 'delivered')
            ->whereHas('items', fn ($q) => $q->where('product_id', $data['product_id']))
            ->exists();

        if (! $purchased) {
            return back()->withErrors(['order_id' => 'You can only review products you have purchased and received.']);
        }

        $existing = $user->reviews()
            ->where('product_id', $data['product_id'])
            ->where('order_id', $data['order_id'])
            ->exists();

        if ($existing) {
            return back()->withErrors(['product_id' => 'You have already reviewed this product for this order.']);
        }

        $review = $user->reviews()->create([
            'product_id' => $data['product_id'],
            'order_id' => $data['order_id'],
            'rating' => $data['rating'],
            'comment' => $data['comment'],
            'is_approved' => false,
        ]);

        return back()->with('success', 'Review submitted successfully and pending approval.');
    }
}
