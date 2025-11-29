<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all peserta magang in this division
     */
    public function pesertaMagang()
    {
        return $this->hasMany(PesertaMagang::class);
    }

    /**
     * Scope for active divisions only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
