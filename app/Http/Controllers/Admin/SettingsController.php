<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');

        return inertia('admin/settings/index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'store_name' => 'nullable|string|max:255',
            'store_email' => 'nullable|email|max:255',
            'store_phone' => 'nullable|string|max:255',
            'store_address' => 'nullable|string',
            'currency' => 'nullable|string|max:10',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'shipping_cost' => 'nullable|numeric|min:0',
        ]);

        foreach ($data as $key => $value) {
            Setting::setValue($key, $value ?? '');
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
