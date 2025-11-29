<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionController extends Controller
{
    /**
     * Display a listing of divisions.
     */
    public function index()
    {
        $divisions = Division::withCount('pesertaMagang')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Division/Index', [
            'divisions' => $divisions,
        ]);
    }

    /**
     * Store a newly created division.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:divisions,name',
            'code' => 'required|string|max:50|unique:divisions,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Division::create($validated);

        return redirect()->back()->with('success', 'Divisi berhasil ditambahkan!');
    }

    /**
     * Update the specified division.
     */
    public function update(Request $request, Division $division)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:divisions,name,' . $division->id,
            'code' => 'required|string|max:50|unique:divisions,code,' . $division->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $division->update($validated);

        return redirect()->back()->with('success', 'Divisi berhasil diperbarui!');
    }

    /**
     * Remove the specified division.
     */
    public function destroy(Division $division)
    {
        // Check if division has peserta magang
        if ($division->pesertaMagang()->count() > 0) {
            return redirect()->back()->withErrors([
                'message' => 'Divisi tidak dapat dihapus karena masih memiliki peserta magang aktif.'
            ]);
        }

        $division->delete();

        return redirect()->back()->with('success', 'Divisi berhasil dihapus!');
    }

    /**
     * Toggle division active status.
     */
    public function toggleStatus(Division $division)
    {
        $division->update([
            'is_active' => !$division->is_active
        ]);

        $status = $division->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()->with('success', "Divisi berhasil {$status}!");
    }
}
