<?php

namespace App\Http\Controllers;

use App\Models\HasilSaw;
use App\Models\Penilaian;
use App\Services\SawService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class HasilSawController extends Controller
{
    use AuthorizesRequests;

    protected $sawService;

    public function __construct(SawService $sawService)
    {
        $this->sawService = $sawService;
    }

    /**
     * Display hasil SAW (ranking)
     */
    public function index(Request $request)
    {
        $this->authorize('view laporan');

        $periode = $request->input('periode', now()->format('Y-m-01'));

        // Check if penilaian exists for this periode
        $penilaianCount = Penilaian::where('periode_penilaian', $periode)->count();

        // Get hasil SAW
        $hasilSaw = HasilSaw::with(['pesertaMagang.user', 'pesertaMagang.mentor'])
            ->byPeriode($periode)
            ->orderByRanking()
            ->get();

        // Get available periodes
        $availablePeriodes = Penilaian::select('periode_penilaian')
            ->distinct()
            ->orderBy('periode_penilaian', 'desc')
            ->pluck('periode_penilaian')
            ->map(fn($date) => $date->format('Y-m-d'));

        return Inertia::render('Admin/Hasil/Index', [
            'hasilSaw' => $hasilSaw,
            'periode' => $periode,
            'penilaianCount' => $penilaianCount,
            'hasHasil' => $hasilSaw->isNotEmpty(),
            'availablePeriodes' => $availablePeriodes,
        ]);
    }

    /**
     * Calculate SAW for specific periode
     */
    public function calculate(Request $request)
    {
        $this->authorize('create penilaian');

        $validated = $request->validate([
            'periode' => 'required|date',
        ]);

        try {
            $result = $this->sawService->hitungSaw($validated['periode']);

            if ($result['success']) {
                return back()->with('success', 'Perhitungan SAW berhasil! ' . count($result['data']) . ' peserta telah diranking.');
            } else {
                return back()->with('error', $result['message']);
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghitung SAW: ' . $e->getMessage());
        }
    }

    /**
     * Show detail perhitungan SAW untuk peserta tertentu
     */
    public function show(HasilSaw $hasilSaw)
    {
        $this->authorize('view laporan');

        $hasilSaw->load(['pesertaMagang.user', 'pesertaMagang.mentor']);

        // Get penilaian detail
        $penilaianDetail = Penilaian::with('kriteria')
            ->where('peserta_magang_id', $hasilSaw->peserta_magang_id)
            ->where('periode_penilaian', $hasilSaw->periode_penilaian)
            ->get()
            ->map(function ($penilaian) use ($hasilSaw) {
                // Ambil detail normalisasi berdasarkan kriteria_id
                $normalisasi = $hasilSaw->detail_normalisasi[$penilaian->kriteria_id] ?? null;

                return [
                    'id' => $penilaian->id,
                    'nilai' => $penilaian->nilai,
                    'kriteria' => [
                        'id' => $penilaian->kriteria->id,
                        'nama' => $penilaian->kriteria->nama,
                        'bobot' => $penilaian->kriteria->bobot,
                        'jenis' => $penilaian->kriteria->jenis,
                    ],
                    'nilai_ternormalisasi' => $normalisasi['nilai_ternormalisasi'] ?? null,
                    'nilai_preferensi' => $normalisasi['nilai_preferensi'] ?? null,
                ];
            });

        return Inertia::render('Admin/Hasil/Show', [
            'hasilSaw' => $hasilSaw,
            'penilaianDetail' => $penilaianDetail,
        ]);
    }
}
