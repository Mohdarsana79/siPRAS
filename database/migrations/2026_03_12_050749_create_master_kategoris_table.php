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
        Schema::create('master_kategoris', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kategori')->unique();
            $table->string('nama_kategori');
            $table->enum('tipe_kib', ['A', 'B', 'C', 'D', 'E', 'F']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_kategoris');
    }
};
