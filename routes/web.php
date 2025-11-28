<?php

use App\Http\Controllers\Admin\PesertaMagangController;
use App\Http\Controllers\HasilSawController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserApprovalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'check.user.status'])->name('dashboard');

Route::middleware(['auth', 'check.user.status'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Approval Routes (Admin & Mentor only)
    Route::middleware('can:approve users')->group(function () {
        Route::get('/admin/user-approval', [UserApprovalController::class, 'index'])->name('admin.user-approval');
        Route::post('/admin/users/{user}/approve', [UserApprovalController::class, 'approve'])->name('admin.users.approve');
        Route::post('/admin/users/{user}/reject', [UserApprovalController::class, 'reject'])->name('admin.users.reject');
    });

    // Penilaian Routes (Admin & Mentor)
    Route::middleware('can:view penilaian')->group(function () {
        Route::get('/penilaian', [PenilaianController::class, 'index'])->name('penilaian.index');
        Route::get('/penilaian/{pesertaMagang}/create', [PenilaianController::class, 'create'])->name('penilaian.create');
        Route::post('/penilaian/{pesertaMagang}', [PenilaianController::class, 'store'])->name('penilaian.store');
        Route::get('/penilaian/{pesertaMagang}/edit', [PenilaianController::class, 'edit'])->name('penilaian.edit');
        Route::delete('/penilaian/{pesertaMagang}', [PenilaianController::class, 'destroy'])->name('penilaian.destroy');
    });

    // Hasil SAW Routes (Admin & Mentor)
    Route::middleware('can:view laporan')->group(function () {
        Route::get('/hasil-saw', [HasilSawController::class, 'index'])->name('hasil-saw.index');
        Route::post('/hasil-saw/calculate', [HasilSawController::class, 'calculate'])->name('hasil-saw.calculate');
        Route::get('/hasil-saw/{hasilSaw}', [HasilSawController::class, 'show'])->name('hasil-saw.show');
    });
});
    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/admin/peserta-magang', [PesertaMagangController::class, 'index'])
            ->name('admin.peserta-magang.index');
    });

require __DIR__.'/auth.php';
