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
        Schema::create('kib_b_peralatans', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade')->unique();
            $table->string('merk_tipe');
            $table->string('ukuran_cc')->nullable();
            $table->string('bahan');
            $table->year('tahun_pembuatan');
            $table->string('nomor_pabrik')->nullable();
            $table->string('nomor_rangka')->nullable();
            $table->string('nomor_mesin')->nullable();
            $table->string('nomor_polisi')->nullable();
            $table->string('nomor_bpkb')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kib_b_peralatans');
    }
};
