<?php

namespace App\Http\Controllers;

use App\Models\PesertaMagang;
use App\Models\Kriteria;
use App\Models\Penilaian;
use App\Services\SawService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenilaianController extends Controller
{
    use AuthorizesRequests;

    protected $sawService;

    public function __construct(SawService $sawService)
    {
        $this->sawService = $sawService;
    }

    /**
     * Display a listing of peserta magang for penilaian
     */
    public function index(Request $request)
    {
        $this->authorize('view penilaian');

        $periode = $request->input('periode', now()->format('Y-m-01'));

        // Get peserta magang aktif
        $pesertaMagang = PesertaMagang::with(['user', 'mentor'])
            ->where('status_magang', 'aktif')
            ->paginate(10);

        // Get kriteria aktif
        $kriteriaList = Kriteria::active()->get();

        // Check if current periode has penilaian
        $hasPenilaian = Penilaian::where('periode_penilaian', $periode)->exists();

        return Inertia::render('Admin/Penilaian/Index', [
            'pesertaMagang' => $pesertaMagang,
            'kriteria' => $kriteriaList,
            'periode' => $periode,
            'hasPenilaian' => $hasPenilaian,
        ]);
    }

    /**
     * Show form to input nilai for specific peserta
     */
    public function create(PesertaMagang $pesertaMagang, Request $request)
    {
        $this->authorize('create penilaian');

        $periode = $request->input('periode', now()->format('Y-m-01'));

        // Get kriteria aktif
        $kriteriaList = Kriteria::active()->get();

        // Get existing penilaian if any
        $existingPenilaian = Penilaian::where('peserta_magang_id', $pesertaMagang->id)
            ->where('periode_penilaian', $periode)
            ->with('kriteria')
            ->get()
            ->keyBy('kriteria_id');

        return Inertia::render('Admin/Penilaian/Create', [
            'pesertaMagang' => $pesertaMagang->load('user'),
            'kriteria' => $kriteriaList,
            'periode' => $periode,
            'existingPenilaian' => $existingPenilaian,
        ]);
    }

    /**
     * Store penilaian for peserta magang
     */
    public function store(Request $request, PesertaMagang $pesertaMagang)
    {
        $this->authorize('create penilaian');

        $validated = $request->validate([
            'periode_penilaian' => 'required|date',
            'nilai' => 'required|array',
            'nilai.*.kriteria_id' => 'required|exists:kriteria,id',
            'nilai.*.nilai' => 'required|numeric|min:0|max:100',
            'nilai.*.catatan' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();

        try {
            foreach ($validated['nilai'] as $nilaiData) {
                Penilaian::updateOrCreate(
                    [
                        'peserta_magang_id' => $pesertaMagang->id,
                        'kriteria_id' => $nilaiData['kriteria_id'],
                        'periode_penilaian' => $validated['periode_penilaian'],
                    ],
                    [
                        'nilai' => $nilaiData['nilai'],
                        'catatan' => $nilaiData['catatan'] ?? null,
                        'penilai_id' => auth()->id(),
                    ]
                );
            }

            DB::commit();

            return redirect()
                ->route('penilaian.index', ['periode' => $validated['periode_penilaian']])
                ->with('success', "Penilaian untuk {$pesertaMagang->user->name} berhasil disimpan.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan penilaian: ' . $e->getMessage());
        }
    }

    /**
     * Show edit form
     */
    public function edit(PesertaMagang $pesertaMagang, Request $request)
    {
        return $this->create($pesertaMagang, $request);
    }

    /**
     * Delete penilaian for specific periode
     */
    public function destroy(PesertaMagang $pesertaMagang, Request $request)
    {
        $this->authorize('delete penilaian');

        $periode = $request->input('periode');

        try {
            Penilaian::where('peserta_magang_id', $pesertaMagang->id)
                ->where('periode_penilaian', $periode)
                ->delete();

            return back()->with('success', 'Penilaian berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus penilaian: ' . $e->getMessage());
        }
    }
}
