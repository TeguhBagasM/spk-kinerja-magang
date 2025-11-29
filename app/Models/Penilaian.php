<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penilaian extends Model
{
    use HasFactory;

    protected $table = 'penilaian';

    protected $fillable = [
        'peserta_magang_id',
        'kriteria_id',
        'nilai',
        'catatan',
        'penilai_id',
        'periode_penilaian',
    ];

    protected $casts = [
        'nilai' => 'decimal:2',
        'periode_penilaian' => 'date',
    ];

    /**
     * Relasi ke Peserta Magang
     */
    public function pesertaMagang()
    {
        return $this->belongsTo(PesertaMagang::class);
    }

    /**
     * Relasi ke Kriteria
     */
    public function kriteria()
    {
        return $this->belongsTo(Kriteria::class);
    }

    /**
     * Relasi ke Penilai (User)
     */
    public function penilai()
    {
        return $this->belongsTo(User::class, 'penilai_id');
    }

    /**
     * Scope untuk filter by periode
     */
    public function scopeByPeriode($query, $periode)
    {
        return $query->where('periode_penilaian', $periode);
    }

    /**
     * Scope untuk filter by peserta
     */
    public function scopeByPeserta($query, $pesertaMagangId)
    {
        return $query->where('peserta_magang_id', $pesertaMagangId);
    }
}
