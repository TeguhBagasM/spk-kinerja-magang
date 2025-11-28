<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PesertaMagang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesertaMagangController extends Controller
{
    public function index()
    {
        $peserta = PesertaMagang::with('user')
            ->whereHas('user', function ($q) {
                $q->where('status', 'approved');
            })
            ->get();


        return Inertia::render('Admin/PesertaMagang/Index', [
            'peserta' => $peserta
        ]);
    }
}
