<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;

class HomeController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::active()
            ->featured()
            ->inStock()
            ->with(['primaryImage', 'category'])
            ->take(8)
            ->get();

        $trendingProducts = Product::active()
            ->trending()
            ->inStock()
            ->with(['primaryImage', 'category'])
            ->take(8)
            ->get();

        $categories = Category::active()
            ->parents()
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        $flashSale = Product::active()
            ->whereNotNull('compare_price')
            ->where('compare_price', '>', 0)
            ->inStock()
            ->with(['primaryImage'])
            ->take(4)
            ->get();

        return inertia('home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'trendingProducts' => $trendingProducts,
            'flashSale' => $flashSale,
        ]);
    }
}
