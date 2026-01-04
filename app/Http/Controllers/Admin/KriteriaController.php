<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kriteria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KriteriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kriteria = Kriteria::withCount('penilaian')
            ->orderBy('kode')
            ->get();

        return Inertia::render('Admin/Kriteria/Index', [
            'kriteria' => $kriteria,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:10|unique:kriteria,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'bobot' => 'required|numeric|min:0|max:100',
            'jenis' => 'required|in:benefit,cost',
            'is_active' => 'boolean',
        ], [
            'kode.required' => 'Kode kriteria wajib diisi',
            'kode.unique' => 'Kode kriteria sudah digunakan',
            'nama.required' => 'Nama kriteria wajib diisi',
            'bobot.required' => 'Bobot wajib diisi',
            'bobot.min' => 'Bobot minimal 0',
            'bobot.max' => 'Bobot maksimal 100',
            'jenis.required' => 'Jenis kriteria wajib dipilih',
            'jenis.in' => 'Jenis kriteria tidak valid',
        ]);

        Kriteria::create($validated);

        return redirect()->back()->with('success', 'Kriteria berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kriteria $kriteria)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:10|unique:kriteria,kode,' . $kriteria->id,
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'bobot' => 'required|numeric|min:0|max:100',
            'jenis' => 'required|in:benefit,cost',
            'is_active' => 'boolean',
        ], [
            'kode.required' => 'Kode kriteria wajib diisi',
            'kode.unique' => 'Kode kriteria sudah digunakan',
            'nama.required' => 'Nama kriteria wajib diisi',
            'bobot.required' => 'Bobot wajib diisi',
            'bobot.min' => 'Bobot minimal 0',
            'bobot.max' => 'Bobot maksimal 100',
            'jenis.required' => 'Jenis kriteria wajib dipilih',
            'jenis.in' => 'Jenis kriteria tidak valid',
        ]);

        $kriteria->update($validated);

        return redirect()->back()->with('success', 'Kriteria berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kriteria $kriteria)
    {
        // Check if kriteria has related penilaian
        if ($kriteria->penilaian()->count() > 0) {
            return redirect()->back()->withErrors([
                'delete' => 'Kriteria tidak dapat dihapus karena sudah digunakan dalam penilaian'
            ]);
        }

        $kriteria->delete();

        return redirect()->back()->with('success', 'Kriteria berhasil dihapus');
    }
}
