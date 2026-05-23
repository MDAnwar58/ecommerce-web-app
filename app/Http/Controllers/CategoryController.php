<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->parents()
            ->with(['children' => fn ($q) => $q->active()->withCount(['products' => fn ($p) => $p->active()])])
            ->withCount(['products' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }
}
