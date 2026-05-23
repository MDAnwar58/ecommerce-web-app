<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => 500,
            'max_discount' => 500,
            'usage_limit' => 100,
            'is_active' => true,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(3),
        ]);

        Coupon::create([
            'code' => 'FLASH50',
            'type' => 'fixed',
            'value' => 50,
            'min_order_amount' => 300,
            'usage_limit' => 50,
            'is_active' => true,
            'starts_at' => now(),
            'expires_at' => now()->addDays(7),
        ]);

        Coupon::create([
            'code' => 'SAVE20',
            'type' => 'percentage',
            'value' => 20,
            'min_order_amount' => 1000,
            'max_discount' => 1000,
            'usage_limit' => 200,
            'is_active' => true,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(1),
        ]);

        Coupon::create([
            'code' => 'FREESHIP',
            'type' => 'fixed',
            'value' => 100,
            'min_order_amount' => 2000,
            'usage_limit' => null,
            'is_active' => true,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(2),
        ]);
    }
}
