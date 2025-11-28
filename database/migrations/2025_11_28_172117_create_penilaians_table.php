<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penilaian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('peserta_magang_id')->constrained('peserta_magangs')->onDelete('cascade');
            $table->foreignId('kriteria_id')->constrained('kriteria')->onDelete('cascade');
            $table->decimal('nilai', 5, 2); // Nilai asli (misal: skala 1-100 atau 1-5)
            $table->text('catatan')->nullable();
            $table->foreignId('penilai_id')->constrained('users')->onDelete('cascade'); // User yang menilai (mentor/admin)
            $table->date('periode_penilaian'); // Periode penilaian (bulanan/mingguan)
            $table->timestamps();

            // Constraint: satu peserta hanya bisa dinilai sekali per kriteria per periode
            $table->unique(['peserta_magang_id', 'kriteria_id', 'periode_penilaian'], 'unique_penilaian');

            // Index untuk performa query
            $table->index(['peserta_magang_id', 'periode_penilaian']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaian');
    }
};
