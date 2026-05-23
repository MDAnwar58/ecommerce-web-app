<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::active()->inStock()->with(['primaryImage', 'category']);

        if ($request->filled('category')) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $categoryIds = $category->children()->pluck('id')->push($category->id);
                $query->whereIn('category_id', $categoryIds);
            }
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $sort = $request->sort;
        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest' => $query->orderByDesc('created_at'),
            'best_selling' => $query->orderByDesc('sold_count'),
            'top_rated' => $query->orderByDesc('rating'),
            default => $query->orderByDesc('created_at'),
        };

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::active()->parents()
            ->withCount(['products' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        $brands = Product::active()->whereNotNull('brand')
            ->select('brand')
            ->distinct()
            ->pluck('brand');

        return inertia('shop/index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $request->only(['category', 'brand', 'min_price', 'max_price', 'rating', 'search', 'sort']),
        ]);
    }

    public function show(Product $product)
    {
        if (! $product->is_active) {
            abort(404);
        }

        $product->load(['images', 'primaryImage', 'category', 'productVariants' => fn ($q) => $q->where('is_active', true)]);

        $reviews = $product->reviews()
            ->where('is_approved', true)
            ->with('user')
            ->latest()
            ->take(10)
            ->get();

        $relatedProducts = Product::active()
            ->inStock()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['primaryImage'])
            ->take(4)
            ->get();

        return inertia('shop/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'reviews' => $reviews,
        ]);
    }

    public function featured()
    {
        return response()->json(
            Product::active()->featured()->inStock()
                ->with(['primaryImage'])->take(8)->get()
        );
    }

    public function trending()
    {
        return response()->json(
            Product::active()->trending()->inStock()
                ->with(['primaryImage'])->take(8)->get()
        );
    }

    public function search(Request $request)
    {
        $search = $request->q;

        $products = Product::active()
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->with(['primaryImage'])
            ->take(10)
            ->get(['id', 'name', 'slug', 'price', 'brand']);

        return response()->json($products);
    }
}
