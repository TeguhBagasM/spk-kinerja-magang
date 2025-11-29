<?php

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    public function run(): void
    {
        $divisions = [
            [
                'name' => '-',
                'code' => 'NONE',
                'description' => 'Tidak ada divisi',
                'is_active' => true,
            ],
            [
                'name' => 'Big Data',
                'code' => 'BD',
                'description' => 'Divisi yang menangani pengolahan data berskala besar',
                'is_active' => true,
            ],
            [
                'name' => 'DevOps',
                'code' => 'DOPS',
                'description' => 'Divisi yang menangani CI/CD, deployment, dan otomasi sistem',
                'is_active' => true,
            ],
            [
                'name' => 'Executive',
                'code' => 'EXE',
                'description' => 'Divisi eksekutif yang menangani keputusan strategis perusahaan',
                'is_active' => true,
            ],
            [
                'name' => 'Finance',
                'code' => 'FIN',
                'description' => 'Divisi yang mengelola keuangan dan pelaporan finansial',
                'is_active' => true,
            ],
            [
                'name' => 'Operasional',
                'code' => 'OPS',
                'description' => 'Divisi yang menangani kegiatan operasional harian perusahaan',
                'is_active' => true,
            ],
            [
                'name' => 'Produk',
                'code' => 'PRD',
                'description' => 'Divisi yang fokus pada pengembangan dan pengelolaan produk',
                'is_active' => true,
            ],
            [
                'name' => 'Unassigned',
                'code' => 'UNAS',
                'description' => 'Divisi untuk karyawan atau magang yang belum memiliki penempatan',
                'is_active' => true,
            ],
        ];

        foreach ($divisions as $division) {
            Division::create($division);
        }
    }
}
