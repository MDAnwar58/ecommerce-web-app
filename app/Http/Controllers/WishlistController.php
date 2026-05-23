<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $items = Auth::user()->wishlists()
            ->with(['product.primaryImage', 'product.category'])
            ->latest()
            ->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existing = Auth::user()->wishlists()
            ->where('product_id', $data['product_id'])
            ->first();

        if ($existing) {
            return back()->with('info', 'Product is already in your wishlist.');
        }

        Auth::user()->wishlists()->create($data);

        return back()->with('success', 'Added to wishlist.');
    }

    public function destroy(Product $product)
    {
        Auth::user()->wishlists()
            ->where('product_id', $product->id)
            ->delete();

        return back()->with('success', 'Removed from wishlist.');
    }
}
