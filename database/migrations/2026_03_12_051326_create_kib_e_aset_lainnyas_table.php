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
        Schema::create('kib_e_aset_lainnyas', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade')->unique();
            $table->string('judul_buku_nama_kesenian');
            $table->string('pencipta');
            $table->string('spesifikasi');
            $table->string('asal_daerah');
            $table->string('bahan');
            $table->string('jenis_hewan_tumbuhan')->nullable();
            $table->string('ukuran')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kib_e_aset_lainnyas');
    }
};
