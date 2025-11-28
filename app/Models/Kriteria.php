<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    use HasFactory;

    protected $table = 'kriteria';

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'bobot',
        'jenis',
        'is_active',
    ];

    protected $casts = [
        'bobot' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke Penilaian
     */
    public function penilaian()
    {
        return $this->hasMany(Penilaian::class);
    }

    /**
     * Scope untuk kriteria aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get bobot dalam desimal (untuk perhitungan SAW)
     * Contoh: 10% = 0.10
     */
    public function getBobotDesimalAttribute()
    {
        return $this->bobot / 100;
    }

    /**
     * Check if kriteria is benefit type
     */
    public function isBenefit()
    {
        return $this->jenis === 'benefit';
    }

    /**
     * Check if kriteria is cost type
     */
    public function isCost()
    {
        return $this->jenis === 'cost';
    }
}
