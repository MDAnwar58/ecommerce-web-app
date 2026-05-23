<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Grocery',
                'slug' => 'grocery',
                'description' => 'Fresh groceries, rice, oil, spices, and daily essentials',
                'is_active' => true,
                'sort_order' => 1,
                'children' => [
                    ['name' => 'Rice & Grains', 'slug' => 'rice-grains', 'description' => 'Premium rice and grain products', 'is_active' => true, 'sort_order' => 1],
                    ['name' => 'Oil & Ghee', 'slug' => 'oil-ghee', 'description' => 'Cooking oils and ghee', 'is_active' => true, 'sort_order' => 2],
                    ['name' => 'Spices', 'slug' => 'spices', 'description' => 'Whole and ground spices', 'is_active' => true, 'sort_order' => 3],
                    ['name' => 'Beverages', 'slug' => 'beverages', 'description' => 'Tea, coffee, juice, and drinks', 'is_active' => true, 'sort_order' => 4],
                    ['name' => 'Snacks', 'slug' => 'snacks', 'description' => 'Chips, biscuits, and packaged snacks', 'is_active' => true, 'sort_order' => 5],
                ],
            ],
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Smartphones, laptops, accessories, and gadgets',
                'is_active' => true,
                'sort_order' => 2,
                'children' => [
                    ['name' => 'Smartphones', 'slug' => 'smartphones', 'description' => 'Latest smartphones and accessories', 'is_active' => true, 'sort_order' => 1],
                    ['name' => 'Laptops', 'slug' => 'laptops', 'description' => 'Notebooks and laptops', 'is_active' => true, 'sort_order' => 2],
                    ['name' => 'Headphones', 'slug' => 'headphones', 'description' => 'Wireless and wired audio', 'is_active' => true, 'sort_order' => 3],
                    ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Chargers, cables, and gadgets', 'is_active' => true, 'sort_order' => 4],
                ],
            ],
            [
                'name' => 'Fashion',
                'slug' => 'fashion',
                'description' => 'Clothing, accessories, and footwear for men and women',
                'is_active' => true,
                'sort_order' => 3,
                'children' => [
                    ['name' => "Men's Clothing", 'slug' => 'mens-clothing', 'description' => 'Shirts, pants, and suits', 'is_active' => true, 'sort_order' => 1],
                    ['name' => "Women's Clothing", 'slug' => 'womens-clothing', 'description' => 'Dresses, tops, and ethnic wear', 'is_active' => true, 'sort_order' => 2],
                    ['name' => 'Footwear', 'slug' => 'footwear', 'description' => 'Shoes, sandals, and sneakers', 'is_active' => true, 'sort_order' => 3],
                    ['name' => 'Accessories', 'slug' => 'fashion-accessories', 'description' => 'Watches, bags, and jewelry', 'is_active' => true, 'sort_order' => 4],
                ],
            ],
            [
                'name' => 'Household',
                'slug' => 'household',
                'description' => 'Home cleaning, kitchenware, and daily essentials',
                'is_active' => true,
                'sort_order' => 4,
                'children' => [
                    ['name' => 'Cleaning Supplies', 'slug' => 'cleaning-supplies', 'description' => 'Detergents, cleaners, and supplies', 'is_active' => true, 'sort_order' => 1],
                    ['name' => 'Kitchenware', 'slug' => 'kitchenware', 'description' => 'Cookware, utensils, and tools', 'is_active' => true, 'sort_order' => 2],
                    ['name' => 'Home Decor', 'slug' => 'home-decor', 'description' => 'Decorative items and furnishings', 'is_active' => true, 'sort_order' => 3],
                ],
            ],
            [
                'name' => 'Daily Essentials',
                'slug' => 'daily-essentials',
                'description' => 'Personal care, health, and hygiene products',
                'is_active' => true,
                'sort_order' => 5,
                'children' => [
                    ['name' => 'Personal Care', 'slug' => 'personal-care', 'description' => 'Skincare, haircare, and bath', 'is_active' => true, 'sort_order' => 1],
                    ['name' => 'Health & Wellness', 'slug' => 'health-wellness', 'description' => 'Vitamins, supplements, and health', 'is_active' => true, 'sort_order' => 2],
                    ['name' => 'Baby Care', 'slug' => 'baby-care', 'description' => 'Diapers, wipes, and baby products', 'is_active' => true, 'sort_order' => 3],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);
            $parent = Category::create($categoryData);
            foreach ($children as $childData) {
                $childData['parent_id'] = $parent->id;
                Category::create($childData);
            }
        }
    }
}
