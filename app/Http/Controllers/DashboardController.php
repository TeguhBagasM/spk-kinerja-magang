<?php

namespace App\Http\Controllers;

use App\Models\PesertaMagang;
use App\Models\Penilaian;
use App\Models\HasilSaw;
use App\Models\Division;
use App\Models\Mentor;
use App\Models\Kriteria;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $userRoles = $user->roles->pluck('name')->toArray();

        if (in_array('admin', $userRoles) || in_array('mentor', $userRoles)) {
            return $this->adminMentorDashboard();
        } elseif (in_array('peserta_magang', $userRoles)) {
            return $this->pesertaDashboard($user);
        }

        // Default dashboard jika tidak ada role
        return Inertia::render('Dashboard', [
            'stats' => [],
            'message' => 'Role tidak dikenali',
        ]);
    }

    /**
     * Dashboard untuk Admin dan Mentor
     */
    private function adminMentorDashboard()
    {
        // Stats Cards
        $stats = [
            'totalPeserta' => PesertaMagang::where('status_magang', 'aktif')->count(),
            'totalMentor' => Mentor::count(),
            'totalDivisi' => Division::where('is_active', true)->count(),
            'penilaianSelesai' => Penilaian::whereMonth('periode_penilaian', now()->month)
                ->whereYear('periode_penilaian', now()->year)
                ->distinct('peserta_magang_id')
                ->count('peserta_magang_id'),
        ];

        // Distribusi Peserta per Divisi (Pie Chart)
        $distribusiDivisi = PesertaMagang::with('division')
            ->where('status_magang', 'aktif')
            ->get()
            ->groupBy('division.name')
            ->map(function ($group, $divisionName) {
                return [
                    'name' => $divisionName ?? 'Tidak Ada Divisi',
                    'value' => $group->count(),
                ];
            })
            ->values();

        // Tren 6 Bulan Terakhir (Bar Chart)
        $trenData = collect(range(5, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);

            return [
                'bulan' => $date->format('M'),
                'peserta' => PesertaMagang::whereYear('start_date', '<=', $date->year)
                    ->whereMonth('start_date', '<=', $date->month)
                    ->where('status_magang', 'aktif')
                    ->count(),
                'penilaian' => Penilaian::whereYear('periode_penilaian', $date->year)
                    ->whereMonth('periode_penilaian', $date->month)
                    ->distinct('peserta_magang_id')
                    ->count('peserta_magang_id'),
            ];
        });

        // Penilaian Terbaru (Top 4)
        $penilaianTerbaru = HasilSaw::with('pesertaMagang.user')
            ->orderBy('periode_penilaian', 'desc')
            ->orderBy('ranking', 'asc')
            ->limit(4)
            ->get()
            ->map(function ($hasil) {
                $score = round($hasil->skor_akhir * 100, 0); // Convert ke skala 100

                return [
                    'name' => $hasil->pesertaMagang->user->name ?? 'Unknown',
                    'score' => $score,
                    'status' => $this->getScoreStatus($score),
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'distribusiDivisi' => $distribusiDivisi,
            'trenData' => $trenData,
            'penilaianTerbaru' => $penilaianTerbaru,
        ]);
    }

    /**
     * Dashboard untuk Peserta Magang
     */
    private function pesertaDashboard($user)
    {
        $peserta = $user->pesertaMagang;

        if (!$peserta) {
            return Inertia::render('Dashboard', [
                'error' => 'Data peserta magang tidak ditemukan',
                'stats' => [],
            ]);
        }

        // Ambil hasil SAW terbaru (ranking & skor)
        $hasilSawTerbaru = HasilSaw::where('peserta_magang_id', $peserta->id)
            ->latest('periode_penilaian')
            ->first();

        // Total peserta aktif (untuk ranking)
        $totalPesertaAktif = PesertaMagang::where('status_magang', 'aktif')->count();

        // Nilai rata-rata
        $nilaiRataRata = Penilaian::where('peserta_magang_id', $peserta->id)
            ->avg('nilai');

        // Total penilaian yang sudah selesai
        $totalKriteria = Kriteria::where('is_active', true)->count();
        $penilaianSelesai = Penilaian::where('peserta_magang_id', $peserta->id)
            ->whereMonth('periode_penilaian', now()->month)
            ->whereYear('periode_penilaian', now()->year)
            ->distinct('kriteria_id')
            ->count('kriteria_id');

       $startDate = Carbon::parse($peserta->start_date);
        $endDate = $peserta->status_magang === 'selesai'
            ? Carbon::parse($peserta->end_date)
            : now();

        $totalHariMagang = 0;

        $period = CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            // 1 = Senin, 5 = Jumat
            if ($date->dayOfWeekIso >= 1 && $date->dayOfWeekIso <= 5) {
                $totalHariMagang++;
            }
        }

        // Stats Cards
        $stats = [
            'nilaiRataRata' => $nilaiRataRata ? round($nilaiRataRata, 1) : 0,
            'penilaianSelesai' => $penilaianSelesai,
            'totalKriteria' => $totalKriteria,
            'hariMagang' => $totalHariMagang,
            'ranking' => $hasilSawTerbaru ? $hasilSawTerbaru->ranking : null,
            'totalPeserta' => $totalPesertaAktif,
            'skorAkhir' => $hasilSawTerbaru ? round($hasilSawTerbaru->skor_akhir * 100, 1) : 0,
        ];

        // Penilaian per Kriteria (untuk progress bar)
        $penilaianPerKriteria = Penilaian::with('kriteria')
            ->where('peserta_magang_id', $peserta->id)
            ->latest('periode_penilaian')
            ->get()
            ->groupBy('kriteria_id')
            ->map(function ($group) {
                $latest = $group->first();
                return [
                    'name' => $latest->kriteria->nama,
                    'score' => $latest->nilai ? round((float) $latest->nilai, 0) : 0,
                    'max' => 100,
                ];
            })
            ->values();

        // Tren Nilai 6 Bulan Terakhir (Line Chart)
        $trenNilai = collect(range(5, 0))->map(function ($monthsAgo) use ($peserta) {
            $date = now()->subMonths($monthsAgo);

            $avgNilai = Penilaian::where('peserta_magang_id', $peserta->id)
                ->whereYear('periode_penilaian', $date->year)
                ->whereMonth('periode_penilaian', $date->month)
                ->avg('nilai');

            return [
                'bulan' => $date->format('M'),
                'penilaian' => $avgNilai ? round($avgNilai, 0) : 0,
            ];
        });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'penilaianPerKriteria' => $penilaianPerKriteria,
            'trenNilai' => $trenNilai,
        ]);
    }

    /**
     * Helper: Get status label from score
     */
    private function getScoreStatus($score)
    {
        if ($score >= 90) return 'Sangat Baik';
        if ($score >= 80) return 'Baik';
        if ($score >= 70) return 'Cukup';
        if ($score >= 60) return 'Kurang';
        return 'Sangat Kurang';
    }
}
