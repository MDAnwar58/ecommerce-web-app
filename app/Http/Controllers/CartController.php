<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Auth::user()->cartItems()
            ->with(['product.primaryImage', 'variant'])
            ->latest()
            ->get();

        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:100',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $product = Product::findOrFail($data['product_id']);

        if (! $product->is_active) {
            return back()->withErrors(['product_id' => 'This product is not available.']);
        }

        if ($product->track_inventory && $product->stock_quantity < $data['quantity']) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        if ($data['product_variant_id']) {
            $variant = ProductVariant::findOrFail($data['product_variant_id']);
            if (! $variant->is_active || ($variant->stock_quantity < $data['quantity'])) {
                return back()->withErrors(['product_variant_id' => 'Variant not available or out of stock.']);
            }
        }

        $existing = Auth::user()->cartItems()
            ->where('product_id', $data['product_id'])
            ->where('product_variant_id', $data['product_variant_id'])
            ->first();

        if ($existing) {
            $existing->increment('quantity', $data['quantity']);
        } else {
            Auth::user()->cartItems()->create($data);
        }

        return back()->with('success', 'Item added to cart.');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $this->authorizeAccess($cartItem);

        $data = $request->validate([
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        if ($cartItem->product->track_inventory && $cartItem->product->stock_quantity < $data['quantity']) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        $cartItem->update($data);

        return back()->with('success', 'Cart updated.');
    }

    public function destroy(CartItem $cartItem)
    {
        $this->authorizeAccess($cartItem);

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }

    public function count()
    {
        $count = Auth::user()->cartItems()->sum('quantity');

        return response()->json(['count' => $count]);
    }

    private function authorizeAccess(CartItem $cartItem): void
    {
        if ($cartItem->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
