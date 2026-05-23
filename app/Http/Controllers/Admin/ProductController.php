<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        if (! $request->header('X-Inertia') && ($request->query('search') || $request->query('category'))) {
            return redirect()->route('admin.products.index');
        }

        $query = Product::with(['category', 'primaryImage']);

        $search = $request->input('search');
        $category = $request->input('category');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($category) {
            $query->where('category_id', $category);
        }

        $products = $query->latest()->paginate(15);

        $categories = Category::active()->parents()
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        $activeFilters = [];
        if ($search) {
            $activeFilters['search'] = $search;
        }
        if ($category) {
            $activeFilters['category'] = $category;
        }

        return inertia('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $activeFilters,
        ]);
    }

    public function create()
    {
        $categories = Category::active()->parents()
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        $brands = Brand::active()->orderBy('sort_order')->orderBy('name')->get();

        return inertia('admin/products/form', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0|gt:price',
            'cost_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|max:100|unique:products,sku',
            'barcode' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'track_inventory' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']).'-'.Str::random(6);
        $data['track_inventory'] = $data['track_inventory'] ?? true;
        $data['is_active'] = $data['is_active'] ?? true;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_trending'] = $data['is_trending'] ?? false;

        Product::create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load(['images', 'productVariants']);

        $categories = Category::active()->parents()
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        $brands = Brand::active()->orderBy('sort_order')->orderBy('name')->get();

        return inertia('admin/products/form', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'sku' => ['required', 'string', 'max:100', Rule::unique('products')->ignore($product->id)],
            'barcode' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'track_inventory' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
        ]);

        $data['track_inventory'] = $data['track_inventory'] ?? true;
        $data['is_active'] = $data['is_active'] ?? true;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_trending'] = $data['is_trending'] ?? false;

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->update(['is_active' => false]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deactivated successfully.');
    }
}
