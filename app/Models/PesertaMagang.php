<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PesertaMagang extends Model
{
    protected $fillable = [
        'user_id',
        'student_id',
        'campus',
        'division_id',
        'start_date',
        'end_date',
        'mentor_id',
        'status_magang',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    // public function penilaian()
    // {
    //     return $this->hasMany(Penilaian::class);
    // }
}
