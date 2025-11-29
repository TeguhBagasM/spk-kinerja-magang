<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Mentor;
use App\Models\PesertaMagang;
use App\Models\Division;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MentorPesertaSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan ada division
        $divisionIds = Division::pluck('id')->toArray();

        if (count($divisionIds) === 0) {
            $this->command->warn("Tidak ada division. Mohon buat minimal 1 division sebelum seeding.");
            return;
        }

        // -------------------------
        // 1. SEED 5 MENTOR
        // -------------------------
        $mentorUsers = [];

        for ($i = 1; $i <= 5; $i++) {
            $mentorUsers[] = User::create([
                'name' => "Mentor Example $i",
                'email' => "mentor$i@example.com",
                'password' => Hash::make('password'),
                'status' => 'approved',
                'phone' => '08123456789',
            ]);
        }

        foreach ($mentorUsers as $index => $user) {
            Mentor::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'employee_id' => 'EMP' . rand(100, 999),
                'position' => "Senior Staff",
                'department' => "IT Department",
            ]);
        }

        // -------------------------
        // 2. SEED 5 PESERTA MAGANG
        // -------------------------
        for ($i = 1; $i <= 5; $i++) {

            // Buat user untuk peserta
            $user = User::create([
                'name' => "Peserta Magang $i",
                'email' => "peserta$i@example.com",
                'password' => Hash::make('password'),
                'status' => 'approved',
                'phone' => '08987654321',
            ]);

            PesertaMagang::create([
                'user_id' => $user->id,
                'student_id' => 'STU' . rand(100, 999),
                'campus' => 'Universitas Contoh',
                'division_id' => $divisionIds[array_rand($divisionIds)],
                'mentor_id' => Mentor::inRandomOrder()->first()->id,
                'start_date' => now()->subMonths(rand(1, 3)),
                'end_date' => now()->addMonths(rand(1, 3)),
                'status_magang' => 'aktif',
            ]);
        }

        $this->command->info("Seeder Mentor & Peserta Magang berhasil dibuat!");
    }
}
