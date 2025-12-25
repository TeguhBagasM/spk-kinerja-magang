<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kriteria = [
            [
                'kode' => 'C1',
                'nama' => 'Komunikasi',
                'deskripsi' => 'Kemampuan berkomunikasi dengan baik, baik lisan maupun tulisan',
                'bobot' => 10.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C2',
                'nama' => 'Learning Curve',
                'deskripsi' => 'Kemampuan belajar dan beradaptasi dengan cepat terhadap hal baru',
                'bobot' => 10.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C3',
                'nama' => 'Kerjasama dengan Tim',
                'deskripsi' => 'Kemampuan bekerja sama dan berkolaborasi dengan tim',
                'bobot' => 11.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C4',
                'nama' => 'Penguasaan Tools',
                'deskripsi' => 'Kemampuan menguasai dan menggunakan tools/teknologi yang diperlukan',
                'bobot' => 08.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C5',
                'nama' => 'Kehadiran',
                'deskripsi' => 'Tingkat kehadiran dan kedisiplinan waktu',
                'bobot' => 11.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C6',
                'nama' => 'Keaktifan',
                'deskripsi' => 'Tingkat keaktifan dan inisiatif dalam bekerja',
                'bobot' => 10.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C7',
                'nama' => 'Kecepatan Mengerjakan Task',
                'deskripsi' => 'Kecepatan dalam menyelesaikan tugas yang diberikan',
                'bobot' => 10.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C8',
                'nama' => 'Ketepatan Mengerjakan Task',
                'deskripsi' => 'Ketepatan dan akurasi dalam menyelesaikan tugas sesuai requirement',
                'bobot' => 09.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C9',
                'nama' => 'Problem Solving',
                'deskripsi' => 'Kemampuan menganalisis dan menyelesaikan masalah',
                'bobot' => 11.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
            [
                'kode' => 'C10',
                'nama' => 'Tanggung Jawab',
                'deskripsi' => 'Tingkat tanggung jawab terhadap tugas dan pekerjaan',
                'bobot' => 10.00, // 10%
                'jenis' => 'benefit',
                'is_active' => true,
            ],
        ];

        DB::table('kriteria')->insert($kriteria);
    }
}
