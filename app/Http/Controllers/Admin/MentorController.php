<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mentor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class MentorController extends Controller
{
    /**
     * Display a listing of mentors.
     */
    public function index()
    {
        $mentors = Mentor::with(['user', 'pesertaMagang'])
            ->withCount('pesertaMagang')
            ->get();

        return Inertia::render('Admin/Mentor/Index', [
            'mentors' => $mentors,
        ]);
    }

    /**
     * Store a newly created mentor.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'nullable|string|max:20',
            'employee_id' => 'required|string|max:50|unique:mentors,employee_id',
            'position' => 'required|string|max:100',
            'department' => 'required|string|max:100',
        ]);

        try {
            DB::beginTransaction();

            // Create user account
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'status' => 'approved', // Auto approved by admin
                'approved_at' => now(),
                'approved_by' => auth()->id(),
            ]);

            // Assign mentor role
            $user->assignRole('mentor');

            // Create mentor record
            Mentor::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'employee_id' => $validated['employee_id'],
                'position' => $validated['position'],
                'department' => $validated['department'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Mentor berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified mentor.
     */
    public function update(Request $request, Mentor $mentor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $mentor->user_id,
            'phone' => 'nullable|string|max:20',
            'employee_id' => 'required|string|max:50|unique:mentors,employee_id,' . $mentor->id,
            'position' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            DB::beginTransaction();

            // Update user data
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ];

            // Update password if provided
            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $mentor->user()->update($userData);

            // Update mentor data
            $mentor->update([
                'name' => $validated['name'],
                'employee_id' => $validated['employee_id'],
                'position' => $validated['position'],
                'department' => $validated['department'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Mentor berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified mentor.
     */
    public function destroy(Mentor $mentor)
    {
        // Check if mentor has active peserta magang
        if ($mentor->pesertaMagang()->count() > 0) {
            return redirect()->back()->withErrors([
                'message' => 'Mentor tidak dapat dihapus karena masih membimbing peserta magang.'
            ]);
        }

        try {
            DB::beginTransaction();

            $user = $mentor->user;
            $mentor->delete();
            $user->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Mentor berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }
}
