<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    public function index()
    {
        $staff = User::where('role', 'staff')
            ->with('manager')
            ->withCount('assignedOrders')
            ->latest()
            ->get();

        return inertia('admin/staff/index', ['staff' => $staff]);
    }

    public function create()
    {
        return inertia('admin/staff/form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'staff';
        $data['is_active'] = true;
        $data['managed_by'] = auth()->id();

        User::create($data);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff member created successfully.');
    }

    public function edit(User $user)
    {
        if (! $user->isStaff()) {
            abort(404);
        }

        return inertia('admin/staff/form', ['staff' => $user]);
    }

    public function update(Request $request, User $user)
    {
        if (! $user->isStaff()) {
            abort(404);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff updated successfully.');
    }

    public function destroy(User $user)
    {
        if (! $user->isStaff()) {
            abort(404);
        }

        $user->update(['is_active' => false]);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Staff deactivated successfully.');
    }
}
