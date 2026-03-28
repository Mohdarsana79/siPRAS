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
        Schema::create('master_ruangans', function (Blueprint $table) {
            $table->id();
            $table->string('kode_ruangan')->unique();
            $table->string('nama_ruangan');
            $table->string('penanggung_jawab')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_ruangans');
    }
};
