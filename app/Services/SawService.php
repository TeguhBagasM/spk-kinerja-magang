<?php

namespace App\Services;

use App\Models\Penilaian;
use App\Models\HasilSaw;
use App\Models\Kriteria;
use Illuminate\Support\Facades\DB;

class SawService
{
    /**
     * Hitung SAW untuk periode tertentu
     */
    public function hitungSaw($periode)
    {
        DB::beginTransaction();

        try {
            // 1. Ambil semua penilaian untuk periode tersebut
            $penilaianData = Penilaian::with(['pesertaMagang', 'kriteria'])
                ->where('periode_penilaian', $periode)
                ->get()
                ->groupBy('peserta_magang_id');

            // 2. Ambil semua kriteria aktif
            $kriteriaList = Kriteria::active()->get();

            // 3. Cari nilai max dan min untuk setiap kriteria (untuk normalisasi)
            $nilaiMaxMin = $this->getNilaiMaxMin($penilaianData, $kriteriaList);

            // 4. Hitung nilai normalisasi dan skor akhir untuk setiap peserta
            $hasilPerhitungan = [];

            foreach ($penilaianData as $pesertaMagangId => $penilaianPeserta) {
                $skorAkhir = 0;
                $detailNormalisasi = [];

                foreach ($penilaianPeserta as $penilaian) {
                    $kriteria = $penilaian->kriteria;
                    $nilai = $penilaian->nilai;

                    // Normalisasi berdasarkan jenis kriteria
                    if ($kriteria->isBenefit()) {
                        // Benefit: Rij / Max
                        $nilaiNormalisasi = $nilai / $nilaiMaxMin[$kriteria->id]['max'];
                    } else {
                        // Cost: Min / Rij
                        $nilaiNormalisasi = $nilaiMaxMin[$kriteria->id]['min'] / $nilai;
                    }

                    // Hitung nilai preferensi: nilai normalisasi * bobot
                    $nilaiPreferensi = $nilaiNormalisasi * $kriteria->bobot_desimal;
                    $skorAkhir += $nilaiPreferensi;

                    // Simpan detail untuk tracking
                    $detailNormalisasi[$kriteria->id] = [
                        'kode_kriteria' => $kriteria->kode,
                        'nama_kriteria' => $kriteria->nama,
                        'nilai_asli' => $nilai,
                        'nilai_normalisasi' => round($nilaiNormalisasi, 4),
                        'bobot' => $kriteria->bobot,
                        'nilai_preferensi' => round($nilaiPreferensi, 4),
                    ];
                }

                $hasilPerhitungan[] = [
                    'peserta_magang_id' => $pesertaMagangId,
                    'skor_akhir' => $skorAkhir,
                    'detail_normalisasi' => $detailNormalisasi,
                ];
            }

            // 5. Urutkan berdasarkan skor akhir (descending) dan beri ranking
            usort($hasilPerhitungan, function ($a, $b) {
                return $b['skor_akhir'] <=> $a['skor_akhir'];
            });

            $ranking = 1;
            foreach ($hasilPerhitungan as $hasil) {
                HasilSaw::updateOrCreate(
                    [
                        'peserta_magang_id' => $hasil['peserta_magang_id'],
                        'periode_penilaian' => $periode,
                    ],
                    [
                        'skor_akhir' => $hasil['skor_akhir'],
                        'ranking' => $ranking,
                        'detail_normalisasi' => $hasil['detail_normalisasi'],
                    ]
                );
                $ranking++;
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Perhitungan SAW berhasil',
                'data' => $hasilPerhitungan,
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Perhitungan SAW gagal: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Dapatkan nilai max dan min untuk setiap kriteria
     */
    private function getNilaiMaxMin($penilaianData, $kriteriaList)
    {
        $nilaiMaxMin = [];

        foreach ($kriteriaList as $kriteria) {
            $nilaiKriteria = [];

            foreach ($penilaianData as $penilaianPeserta) {
                foreach ($penilaianPeserta as $penilaian) {
                    if ($penilaian->kriteria_id == $kriteria->id) {
                        $nilaiKriteria[] = $penilaian->nilai;
                    }
                }
            }

            if (!empty($nilaiKriteria)) {
                $nilaiMaxMin[$kriteria->id] = [
                    'max' => max($nilaiKriteria),
                    'min' => min($nilaiKriteria),
                ];
            }
        }

        return $nilaiMaxMin;
    }

    /**
     * Get hasil SAW by periode dengan detail peserta
     */
    public function getHasilByPeriode($periode)
    {
        return HasilSaw::with('pesertaMagang.user')
            ->byPeriode($periode)
            ->orderByRanking()
            ->get();
    }
}
