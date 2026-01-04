<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Buat permissions untuk sistem SPK Kinerja Magang
        $permissions = [
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',
            'approve users',
            'reject users',

            // Peserta Magang
            'view peserta',
            'create peserta',
            'edit peserta',
            'delete peserta',

            // Penilaian
            'view penilaian',
            'create penilaian',
            'edit penilaian',
            'delete penilaian',
            'view own penilaian',

            // Kriteria
            'view kriteria',
            'create kriteria',
            'edit kriteria',
            'delete kriteria',

            // Laporan
            'view laporan',
            'export laporan',

            'manage divisions',
            'manage mentors',
            'manage kriteria',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Buat roles dan assign permissions

        // Role: Admin (Full Access)
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Role: Mentor (Dapat menilai, approve, dan melihat)
        $mentorRole = Role::create(['name' => 'mentor']);
        $mentorRole->givePermissionTo([
            'view users',
            'approve users',
            'reject users',
            'view peserta',
            'edit peserta',
            'view penilaian',
            'create penilaian',
            'edit penilaian',
            'view kriteria',
            'view laporan',
            'export laporan',
        ]);

        // Role: Peserta Magang (Hanya dapat melihat penilaian sendiri)
        $pesertaRole = Role::create(['name' => 'peserta_magang']);
        $pesertaRole->givePermissionTo([
            'view own penilaian',
        ]);
// kpi cara hitungnya gimana
// aplikasi hr sunfish
        // Buat user admin default (approved)
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'status' => 'approved',
            'approved_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Buat user mentor default (approved)
        $mentor = User::create([
            'name' => 'Mentor 1',
            'email' => 'mentor@example.com',
            'password' => Hash::make('password'),
            'status' => 'approved',
            'approved_at' => now(),
        ]);
        $mentor->assignRole('mentor');

        // Buat user peserta magang (approved untuk testing)
        $peserta = User::create([
            'name' => 'Peserta Magang 1',
            'email' => 'peserta@example.com',
            'password' => Hash::make('password'),
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $admin->id,
        ]);
        $peserta->assignRole('peserta_magang');

        // Buat user peserta magang pending untuk testing approval
        $pesertaPending = User::create([
            'name' => 'Peserta Magang Pending',
            'email' => 'peserta.pending@example.com',
            'password' => Hash::make('password'),
            'status' => 'pending',
        ]);
        $pesertaPending->assignRole('peserta_magang');
    }
}
