<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return inertia('admin/settings/index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|max:255',
            'settings.*.value' => 'nullable',
            'settings.*.group' => 'nullable|string|max:255',
        ]);

        foreach ($data['settings'] as $setting) {
            Setting::setValue($setting['key'], $setting['value'] ?? '');
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
