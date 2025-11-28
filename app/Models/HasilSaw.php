<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HasilSaw extends Model
{
    use HasFactory;

    protected $table = 'hasil_saw';

    protected $fillable = [
        'peserta_magang_id',
        'periode_penilaian',
        'skor_akhir',
        'ranking',
        'detail_normalisasi',
    ];

    protected $casts = [
        'skor_akhir' => 'float',
        'periode_penilaian' => 'date',
        'detail_normalisasi' => 'array',
    ];

    /**
     * Relasi ke Peserta Magang
     */
    public function pesertaMagang()
    {
        return $this->belongsTo(PesertaMagang::class);
    }

    /**
     * Scope untuk filter by periode
     */
    public function scopeByPeriode($query, $periode)
    {
        return $query->where('periode_penilaian', $periode);
    }

    /**
     * Scope untuk order by ranking
     */
    public function scopeOrderByRanking($query)
    {
        return $query->orderBy('ranking', 'asc');
    }

    /**
     * Get detail normalisasi untuk kriteria tertentu
     */
    public function getNormalisasiKriteria($kriteriaId)
    {
        return $this->detail_normalisasi[$kriteriaId] ?? null;
    }
}
