<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'primaryImage'])
            ->latest()
            ->paginate(15);

        return inertia('staff/products/index', ['products' => $products]);
    }

    public function edit(Product $product)
    {
        $product->load(['images', 'productVariants']);

        $categories = Category::active()->parents()
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        return inertia('staff/products/form', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'stock_quantity' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
        ]);

        $product->update($data);

        return redirect()->route('staff.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function updateStock(Request $request, Product $product)
    {
        $data = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product->update($data);

        return back()->with('success', 'Stock updated successfully.');
    }
}
