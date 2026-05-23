<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with(['parent', 'children'])
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return inertia('admin/categories/index', ['categories' => $categories]);
    }

    public function create()
    {
        $categories = Category::active()->parents()
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        return inertia('admin/categories/form', ['categories' => $categories]);
    }

    public function edit(Category $category)
    {
        $categories = Category::active()->parents()
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        return inertia('admin/categories/form', [
            'category' => $category->loadCount('products'),
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['is_active'] = $data['is_active'] ?? true;
        $data['sort_order'] = $data['sort_order'] ?? 0;

        Category::create($data);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['is_active'] = $data['is_active'] ?? true;
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $category->update($data);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        if ($category->children()->exists()) {
            return back()->withErrors(['delete' => 'Cannot delete category with subcategories.']);
        }

        if ($category->products()->exists()) {
            return back()->withErrors(['delete' => 'Cannot delete category with associated products.']);
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
