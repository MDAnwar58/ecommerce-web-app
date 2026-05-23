<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return inertia('admin/brands/index', [
            'brands' => $brands,
        ]);
    }

    public function create()
    {
        return inertia('admin/brands/form');
    }

    public function edit(Brand $brand)
    {
        return inertia('admin/brands/form', [
            'brand' => $brand,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug',
            'description' => 'nullable|string|max:1000',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        Brand::create($data);

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand created successfully.');
    }

    public function update(Request $request, Brand $brand)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug,'.$brand->id,
            'description' => 'nullable|string|max:1000',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $brand->update($data);

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        $productsCount = Product::where('brand', $brand->slug)->count();

        if ($productsCount > 0) {
            return back()->withErrors(['brand' => "Cannot delete brand. {$productsCount} product(s) are using this brand."]);
        }

        $brand->delete();

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand deleted successfully.');
    }
}
