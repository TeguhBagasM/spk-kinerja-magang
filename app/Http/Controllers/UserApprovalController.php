<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserApprovalController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of pending users.
     */
    public function index()
    {
        $this->authorize('approve users');

        $pendingUsers = User::where('status', 'pending')
            ->with(['roles', 'pesertaMagang', 'mentor']) // Eager load data terkait
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/User/UserApproval', [
            'pendingUsers' => $pendingUsers,
        ]);
    }

    /**
     * Approve a user.
     */
    public function approve(User $user)
    {
        $this->authorize('approve users');

        try {
            $user->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => auth()->id(),
            ]);

            return back()->with('success', "User {$user->name} berhasil disetujui.");
        } catch (\Exception $e) {
            return back()->with('error', "Gagal menyetujui user: " . $e->getMessage());
        }
    }

    /**
     * Reject a user.
     */
    public function reject(User $user)
    {
        $this->authorize('reject users');

        try {
            DB::beginTransaction();

            // Hapus juga data di tabel terkait
            if ($user->hasRole('peserta_magang')) {
                $user->pesertaMagang()?->delete();
            } elseif ($user->hasRole('mentor')) {
                $user->mentor()?->delete();
            }

            $user->update([
                'status' => 'rejected',
            ]);

            DB::commit();

            return back()->with('success', "User {$user->name} berhasil ditolak.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', "Gagal menolak user: " . $e->getMessage());
        }
    }
}
