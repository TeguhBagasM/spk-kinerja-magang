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
        Schema::create('kriteria', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 10)->unique(); // C1, C2, C3, dst
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->decimal('bobot', 5, 2); // Bobot dalam persen (0-100)
            $table->enum('jenis', ['benefit', 'cost'])->default('benefit'); // Benefit = semakin tinggi semakin baik, Cost = semakin rendah semakin baik
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kriterias');
    }
};
