<?php

use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Admin\MentorController;
use App\Http\Controllers\Admin\PesertaMagangController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontEndController;
use App\Http\Controllers\HasilSawController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserApprovalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FrontEndController::class, 'welcome'])->name('welcome');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'check.user.status'])
    ->name('dashboard');

Route::middleware(['auth', 'check.user.status'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('can:approve users')->group(function () {
        Route::get('/admin/user-approval', [UserApprovalController::class, 'index'])->name('admin.user-approval');
        Route::post('/admin/users/{user}/approve', [UserApprovalController::class, 'approve'])->name('admin.users.approve');
        Route::post('/admin/users/{user}/reject', [UserApprovalController::class, 'reject'])->name('admin.users.reject');
    });

    Route::middleware('can:view penilaian')->group(function () {
        Route::get('/penilaian', [PenilaianController::class, 'index'])->name('penilaian.index');
        Route::get('/penilaian/{pesertaMagang}/create', [PenilaianController::class, 'create'])->name('penilaian.create');
        Route::post('/penilaian/{pesertaMagang}', [PenilaianController::class, 'store'])->name('penilaian.store');
        Route::get('/penilaian/{pesertaMagang}/edit', [PenilaianController::class, 'edit'])->name('penilaian.edit');
        Route::delete('/penilaian/{pesertaMagang}', [PenilaianController::class, 'destroy'])->name('penilaian.destroy');
    });

    Route::middleware('can:view laporan')->group(function () {
        Route::get('/hasil-saw', [HasilSawController::class, 'index'])->name('hasil-saw.index');
        Route::post('/hasil-saw/calculate', [HasilSawController::class, 'calculate'])->name('hasil-saw.calculate');
        Route::get('/hasil-saw/{hasilSaw}', [HasilSawController::class, 'show'])->name('hasil-saw.show');
    });
});
    Route::middleware(['auth', 'role:admin'])->group(function () {

        Route::get('/admin/peserta-magang/manage', [PesertaMagangController::class, 'manage'])
            ->name('admin.peserta-magang.manage');

        Route::post('/admin/peserta-magang', [PesertaMagangController::class, 'store'])
            ->name('admin.peserta-magang.store');

        Route::put('/admin/peserta-magang/{pesertaMagang}', [PesertaMagangController::class, 'update'])
            ->name('admin.peserta-magang.update');

        Route::delete('/admin/peserta-magang/{pesertaMagang}', [PesertaMagangController::class, 'destroy'])
            ->name('admin.peserta-magang.destroy');

        Route::post('/admin/peserta-magang/{pesertaMagang}/assign-mentor', [PesertaMagangController::class, 'assignMentor'])
            ->name('admin.peserta-magang.assign-mentor');

        Route::get('/admin/divisions', [DivisionController::class, 'index'])
            ->name('admin.divisions.index');

        Route::post('/admin/divisions', [DivisionController::class, 'store'])
            ->name('admin.divisions.store');

        Route::put('/admin/divisions/{division}', [DivisionController::class, 'update'])
            ->name('admin.divisions.update');

        Route::delete('/admin/divisions/{division}', [DivisionController::class, 'destroy'])
            ->name('admin.divisions.destroy');

        Route::post('/admin/divisions/{division}/toggle-status', [DivisionController::class, 'toggleStatus'])
            ->name('admin.divisions.toggle-status');

        Route::get('/admin/mentors', [MentorController::class, 'index'])
            ->name('admin.mentors.index');

        Route::post('/admin/mentors', [MentorController::class, 'store'])
            ->name('admin.mentors.store');

        Route::put('/admin/mentors/{mentor}', [MentorController::class, 'update'])
            ->name('admin.mentors.update');

        Route::delete('/admin/mentors/{mentor}', [MentorController::class, 'destroy'])
            ->name('admin.mentors.destroy');

        });

require __DIR__.'/auth.php';
