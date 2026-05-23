<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::create(['key' => 'store_name', 'value' => 'ShopHub', 'group' => 'general']);
        Setting::create(['key' => 'store_email', 'value' => 'support@shophub.com', 'group' => 'general']);
        Setting::create(['key' => 'store_phone', 'value' => '+880-1234-567890', 'group' => 'general']);
        Setting::create(['key' => 'store_address', 'value' => '123 Business Avenue, Dhaka, Bangladesh', 'group' => 'general']);
        Setting::create(['key' => 'currency', 'value' => 'BDT', 'group' => 'general']);
        Setting::create(['key' => 'tax_rate', 'value' => '5', 'group' => 'general']);
        Setting::create(['key' => 'shipping_cost', 'value' => '60', 'group' => 'general']);
        Setting::create(['key' => 'free_shipping_threshold', 'value' => '2000', 'group' => 'general']);
    }
}
