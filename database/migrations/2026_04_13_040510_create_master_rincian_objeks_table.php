<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_rincian_objeks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_objek_id')->constrained('master_objeks')->onDelete('cascade');
            $table->string('kode_rincian_objek', 2);
            $table->string('nama_rincian_objek');
            $table->timestamps();

            $table->unique(['master_objek_id', 'kode_rincian_objek'], 'unique_rincian_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_rincian_objeks');
    }
};
