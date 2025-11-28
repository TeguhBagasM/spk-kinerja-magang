<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'employee_id',
        'position',
        'department',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pesertaMagang()
    {
        return $this->hasMany(PesertaMagang::class);
    }

    // public function penilaian()
    // {
    //     return $this->hasMany(Penilaian::class);
    // }
}
