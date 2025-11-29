<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PesertaMagang;
use App\Models\Mentor;
use App\Models\Division;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class PesertaMagangController extends Controller
{
    /**
     * Display list of approved peserta for mentor assignment
     */
    // public function index()
    // {
    //     $peserta = PesertaMagang::with(['user', 'mentor', 'division'])
    //         ->whereHas('user', function ($q) {
    //             $q->where('status', 'approved');
    //         })
    //         ->get();

    //     $mentors = Mentor::with('user')
    //         ->get()
    //         ->map(function ($mentor) {
    //             return [
    //                 'id' => $mentor->id,
    //                 'name' => $mentor->name,
    //                 'position' => $mentor->position,
    //                 'department' => $mentor->department,
    //             ];
    //         });

    //     $pendingCount = User::where('status', 'pending')->count();

    //     return Inertia::render('Admin/PesertaMagang/Index', [
    //         'peserta' => $peserta,
    //         'mentors' => $mentors,
    //         'pendingCount' => $pendingCount,
    //     ]);
    // }

    /**
     * Display full management page (all peserta)
     */
    public function manage()
    {
        $peserta = PesertaMagang::with(['user', 'mentor', 'division'])
            ->get();

        $mentors = Mentor::all();
        $divisions = Division::active()->get();
        $pendingCount = User::where('status', 'pending')->count();

        return Inertia::render('Admin/PesertaMagang/Manage', [
            'peserta' => $peserta,
            'mentors' => $mentors,
            'divisions' => $divisions,
            'pendingCount' => $pendingCount,
        ]);
    }

    /**
     * Store a newly created peserta magang.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'nullable|string|max:20',
            'student_id' => 'required|string|max:50|unique:peserta_magangs,student_id',
            'campus' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'mentor_id' => 'nullable|exists:mentors,id',
            'status_magang' => 'required|in:aktif,selesai,berhenti',
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

            // Assign peserta_magang role
            $user->assignRole('peserta_magang');

            // Create peserta magang record
            PesertaMagang::create([
                'user_id' => $user->id,
                'student_id' => $validated['student_id'],
                'campus' => $validated['campus'],
                'division_id' => $validated['division_id'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'mentor_id' => $validated['mentor_id'] ?? null,
                'status_magang' => $validated['status_magang'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Peserta magang berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified peserta magang.
     */
    public function update(Request $request, PesertaMagang $pesertaMagang)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $pesertaMagang->user_id,
            'phone' => 'nullable|string|max:20',
            'student_id' => 'required|string|max:50|unique:peserta_magangs,student_id,' . $pesertaMagang->id,
            'campus' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'mentor_id' => 'nullable|exists:mentors,id',
            'status_magang' => 'required|in:aktif,selesai,berhenti',
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

            $pesertaMagang->user()->update($userData);

            // Update peserta magang data
            $pesertaMagang->update([
                'student_id' => $validated['student_id'],
                'campus' => $validated['campus'],
                'division_id' => $validated['division_id'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'mentor_id' => $validated['mentor_id'] ?? null,
                'status_magang' => $validated['status_magang'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Peserta magang berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified peserta magang.
     */
    public function destroy(PesertaMagang $pesertaMagang)
    {
        try {
            DB::beginTransaction();

            $user = $pesertaMagang->user;
            $pesertaMagang->delete();
            $user->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Peserta magang berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Assign mentor to peserta magang
     */
    public function assignMentor(Request $request, PesertaMagang $pesertaMagang)
    {
        $request->validate([
            'mentor_id' => 'required|exists:mentors,id',
        ]);

        $pesertaMagang->update([
            'mentor_id' => $request->mentor_id,
        ]);

        return redirect()->back()->with('success', 'Mentor berhasil ditentukan!');
    }
}
