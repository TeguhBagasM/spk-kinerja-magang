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
         Schema::create('hasil_saw', function (Blueprint $table) {
            $table->id();
            $table->foreignId('peserta_magang_id')->constrained('peserta_magangs')->onDelete('cascade');
            $table->date('periode_penilaian');
            $table->decimal('skor_akhir', 10, 4); // Hasil perhitungan SAW
            $table->integer('ranking')->nullable(); // Peringkat berdasarkan skor
            $table->json('detail_normalisasi')->nullable(); // Menyimpan detail perhitungan normalisasi per kriteria
            $table->timestamps();

            // Unique constraint untuk peserta per periode
            $table->unique(['peserta_magang_id', 'periode_penilaian'], 'unique_hasil_saw');

            // Index untuk performa
            $table->index(['periode_penilaian', 'ranking']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_saw');
    }
};
