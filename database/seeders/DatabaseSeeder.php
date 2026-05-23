<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@shophub.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@shophub.com',
            'password' => bcrypt('password'),
            'role' => 'staff',
            'permissions' => ['process_orders', 'manage_inventory', 'manage_products', 'customer_support'],
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@shophub.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            CouponSeeder::class,
            SettingsSeeder::class,
        ]);
    }
}
