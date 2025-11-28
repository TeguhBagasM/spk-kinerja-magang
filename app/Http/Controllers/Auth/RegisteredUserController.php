<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
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
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        // Base validation
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:peserta_magang,mentor',
            'phone' => 'nullable|max:20',
        ];

        // Conditional validation based on role
        if ($request->role === 'peserta_magang') {
            $rules['student_id'] = 'required|string|max:50|unique:peserta_magangs,student_id';
            $rules['campus'] = 'required|string|max:255';
            $rules['division'] = 'required|string|max:100';
        } elseif ($request->role === 'mentor') {
            $rules['name'] = 'required|string|max:255';
            $rules['employee_id'] = 'required|string|max:50|unique:mentors,employee_id';
            $rules['position'] = 'required|string|max:100';
            $rules['department'] = 'required|string|max:100';
        }

        $validated = $request->validate($rules);

        try {
            DB::beginTransaction();

            // Create user (hanya data autentikasi)
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'status' => 'pending',
                'phone' => $validated['phone'],
            ]);

            // Assign role
            $user->assignRole($validated['role']);

            // Simpan data role-specific ke session untuk digunakan saat approval
            // ATAU langsung create record tapi dengan flag pending
            Session::put('registration_data', [
                'user_id' => $user->id,
                'role' => $validated['role'],
                'role_data' => $request->only([
                    'student_id', 'campus', 'division',
                    'employee_id', 'position', 'department'
                ])
            ]);

            // Langsung create record di tabel terkait (recommended)
            if ($validated['role'] === 'peserta_magang') {
                \App\Models\PesertaMagang::create([
                    'user_id' => $user->id,
                    'student_id' => $validated['student_id'],
                    'campus' => $validated['campus'],
                    'division' => $validated['division'],
                    'start_date' => now(), // Bisa di-update nanti saat approval
                    'end_date' => now()->addMonths(3),
                    'status_magang' => 'aktif',
                ]);
            } elseif ($validated['role'] === 'mentor') {
                \App\Models\Mentor::create([
                    'user_id' => $user->id,
                    'name' => $validated['name'],
                    'employee_id' => $validated['employee_id'],
                    'position' => $validated['position'],
                    'department' => $validated['department'],
                ]);
            }

            event(new Registered($user));

            DB::commit();

            return redirect()->route('login')->with('success', 'Registrasi berhasil! Akun Anda menunggu persetujuan dari admin.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->with('error', 'Terjadi kesalahan saat registrasi: ' . $e->getMessage());
        }
    }
}
