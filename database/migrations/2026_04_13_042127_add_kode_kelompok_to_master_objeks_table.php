<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('master_objeks', function (Blueprint $table) {
            $table->string('kode_kelompok', 1)->after('kode_jenis')->default('3'); // Default Aset Tetap
        });
    }

    public function down(): void
    {
        Schema::table('master_objeks', function (Blueprint $table) {
            $table->dropColumn('kode_kelompok');
        });
    }
};
