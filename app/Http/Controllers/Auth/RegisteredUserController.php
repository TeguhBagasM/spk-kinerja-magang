<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Division;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        // Get active divisions for select options
        $divisions = Division::active()
            ->orderBy('name')
            ->get()
            ->map(function ($division) {
                return [
                    'id' => $division->id,
                    'name' => $division->name,
                    'code' => $division->code,
                    'description' => $division->description,
                ];
            });

        return Inertia::render('Auth/Register', [
            'divisions' => $divisions,
        ]);
    }

    /**
     * Handle an incoming registration request.
     * Only for Peserta Magang
     */
    public function store(Request $request): RedirectResponse
    {
        // Validation rules for peserta magang only
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'nullable|string|max:20',
            'student_id' => 'required|string|max:50|unique:peserta_magangs,student_id',
            'campus' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
            'start_date' => 'required|date|before_or_equal:today',
            'end_date' => 'required|date|after:start_date|after_or_equal:today',
        ], [
            'student_id.unique' => 'NIM/Student ID sudah terdaftar.',
            'email.unique' => 'Email sudah terdaftar.',
            'start_date.before_or_equal' => 'Tanggal mulai tidak boleh di masa depan.',
            'end_date.after' => 'Tanggal selesai harus setelah tanggal mulai.',
        ]);

        try {
            DB::beginTransaction();

            // Create user with pending status
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'status' => 'pending',
                'phone' => $validated['phone'] ?? null,
            ]);

            // Assign peserta_magang role
            $user->assignRole('peserta_magang');

            // Create peserta magang record
            \App\Models\PesertaMagang::create([
                'user_id' => $user->id,
                'student_id' => $validated['student_id'],
                'campus' => $validated['campus'],
                'division_id' => $validated['division_id'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status_magang' => 'aktif',
            ]);

            event(new Registered($user));

            DB::commit();

            return redirect()->route('login')->with('success', 'Registrasi berhasil! Silakan login setelah akun Anda disetujui oleh admin.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->with('error', 'Terjadi kesalahan saat registrasi. Silakan coba lagi.');
        }
    }
}
