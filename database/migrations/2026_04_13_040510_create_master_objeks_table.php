<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_objeks', function (Blueprint $table) {
            $table->id();
            $table->string('kode_jenis', 1); // 1-6
            $table->string('kode_objek', 2);
            $table->string('nama_objek');
            $table->timestamps();

            $table->unique(['kode_jenis', 'kode_objek'], 'unique_objek_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_objeks');
    }
};
